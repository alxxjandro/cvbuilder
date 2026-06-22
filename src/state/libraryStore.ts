import { create } from "zustand";
import type { CVData, TemplateId } from "../types/cv";
import type { Json } from "../lib/database.types";
import { createEmptyCV, withDefaults } from "../model/cv";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "./authStore";

/**
 * One stored CV in the user's library: its identity, last-edit time and the
 * full document. The display role is derived from the document headline, so it
 * is not stored separately.
 */
export interface LibraryCV {
  id: string;
  title: string;
  updatedAt: number;
  data: CVData;
}

/**
 * Returns a deep, independent copy of a CV document so edits to one library
 * entry never alias another.
 *
 * @param data - The document to clone.
 * @returns A structural clone of `data`.
 */
function cloneData(data: CVData): CVData {
  return structuredClone(data);
}

/**
 * Builds a blank document seeded with the signed-in user's name so a new CV
 * starts from real information rather than an empty masthead.
 *
 * @returns A fresh document with the profile name prefilled when available.
 */
function blankDocumentForUser(templateId: TemplateId): CVData {
  const data = createEmptyCV();
  data.templateId = templateId;
  const user = useAuthStore.getState().user;
  if (user) {
    const [firstName, ...rest] = user.name.split(" ");
    data.profile.firstName = firstName ?? "";
    data.profile.lastName = rest.join(" ");
    data.profile.email = user.email;
  }
  return data;
}

/**
 * Maps a `public.cvs` row into the in-memory {@link LibraryCV} shape.
 *
 * @param row - The raw database row.
 * @returns The library entry the UI renders.
 */
function rowToLibraryCV(row: {
  id: string;
  title: string;
  updated_at: string;
  data: Json;
}): LibraryCV {
  return {
    id: row.id,
    title: row.title,
    updatedAt: new Date(row.updated_at).getTime(),
    data: withDefaults(row.data as unknown as CVData),
  };
}

/**
 * The CV library: the collection shown on the dashboard and the source the
 * editor loads a working document from. CRUD actions update local state
 * immediately (optimistic) and mirror each change to the `cvs` table.
 */
export interface LibraryStore {
  cvs: LibraryCV[];
  /** Whether the account's library has been loaded at least once. */
  loaded: boolean;
  /** Replaces the library with the rows owned by the signed-in user. */
  load: () => Promise<void>;
  /** Empties the library (used on sign-out). */
  clear: () => void;
  create: (templateId?: TemplateId) => string;
  duplicate: (id: string) => string | null;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
  save: (id: string, data: CVData) => void;
}

/**
 * Per-CV timers that debounce remote `save` writes so editing does not issue a
 * network request on every keystroke.
 */
const saveTimers = new Map<string, ReturnType<typeof setTimeout>>();
const SAVE_DEBOUNCE_MS = 800;

/**
 * Pushes a CV's latest document to Supabase, coalescing rapid edits into a
 * single write per {@link SAVE_DEBOUNCE_MS} window.
 *
 * @param id - The CV id.
 * @param data - The document to persist.
 */
function scheduleRemoteSave(id: string, data: CVData): void {
  const existing = saveTimers.get(id);
  if (existing) clearTimeout(existing);
  saveTimers.set(
    id,
    setTimeout(() => {
      saveTimers.delete(id);
      void supabase
        .from("cvs")
        .update({
          data: data as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Failed to save CV", error);
        });
    }, SAVE_DEBOUNCE_MS),
  );
}

/**
 * Zustand store owning every CV in the library. The backend is the source of
 * truth: {@link LibraryStore.load} hydrates it from the signed-in account and
 * every mutation is mirrored to the `cvs` table.
 */
export const useLibraryStore = create<LibraryStore>()((set, get) => ({
  cvs: [],
  loaded: false,

  load: async () => {
    const { data, error } = await supabase
      .from("cvs")
      .select("id, title, updated_at, data")
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("Failed to load library", error);
      set({ loaded: true });
      return;
    }
    set({ cvs: data.map(rowToLibraryCV), loaded: true });
  },

  clear: () => set({ cvs: [], loaded: false }),

  create: (templateId = "classic") => {
    const id = crypto.randomUUID();
    const entry: LibraryCV = {
      id,
      title: "Untitled CV",
      updatedAt: Date.now(),
      data: blankDocumentForUser(templateId),
    };
    set((state) => ({ cvs: [entry, ...state.cvs] }));
    void supabase
      .from("cvs")
      .insert({ id, title: entry.title, data: entry.data as unknown as Json })
      .then(({ error }) => {
        if (error) console.error("Failed to create CV", error);
      });
    return id;
  },

  duplicate: (id) => {
    const source = get().cvs.find((cv) => cv.id === id);
    if (!source) return null;

    const newId = crypto.randomUUID();
    const copy: LibraryCV = {
      id: newId,
      title: `Copy of ${source.title}`,
      updatedAt: Date.now(),
      data: cloneData(source.data),
    };
    set((state) => ({ cvs: [copy, ...state.cvs] }));
    void supabase
      .from("cvs")
      .insert({
        id: newId,
        title: copy.title,
        data: copy.data as unknown as Json,
      })
      .then(({ error }) => {
        if (error) console.error("Failed to duplicate CV", error);
      });
    return newId;
  },

  rename: (id, title) => {
    set((state) => ({
      cvs: state.cvs.map((cv) => (cv.id === id ? { ...cv, title } : cv)),
    }));
    void supabase
      .from("cvs")
      .update({ title })
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("Failed to rename CV", error);
      });
  },

  remove: (id) => {
    set((state) => ({ cvs: state.cvs.filter((cv) => cv.id !== id) }));
    void supabase
      .from("cvs")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("Failed to delete CV", error);
      });
  },

  save: (id, data) => {
    set((state) => ({
      cvs: state.cvs.map((cv) =>
        cv.id === id ? { ...cv, data, updatedAt: Date.now() } : cv,
      ),
    }));
    scheduleRemoteSave(id, data);
  },
}));

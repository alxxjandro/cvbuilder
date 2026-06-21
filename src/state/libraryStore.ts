import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CVData } from "../types/cv";
import type { Json } from "../lib/database.types";
import { createEmptyCV, SAMPLE_LIBRARY } from "../model/cv";
import { supabase, isSupabaseEnabled } from "../lib/supabase";
import { useAuthStore } from "./authStore";

const DAY = 24 * 60 * 60 * 1000;

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
function blankDocumentForUser(): CVData {
  const data = createEmptyCV();
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
 * Builds the starter library from {@link SAMPLE_LIBRARY}: real, editable
 * documents with fresh ids and staggered edit times. Used only on the mocked,
 * localStorage path; real accounts start empty.
 *
 * @returns The seeded list of library CVs.
 */
function seedLibrary(): LibraryCV[] {
  const now = Date.now();
  return SAMPLE_LIBRARY.map((sample, index) => ({
    id: crypto.randomUUID(),
    title: sample.title,
    updatedAt: now - index * 2 * DAY,
    data: cloneData(sample.data),
  }));
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
    data: row.data as unknown as CVData,
  };
}

/**
 * The CV library: the collection shown on the dashboard and the source the
 * editor loads a working document from. CRUD actions update local state
 * immediately and, when Supabase is enabled, mirror the change to the backend.
 */
export interface LibraryStore {
  cvs: LibraryCV[];
  /** Loaded the persisted/remote library at least once. */
  loaded: boolean;
  /** Replaces the library with the rows owned by the signed-in user. */
  load: () => Promise<void>;
  /** Empties the library (used on sign-out). */
  clear: () => void;
  create: () => string;
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
      void supabase!
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
 * The store implementation. The same actions back both paths; each action
 * branches on {@link isSupabaseEnabled} to also hit the backend.
 */
const createLibrary = (
  set: (
    partial:
      | Partial<LibraryStore>
      | ((state: LibraryStore) => Partial<LibraryStore>),
  ) => void,
  get: () => LibraryStore,
): LibraryStore => ({
  cvs: isSupabaseEnabled ? [] : seedLibrary(),
  loaded: !isSupabaseEnabled,

  load: async () => {
    if (!isSupabaseEnabled) {
      set({ loaded: true });
      return;
    }
    const { data, error } = await supabase!
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

  clear: () => set({ cvs: [], loaded: !isSupabaseEnabled }),

  create: () => {
    const id = crypto.randomUUID();
    const entry: LibraryCV = {
      id,
      title: "Untitled CV",
      updatedAt: Date.now(),
      data: blankDocumentForUser(),
    };
    set((state) => ({ cvs: [entry, ...state.cvs] }));
    if (isSupabaseEnabled) {
      void supabase!
        .from("cvs")
        .insert({ id, title: entry.title, data: entry.data as unknown as Json })
        .then(({ error }) => {
          if (error) console.error("Failed to create CV", error);
        });
    }
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
    if (isSupabaseEnabled) {
      void supabase!
        .from("cvs")
        .insert({
          id: newId,
          title: copy.title,
          data: copy.data as unknown as Json,
        })
        .then(({ error }) => {
          if (error) console.error("Failed to duplicate CV", error);
        });
    }
    return newId;
  },

  rename: (id, title) => {
    set((state) => ({
      cvs: state.cvs.map((cv) => (cv.id === id ? { ...cv, title } : cv)),
    }));
    if (isSupabaseEnabled) {
      void supabase!
        .from("cvs")
        .update({ title })
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Failed to rename CV", error);
        });
    }
  },

  remove: (id) => {
    set((state) => ({ cvs: state.cvs.filter((cv) => cv.id !== id) }));
    if (isSupabaseEnabled) {
      void supabase!
        .from("cvs")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Failed to delete CV", error);
        });
    }
  },

  save: (id, data) => {
    set((state) => ({
      cvs: state.cvs.map((cv) =>
        cv.id === id ? { ...cv, data, updatedAt: Date.now() } : cv,
      ),
    }));
    if (isSupabaseEnabled) scheduleRemoteSave(id, data);
  },
});

/**
 * Zustand store owning every CV in the library. With Supabase enabled the
 * backend is the source of truth and the store is hydrated by {@link
 * LibraryStore.load}; otherwise it is persisted to localStorage.
 */
export const useLibraryStore = isSupabaseEnabled
  ? create<LibraryStore>()(createLibrary)
  : create<LibraryStore>()(
      persist(createLibrary, {
        name: "currio-library",
        partialize: (state) => ({ cvs: state.cvs }),
      }),
    );

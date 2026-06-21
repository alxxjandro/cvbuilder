import { create } from "zustand";
import type {
  BulletSection,
  CVData,
  ListSection,
  Profile,
  SectionEntryMap,
} from "../types/cv";
import { createEmptyCV, createEntry } from "../model/cv";

/**
 * Maps each bullet section to the entry field that stores its string lines.
 */
const BULLET_FIELD: Record<BulletSection, "bullets" | "groupValues"> = {
  experience: "bullets",
  projects: "bullets",
  skillGroups: "groupValues",
};

/**
 * Returns a new document with `updater` applied to the entry identified by
 * `id` in `section`; all other entries are kept by reference.
 *
 * @param data - The current document.
 * @param section - The list section that owns the entry.
 * @param id - The id of the entry to replace.
 * @param updater - Maps the matched entry to its replacement.
 * @returns The next document.
 */
function replaceEntry<S extends ListSection>(
  data: CVData,
  section: S,
  id: string,
  updater: (entry: SectionEntryMap[S]) => SectionEntryMap[S],
): CVData {
  const list = data[section] as SectionEntryMap[S][];
  return {
    ...data,
    [section]: list.map((entry) => (entry.id === id ? updater(entry) : entry)),
  };
}

/**
 * Returns a new document with `updater` applied to the string array held by a
 * bullet entry (the `bullets` or `groupValues` field, depending on section).
 *
 * @param data - The current document.
 * @param section - The bullet section that owns the entry.
 * @param id - The id of the entry to update.
 * @param updater - Maps the current lines to their replacement.
 * @returns The next document.
 */
function replaceBullets(
  data: CVData,
  section: BulletSection,
  id: string,
  updater: (lines: string[]) => string[],
): CVData {
  const field = BULLET_FIELD[section];
  return replaceEntry(data, section, id, (entry) => {
    const lines = (entry as unknown as Record<string, string[]>)[field];
    return { ...entry, [field]: updater(lines) };
  });
}

/**
 * Global CV state and the actions that mutate it. State updates are always
 * immutable; components subscribe to slices of `data` through selectors.
 */
export interface CVStore {
  /**
   * The current CV document.
   */
  data: CVData;
  /**
   * Updates one field of the profile header.
   */
  updateProfileField: (field: keyof Profile, value: string) => void;
  /**
   * Appends a fresh, empty entry to a list section.
   */
  addEntry: (section: ListSection) => void;
  /**
   * Patches the entry identified by `id` within `section`.
   */
  updateEntry: <S extends ListSection>(
    section: S,
    id: string,
    patch: Partial<SectionEntryMap[S]>,
  ) => void;
  /**
   * Removes the entry identified by `id` from `section`.
   */
  deleteEntry: (section: ListSection, id: string) => void;
  /**
   * Moves an entry one position up or down within `section`.
   */
  reorderEntry: (
    section: ListSection,
    id: string,
    direction: "up" | "down",
  ) => void;
  /**
   * Appends a bullet/value line to a bullet entry.
   */
  addBullet: (section: BulletSection, id: string, value: string) => void;
  /**
   * Replaces the bullet line at `index` of a bullet entry.
   */
  updateBullet: (
    section: BulletSection,
    id: string,
    index: number,
    value: string,
  ) => void;
  /**
   * Removes the bullet line at `index` of a bullet entry.
   */
  deleteBullet: (section: BulletSection, id: string, index: number) => void;
  /**
   * Replaces the entire document.
   */
  load: (data: CVData) => void;
}

/**
 * Zustand store that owns the working CV document. It starts empty; the editor
 * loads the document for the current route and mirrors edits back to the
 * persisted library, while tests replace it through {@link CVStore.load}.
 */
export const useCVStore = create<CVStore>((set) => ({
  data: createEmptyCV(),

  updateProfileField: (field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        profile: { ...state.data.profile, [field]: value },
      },
    })),

  addEntry: (section) =>
    set((state) => {
      const list = state.data[section] as SectionEntryMap[ListSection][];
      return {
        data: { ...state.data, [section]: [...list, createEntry(section)] },
      };
    }),

  updateEntry: (section, id, patch) =>
    set((state) => ({
      data: replaceEntry(state.data, section, id, (entry) => ({
        ...entry,
        ...patch,
      })),
    })),

  deleteEntry: (section, id) =>
    set((state) => {
      const list = state.data[section] as { id: string }[];
      return {
        data: {
          ...state.data,
          [section]: list.filter((entry) => entry.id !== id),
        },
      };
    }),

  reorderEntry: (section, id, direction) =>
    set((state) => {
      const list = state.data[section] as { id: string }[];
      const index = list.findIndex((entry) => entry.id === id);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || target < 0 || target >= list.length) return state;

      const reordered = [...list];
      [reordered[index], reordered[target]] = [
        reordered[target],
        reordered[index],
      ];
      return { data: { ...state.data, [section]: reordered } };
    }),

  addBullet: (section, id, value) =>
    set((state) => ({
      data: replaceBullets(state.data, section, id, (lines) => [
        ...lines,
        value,
      ]),
    })),

  updateBullet: (section, id, index, value) =>
    set((state) => ({
      data: replaceBullets(state.data, section, id, (lines) =>
        lines.map((line, i) => (i === index ? value : line)),
      ),
    })),

  deleteBullet: (section, id, index) =>
    set((state) => ({
      data: replaceBullets(state.data, section, id, (lines) =>
        lines.filter((_, i) => i !== index),
      ),
    })),

  load: (data) => set({ data }),
}));

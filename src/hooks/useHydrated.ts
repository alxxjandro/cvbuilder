import { useLibraryStore } from "../state/libraryStore";

/**
 * Tracks whether the library is ready to render, meaning the signed-in
 * account's CVs have been loaded from the backend. Components use it to show
 * skeletons until real data is ready.
 *
 * @returns `true` once the library has loaded.
 */
export function useHydrated(): boolean {
  return useLibraryStore((state) => state.loaded);
}

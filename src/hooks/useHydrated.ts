import { useEffect, useState } from "react";
import { useLibraryStore } from "../state/libraryStore";
import { isSupabaseEnabled } from "../lib/supabase";

/**
 * Minimal shape of zustand's persist API, present only on the mocked,
 * localStorage-backed store.
 */
interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (callback: () => void) => () => void;
}

/**
 * The persist API when the store is localStorage-backed, otherwise `undefined`
 * (Supabase mode loads from the network instead of rehydrating).
 */
const persist = (useLibraryStore as unknown as { persist?: PersistApi })
  .persist;

/**
 * Tracks whether the library is ready to render. In Supabase mode this means
 * the account's CVs have been loaded; in mock mode it means the persisted
 * library has finished rehydrating from localStorage. Components use it to show
 * skeletons until real data is ready.
 *
 * @returns `true` once the library is ready.
 */
export function useHydrated(): boolean {
  const loaded = useLibraryStore((state) => state.loaded);
  const [hydrated, setHydrated] = useState(() =>
    isSupabaseEnabled ? loaded : (persist?.hasHydrated() ?? true),
  );

  useEffect(() => {
    if (isSupabaseEnabled || !persist) return;
    const unsubscribe = persist.onFinishHydration(() => setHydrated(true));
    setHydrated(persist.hasHydrated());
    return unsubscribe;
  }, []);

  return isSupabaseEnabled ? loaded : hydrated;
}

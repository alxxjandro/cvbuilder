import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase, isSupabaseEnabled } from "./supabase";
import type { Json } from "./database.types";
import { useAuthStore, type User } from "../state/authStore";
import { useLibraryStore, type LibraryCV } from "../state/libraryStore";

const LOCAL_LIBRARY_KEY = "currio-library";

/**
 * Derives up-to-two-letter initials from a display name.
 *
 * @param name - The user's display name.
 * @returns Uppercase initials, for example `"MO"`.
 */
function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/**
 * Normalizes a Supabase auth user into the app's {@link User} shape, preferring
 * the Google profile name and falling back to the email local part.
 *
 * @param account - The Supabase session user.
 * @returns The normalized account.
 */
function toUser(account: SupabaseUser): User {
  const meta = account.user_metadata ?? {};
  const name: string =
    meta.full_name || meta.name || account.email?.split("@")[0] || "You";
  return {
    name,
    email: account.email ?? "",
    initials: initialsFrom(name),
  };
}

/**
 * Reads CVs persisted by a previous mocked, localStorage-only session and, when
 * present, uploads them to the freshly signed-in account. Runs once: the local
 * copy is cleared after a successful insert so it never re-imports.
 *
 * @returns Whether any rows were imported.
 */
async function importLocalLibrary(): Promise<boolean> {
  const raw = localStorage.getItem(LOCAL_LIBRARY_KEY);
  if (!raw) return false;

  let cvs: LibraryCV[] = [];
  try {
    const parsed = JSON.parse(raw) as { state?: { cvs?: LibraryCV[] } };
    cvs = parsed.state?.cvs ?? [];
  } catch {
    localStorage.removeItem(LOCAL_LIBRARY_KEY);
    return false;
  }

  if (cvs.length === 0) {
    localStorage.removeItem(LOCAL_LIBRARY_KEY);
    return false;
  }

  const rows = cvs.map((cv) => ({
    id: cv.id,
    title: cv.title,
    data: cv.data as unknown as Json,
    updated_at: new Date(cv.updatedAt).toISOString(),
  }));

  const { error } = await supabase!.from("cvs").insert(rows);
  if (error) {
    console.error("Failed to import local library", error);
    return false; // keep the local copy so the import can be retried
  }

  localStorage.removeItem(LOCAL_LIBRARY_KEY);
  return true;
}

/**
 * Loads the account's library, importing any leftover local CVs the first time
 * a brand-new (empty) account signs in.
 */
async function syncLibrary(): Promise<void> {
  const library = useLibraryStore.getState();
  await library.load();
  if (useLibraryStore.getState().cvs.length === 0) {
    const imported = await importLocalLibrary();
    if (imported) await library.load();
  }
}

/**
 * Wires the Supabase auth session into the app stores. Imported for its side
 * effects from `main.tsx`. A no-op when Supabase is not configured (the mock
 * path owns the session and library in that case).
 */
export function initSession(): void {
  if (!isSupabaseEnabled) return;

  supabase!.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      useAuthStore.getState().setUser(toUser(session.user));
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        void syncLibrary();
      }
    } else {
      useAuthStore.getState().setUser(null);
      useLibraryStore.getState().clear();
    }
  });
}

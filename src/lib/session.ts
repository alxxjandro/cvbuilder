import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { useAuthStore, type User } from "../state/authStore";
import { useLibraryStore } from "../state/libraryStore";

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
 * Wires the Supabase auth session into the app stores. Imported for its side
 * effects from `main.tsx`: the listener resolves the session on load, on
 * sign-in and on sign-out, keeping the auth and library stores in sync.
 */
export function initSession(): void {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      useAuthStore.getState().setUser(toUser(session.user));
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        void useLibraryStore.getState().load();
      }
    } else {
      useAuthStore.getState().setUser(null);
      useLibraryStore.getState().clear();
    }
  });
}

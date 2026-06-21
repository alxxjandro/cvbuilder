import { create } from "zustand";
import { supabase } from "../lib/supabase";

/**
 * The signed-in account, normalized from the Supabase session.
 */
export interface User {
  name: string;
  email: string;
  initials: string;
}

/**
 * Authentication state. `signIn` starts the Google OAuth redirect; the resolved
 * session is written back by the session bootstrap (`src/lib/session.ts`).
 */
export interface AuthStore {
  user: User | null;
  /**
   * Whether the initial session has been resolved. Guards avoid redirecting
   * while this is false so the post-OAuth round trip does not flash the
   * landing page.
   */
  ready: boolean;
  signIn: () => void;
  signOut: () => void;
  /** Records the resolved account; used by the Supabase session listener. */
  setUser: (user: User | null) => void;
}

/**
 * Zustand store holding the current session. The Supabase session is the source
 * of truth and is rehydrated by the auth listener on load, so nothing is
 * persisted here directly.
 */
export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  ready: false,
  signIn: () => {
    void supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  },
  signOut: () => {
    void supabase.auth.signOut();
    set({ user: null });
  },
  setUser: (user) => set({ user, ready: true }),
}));

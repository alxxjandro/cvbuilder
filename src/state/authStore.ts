import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, isSupabaseEnabled } from "../lib/supabase";

/**
 * The signed-in account, normalized from either the mock or a Supabase session.
 */
export interface User {
  name: string;
  email: string;
  initials: string;
}

/**
 * Hardcoded account used while authentication is mocked (Supabase not
 * configured). Mirrors the sample CV owner so the avatar and seeded documents
 * line up.
 */
const HARDCODED_USER: User = {
  name: "Maya Okonkwo",
  email: "maya.okonkwo@gmail.com",
  initials: "MO",
};

/**
 * Authentication state. With Supabase configured, {@link AuthStore.signIn}
 * starts the Google OAuth redirect and the resolved session is written back by
 * the session bootstrap (`src/lib/session.ts`). Without it, sign-in resolves
 * immediately to {@link HARDCODED_USER}.
 */
export interface AuthStore {
  user: User | null;
  /**
   * Whether the initial session has been resolved. Guards avoid redirecting
   * while this is false so the post-OAuth round trip does not flash the
   * landing page. Always true in mock mode.
   */
  ready: boolean;
  signIn: () => void;
  signOut: () => void;
  /** Records the resolved account; used by the Supabase session listener. */
  setUser: (user: User | null) => void;
}

/**
 * Zustand store holding the current session. Persisted to localStorage only in
 * mock mode; with Supabase enabled the session is the source of truth and is
 * rehydrated by the auth listener, so we skip the local copy.
 */
export const useAuthStore = isSupabaseEnabled
  ? create<AuthStore>()((set) => ({
      user: null,
      ready: false,
      signIn: () => {
        void supabase!.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${window.location.origin}/dashboard` },
        });
      },
      signOut: () => {
        void supabase!.auth.signOut();
        set({ user: null });
      },
      setUser: (user) => set({ user, ready: true }),
    }))
  : create<AuthStore>()(
      persist(
        (set) => ({
          user: null,
          ready: true,
          signIn: () => set({ user: HARDCODED_USER }),
          signOut: () => set({ user: null }),
          setUser: (user) => set({ user, ready: true }),
        }),
        {
          name: "currio-auth",
          partialize: (state) => ({ user: state.user }),
        },
      ),
    );

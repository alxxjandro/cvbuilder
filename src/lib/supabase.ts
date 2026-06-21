import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env.VITE_SUPABASE_URL;
/**
 * Prefer the modern publishable key (`sb_publishable_...`); fall back to the
 * legacy anon key so older `.env.local` files keep working.
 */
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Shared, schema-typed Supabase client, or `null` until the environment is
 * configured. While the backend is unconfigured the app runs entirely on
 * localStorage; once `VITE_SUPABASE_URL` and a publishable/anon key are set,
 * this resolves to a live client that the auth store and CV repository switch
 * over to.
 */
export const supabase: SupabaseClient<Database> | null =
  url && key ? createClient<Database>(url, key) : null;

/**
 * Whether Supabase is configured. Call sites use this to choose between the
 * mocked localStorage path and the real backend.
 */
export const isSupabaseEnabled = supabase !== null;

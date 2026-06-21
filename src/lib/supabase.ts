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

if (!url || !key) {
  throw new Error(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL and " +
      "VITE_SUPABASE_PUBLISHABLE_KEY in .env.local for local development and " +
      "in your Netlify site settings for production.",
  );
}

/**
 * Shared, schema-typed Supabase client. The app is backend-only: both
 * authentication (Google OAuth) and the CV library are served by this client.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  url,
  key,
);

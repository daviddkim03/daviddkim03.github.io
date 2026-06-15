import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when the Supabase env vars are present (admin + live content enabled). */
export const isSupabaseConfigured = Boolean(url && anonKey);

let cached: SupabaseClient | null = null;

/**
 * Returns a singleton browser Supabase client, or null when the project isn't
 * configured. Callers must handle null so the site works as a static export
 * with the built-in default content.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return cached;
}

/** Storage bucket that holds the résumé PDF and any uploaded images. */
export const ASSETS_BUCKET = "assets";

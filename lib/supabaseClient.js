import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when both environment variables are present. */
export const isSupabaseConfigured = Boolean(url && anonKey);

let browserClient = null;

/**
 * Supabase client for the browser (keeps the admin session in localStorage).
 * Returns null when the env vars are missing, so pages can show a clear
 * message instead of crashing.
 */
export function getSupabaseBrowser() {
  if (!isSupabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClient;
}

/** Fresh client for server components (no session persistence). */
export function getSupabaseServer() {
  if (!isSupabaseConfigured) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const STORAGE_BUCKET = "portfolio";

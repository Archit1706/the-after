import { createBrowserClient } from "@supabase/ssr";
import { publicConfig } from "@/lib/env";

/** Browser-side Supabase client. Guard on `publicFeatures.supabase` first. */
export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = publicConfig;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured.");
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

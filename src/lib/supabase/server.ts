import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/env";

/**
 * Server-side Supabase client bound to the request's cookies. Used in Server
 * Components, Server Actions, and Route Handlers. Throws if Supabase isn't
 * configured — callers guard on `features.supabase` first.
 */
export async function createSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = serverEnv;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render where cookies are read-only.
          // The proxy refreshes the session cookie, so this is safe to ignore.
        }
      },
    },
  });
}

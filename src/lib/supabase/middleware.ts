import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env";

/**
 * Refreshes the Supabase auth session on each request and propagates the
 * updated cookies onto the response. This is the canonical @supabase/ssr
 * middleware pattern, adapted for the Next 16 proxy (nodejs runtime).
 */
export async function updateSupabaseSession(
  request: NextRequest
): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const { supabaseUrl, supabaseAnonKey } = serverEnv;
  if (!supabaseUrl || !supabaseAnonKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Touch getUser() to trigger a token refresh when needed.
  await supabase.auth.getUser();

  return response;
}

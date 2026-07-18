import { NextResponse, type NextRequest } from "next/server";
import { features } from "@/lib/env";
import {
  GUEST_COOKIE,
  GUEST_COOKIE_MAX_AGE,
  GUEST_ID_PREFIX,
} from "@/lib/auth/constants";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

/**
 * Next 16 proxy (replaces middleware). Two responsibilities:
 * - Supabase mode: keep the auth session fresh.
 * - Demo mode: provision a per-browser guest identity so each visitor gets
 *   their own private, persistent space with no sign-in.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  if (features.supabase) {
    return updateSupabaseSession(request);
  }

  const response = NextResponse.next();
  if (!request.cookies.get(GUEST_COOKIE)) {
    response.cookies.set(GUEST_COOKIE, `${GUEST_ID_PREFIX}${crypto.randomUUID()}`, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: GUEST_COOKIE_MAX_AGE,
    });
  }
  return response;
}

export const config = {
  matcher: [
    // Run on everything except static assets and image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};

import "server-only";
import { cookies } from "next/headers";
import { features } from "@/lib/env";
import { createLogger } from "@/lib/logger";
import type { AppUser } from "@/lib/db/types";
import { GUEST_COOKIE } from "./constants";
import { getSupabaseUser } from "./supabase-user";

const log = createLogger("auth");

const FALLBACK_GUEST: AppUser = {
  id: "guest",
  email: null,
  name: "Guest",
  isGuest: true,
};

/**
 * Resolves the current user for the request.
 *
 * - Supabase mode: the authenticated user, or `null` when signed out.
 * - Demo mode: a per-browser guest identity (provisioned by the proxy), so
 *   the full experience is usable with no sign-in and each browser's data
 *   stays separate.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  if (features.supabase) {
    try {
      return await getSupabaseUser();
    } catch (err) {
      log.error("Failed to resolve Supabase user", {
        message: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }

  const store = await cookies();
  const guestId = store.get(GUEST_COOKIE)?.value;
  if (!guestId) return FALLBACK_GUEST;
  return { id: guestId, email: null, name: "Guest", isGuest: true };
}

/** Like getCurrentUser but never null — for demo-friendly routes. */
export async function getCurrentUserOrGuest(): Promise<AppUser> {
  const user = await getCurrentUser();
  return user ?? FALLBACK_GUEST;
}

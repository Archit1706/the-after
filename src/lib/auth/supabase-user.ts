import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppUser } from "@/lib/db/types";

/** Resolves the authenticated Supabase user for the current request. */
export async function getSupabaseUser(): Promise<AppUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const metadata = user.user_metadata ?? {};
  const name =
    (typeof metadata.full_name === "string" && metadata.full_name) ||
    (typeof metadata.name === "string" && metadata.name) ||
    null;

  return {
    id: user.id,
    email: user.email ?? null,
    name,
    isGuest: false,
  };
}

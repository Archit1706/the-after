"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { features } from "@/lib/env";
import { GUEST_COOKIE } from "./constants";

/** Sign out (Supabase) or reset the guest identity (demo mode). */
export async function signOut(): Promise<void> {
  if (features.supabase) {
    const { createSupabaseServerClient } = await import(
      "@/lib/supabase/server"
    );
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } else {
    const store = await cookies();
    store.delete(GUEST_COOKIE);
  }
  redirect("/");
}

"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { features } from "@/lib/env";

export interface AuthActionState {
  error?: string;
  message?: string;
}

async function origin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!features.supabase) redirect("/begin");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/plan");
  if (!email || !password) return { error: "Please enter your email and password." };

  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect(next);
}

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!features.supabase) redirect("/begin");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 8) {
    return { error: "Please use a valid email and a password of at least 8 characters." };
  }

  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${await origin()}/auth/callback` },
  });
  if (error) return { error: error.message };

  // If the project requires email confirmation, there's no active session yet.
  if (!data.session) {
    return {
      message:
        "Almost there — check your email for a link to confirm your account.",
    };
  }

  redirect("/plan");
}

export async function signInWithGoogleAction(): Promise<void> {
  if (!features.supabase) redirect("/begin");

  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await origin()}/auth/callback` },
  });
  if (data?.url) redirect(data.url);
  redirect("/sign-in?error=oauth");
}

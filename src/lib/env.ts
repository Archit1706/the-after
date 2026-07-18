/**
 * Central, defensive access to configuration.
 *
 * Nothing here throws when a value is missing: The After is designed to run
 * fully in a keyless "demo mode" and progressively light up as real
 * credentials (OpenAI, Supabase) are provided. Feature flags let the rest of
 * the app branch on what's actually available.
 *
 * Only `NEXT_PUBLIC_*` values are inlined into the client bundle; server-only
 * secrets resolve to `undefined` on the client, so this module is safe to
 * import anywhere.
 */

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const serverEnv = {
  openaiApiKey: clean(process.env.OPENAI_API_KEY),
  openaiModel: clean(process.env.OPENAI_MODEL) ?? "gpt-5.6",
  openaiBaseUrl: clean(process.env.OPENAI_BASE_URL),
  supabaseUrl: clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  supabaseServiceRoleKey: clean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  appUrl:
    clean(process.env.APP_URL) ??
    clean(process.env.NEXT_PUBLIC_APP_URL) ??
    "http://localhost:3000",
} as const;

/** Client-safe configuration (only NEXT_PUBLIC values). */
export const publicConfig = {
  supabaseUrl: clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
} as const;

/** Server-side view of which integrations are wired up. */
export const features = {
  /** Real GPT-5.6 calls (otherwise a deterministic demo model is used). */
  ai: Boolean(serverEnv.openaiApiKey),
  /** Supabase Postgres + Auth + Storage (otherwise local demo store). */
  supabase: Boolean(serverEnv.supabaseUrl && serverEnv.supabaseAnonKey),
} as const;

/** Client-safe view (only reflects what the browser can know). */
export const publicFeatures = {
  supabase: Boolean(publicConfig.supabaseUrl && publicConfig.supabaseAnonKey),
} as const;

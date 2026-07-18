<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# The After — project guide

A compassionate "death-admin" companion: it guides a grieving person through the
practical tasks after a loved one dies (see `README.md`).

## Stack & conventions
- Next.js 16 (App Router, React 19 Server Components + Server Actions),
  TypeScript, Tailwind v4. Node 20.9+.
- `params`/`searchParams`/`cookies()` are **async** (await them). Middleware is
  `src/proxy.ts` (not `middleware.ts`).
- Zod schemas in `src/lib/domain/` are the single source of truth for types —
  infer types, don't hand-write them.
- Import alias: `@/*` → `src/*`.

## Key seams (extend these, don't fork them)
- **AI:** `src/lib/ai/` — provider interface (`getAi()`), live OpenAI + demo
  mock. Every AI feature must keep a deterministic fallback so the app runs with
  no key.
- **Data:** `src/lib/db/` — `Repository` interface with in-memory and Supabase
  implementations behind `getRepository()`.
- **Auth:** `getCurrentUser()` in `src/lib/auth/session.ts` (guest cookie in
  demo mode, Supabase when configured).
- **Plan:** `src/lib/plan/templates.ts` (task library) + `generate.ts`.

## Rules
- The app must always run with **no env vars** (demo mode). Guard new
  integrations behind `features.*` in `src/lib/env.ts`.
- Server Actions must verify ownership (see `getOwnedCase`).
- Keep the tone warm and non-clinical in all user-facing copy.
- Run `npx tsc --noEmit` and `npm run build` before committing.

# The After

**A gentle, guided companion for the practical side of loss.**

When someone you love dies, dozens of accounts, forms, and deadlines arrive all
at once — while you're grieving. **The After** turns that overwhelming pile into
a calm, personal plan, drafts the hardest letters and calls for you, and stays
beside you as a companion the whole way through.

> Built for **OpenAI Build Week** · Track: **Apps for Your Life**

- **Live demo:** _add your Vercel URL here_
- **Runs with zero setup:** `npm install && npm run dev` → open http://localhost:3000

---

## Why this exists

Grief comes with a second, invisible job: closing bank accounts, notifying
Social Security, ordering death certificates, filing insurance claims, canceling
subscriptions, handling probate — often 100+ tasks, many with real deadlines.
Most people face it with a stack of browser tabs and a legal pad, at the worst
possible moment.

The After exists to carry that load. It's designed as an **experience, not a
dashboard**: warm, unhurried, inclusive of every kind of loss and family, and
built so you only ever have to look at the next small step.

## What it does

- **Guided intake** — a warm, one-question-at-a-time conversation that learns
  your situation. Everything is optional; nothing is required.
- **A personal plan** — a prioritized checklist grouped into _Right now · Soon ·
  Later_, with statutory-aware deadlines computed from the date of passing. Only
  the tasks that apply to your situation appear.
- **Letters & phone scripts** — drafted for banks, benefits, utilities, and any
  organization, personalized and exportable (copy, download, print/PDF).
- **Document vault** — keep the death certificate, will, and IDs safe, with a
  certified-copies tracker.
- **Who to notify** — a searchable directory of institutions with real contact
  info, what each needs, and progress tracking.
- **Companion** — an always-available, streaming chat grounded in your specific
  case, so you never have to explain from scratch.

## How GPT-5.6 is used

The After has a **pluggable AI layer** (`src/lib/ai/`) that powers:

- **Intake enrichment & plan summaries** — GPT-5.6 writes the warm, personal
  summary of your plan and suggests situation-specific tasks a generic checklist
  would miss (`src/lib/plan/generate.ts`).
- **Letters & phone scripts** — GPT-5.6 drafts personalized, ready-to-use
  correspondence (`src/lib/letters/generate.ts`).
- **The companion** — GPT-5.6 answers grounded in your case, streamed token by
  token (`src/app/api/companion/route.ts`).

Every AI feature has a **deterministic fallback**, so the app is fully usable —
and demoable — with no API key at all. Set `OPENAI_API_KEY` to switch the same
code paths to live GPT-5.6.

## Running it

### Quick start (demo mode — no keys needed)

```bash
npm install
npm run dev
# open http://localhost:3000
```

Out of the box the app runs in **demo mode**:

- **AI:** a deterministic model produces plans, letters, and companion replies
  (no key, no cost). Add `OPENAI_API_KEY` to use real GPT-5.6.
- **Data:** a private, per-browser guest space backed by an in-memory store
  (persisted to `.data/` locally). No sign-in required.

This is the simplest way for judges to try the full experience end to end — just
click **Begin gently** and go through the intake.

### Full mode (real accounts + persistence)

1. Copy env: `cp .env.example .env.local`
2. Create a [Supabase](https://supabase.com) project and run
   [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor (creates all
   tables, row-level security, and the private `documents` storage bucket).
3. Fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, and `OPENAI_API_KEY` in `.env.local`.
4. `npm run dev`

With Supabase configured, sign-in (email/password + Google) turns on
automatically, data persists in Postgres, and documents are stored privately in
Supabase Storage. Every table is protected by row-level security so users only
ever see their own case.

### Deploying

Deploy to [Vercel](https://vercel.com): import the repo, add the same
environment variables, and deploy. Set `NEXT_PUBLIC_APP_URL` to your deployed
URL for correct OAuth redirects (and add `<url>/auth/callback` to Supabase's
allowed redirect URLs).

## Architecture

- **Framework:** Next.js 16 (App Router, React 19, Server Components + Server
  Actions), TypeScript, Tailwind CSS v4.
- **AI:** `src/lib/ai/` — a provider interface with live OpenAI (GPT-5.6) and
  deterministic demo implementations, selected at runtime by configuration.
- **Domain:** `src/lib/domain/` — Zod schemas as the single source of truth for
  types and validation.
- **Data:** `src/lib/db/` — a `Repository` interface with two implementations
  (in-memory demo store and Supabase-backed store) behind one factory.
- **Auth:** per-browser guest identity in demo mode (`src/proxy.ts`), Supabase
  Auth when configured — same `getCurrentUser()` seam either way.
- **Plan engine:** `src/lib/plan/` — a curated, condition-aware task template
  library plus a generator that filters by situation, computes deadlines, and
  layers optional AI additions.

Design principles: graceful degradation everywhere (no key or no database is a
supported state, not an error), ownership-checked server actions, accessible
components (labels, focus rings, `prefers-reduced-motion`), and a calm,
bereavement-appropriate visual language.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Zod · OpenAI SDK
(GPT-5.6) · Supabase (Postgres, Auth, Storage) · lucide-react

## Building with Codex + GPT-5.6

<!--
  REQUIRED FOR SUBMISSION — complete this section truthfully before submitting.
  The rules require the /feedback Codex session ID for the thread where the
  majority of core functionality was built, and the demo video must narrate how
  you used Codex and GPT-5.6.
-->

- **Codex `/feedback` session ID:** `<add your session id here>`
- **Where Codex accelerated the work:** _e.g. scaffolding the domain model,
  generating the task template library, wiring the Supabase repository, iterating
  on the intake flow…_
- **Key decisions we made:** _e.g. the pluggable AI layer with a deterministic
  fallback so the app is always demoable; deadline math driven from the date of
  passing; per-browser guest identity for a frictionless first run…_
- **How GPT-5.6 shows up in the product:** intake summaries, situation-specific
  task suggestions, letter/script drafting, and the case-grounded companion.

## A note on scope

The After offers general, practical guidance to help you get organized. It is
**not legal, tax, financial, or medical advice**, and it is not a substitute for
a licensed professional. Deadlines and requirements vary by place and situation
— please verify anything important.

## License

MIT — see [LICENSE](LICENSE).

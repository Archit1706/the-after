# The After

> Built for **OpenAI Build Week** · Track: **Apps for Your Life**

**The After is a gentle death-admin companion for the practical work that
follows a loss.** It turns accounts, paperwork, documents, and deadlines into a
calm personal plan, helps draft difficult letters and calls, and offers a warm
place to ask what comes next — so a grieving person only has to face one small
step at a time.

- **Live demo:** [theafter.vercel.app](https://theafter.vercel.app). Private
  test credentials are provided in the Devpost submission&rsquo;s testing
  instructions; they are not stored in this public repository.
- **Runs with zero setup:** `npm install && npm run dev`

## Run locally

### Demo mode — no environment variables

```bash
npm install
npm run dev
# open http://localhost:3000
```

With no `.env.local` or environment variables, The After runs immediately with
deterministic AI and in-memory, private per-browser guest data. No account, API
key, or database is needed, so judges can test the full flow right away.


### Full mode — OpenAI + Supabase

Copy `.env.example` to `.env.local`, set the values you use, and run
`supabase/schema.sql` once in your Supabase project before starting the app.

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Enables live GPT-5.6 responses. |
| `OPENAI_MODEL=gpt-5.6-sol` | Optional model override for live requests. |
| `OPENAI_BASE_URL` | Optional OpenAI-compatible endpoint override. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe Supabase anonymous key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase service key. |
| `NEXT_PUBLIC_APP_URL` | Public base URL used for OAuth redirects. |
| `APP_URL` | Optional server-side base URL fallback. |

With Supabase configured, the app uses real accounts, Postgres persistence, and
private document storage. Every table is protected by row-level security.

## Feature tour

1. **Guided intake** — a warm, one-question-at-a-time start; every answer is optional.
2. **Personal plan** — a prioritized Right now / Soon / Later checklist shaped by the situation.
3. **Task detail + Ask about this step** — practical steps, document needs, and focused GPT-5.6 guidance for one task.
4. **Letters and phone scripts** — drafts for banks, benefits, utilities, and other organizations, ready to refine or export.
5. **Document vault** — private storage for certificates, wills, IDs, statements, and certified-copy tracking.
6. **Who-to-notify directory** — searchable organizations, contact guidance, and progress tracking.
7. **Companion** — a case-grounded conversation for questions that arise along the way.

## Architecture seams

- **AI — `src/lib/ai/`:** one provider interface selects the live OpenAI
  implementation when `OPENAI_API_KEY` is available and a deterministic demo
  implementation when it is not. The same fallback keeps intake, letters,
  companion, and task guidance usable with no key.
- **Data — `src/lib/db/`:** one repository interface selects a Supabase-backed
  implementation when configured or the deterministic in-memory demo store
  otherwise.
- **Auth:** demo mode creates a private guest identity in `src/proxy.ts`; full
  mode uses Supabase Auth. Both paths go through `getCurrentUser()`.

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

- **Codex `/feedback` session ID:** `019f7788-feac-7012-8fd6-26bde7936c55`
- **Where Codex accelerated the work:** Codex added the technical SEO foundation
  (canonical metadata, sitemap, robots policy, manifest, and share cards),
  page-level privacy indexing controls, visible FAQ content with matching
  structured data, accessibility polish, and security headers. It also added a
  focused “Ask about this step” experience on plan tasks.
- **Key decisions we made:** GPT-5.6 helped keep the public copy useful without
  turning it into a keyword list, and shaped the task-question prompt to stay
  concise, caring, and grounded in the selected task. The feature uses the
  existing provider seam so no-key demo mode remains deterministic; it does not
  persist sensitive free-text questions or add a CSP that might disrupt
  Supabase, OpenAI, or streaming.
- **How GPT-5.6 shows up in the product:** intake summaries, situation-specific
  task suggestions, letter/script drafting, the case-grounded companion, and
  focused guidance for a specific plan task.

## A note on scope

The After offers general, practical guidance to help you get organized. It is
**not legal, tax, financial, or medical advice**, and it is not a substitute for
a licensed professional. Deadlines and requirements vary by place and situation
— please verify anything important.

## License

MIT — see [LICENSE](LICENSE).

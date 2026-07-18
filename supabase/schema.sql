-- The After — Supabase schema
-- Run this in the Supabase SQL editor (or via the CLI) once per project.
-- Every table is row-level-secured so a user can only ever see their own case.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.cases (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'intake',
  deceased jsonb not null default '{}'::jsonb,
  profile jsonb not null default '{}'::jsonb,
  intake_complete boolean not null default false,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists cases_user_id_idx on public.cases (user_id);

create table if not exists public.tasks (
  id text primary key,
  case_id text not null references public.cases (id) on delete cascade,
  title text not null,
  rationale text not null default '',
  steps jsonb not null default '[]'::jsonb,
  category text not null default 'immediate',
  phase text not null default 'soon',
  priority text not null default 'medium',
  status text not null default 'todo',
  due_date text,
  deadline_type text not null default 'none',
  deadline_note text,
  required_documents jsonb not null default '[]'::jsonb,
  institution_refs jsonb not null default '[]'::jsonb,
  notes text,
  source text not null default 'template',
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists tasks_case_id_idx on public.tasks (case_id);

create table if not exists public.letters (
  id text primary key,
  case_id text not null references public.cases (id) on delete cascade,
  task_id text,
  institution_ref text,
  type text not null default 'letter',
  title text not null,
  recipient text not null default '',
  subject text not null default '',
  body text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists letters_case_id_idx on public.letters (case_id);

create table if not exists public.documents (
  id text primary key,
  case_id text not null references public.cases (id) on delete cascade,
  kind text not null default 'other',
  name text not null,
  storage_path text,
  mime_type text,
  size integer,
  copies_on_hand integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists documents_case_id_idx on public.documents (case_id);

create table if not exists public.case_institutions (
  id text primary key,
  case_id text not null references public.cases (id) on delete cascade,
  institution_id text,
  custom_institution jsonb,
  status text not null default 'to_contact',
  account_reference text,
  notes text,
  contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists case_institutions_case_id_idx
  on public.case_institutions (case_id);

create table if not exists public.messages (
  id text primary key,
  case_id text not null references public.cases (id) on delete cascade,
  thread text not null,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_case_thread_idx
  on public.messages (case_id, thread);

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.cases enable row level security;
alter table public.tasks enable row level security;
alter table public.letters enable row level security;
alter table public.documents enable row level security;
alter table public.case_institutions enable row level security;
alter table public.messages enable row level security;

-- Cases: a user owns rows where user_id = auth.uid().
drop policy if exists "cases_owner" on public.cases;
create policy "cases_owner" on public.cases
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Child tables: access allowed when the parent case belongs to the user.
create or replace function public.owns_case(target_case_id text)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.cases c
    where c.id = target_case_id and c.user_id = auth.uid()
  );
$$;

drop policy if exists "tasks_owner" on public.tasks;
create policy "tasks_owner" on public.tasks
  for all using (public.owns_case(case_id)) with check (public.owns_case(case_id));

drop policy if exists "letters_owner" on public.letters;
create policy "letters_owner" on public.letters
  for all using (public.owns_case(case_id)) with check (public.owns_case(case_id));

drop policy if exists "documents_owner" on public.documents;
create policy "documents_owner" on public.documents
  for all using (public.owns_case(case_id)) with check (public.owns_case(case_id));

drop policy if exists "case_institutions_owner" on public.case_institutions;
create policy "case_institutions_owner" on public.case_institutions
  for all using (public.owns_case(case_id)) with check (public.owns_case(case_id));

drop policy if exists "messages_owner" on public.messages;
create policy "messages_owner" on public.messages
  for all using (public.owns_case(case_id)) with check (public.owns_case(case_id));

-- ---------------------------------------------------------------------------
-- Storage bucket for the document vault (private)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Users can manage files under a folder named after a case they own.
drop policy if exists "documents_storage_owner" on storage.objects;
create policy "documents_storage_owner" on storage.objects
  for all using (
    bucket_id = 'documents'
    and public.owns_case((storage.foldername(name))[1])
  ) with check (
    bucket_id = 'documents'
    and public.owns_case((storage.foldername(name))[1])
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Becoming — Supabase database setup
-- Run this in your Supabase project's SQL Editor (supabase.com → SQL Editor)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Reflections table (stores shared reflections from the exhibition board)
create table if not exists public.reflections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,  -- null = anonymous
  text        text        not null,
  emotion     text        not null default 'hopeful',
  category    text        not null default 'Growth',
  mood        text        not null default '🙂',
  tags        text[]      not null default '{}',
  city        text        not null default 'Unknown',
  country     text        not null default '??',
  lat         double precision not null default 0,
  lng         double precision not null default 0,
  created_at  timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.reflections enable row level security;

-- 3. Anyone can read reflections (they show on the public exhibition board)
create policy "Public read" on public.reflections
  for select using (true);

-- 4. Only the service role (server) can insert
--    (the Vite middleware uses the service role key, bypassing RLS)
--    If you also want authenticated users to insert directly from the browser,
--    uncomment the policy below instead:
-- create policy "Auth users can insert" on public.reflections
--   for insert with check (auth.uid() = user_id or user_id is null);

-- 5. Index for sorting by time (used by the live board)
create index if not exists reflections_created_at_idx
  on public.reflections (created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- That's it! Auth (email sign-up, confirmation emails, sign-in, password reset)
-- is handled automatically by Supabase — no extra tables needed.
-- ─────────────────────────────────────────────────────────────────────────────

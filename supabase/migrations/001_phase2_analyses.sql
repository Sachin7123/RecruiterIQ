-- Phase 2: analyses table + pdf-uploads storage bucket
-- Run in Supabase SQL Editor or via: supabase db push

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  pdf_path text,
  raw_text text,
  profile_data jsonb,
  analysis_result jsonb,
  status text not null default 'pending'
);

create index if not exists analyses_created_at_idx on public.analyses (created_at desc);
create index if not exists analyses_status_idx on public.analyses (status);

alter table public.analyses enable row level security;

-- MVP: no client auth — server uses service role (bypasses RLS)
-- Block direct anon/authenticated access until auth is added
revoke all on public.analyses from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pdf-uploads',
  'pdf-uploads',
  false,
  10485760,
  array['application/pdf']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

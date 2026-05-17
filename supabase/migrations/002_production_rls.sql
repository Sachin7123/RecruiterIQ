-- Phase 7: production RLS hardening (run after 001_phase2_analyses.sql)

-- Belt-and-suspenders: block direct client access until auth is added
drop policy if exists "deny_public_analyses" on public.analyses;
create policy "deny_public_analyses"
  on public.analyses
  for all
  to anon, authenticated
  using (false)
  with check (false);

-- Service role bypasses RLS; inserts/updates happen only from API routes

-- Faster listing by recency (001 may already create this; safe to re-run)
create index if not exists analyses_created_at_idx on public.analyses (created_at desc);

-- Storage: private bucket — only service role (API) should read/write objects
drop policy if exists "service_role_pdf_uploads_all" on storage.objects;
create policy "service_role_pdf_uploads_all"
  on storage.objects
  for all
  to service_role
  using (bucket_id = 'pdf-uploads')
  with check (bucket_id = 'pdf-uploads');

drop policy if exists "deny_public_pdf_uploads" on storage.objects;
create policy "deny_public_pdf_uploads"
  on storage.objects
  for all
  to anon, authenticated
  using (false)
  with check (false);

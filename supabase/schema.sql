-- dkport admin schema.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- It is safe to re-run (idempotent).

-- 1. Single-row table holding the editable site content as JSON.
create table if not exists public.site_content (
  id integer primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

insert into public.site_content (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_content enable row level security;

-- Public (anon) can read the content; only signed-in users can change it.
drop policy if exists "site_content read" on public.site_content;
create policy "site_content read" on public.site_content
  for select using (true);

drop policy if exists "site_content write" on public.site_content;
create policy "site_content write" on public.site_content
  for all to authenticated using (true) with check (true);

-- 2. Public storage bucket for the résumé PDF (and any uploaded images).
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

drop policy if exists "assets read" on storage.objects;
create policy "assets read" on storage.objects
  for select using (bucket_id = 'assets');

drop policy if exists "assets write" on storage.objects;
create policy "assets write" on storage.objects
  for all to authenticated
  using (bucket_id = 'assets')
  with check (bucket_id = 'assets');

-- 3. Create your admin login:
--    Dashboard -> Authentication -> Users -> Add user (email + password).
--    Then disable public sign-ups: Authentication -> Providers -> Email ->
--    turn OFF "Allow new users to sign up".

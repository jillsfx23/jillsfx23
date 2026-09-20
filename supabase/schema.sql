-- ============================================================
-- JILLS EFFECTS — Supabase setup
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.
-- Safe to run more than once.
-- ============================================================

-- ---------- 1. Projects table ----------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text not null check (category in ('graphic-design', '3d-design', 'videos')),
  description   text,
  software      text,
  image_url     text,
  video_url     text,
  thumbnail_url text,
  published     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists projects_category_idx
  on public.projects (category, published, sort_order, created_at desc);

alter table public.projects enable row level security;

-- ---------- 2. Row level security ----------
-- Anyone (including logged-out clients) may read published projects.
drop policy if exists "public reads published projects" on public.projects;
create policy "public reads published projects"
  on public.projects for select
  using (published = true);

-- The signed-in admin may read everything, including hidden projects.
drop policy if exists "admin reads all projects" on public.projects;
create policy "admin reads all projects"
  on public.projects for select
  to authenticated
  using (true);

drop policy if exists "admin inserts projects" on public.projects;
create policy "admin inserts projects"
  on public.projects for insert
  to authenticated
  with check (true);

drop policy if exists "admin updates projects" on public.projects;
create policy "admin updates projects"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin deletes projects" on public.projects;
create policy "admin deletes projects"
  on public.projects for delete
  to authenticated
  using (true);

-- ---------- 3. Storage bucket for images and videos ----------
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "public reads portfolio files" on storage.objects;
create policy "public reads portfolio files"
  on storage.objects for select
  using (bucket_id = 'portfolio');

drop policy if exists "admin uploads portfolio files" on storage.objects;
create policy "admin uploads portfolio files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio');

drop policy if exists "admin updates portfolio files" on storage.objects;
create policy "admin updates portfolio files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio');

drop policy if exists "admin deletes portfolio files" on storage.objects;
create policy "admin deletes portfolio files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio');

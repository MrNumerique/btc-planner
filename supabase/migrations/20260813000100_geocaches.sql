-- À exécuter dans l'éditeur SQL de Supabase (Project > SQL Editor)

create table if not exists geocaches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now()
);

alter table geocaches enable row level security;

create policy "Public read geocaches" on geocaches
  for select using (true);

-- Bucket public pour les images de caches, même principe que event-images :
-- écritures via service_role uniquement, lecture publique via le flag "public".
insert into storage.buckets (id, name, public)
values ('geocache-images', 'geocache-images', true)
on conflict (id) do nothing;

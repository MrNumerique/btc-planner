-- À exécuter dans l'éditeur SQL de Supabase (Project > SQL Editor)

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#3CAA3C',
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  image_url text,
  start_date date not null,
  end_date date,
  start_time time,
  category_id uuid not null references categories(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists events_category_id_idx on events(category_id);
create index if not exists events_start_date_idx on events(start_date);

alter table categories enable row level security;
alter table events enable row level security;

-- Lecture publique (page d'affichage), aucune écriture publique autorisée.
-- Les écritures passent uniquement par le back office, via la clé service_role
-- (utilisée côté serveur uniquement) qui contourne RLS.
create policy "Public read categories" on categories
  for select using (true);

create policy "Public read events" on events
  for select using (true);

-- Quelques catégories de départ (facultatif, modifiable depuis le back office)
insert into categories (name, color) values
  ('Numérique', '#3A7EC6'),
  ('Bien-être', '#3CAA3C'),
  ('Mobilité', '#F07B1E')
on conflict (name) do nothing;

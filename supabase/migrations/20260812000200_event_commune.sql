-- À exécuter dans l'éditeur SQL de Supabase (Project > SQL Editor)

create table if not exists communes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table communes enable row level security;

create policy "Public read communes" on communes
  for select using (true);

alter table events add column if not exists commune_id uuid references communes(id) on delete set null;

create index if not exists events_commune_id_idx on events(commune_id);

alter table events drop column if exists location;

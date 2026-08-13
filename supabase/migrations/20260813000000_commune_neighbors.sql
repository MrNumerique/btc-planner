-- À exécuter dans l'éditeur SQL de Supabase (Project > SQL Editor)

create table if not exists commune_neighbors (
  commune_id uuid not null references communes(id) on delete cascade,
  neighbor_id uuid not null references communes(id) on delete cascade,
  primary key (commune_id, neighbor_id),
  check (commune_id <> neighbor_id)
);

create index if not exists commune_neighbors_neighbor_id_idx on commune_neighbors(neighbor_id);

alter table commune_neighbors enable row level security;

create policy "Public read commune_neighbors" on commune_neighbors
  for select using (true);

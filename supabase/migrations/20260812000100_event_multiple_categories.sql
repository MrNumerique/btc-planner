-- À exécuter dans l'éditeur SQL de Supabase (Project > SQL Editor)

create table if not exists event_categories (
  event_id uuid not null references events(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (event_id, category_id)
);

create index if not exists event_categories_category_id_idx on event_categories(category_id);

alter table event_categories enable row level security;

create policy "Public read event_categories" on event_categories
  for select using (true);

-- Migration des données existantes (un événement gardait une seule catégorie)
insert into event_categories (event_id, category_id)
select id, category_id from events where category_id is not null
on conflict do nothing;

alter table events drop column if exists category_id;

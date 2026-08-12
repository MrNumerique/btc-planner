-- À exécuter dans l'éditeur SQL de Supabase (Project > SQL Editor)

alter table events add column if not exists end_time time;

-- À exécuter dans l'éditeur SQL de Supabase (Project > SQL Editor)
-- Nécessite l'extension pg_cron activée au préalable
-- (Database > Extensions > rechercher "pg_cron" > Enable).

create extension if not exists pg_cron;

-- Supprime chaque jour à 3h du matin les événements dont la date de fin
-- (ou de début si pas de date de fin) est déjà passée.
-- event_categories est nettoyée automatiquement (on delete cascade).
select cron.schedule(
  'cleanup-past-events',
  '0 3 * * *',
  $$ delete from events where coalesce(end_date, start_date) < current_date $$
);

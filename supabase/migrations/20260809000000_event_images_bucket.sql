-- Bucket public pour les images d'événements uploadées depuis le back office.
-- Les uploads passent uniquement par la clé service_role côté serveur, qui
-- contourne RLS ; le flag "public" suffit à rendre les fichiers lisibles
-- publiquement via leur URL, sans policy de lecture supplémentaire.
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

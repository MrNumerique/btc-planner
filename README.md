# Planning du projet

Site public affichant le planning des actions d'un projet sous forme de timeline
(une ligne par catégorie, événements classés chronologiquement), avec un back
office protégé par mot de passe pour ajouter/modifier/supprimer les catégories
et les événements.

Style visuel repris de [catalogue_btc](https://github.com/MrNumerique/catalogue_btc).

## Stack

- [Next.js](https://nextjs.org) (App Router) — frontend + back office
- [Supabase](https://supabase.com) (Postgres gratuit) — stockage des catégories et événements
- [Vercel](https://vercel.com) — hébergement gratuit

## Mise en place

### 1. Base de données Supabase

1. Créer un projet sur [supabase.com](https://supabase.com) (offre gratuite).
2. Aller dans **SQL Editor** et exécuter le contenu de [`supabase/schema.sql`](supabase/schema.sql).
   Cela crée les tables `categories` et `events`, active la lecture publique, et
   ajoute trois catégories de départ (Numérique, Bien-être, Mobilité).
3. Récupérer dans **Project Settings > API** :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secret, ne jamais l'exposer côté client)

### 2. Variables d'environnement

Copier `.env.example` vers `.env.local` et renseigner les valeurs :

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
BACKOFFICE_PASSWORD=...   # mot de passe d'accès à /admin
```

### 3. Lancer en local

```bash
npm install
npm run dev
```

- Page publique : http://localhost:3000
- Back office : http://localhost:3000/admin

## Déploiement (Vercel, gratuit)

1. Pousser le projet sur un repo Git (GitHub/GitLab).
2. Importer le repo sur [vercel.com](https://vercel.com/new).
3. Renseigner les 4 variables d'environnement du `.env.local` dans les
   paramètres du projet Vercel (**Settings > Environment Variables**).
4. Déployer. Le site est servi gratuitement sur `*.vercel.app` (domaine
   personnalisé possible).

## Fonctionnement

- **Page publique (`/`)** : lecture seule, une ligne par catégorie, événements
  triés par date. Sur desktop les événements d'une catégorie défilent
  horizontalement ; sur mobile ils s'empilent verticalement.
- **Back office (`/admin`)** : protégé par le mot de passe `BACKOFFICE_PASSWORD`.
  Permet de créer/supprimer des catégories (avec couleur) et de
  créer/modifier/supprimer des événements (titre, dates, heure, lieu,
  description, image).
- Les écritures passent uniquement par la clé `service_role` côté serveur ;
  la clé publique (`anon`) n'a accès qu'en lecture (RLS Supabase).

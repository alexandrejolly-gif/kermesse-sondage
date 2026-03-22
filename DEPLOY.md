# Deploiement — Sondage Kermesse

## 1. Creer un projet Supabase

1. Aller sur https://supabase.com et creer un compte (gratuit)
2. Cliquer "New Project", choisir un nom et une region (EU West recommande)
3. Noter le mot de passe de la base de donnees (pas utilise directement ici)

## 2. Creer les tables dans Supabase

Aller dans **SQL Editor** (menu de gauche) et executer ces requetes une par une :

### Table `config`

```sql
create table config (
  id text primary key default 'main',
  title text not null default 'Kermesse de l''Ecole',
  description text default '',
  slots jsonb not null default '[]',
  roles jsonb not null default '[]',
  admin_password text not null default 'kermesse2025',
  updated_at timestamptz default now()
);

insert into config (id, title, description, slots, roles, admin_password)
values (
  'main',
  'Kermesse de l''Ecole',
  'Indiquez vos disponibilites pour aider lors de la kermesse. Merci pour votre participation !',
  '[
    {"id":"a","label":"Samedi 14 juin","sub":"10h-12h"},
    {"id":"b","label":"Samedi 14 juin","sub":"14h-16h"},
    {"id":"c","label":"Samedi 14 juin","sub":"16h-18h"},
    {"id":"d","label":"Dimanche 15 juin","sub":"10h-12h"},
    {"id":"e","label":"Dimanche 15 juin","sub":"14h-16h"}
  ]',
  '[
    {"id":"r1","label":"Buvette"},
    {"id":"r2","label":"Peche a la ligne"},
    {"id":"r3","label":"Chamboule tout"},
    {"id":"r4","label":"Maquillage"},
    {"id":"r5","label":"Entree / Caisse"}
  ]',
  'kermesse2025'
);
```

### Table `responses`

```sql
create table responses (
  id text primary key,
  name text not null,
  email text not null unique,
  votes jsonb not null default '{}',
  roles jsonb not null default '[]',
  created_at timestamptz default now()
);

create unique index responses_email_lower on responses (lower(email));
```

### Row Level Security (RLS)

```sql
alter table config enable row level security;
alter table responses enable row level security;

create policy "config read" on config for select using (true);
create policy "responses read" on responses for select using (true);
create policy "responses insert" on responses for insert with check (true);
create policy "responses update" on responses for update using (true) with check (true);
```

### Activer le Realtime

Dans le dashboard Supabase :
1. Aller dans **Database > Replication**
2. Activer la replication pour la table `responses`

Ou via SQL :
```sql
alter publication supabase_realtime add table responses;
```

## 3. Recuperer les cles API

Dans le dashboard Supabase, aller dans **Settings > API** :
- **Project URL** : `https://xxxx.supabase.co`
- **anon (public) key** : commence par `eyJ...`
- **service_role key** : commence par `eyJ...` (NE JAMAIS exposer cote client)

## 4. Configuration locale

```bash
# Cloner le repo ou aller dans le dossier du projet
cd kermesse-sondage

# Installer les dependances
npm install

# Creer le fichier .env.local
cp .env.example .env.local
```

Editer `.env.local` avec vos vraies cles :
```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJvotre_anon_key...
SUPABASE_SERVICE_ROLE_KEY=eyJvotre_service_role_key...
```

## 5. Tester en local

```bash
npm run dev
```

Ouvrir http://localhost:5173 dans le navigateur.

> Note : Les API routes (`/api/*`) ne fonctionnent qu'en production sur Vercel.
> En local, les operations admin (sauvegarder config, supprimer reponses)
> ne marcheront pas. Pour tester localement avec les API routes, utilisez
> `vercel dev` apres avoir installe le CLI Vercel (`npm i -g vercel`).

## 6. Deployer sur Vercel

### Option A : Via GitHub (recommande)

1. Pousser le code sur un repo GitHub :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/votre-user/kermesse-sondage.git
   git push -u origin main
   ```

2. Aller sur https://vercel.com et se connecter avec GitHub

3. Cliquer "Import Project" et selectionner le repo

4. Dans les settings du projet, ajouter les **Environment Variables** :
   - `VITE_SUPABASE_URL` = votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` = votre anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = votre service role key

5. Deployer !

### Option B : Via CLI Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Configurer les variables d'environnement dans le dashboard Vercel ensuite.

## 7. Partager

Recuperer l'URL de production (ex: `https://kermesse-sondage.vercel.app`)
et la partager aux parents !

---

## Rappels de securite

- La `SUPABASE_SERVICE_ROLE_KEY` n'est JAMAIS dans le code frontend
- Elle n'est utilisee que dans les fichiers `api/*.js` (cote serveur Vercel)
- Le mot de passe admin est stocke en clair dans la table `config` (acceptable pour cet usage)
- Les emails sont stockes en base mais masques dans l'onglet Resultats public

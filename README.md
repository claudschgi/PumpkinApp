# Pumpkin App (Astro + Tailwind + PostgreSQL)

Self-hosted Web-App zum Entdecken von Kürbissen und Rezepten, inkl. Auth, Likes/Saves und Admin-CRUD.

## Stack
- Astro SSR + API Routes
- TailwindCSS
- PostgreSQL mit Schemas: `content`, `social`, `auth`
- Session Auth via HttpOnly Cookie

## Quickstart
1. Dependencies installieren:
   ```bash
   npm install
   ```
2. DB starten:
   ```bash
   docker compose -f docker/docker-compose.yml up -d postgres
   ```
3. Schema anwenden und Seed importieren:
   ```bash
   psql postgres://pumpkin:pumpkin@localhost:5432/pumpkin -f db/schema.sql
   psql postgres://pumpkin:pumpkin@localhost:5432/pumpkin -f db/seed.sql
   ```
4. App starten:
   ```bash
   DATABASE_URL=postgres://pumpkin:pumpkin@localhost:5432/pumpkin npm run dev
   ```

## API-Highlights
- Public: `/api/pumpkins`, `/api/recipes`, Details + Mapping
- Auth: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- Social: Like/Save Endpoints + `/api/me/likes`, `/api/me/saves`
- Admin: `/api/admin/*` für Pumpkins, Recipes, Ingredients, Tags

## Security
- Session Cookies `HttpOnly`, `SameSite=Lax`
- CSRF via Double-Submit-Token (`x-csrf-token`)
- Einfaches in-memory Rate Limit (Login + Social Actions)
- Rollenprüfung für alle Admin-Routen

# Kime Karate Club

Club website and student portal, built as an installable PWA. This is the demo/first deployment of the Tatami club-site codebase: a public landing page, a student login area, and a coach/owner admin panel, all on one club's domain.

The club's identity (name, colours, logo, copy) comes from the database, not hardcoded values, so this same codebase is meant to be redeployed for future clubs against their own domain later.

## Stack

- React 18 + TypeScript (strict), built with Vite
- React Router
- Supabase (Postgres + Auth + Row Level Security)
- TanStack Query
- Tailwind CSS
- react-i18next (Bulgarian default, English toggle)
- vite-plugin-pwa

## Getting started

```bash
npm install
cp .env.example .env   # fill in the Supabase values, see below
npm run dev
```

## Environment variables

| Variable | Where to get it |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project settings -> API -> Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase project settings -> API -> anon public key |
| `VITE_CLUB_SLUG` | Local dev only. Which club row to render since there's no real domain to look up from `localhost`. |

Never put a Supabase service-role key or any other secret in a `VITE_*` variable — anything with that prefix is bundled into the client and is publicly readable.

## Scripts

- `npm run dev` - start the local dev server
- `npm run build` - type-check and build for production
- `npm run lint` - run the linter
- `npm run preview` - preview the production build locally

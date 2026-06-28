# Midtune

A curated archive of free, copyright-safe midwest emo instrumental tracks.

**Live:** [https://midwest.listune.app](https://midwest.listune.app)

## What is Midtune?

Midtune is a free, curated collection of midwest emo instrumental tracks that anyone can preview, copy the audio URL, and download for use in videos, games, streams, edits, and indie projects. No signups, no ads, no paperwork.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4
- **Routing:** react-router-dom v7
- **Backend:** Cloudflare Pages Functions
- **Database:** Cloudflare D1 (SQLite)
- **Deployment:** Cloudflare Pages

## Project Structure

```
src/
├── main.tsx                    # React entry
├── App.tsx                     # Routes + layout
├── styles.css                  # Global styles + design tokens
├── components/
│   ├── layout/                 # Navbar, Footer
│   ├── tracks/                 # TrackCard, TrackCover, Waveform
│   ├── player/                 # FloatingPlayer
│   └── ui/                     # Logo, shared UI
├── context/                    # PlayerContext
├── data/                       # Demo/fallback track data
├── hooks/                      # Custom hooks
├── lib/                        # Utility functions
├── pages/                      # Page components
├── services/                   # API client functions
└── types/                      # TypeScript types

functions/                      # Cloudflare Pages Functions (API)
├── api/
│   ├── tracks.ts               # Public track list
│   └── admin/
│       ├── login.ts            # Admin authentication
│       └── tracks.ts           # Admin CRUD
db/
├── schema.sql                  # D1 table definitions
└── seed.sql                    # Initial data
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

These are **Cloudflare environment secrets** — never store them in frontend code.

| Variable        | Description                              |
| --------------- | ---------------------------------------- |
| `ADMIN_SECRET`  | Password for admin login                 |
| `HMAC_KEY`      | Secret key for signing admin auth tokens |

Set them via the Cloudflare dashboard or wrangler:

```bash
wrangler secret put ADMIN_SECRET
wrangler secret put HMAC_KEY
```

## Admin Security

The admin panel (`/admin`) is protected by layered security:

1. **App-level auth:** Password validated server-side against `ADMIN_SECRET` env var
2. **HMAC tokens:** Short-lived (2h) tokens signed with `HMAC_KEY`, stored in memory only
3. **Server-side validation:** Every admin API request validates the token
4. **No frontend secrets:** Admin credentials are never stored in frontend code or localStorage

**Recommended:** Additionally protect `/admin` with **Cloudflare Access / Zero Trust** as an extra layer. This prevents even reaching the login page without Cloudflare SSO.

## How Tracks Are Added

1. **Via admin panel:** Log in at `/admin`, fill out the form, and submit
2. **Via D1 directly:** Insert rows into the `tracks` table using `wrangler d1 execute`
3. **Demo mode:** Without D1, the app falls back to local demo data in `src/data/tracks.ts`
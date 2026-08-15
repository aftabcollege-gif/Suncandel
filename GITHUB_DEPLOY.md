# SUN — GitHub / Vercel Deployment

## GitHub

Upload the contents of this folder to `aftabcollege-gif/Suncandel` on branch `main`.

Do not upload `.env` or any real secrets. Use `.env.example` as the template.

## Vercel

- Framework: Next.js
- Build command: `next build`
- Install command: auto-detected (`npm install`)
- Output: Next.js default

## Required environment variables

Set these in Vercel Project Settings → Environment Variables:

- `DATABASE_URL` — Supabase/PostgreSQL connection string
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `PAYMENT_CALLBACK_SECRET`
- `ACCESS_TOKEN_TTL_MINUTES`
- `REFRESH_TOKEN_TTL_DAYS`
- `CORS_ALLOWED_ORIGIN` — production URL after first deployment

Never commit production secrets to GitHub.

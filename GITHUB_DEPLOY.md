# SUN — GitHub / Vercel Deployment

## Root cause of the previous 404

The live Vercel URL returned `404 NOT_FOUND` because the GitHub repo was missing the entire `src/` application.

`package.json` and `next.config.ts` were present, so Vercel treated the project as Next.js, but there was no `app` / `pages` directory. The build therefore produced no routes.

The source already existed inside `Suncandel-GitHub-Ready.zip`. It must live in the repo root as `src/`, not only inside the zip.

## GitHub

Push the project **from the repository root** (the folder that contains `package.json` and `src/`).

Do not upload through the GitHub web UI for this project — it silently drops large folder trees.

```bash
git add src public next.config.ts vercel.json package.json package-lock.json
git commit -m "Restore Next.js app source for Vercel"
git push origin main
```

Do not commit `.env` or any real secrets. Use `.env.example` as the template.

## Vercel project settings

- Framework: Next.js
- Root Directory: `.` (repository root — **not** `SUN-RELEASE`)
- Build command: `npm run build`
- Install command: `npm install`
- Output: Next.js default (do not set an output directory)
- Node.js: 22.x

After connecting the GitHub repo, every push to `main` redeploys automatically.

## Required environment variables

Set these in Vercel → Project Settings → Environment Variables (Production + Preview):

- `DATABASE_URL` — Supabase / Neon / PostgreSQL connection string
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `PAYMENT_CALLBACK_SECRET`
- `ACCESS_TOKEN_TTL_MINUTES`
- `REFRESH_TOKEN_TTL_DAYS`
- `CORS_ALLOWED_ORIGIN` — the production URL, e.g. `https://your-project.vercel.app`

The storefront can build without `DATABASE_URL`. API routes that need the database will return an error until the variable is set.

Never commit production secrets to GitHub.

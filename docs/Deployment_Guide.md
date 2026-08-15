# Deployment Guide

## Local/Stage
1. Set env variables
2. `npx drizzle-kit push`
3. `npm run build`
4. `docker compose up --build -d`

## Production
1. Backup database
2. Apply migrations
3. Run integrity check script
4. Build + deploy immutable image
5. Verify `/health` and `/api/health`

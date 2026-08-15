# SUN — Enterprise Multi-Vendor Social Commerce

## Project Overview
SUN یک پلتفرم Enterprise برای Marketplace چندفروشندگی، Social Commerce و AI Commerce در بازار ایران است.

## Architecture
- Backend: Next.js Route Handlers + Clean Architecture layers
- Database: PostgreSQL + Drizzle ORM
- Frontend: Next.js App Router + Design System + 6 Theme Engine
- AI: Model-agnostic AI service layer with explainable outputs

## Requirements
- Node.js 22+
- PostgreSQL 16+
- npm 10+

## Installation
```bash
npm ci
cp .env.example .env
```

## Configuration
متغیرهای کلیدی:
- DATABASE_URL
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- PAYMENT_CALLBACK_SECRET
- ACCESS_TOKEN_TTL_MINUTES
- REFRESH_TOKEN_TTL_DAYS
- CORS_ALLOWED_ORIGIN

## Database Setup
```bash
npx drizzle-kit push
psql "$DATABASE_URL" -f drizzle/0001_seed.sql
```

## Development
```bash
npm run dev
```

## Testing
```bash
node --import tsx --test src/Tests/*.ts
```

## Production Build
```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run build
```

## Deployment
- Docker:
```bash
docker compose up --build -d
```

## Environment Variables
الگوی کامل در `.env.example` موجود است.

## Troubleshooting
- خطای DB: بررسی DATABASE_URL و دسترسی PostgreSQL
- خطای Auth: بررسی JWT secretها
- خطای Callback پرداخت: بررسی PAYMENT_CALLBACK_SECRET و `x-callback-signature`
- خطای Rate Limit: بررسی تعداد درخواست در بازه زمانی

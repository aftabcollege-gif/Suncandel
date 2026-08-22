# سان‌کندل (SUN) — شمع و ملزومات جشن

> **سایت مرجع:** [suncandel-beta.vercel.app](https://suncandel-beta.vercel.app/)

## معرفی

**سان‌کندل** شبکهٔ تولید و پخش **شمع، لوازم جشن تولد، قنادی، بسته‌بندی و هدیه** است؛
«روشن از شعله، نه از برچسب و جایگاه.»

در هفت سال گذشته سان‌کندل شمع **استوانه، قلمی، پیچ و وارمر** را برای جشن، قنادی و هدیه در ایران
تولید و پخش کرده‌است. کارگاه ما با شعله و خورشید شکل گرفته؛ از موم تا بسته‌بندی، برای مناسبت‌هایی
که باید روشن بمانند.

- **شعار:** سان‌کندل، آتلیهٔ شمع و شعله — تولید و پخش شمع، جشن تولد و هدیه.
- **گردش کار فروشگاه برای کسانی که شعله می‌فروشند.**
- **ساخته‌شده برای مناسبت. روشن با هنر.**

## کاتالوگ فروشگاه

فروشگاه روی کاتالوگ واقعی کارگاه سان‌کندل کار می‌کند (۱۲ قلم کالای فعال، موجودی لحظه‌ای):

| دسته | اقلام | بازه قیمت (تومان) |
|---|---|---|
| شمع استوانه (قطر ۴ و ۶) | کلاسیک و متالیک | ۱۲۹٬۰۰۰ – ۳۱۹٬۰۰۰ |
| شمع قلمی (۲۰ و ۳۰ سانت) | کلاسیک و متالیک | ۲۰۹٬۰۰۰ – ۳۳۹٬۰۰۰ |
| شمع پیچ (۲۰ سانت) | کلاسیک و متالیک | ۱۷۵٬۰۰۰ – ۲۲۹٬۰۰۰ |
| وارمر (بسته ۱۰ و ۵۰ عددی) | مهمانی و تالار | ۷۹٬۰۰۰ – ۲۲۹٬۰۰۰ |

رنگ‌های متالیک (طلایی، نقره‌ای، سورمه) و کلاسیک برای جشن، قنادی، تالار، کافه و هدیه.

## امکانات سایت

- **کشف محصول:** جستجوی هوشمند، Wishlist، «اخیراً دیده‌شده» و پیشنهاد شخصی‌سازی‌شده
- **احراز هویت:** ورود با موبایل/نام کاربری + رمز عبور یا **کد یک‌بارمصرف (OTP پیامکی)**
- **نقش‌ها:** مشتری، فروشنده (Vendor) و ادمین — ثبت‌نام فروشنده با **تأیید ادمین** و ساخت فروشگاه اختصاصی
- **تجارت:** سبد خرید، پرداخت، سفارش عمده و ارسال با کد رهگیری
- **چندفروشندگی:** هر فروشنده فروشگاه/برند اختصاصی با تم و هویت بصری جداگانه دارد
- **رسانه:** تصاویر محصول از منبع ووکامرس (`suncandleco.ir`) از طریق `/api/v1/media/remote` پراکسی می‌شوند

## معماری

- **Backend:** Next.js Route Handlers + معماری تمیز لایه‌ای (Domain / Application / Infrastructure / API / Shared)
- **Database:** PostgreSQL + Drizzle ORM
- **Frontend:** Next.js App Router + Design System + ۶ تم قابل‌تعویض در زمان اجرا
- **AI:** لایهٔ سرویس هوش مصنوعی model-agnostic (دستیار، توصیه‌گر، جستجو)
- **3D / Motion:** three.js + react-three-fiber، framer-motion، GSAP (با fallback موبایل و reduced-motion)

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
- `DATABASE_URL`
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
- `PAYMENT_CALLBACK_SECRET`
- `ACCESS_TOKEN_TTL_MINUTES` / `REFRESH_TOKEN_TTL_DAYS`
- `CORS_ALLOWED_ORIGIN`

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

- **Vercel (Production):** https://suncandel-beta.vercel.app/
- Docker:
```bash
docker compose up --build -d
```

## Environment Variables

الگوی کامل در `.env.example` موجود است.

## Troubleshooting

- خطای DB: بررسی `DATABASE_URL` و دسترسی PostgreSQL
- خطای Auth: بررسی JWT secretها
- خطای Callback پرداخت: بررسی `PAYMENT_CALLBACK_SECRET` و `x-callback-signature`
- خطای Rate Limit: بررسی تعداد درخواست در بازه زمانی

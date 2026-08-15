# SUN Release Package

این پوشه بسته نهایی انتشار SUN v1.0.0 را نگهداری می‌کند.

## Map
- frontend/: مستندات و اشاره‌گر به کدهای UI
- backend/: مستندات و اشاره‌گر به API/Application/Infrastructure
- database/: schema, migrations, backup/restore docs
- ai/: AI service layer, model strategy, safety
- infrastructure/: CI/CD, monitoring, deployment
- tests/: test execution reports and scripts
- documentation/: اسناد نهایی فازهای 1 تا 5
- scripts/: اسکریپت‌های اجرایی عملیات
- docker/: container runtime artifacts

## Source Mapping
- Frontend source: `src/app`, `src/components`, `src/features`, `src/themes`
- Backend source: `src/Application`, `src/Infrastructure`, `src/app/api`
- Database source: `src/db/schema.ts`, `drizzle/*.sql`
- AI source: `src/Application/aiCommerceService.ts`, `src/Domain/ai/nlp.ts`

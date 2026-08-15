# SUN Phase 4 — AI Commerce Engine + Social Commerce Integration

## 1) AI Architecture Document

### 1.1 هدف لایه AI
افزودن یک لایه هوشمند مستقل، مدل‌-agnostic، API-based و امن بر روی هسته Marketplace موجود بدون شکستن Domain و APIهای قبلی.

### 1.2 معماری اجرایی
- **SUN Core Platform** (Phase 2 + 3)
- **AI Service Layer** (`src/Application/aiCommerceService.ts`)
- **AI Domain NLP** (`src/Domain/ai/nlp.ts`)
- **AI Data Layer** (جداول AI در PostgreSQL)
- **AI API Layer** (`/api/v1/ai/*`)

### 1.3 اصول معماری
- Model Agnostic via provider interface
- Explainable inference log for every AI action
- Tenant isolation strict (tenant_id scoped)
- Consent-aware customer intelligence
- Audit + Security logging for critical social integration flows

---

## 2) AI Service Layer (Implemented)

فایل مرکزی:
- `src/Application/aiCommerceService.ts`

پیاده‌سازی‌شده:
- Model registry bootstrap + inference logging
- Customer intelligence profile computation
- Hybrid recommendation (content + collaborative + popularity)
- Semantic search (Fa NLP + typo tolerance + smart filters)
- Customer assistant
- Vendor copilot (product/sales/inventory)
- Instagram commerce processing
- Marketing automation suggestion + execution
- AI analytics (forecast/churn/product performance)
- AI pipeline jobs

---

## 3) AI Assistant (Customer)

Endpoint:
- `POST /api/v1/ai/assistant/customer`

ورودی:
- `query`, optional `storeId`

خروجی:
- `answer` (پاسخ توضیح‌پذیر)
- `suggestions` (محصول + دلیل + امتیاز + لینک)

الگوریتم:
- intent detection
- semantic similarity روی title/description
- evidence-based reasoning

---

## 4) Vendor AI Copilot

### 4.1 Product Assistant
Endpoint:
- `POST /api/v1/ai/assistant/vendor/product`

خروجی:
- پیشنهاد عنوان/توضیح
- SEO Description
- بازه قیمت پیشنهادی مبتنی بر داده فروشگاه

### 4.2 Sales Assistant
Endpoint:
- `POST /api/v1/ai/assistant/vendor/sales`

خروجی:
- فروش 30 روزه
- محصولات پرفروش
- کم‌فروش‌ها
- فرصت‌های رشد

### 4.3 Inventory Assistant
Endpoint:
- `POST /api/v1/ai/assistant/vendor/inventory`

خروجی:
- sold velocity
- days to stockout
- reorder recommendation
- اولویت replenishment

---

## 5) Recommendation Engine

### پیاده‌سازی روش‌ها
- Content-based: شباهت متنی + category signal
- Collaborative: الگوی خرید مشتریان مشابه
- Hybrid: ادغام امتیازدهی + popular/newest

### سناریوها
- Homepage: `GET /api/v1/ai/recommendations/homepage`
- Product: `POST /api/v1/ai/recommendations/product`
- Cart (Upsell/Cross-sell): `POST /api/v1/ai/recommendations/cart`
- After Purchase: `POST /api/v1/ai/recommendations/after-purchase`

---

## 6) Smart Search Engine

Endpoint:
- `POST /api/v1/ai/search`

ویژگی‌ها:
- Semantic match فارسی
- typo tolerant ranking
- smart filters: min/max price + category + store
- query logging در `ai_search_logs`

---

## 7) Instagram Commerce Integration

### 7.1 Account Connection
- `POST /api/v1/ai/social/instagram/connect`
- token hash ذخیره می‌شود (raw secret ذخیره نمی‌شود)

### 7.2 Message Processing
- `POST /api/v1/ai/social/instagram/messages/process`
- intent classification
- suggested products
- order intent extraction (quantity + product)

---

## 8) Marketing Automation Engine

Endpoints:
- `GET /api/v1/ai/automation/campaigns/suggestions`
- `POST /api/v1/ai/automation/campaigns/run-cart-abandonment`

قابلیت‌ها:
- تشخیص مشتریان cart-abandonment
- توصیه زمان/کانال ارسال
- ثبت run history در `marketing_automation_runs`

---

## 9) Customer Intelligence Platform

Endpoint:
- `GET /api/v1/ai/intelligence/profile`

خروجی:
- preference profile
- interest profile
- buying pattern
- segment
- consent-aware execution

---

## 10) AI Analytics Engine

Endpoint:
- `GET /api/v1/ai/analytics/insights`

تحلیل‌ها:
- sales forecast (moving average)
- churn risk (rule: no purchase > 60 days)
- product performance ranking
- evaluation snapshot storage

---

## 11) AI Data Pipeline

Endpoint:
- `POST /api/v1/ai/pipeline/run`

Job Types:
- `customer_intelligence_refresh`
- `recommendation_refresh`

Persistence:
- `ai_pipeline_jobs` with status/result/timestamps

---

## 12) Security, Privacy, Access Control

- همه endpointها auth-protected
- permission checks متناسب با role
- tenant-bound filtering در همه queryها
- no cross-vendor data leakage
- hashed social access token
- inference logs + audit logs برای قابلیت ممیزی

---

## AI API Index

- `/api/v1/ai/models`
- `/api/v1/ai/assistant/customer`
- `/api/v1/ai/assistant/vendor/product`
- `/api/v1/ai/assistant/vendor/sales`
- `/api/v1/ai/assistant/vendor/inventory`
- `/api/v1/ai/recommendations/homepage`
- `/api/v1/ai/recommendations/product`
- `/api/v1/ai/recommendations/cart`
- `/api/v1/ai/recommendations/after-purchase`
- `/api/v1/ai/search`
- `/api/v1/ai/social/instagram/connect`
- `/api/v1/ai/social/instagram/messages/process`
- `/api/v1/ai/automation/campaigns/suggestions`
- `/api/v1/ai/automation/campaigns/run-cart-abandonment`
- `/api/v1/ai/intelligence/profile`
- `/api/v1/ai/analytics/insights`
- `/api/v1/ai/pipeline/run`

---

## Model Management Strategy

- جدول: `ai_model_registry`
- خصوصیات: model_key, provider, version, status, config
- قابلیت rollout چندمدلی per-tenant
- امکان deprecate/version switch بدون تغییر API contract
- تمامی inferenceها به model_registry_id لینک می‌شوند

---

## Testing Documentation

### Model/Logic Tests
- `src/Tests/ai.nlp.unit.test.ts`
- `src/Tests/ai.business.unit.test.ts`

### Security Tests
- `src/Tests/ai.security.unit.test.ts`

### Existing QA Inheritance
- TypeScript strict build
- API validation schemas
- centralized error handling

---

## Phase 4 Deliverables Mapping
1. AI Architecture Document ✅
2. AI Service Layer ✅
3. AI Assistant ✅
4. Vendor AI Copilot ✅
5. Recommendation Engine ✅
6. Smart Search Engine ✅
7. Instagram Commerce Integration ✅
8. Marketing Automation Engine ✅
9. Customer Intelligence Platform ✅
10. AI API Documentation ✅
11. Model Management Strategy ✅
12. Testing Documentation ✅

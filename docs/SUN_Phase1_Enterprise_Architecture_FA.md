# SUN — سند جامع معماری Enterprise (Phase 1)

## 1) Executive Summary

### چشم‌انداز اجرایی
پروژه **SUN** یک پلتفرم **Enterprise Multi-Vendor Social Commerce Marketplace** برای بازار ایران است که تمرکز آن بر فروش محصولات تخصصی (شمع، صنایع‌دستی، لوازم جشن/تولد، قنادی، بسته‌بندی، هدایا و محصولات سفارشی) با رویکرد **Social Selling + AI Commerce** می‌باشد.

SUN یک فروشگاه ساده نیست؛ بلکه یک اکوسیستم تجاری چندذی‌نفعه است که باید همزمان ویژگی‌های زیر را ارائه کند:
- Marketplace چندفروشندگی (Multi Vendor)
- مدیریت فروشگاه‌های مستقل هر فروشنده (Multi Store)
- ابزارهای فروش اجتماعی (Instagram/UGC/Campaign)
- CRM عملیاتی برای تعاملات مشتری
- موتور تحلیل و گزارش‌دهی
- توصیه‌گر و خدمات هوشمند مبتنی بر AI

### اهداف کلیدی کسب‌وکار
- افزایش نرخ تبدیل از طریق Social Proof، پیشنهاد هوشمند و تجربه خرید روان
- افزایش سهم فروشندگان از کانال دیجیتال با ابزارهای حرفه‌ای مدیریت فروش
- ایجاد زیرساخت مقیاس‌پذیر برای رشد ترافیک، تنوع کالا و تعداد فروشندگان
- تضمین امنیت، انطباق، قابلیت ممیزی و پایداری سرویس در سطح Enterprise

### KPIهای سطح بالا (۱۲ ماهه)
- Uptime ≥ 99.95%
- میانگین زمان پاسخ APIهای حیاتی < 300ms (P95)
- نرخ خطای تراکنش پرداخت < 0.5%
- Conversion Rate بهبود 20% با AI Recommendation
- Onboarding Vendor جدید < 1 روز کاری

---

## 2) Complete Architecture Document

## 2.1 System Vision

### مسئله‌ای که SUN حل می‌کند
اکوسیستم فروش محصولات دست‌ساز و تخصصی ایران عمدتاً پراکنده، غیرمتمرکز و فاقد زیرساخت حرفه‌ای برای:
- مدیریت همزمان چند فروشنده
- یکپارچه‌سازی کانال‌های اجتماعی
- کنترل سفارش/پرداخت/ارسال
- مدیریت ارتباط با مشتری
- تحلیل رفتار خرید و شخصی‌سازی پیشنهادات

SUN با ارائه یک **هسته تجاری یکپارچه**، این شکاف را پر می‌کند.

### کاربران اصلی
1. **Customer**: جستجو، کشف، سفارش، پرداخت، پیگیری، تعامل اجتماعی
2. **Vendor**: مدیریت فروشگاه، محصول، قیمت، موجودی، سفارش، کمپین
3. **Staff**: عملیات داخلی، پشتیبانی، مدیریت محتوا/سفارش
4. **Admin**: نظارت عملیاتی/مالی/امنیتی و کنترل پلتفرم
5. **Super Admin**: سیاست‌گذاری کلان، مدیریت Tenant و تنظیمات سیستمی
6. **External Services**: پرداخت، پیامک، ایمیل، شبکه اجتماعی، AI، حمل‌ونقل

### مزیت رقابتی
- **Social Commerce Native** (نه صرفاً افزونه روی فروشگاه)
- **Multi-Vendor + Multi-Store** با جداسازی سطح Enterprise
- **AI-Assisted Commerce** در جستجو، توصیه و محتوای فروش
- **CRM داخلی** برای گردش کامل Lead-to-Loyalty
- **RTL/Persian-first UX و بومی‌سازی کامل ایران**

---

## 2.2 System Context Diagram

### Context (متنی)
```text
[Customer] ----\
[Vendor] -------\
[Staff] --------- > [SUN Platform] <---- [Payment Gateway]
[Admin] --------/          |              [Instagram API]
[Super Admin] --/          |              [SMS Provider]
                            |              [Email Provider]
                            \------------ [AI Services]
                                           [Shipping Provider]
```

### ارتباط Actorها با SUN
- **Customer ↔ SUN**: مرور کالا، سبد خرید، سفارش، نظر، Wishlist، پیگیری ارسال
- **Vendor ↔ SUN**: مدیریت کاتالوگ، سفارش، قیمت، موجودی، گزارش فروش
- **Staff ↔ SUN**: CRM، پشتیبانی، مدیریت رویدادهای عملیاتی
- **Admin ↔ SUN**: مدیریت نقش/دسترسی، سیاست‌های مالی، مانیتورینگ
- **Super Admin ↔ SUN**: مدیریت Tenantها، تنظیمات سراسری، SLA و سیاست‌ها

### ارتباط سیستم‌های بیرونی
- **Payment Gateway**: ایجاد/تایید تراکنش، callback امن، reconciliation
- **Instagram API**: همگام‌سازی محتوای اجتماعی و سیگنال‌های تعامل
- **SMS/Email Providers**: OTP، اعلان سفارش، کمپین CRM
- **AI Services**: embedding، classification، recommendations، copy assist
- **Shipping Provider**: نرخ‌گیری، صدور مرسوله، رهگیری

---

## 2.3 Container Architecture

### Frontend Applications
1. **Customer Portal (Web/Mobile Web PWA)**
   - وظیفه: خرید، تعامل اجتماعی، حساب کاربری، سفارش
2. **Vendor Portal**
   - وظیفه: مدیریت فروشگاه، محصول، موجودی، سفارش، کمپین
3. **Admin Portal**
   - وظیفه: عملیات پلتفرم، امنیت، مدیریت کاربران/فروشندگان، گزارش‌ها

### Backend Services (Modular Services)
1. **Identity Service**: ثبت‌نام/ورود، OTP، نقش‌ها، توکن‌ها
2. **Vendor Service**: پروفایل Vendor، فروشگاه‌ها، KYC، وضعیت فعالیت
3. **Product Service**: کاتالوگ، دسته‌بندی، ویژگی‌ها، قیمت/موجودی
4. **Order Service**: Cart، Checkout، سفارش، وضعیت و تاریخچه
5. **Payment Service**: پرداخت، callback، refund، مغایرت‌گیری
6. **CRM Service**: تعاملات، تیکت، کمپین، Journey مشتری
7. **Notification Service**: SMS/Email/In-App Event delivery
8. **AI Service**: توصیه‌گر، رتبه‌بندی جستجو، تولید محتوای محصول
9. **Analytics Service**: رویدادها، داشبورد KPI، گزارش عملکرد

### Data Layer
- **Primary Database**: PostgreSQL (OLTP)
- **Cache**: Redis (Session, Rate Limit, Hot Data)
- **File Storage**: S3-compatible object storage
- **Search Engine**: OpenSearch/Elasticsearch برای جستجوی کاتالوگ

### الگوی استقرار (پیشنهادی)
- لایه API و Workerها در کانتینرهای مستقل
- Queue مبتنی بر Redis Streams / RabbitMQ (برای Eventهای async)
- CDN برای فایل‌های استاتیک و تصاویر

---

## 2.4 Component Architecture (By Module)

### Identity Module
- Responsibility: احراز هویت، صدور توکن، RBAC
- Dependency: Notification, Audit
- Input: phone/email/password/otp
- Output: access token, refresh token, session, auth events
- Communication: Sync API + Async Auth Events

### Vendor Module
- Responsibility: مدیریت فروشنده/فروشگاه/پرسنل فروشنده
- Dependency: Identity, Audit, File Storage
- Input: KYC docs, store metadata
- Output: vendor status, store profile, staff assignments
- Communication: Sync CRUD + Async verification events

### Product Module
- Responsibility: مدیریت کالا، دسته، attribute، media، inventory
- Dependency: Vendor, Search, File Storage
- Input: product draft/update, images, attributes
- Output: publish status, searchable product index
- Communication: Sync API + Async indexing events

### Commerce Module
- Responsibility: cart, pricing, order lifecycle, checkout
- Dependency: Product, Payment, Notification
- Input: cart actions, checkout request, payment callback
- Output: order state transitions, invoices, notifications
- Communication: Sync command API + Async domain events

### Payment Module
- Responsibility: initiation, verification, refund, reconciliation
- Dependency: Gateway adapter, Audit
- Input: payment intent, callback payload
- Output: paid/failed/refunded states
- Communication: Sync verification + Async settlement events

### CRM Module
- Responsibility: customer timeline, ticketing, campaign orchestration
- Dependency: Analytics, Notification
- Input: customer events, agent actions
- Output: interaction logs, segmentation tags
- Communication: Event-driven + Query APIs

### Notification Module
- Responsibility: template, channel routing, delivery tracking
- Dependency: SMS/Email providers
- Input: notification events
- Output: sent/failed delivery reports
- Communication: Async queue-based

### AI Module
- Responsibility: recommendation, semantic search boost, copy generation
- Dependency: Product, Analytics, External AI
- Input: user behavior, catalog metadata
- Output: recommendation list, generated snippets, scoring
- Communication: Async pipelines + low-latency inference API

### Analytics Module
- Responsibility: event ingestion, aggregation, KPI dashboards
- Dependency: all domains via events
- Input: domain events + tracking events
- Output: metrics, cohorts, retention funnels
- Communication: Async ingestion + read-optimized APIs

---

## 3) Technology Decision Document

## 3.1 Frontend
- **Framework**: Next.js (App Router)
  - Reason: SSR/ISR، SEO قوی برای Marketplace، یکپارچگی Fullstack
- **UI Architecture**: Feature-Sliced + Domain-oriented modules
  - Reason: مقیاس‌پذیری تیمی و کاهش coupling
- **State Management**: React Query (server state) + Zustand (local state)
  - Reason: تفکیک stateهای همگام/محلی و کاهش پیچیدگی
- **Styling**: Tailwind CSS + Design Tokens
  - Reason: سرعت توسعه + سازگاری theme + maintainability
- **Component Strategy**: Shared component library + variant-driven primitives
  - Reason: یکپارچگی Customer/Vendor/Admin
- **RTL Strategy**:
  - dir="rtl" در سطح layout
  - logical CSS properties
  - تست RTL snapshot
  - فونت فارسی استاندارد + fallback stack

## 3.2 Backend
- **Framework**: Next.js Route Handlers برای فاز اولیه + Service modules
  - Reason: تسریع delivery اولیه؛ قابلیت استخراج میکروسرویس در رشد بعدی
- **Architecture Pattern**: Modular Monolith (DDD-ready)
  - Reason: کاهش پیچیدگی عملیاتی اولیه و حفظ مرزبندی domain
- **API Style**:
  - External/Public: REST
  - Internal service-to-service: REST + Async Events
- **Authentication Strategy**:
  - JWT Access (short-lived) + Refresh Token rotation
  - OTP-based login برای کاربر ایرانی + optional password

## 3.3 Database
- **Engine**: PostgreSQL
  - Reason: ACID، JSONB، ایندکس پیشرفته، پایداری Enterprise
- **ORM**: Drizzle ORM
  - Reason: type-safe schema، migration-friendly، عملکرد مناسب
- **Migration Strategy**:
  - Dev/Staging: drizzle-kit push
  - Production: versioned SQL migrations + gated rollout
- **Backup Strategy**:
  - PITR + daily full backup + encrypted offsite
  - دوره نگهداری: 35 روز + monthly snapshots

## 3.4 Infrastructure
- **Containerization**: Docker + multi-stage builds
- **CI/CD**: GitHub Actions (lint/type/build/test/security scan)
- **Monitoring**: OpenTelemetry + Prometheus + Grafana
- **Logging**: Structured JSON logs + central aggregation (ELK/OpenSearch)
- **Secrets Management**: Vault/Cloud Secret Manager

---

## 4) DDD Design

## 4.1 Bounded Contexts
1. **Identity Context**
2. **Vendor Context**
3. **Product Context**
4. **Commerce Context**
5. **Customer Context**
6. **CRM Context**
7. **AI Context**
8. **Analytics Context**

## 4.2 Entities per Context

### Identity
- User, Role, Permission, Session, AuthMethod, OTPChallenge

### Vendor
- Vendor, Store, VendorStaff, KYCRecord, SettlementProfile

### Product
- Product, ProductVariant, Category, Attribute, InventoryItem, MediaAsset

### Commerce
- Cart, CartItem, Order, OrderItem, Payment, Refund, Shipment

### Customer
- CustomerProfile, Address, Review, Wishlist, FavoriteStore

### CRM
- Interaction, Ticket, Campaign, Segment, ConsentRecord

### AI
- RecommendationModel, FeatureVector, RankingPolicy, PromptTemplate

### Analytics
- Event, MetricSnapshot, DashboardWidget, CohortDefinition

## 4.3 Aggregate Design

### نمونه Aggregateها
- **UserAggregate (Root: User)**
  - Rules: وضعیت کاربر، نقش‌ها، روش‌های احراز هویت
- **VendorAggregate (Root: Vendor)**
  - Rules: vendor status transitions (pending/verified/suspended)
- **StoreAggregate (Root: Store)**
  - Rules: store ownership، staff assignment policy
- **ProductAggregate (Root: Product)**
  - Rules: publish فقط در وضعیت تایید Vendor و داده کامل محصول
- **OrderAggregate (Root: Order)**
  - Rules: immutable price snapshot، transition state machine
- **CartAggregate (Root: Cart)**
  - Rules: item validity، inventory re-check on checkout
- **CustomerAggregate (Root: CustomerProfile)**
  - Rules: consent + communication preferences

## 4.4 Value Objects
- Money(amount, currency)
- PhoneNumber(countryCode, nationalNumber)
- AddressVO(province, city, postalCode, line)
- DateRange(start, end)
- ProductAttributeValue(name, value, unit)
- OrderStatusTransition(from, to, reason)
- TenantId, VendorId, StoreId

## 4.5 Domain Services
- PricingService
- InventoryReservationService
- PaymentOrchestrationService
- RecommendationService
- CustomerSegmentationService
- FraudDetectionService (rule-based در فاز اولیه)

---

## 5) Database Blueprint

## 5.1 ERD (متنی)
```text
Users --< UserRoles >-- Roles --< RolePermissions >-- Permissions
Users --< Sessions

Vendors --< Stores --< VendorStaff >-- Users
Vendors --< KYCRecords

Categories --< Products --< ProductVariants
Products --< ProductMedia
Products --< InventoryItems
Products --< ProductAttributes

Customers(=Users projection) --< Addresses
Customers --< Wishlists --< WishlistItems >-- Products
Customers --< Reviews >-- Products

Carts --< CartItems >-- ProductVariants
Orders --< OrderItems >-- ProductVariants
Orders --< Payments
Orders --< Shipments
Payments --< Refunds

Customers --< CRMInteractions
Customers --< CustomerInteractionLogs

AuditLogs
SystemConfigurations
```

## 5.2 Core Tables (High-Level)

### Identity
- users(id, tenant_id, phone, email, password_hash, status, created_at, ...)
- roles(id, tenant_id/null, code, name)
- permissions(id, code, description)
- user_roles(user_id, role_id)
- role_permissions(role_id, permission_id)
- sessions(id, user_id, refresh_token_hash, expires_at, ip, user_agent)

### Vendor
- vendors(id, tenant_id, legal_name, national_id, status, verified_at)
- stores(id, vendor_id, name_fa, slug, status, theme_config_json)
- vendor_staff(id, store_id, user_id, role_code, is_active)

### Catalog
- categories(id, parent_id, name_fa, slug, is_active)
- products(id, store_id, category_id, title_fa, description, status)
- product_variants(id, product_id, sku, price_amount, currency, stock_qty)
- product_attributes(id, product_id, key, value, unit)

### Commerce
- carts(id, customer_id, store_id, status, expires_at)
- cart_items(id, cart_id, variant_id, qty, unit_price_snapshot)
- orders(id, customer_id, store_id, order_no, status, total_amount)
- order_items(id, order_id, variant_id, qty, unit_price, tax_amount)
- payments(id, order_id, gateway, amount, status, transaction_ref)

### Customer
- customers(id, user_id, loyalty_tier, birth_date)
- reviews(id, customer_id, product_id, rating, comment, status)
- wishlists(id, customer_id, title)
- wishlist_items(id, wishlist_id, product_id)

### CRM
- activities(id, customer_id, type, channel, payload_json, created_by)
- customer_interaction_logs(id, customer_id, actor_id, action, meta_json)

### System
- audit_logs(id, tenant_id, actor_id, action, resource, resource_id, metadata_json)
- configurations(id, tenant_id/null, key, value_json, is_secret_ref)

## 5.3 Database Rules

### Primary Key Strategy
- UUID v7 (ترجیحی) یا ULID برای توزیع‌پذیری و امن‌تر بودن نسبت به serial

### Foreign Key Strategy
- FK سخت‌گیرانه برای OLTP integrity
- ON DELETE محدود (RESTRICT) برای داده‌های تراکنشی

### Index Strategy
- ایندکس ترکیبی بر (tenant_id, status)
- ایندکس‌های جستجو: (slug), (sku), (order_no)
- Partial index برای رکوردهای active
- GIN index برای JSONBهای تحلیلی موردنیاز

### Soft Delete Strategy
- deleted_at + deleted_by
- Query filters در repository لایه domain

### Audit Strategy
- audit_logs برای همه عملیات حساس (auth, payment, role changes)
- ثبت trace_id/request_id برای correlation

### Multi-Tenant Strategy
- tenant_id اجباری در جدول‌های tenant-scoped
- Row-level isolation در service layer + optional PostgreSQL RLS
- داده‌های shared (مانند permissions پایه) با tenant_id=null

---

## 6) Security Blueprint

## 6.1 Authentication

### Login Flow
1. User شماره موبایل/ایمیل وارد می‌کند
2. OTP challenge یا password verification
3. صدور Access Token کوتاه‌عمر (مثلاً 15 دقیقه)
4. صدور Refresh Token چرخشی (مثلاً 30 روز)
5. ثبت session + device fingerprint

### Token Strategy
- Access JWT شامل sub, tenant, roles, permissions hash
- Refresh Token فقط به‌صورت hash ذخیره شود
- revoke list در Redis برای logout فوری

### Session Management
- محدودیت نشست همزمان قابل تنظیم
- تشخیص فعالیت مشکوک (IP/User-Agent drift)
- step-up auth برای عملیات حساس

## 6.2 Authorization

### RBAC
- Roleهای سیستمی: customer, vendor_owner, vendor_staff, support_staff, admin, super_admin
- Permissionهای granular مانند:
  - product:create
  - order:refund
  - vendor:approve
  - user:assign_role

### Permission Model
- ترکیبی از RBAC + policy checks (tenant/store ownership)

## 6.3 Data Security
- Encryption in transit: TLS 1.2+
- Encryption at rest: DB/storage encryption
- فیلدهای حساس: hashing/encryption (PII/financial refs)
- Secret rotation + key management policy

## 6.4 Application Security
- OWASP Top 10 controls
- Input validation با schema validation
- CSRF protection برای session-bound endpoints
- Rate limiting:
  - login/otp endpoints
  - payment callbacks
  - public search APIs
- API Security:
  - signed webhook verification
  - idempotency keys برای checkout/payment

## 6.5 Audit & Security Logging
- ثبت همه فعالیت‌های حساس کاربر/ادمین
- لاگ امنیتی غیرقابل‌دستکاری (append-only sink)
- Alarm برای الگوهای مشکوک (failed login spikes, privilege escalation)

---

## 7) Multi-Tenant Architecture

## 7.1 Tenant Model
- مدل: **Shared Database, Shared Schema, Tenant-scoped rows**
- هر Vendor یک Tenant کسب‌وکاری
- هر Tenant می‌تواند چند Store داشته باشد

## 7.2 Vendor Isolation
- همه queryهای tenant-scoped باید tenant_id filter شوند
- middleware احراز tenant context از توکن و مسیر

## 7.3 Data Separation
- جدول‌های مشترک: category taxonomy base, permission dictionary
- جدول‌های اختصاصی: orders/payments/customers/vendor resources

## 7.4 Permission Isolation
- هیچ Vendor به داده Vendor دیگر دسترسی نداشته باشد
- vendor_staff فقط در محدوده storeهای assign شده

## 7.5 Configuration Isolation
- تنظیمات theme/campaign/notification per tenant/store
- fallback به تنظیمات global در نبود تنظیم tenant

---

## 8) Integration Blueprint

## 8.1 Instagram Integration
- Data Flow: Pull/Sync محتوای پست/متریک تعامل → CRM/Analytics
- API Pattern: Scheduled sync + webhook (در صورت پشتیبانی)
- Security: OAuth token storage encrypted
- Error Handling: retry با backoff + token refresh + dead-letter queue

## 8.2 Payment Gateway
- Data Flow: create payment intent → redirect → callback verify → order update
- API Pattern: request/response + webhook callback
- Security: signature validation, IP allowlist, idempotency key
- Error Handling: reconciliation job دوره‌ای + manual review queue

## 8.3 SMS Provider
- Data Flow: OTP/transactional notifications
- API Pattern: async queued dispatch
- Security: credential vault + sender whitelist
- Error Handling: fallback provider secondary + retry policy

## 8.4 Email Provider
- Data Flow: order confirmations, campaign mails
- API Pattern: template-driven send API
- Security: SPF/DKIM/DMARC + API key rotation
- Error Handling: bounce tracking + suppression list

## 8.5 AI Provider
- Data Flow: product/customer features → inference → recommendations/content
- API Pattern: sync inference for realtime + async batch for re-ranking
- Security: PII minimization + anonymized payloads
- Error Handling: circuit breaker + graceful fallback to rule-based engine

## 8.6 Shipping Provider
- Data Flow: rate quote → shipment create → tracking updates
- API Pattern: sync quote/create + webhook tracking
- Security: signed requests + scoped credentials
- Error Handling: fallback courier + status reconciliation job

---

## 9) Development Roadmap

## Phase 1 — Architecture
- Goal: تعریف معماری، DDD، دیتا، امنیت، DevOps
- Deliverables: همین سند + ADR + backlog اولیه
- Dependencies: alignment محصول/فنی
- Risks: scope creep، عدم همسویی ذی‌نفعان

## Phase 2 — Backend Foundation
- Goal: پیاده‌سازی Modular Monolith + Auth + Vendor + Catalog + Commerce Core
- Deliverables: API v1، schema پایدار، event bus پایه، audit
- Dependencies: Phase 1 approval
- Risks: پیچیدگی domain events، وابستگی به درگاه پرداخت

## Phase 3 — Frontend & Multi Theme Engine
- Goal: پورتال مشتری/فروشنده/ادمین + theme per store
- Deliverables: UX کامل RTL، داشبوردها، onboarding فروشنده
- Dependencies: API stability
- Risks: performance در کاتالوگ‌های حجیم، تنوع دستگاه

## Phase 4 — AI Commerce
- Goal: recommendation، semantic search، content assist
- Deliverables: مدل‌های اولیه، A/B framework، KPI tracking
- Dependencies: داده رفتاری کافی
- Risks: کیفیت داده، drift مدل، هزینه inference

## Phase 5 — Production Release
- Goal: hardening، scaling، security sign-off، go-live
- Deliverables: SLO/SLA، runbooks، DR drills، launch checklist
- Dependencies: test coverage و UAT کامل
- Risks: incidentهای روز اول، bottleneck زیرساخت

---

## 10) Architecture Decision Records (ADR)

### ADR-001
- Decision: معماری **Modular Monolith** در فاز اولیه
- Reason: سرعت توسعه + کاهش پیچیدگی عملیات
- Alternatives: Microservices کامل از ابتدا
- Final Choice: Modular Monolith با مرزبندی DDD
- Impact: مهاجرت ساده‌تر به سرویس‌های مستقل در رشد

### ADR-002
- Decision: PostgreSQL به‌عنوان دیتابیس اصلی
- Reason: تراکنش‌پذیری قوی + قابلیت‌های پیشرفته
- Alternatives: MySQL, MongoDB
- Final Choice: PostgreSQL
- Impact: consistency بهتر برای سفارش/پرداخت

### ADR-003
- Decision: Drizzle ORM
- Reason: type safety و سادگی schema-as-code
- Alternatives: Prisma, TypeORM
- Final Choice: Drizzle
- Impact: کیفیت بهتر قرارداد داده در TypeScript

### ADR-004
- Decision: JWT Access + Rotating Refresh Tokens
- Reason: امنیت و مقیاس‌پذیری در API stateless
- Alternatives: session-only cookies
- Final Choice: hybrid token/session tracking
- Impact: نیاز به مدیریت revoke list

### ADR-005
- Decision: Shared DB + Tenant-scoped rows
- Reason: هزینه کمتر و عملیات ساده‌تر در شروع
- Alternatives: DB-per-tenant
- Final Choice: shared schema with tenant isolation
- Impact: نیاز به سخت‌گیری در tenant filters/RLS

### ADR-006
- Decision: Event-driven integration بین ماژول‌ها
- Reason: کاهش coupling و افزایش resilience
- Alternatives: فقط synchronous API calls
- Final Choice: sync command + async events
- Impact: نیاز به observability و retry/DLQ

### ADR-007
- Decision: OpenSearch برای جستجوی کاتالوگ
- Reason: نیاز به full-text + faceted filtering
- Alternatives: PostgreSQL full-text only
- Final Choice: OpenSearch
- Impact: پیچیدگی همگام‌سازی ایندکس

### ADR-008
- Decision: Security-by-Design (OWASP + audit-first)
- Reason: حساسیت مالی/هویتی پلتفرم
- Alternatives: hardening پس از release
- Final Choice: secure SDLC از ابتدا
- Impact: زمان توسعه بیشتر ولی ریسک عملیاتی کمتر

### ADR-009
- Decision: Persian/RTL Native در هسته محصول
- Reason: بازار هدف ایران
- Alternatives: LTR-first سپس بومی‌سازی
- Final Choice: RTL-first architecture
- Impact: کیفیت تجربه کاربری بالاتر در بازار هدف

### ADR-010
- Decision: CI/CD با quality gates اجباری
- Reason: جلوگیری از regression و کاهش incident
- Alternatives: deploy دستی
- Final Choice: pipeline خودکار با gate
- Impact: release پایدارتر، زمان setup اولیه بیشتر

---

## 11) Non-Functional Requirements (NFR) — Baseline
- Availability: 99.95%
- Performance: P95 API < 300ms برای مسیرهای حیاتی
- Scalability: 10x رشد vendor/product بدون redesign بنیادین
- Security: OWASP ASVS baseline + quarterly penetration test
- Observability: metrics/logs/traces کامل برای تمام سرویس‌ها
- Maintainability: domain boundaries، ADR discipline، coding standards
- Compliance: حفظ حریم خصوصی داده و سیاست نگهداری مشخص

---

## 12) Exit Criteria for Phase 1
- سند معماری تاییدشده توسط Product + Engineering + Security
- مرزبندی DDD و مدل داده نهایی‌شده
- ADRهای کلیدی تصویب‌شده
- Roadmap فازبندی و ریسک‌ها مورد توافق
- آمادگی شروع Phase 2 بدون ابهام معماری

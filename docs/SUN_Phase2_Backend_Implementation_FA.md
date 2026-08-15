# SUN — Phase 2 Backend & Data Platform Documentation

## 1. Architecture Overview
- Pattern: Clean Architecture با DDD و Modular Monolith
- Layers:
  - `src/Domain`: business rules (order transition, pricing, inventory)
  - `src/Application`: use-case services
  - `src/Infrastructure`: repositories + seed
  - `src/API`: request schemas
  - `src/Shared`: cross-cutting concerns (auth, error, audit, tenant)
  - `src/Tests`: unit/integration/security tests
- API Versioning: `/api/v1/*`
- Multi-Tenant: `tenantId` در claims و data rows

## 2. Implemented Modules

### 2.1 Identity & Access
- Registration / Login / Refresh / Logout / Me / Change Password
- JWT Access + Refresh Token flow
- Password hashing با bcrypt
- Session persistence در جدول `sessions`
- Security logs در `security_logs`

### 2.2 Vendor Management
- Vendor creation and listing
- Store creation and listing per vendor
- Store staff assignment and listing

### 2.3 Product Catalog
- Category CRUD پایه (GET/POST)
- Product creation with variants
- Inventory movement ثبت‌شده برای stock history
- Inventory adjust endpoint

### 2.4 Commerce
- Cart creation + item upsert/remove
- Order creation from cart
- Inventory deduction on order create
- Payment initiate + callback processing
- Invoice generation and persistence

### 2.5 Customer Management
- Customer profile fetch
- Preferences update
- Address creation
- Activity tracking

### 2.6 CRM Foundation
- Create/List customer interactions
- Activity logs قابل گزارش‌گیری

### 2.7 Audit & Logging
- فارسی‌سازی پیام‌های audit log
- ثبت actor/action/resource/time
- API دسترسی گزارش ممیزی

## 3. API Documentation (Key Endpoints)

### Identity
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET/PATCH /api/v1/auth/me`
- `POST /api/v1/auth/change-password`

### Vendor
- `GET/POST /api/v1/vendors`
- `GET/POST /api/v1/vendors/{vendorId}/stores`
- `GET/POST /api/v1/stores/{storeId}/staff`

### Catalog
- `GET/POST /api/v1/catalog/categories`
- `GET/POST /api/v1/catalog/products`
- `GET/POST /api/v1/catalog/inventory/movements`

### Commerce
- `GET/POST/DELETE /api/v1/commerce/cart`
- `GET/POST /api/v1/commerce/orders`
- `PATCH /api/v1/commerce/orders/{orderId}/status`
- `POST /api/v1/commerce/payments/initiate`
- `POST /api/v1/commerce/payments/callback`

### Customer/CRM/System
- `GET/PATCH /api/v1/customers/profile`
- `POST /api/v1/customers/addresses`
- `GET/POST /api/v1/customers/activities`
- `GET/POST /api/v1/crm/interactions`
- `GET /api/v1/system/audit-logs`

## 4. Database Dictionary (Core)
- Identity: users, roles, permissions, user_roles, role_permissions, sessions, security_logs
- Vendor: vendors, stores, store_staff
- Catalog: categories, brands, products, product_variants, inventory_movements
- Commerce: carts, cart_items, orders, order_items, payments, invoices
- Customer: customers, customer_addresses, reviews, wishlists, wishlist_items, customer_activities
- CRM: crm_interactions, customer_segments, customer_segment_members
- System: audit_logs, system_configurations, tenants

## 5. Migrations & Seed
- `drizzle/0000_initial.sql`: initial schema migration
- `drizzle/0001_seed.sql`: default tenant/roles/permissions/system config
- TS Seed Script: `src/Infrastructure/seed/runSeed.ts`

## 6. Security Implementation Summary
- Access/Refresh Token strategy
- RBAC + Permission checks per endpoint
- Tenant isolation via tenant-scoped access
- Structured error handling (no sensitive leak)
- Audit logging for privileged actions

## 7. Deployment Guide
1. Ensure environment variables:
   - `DATABASE_URL`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
2. Apply schema:
   - `npx drizzle-kit push`
3. (Optional) Run seeds:
   - `npm exec tsx src/Infrastructure/seed/runSeed.ts`
4. Build and run:
   - `npm run build`
   - managed runtime healthcheck via platform

## 8. QA Scope
- Unit tests for domain rules
- Security tests for permission and password
- Integration test for database connectivity

## 9. Known Architectural Notes
- پرداخت فعلاً با integration adapter mock URL تولید می‌کند، اما callback واقعی و state management پیاده‌سازی شده است.
- برای production نهایی، adapter رسمی درگاه ایرانی (مثل زرین‌پال/آیدی‌پی) در لایه Infrastructure افزوده شود.

# Database Documentation

## Core
- PostgreSQL + Drizzle schema in `src/db/schema.ts`
- Multi-tenant strategy: tenant_id row scoping

## Migrations
- `drizzle/0000_initial.sql`
- `drizzle/0001_seed.sql`
- `drizzle/0001_ai_phase4.sql`

## Integrity
- FK constraints applied
- Unique constraints for key business entities
- audit + AI telemetry tables available

# SUN v1.0.0 Release Notes

## New Features
- Enterprise multi-tenant marketplace core (Identity, Vendor, Catalog, Commerce, CRM)
- Enterprise frontend with 6 runtime-switchable themes
- AI Commerce layer: assistant, recommendation, semantic search, social processing
- Instagram commerce intake + automation and analytics endpoints

## Improvements
- Tenant isolation hardening on critical read paths
- Inventory and commerce integrity improvements
- Expanded observability with health endpoint `/health`

## Security Fixes
- API security headers via middleware
- Rate limiting on sensitive and AI endpoints
- Payment callback HMAC signature verification
- Duplicate payment callback idempotency handling
- Request content-type and payload size checks

## Performance Improvements
- Added caching-friendly architecture patterns and reduced unsafe broad queries
- Added batch pipeline jobs for AI recomputation
- Added operational scripts for backup and integrity checks

## Known Limitations
- Lighthouse/Core Web Vitals automated lab measurement not executed in sandbox
- Full E2E and stress test tooling setup documented but not fully executed here
- Payment provider integration uses internal contract and requires real gateway adapter for production

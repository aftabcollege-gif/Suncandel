# Security Documentation

## Implemented
- JWT access/refresh
- RBAC/permission checks
- Tenant-scoped data access
- Security headers in middleware
- Rate limiting for sensitive APIs
- HMAC verification for payment callback
- Request JSON/content-length validation

## Remaining
- Account lockout policy with persistent storage (recommended)
- External WAF and bot mitigation in production edge

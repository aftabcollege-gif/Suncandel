INSERT INTO tenants (name, code, is_active)
VALUES ('SUN Main Tenant', 'sun-main', true)
ON CONFLICT (code) DO NOTHING;

WITH t AS (
  SELECT id AS tenant_id FROM tenants WHERE code = 'sun-main' LIMIT 1
)
INSERT INTO roles (tenant_id, code, name, description, is_system)
SELECT t.tenant_id, r.code, r.name, r.description, true
FROM t
CROSS JOIN (
  VALUES
    ('super_admin', 'Super Admin', 'System role super admin'),
    ('admin', 'Admin', 'System role admin'),
    ('vendor', 'Vendor', 'System role vendor'),
    ('staff', 'Staff', 'System role staff'),
    ('customer', 'Customer', 'System role customer')
) AS r(code, name, description)
ON CONFLICT DO NOTHING;

INSERT INTO permissions (code, description)
VALUES
  ('vendor:manage', 'Permission for vendor management'),
  ('store:manage', 'Permission for store management'),
  ('product:manage', 'Permission for product management'),
  ('inventory:manage', 'Permission for inventory management'),
  ('order:create', 'Permission for creating order'),
  ('order:read_self', 'Permission for reading own orders'),
  ('order:read', 'Permission for reading orders'),
  ('order:update', 'Permission for updating order status'),
  ('payment:manage', 'Permission for payment operations'),
  ('crm:read', 'Permission for crm read operations'),
  ('crm:write', 'Permission for crm write operations'),
  ('crm:manage', 'Permission for crm management'),
  ('user:manage', 'Permission for user management'),
  ('audit:read', 'Permission for audit read operations'),
  ('cart:manage', 'Permission for cart operations'),
  ('review:create', 'Permission for creating review')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'vendor:manage',
  'store:manage',
  'product:manage',
  'inventory:manage',
  'order:read',
  'order:update',
  'payment:manage',
  'crm:manage',
  'user:manage',
  'audit:read'
)
WHERE r.code = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN ('store:manage', 'product:manage', 'inventory:manage', 'order:read', 'order:update', 'crm:read')
WHERE r.code = 'vendor'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN ('product:manage', 'order:read', 'order:update', 'crm:write')
WHERE r.code = 'staff'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN ('cart:manage', 'order:create', 'order:read_self', 'review:create')
WHERE r.code = 'customer'
ON CONFLICT DO NOTHING;

WITH t AS (
  SELECT id AS tenant_id FROM tenants WHERE code = 'sun-main' LIMIT 1
)
INSERT INTO system_configurations (tenant_id, key, value, is_secret_ref)
SELECT t.tenant_id, 'platform.default_currency', '{"currency":"IRR"}'::jsonb, false
FROM t
ON CONFLICT DO NOTHING;

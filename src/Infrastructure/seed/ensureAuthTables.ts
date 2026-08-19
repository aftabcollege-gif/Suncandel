import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function ensureAuthTables() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS tenants (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      name varchar(255) NOT NULL,
      code varchar(64) NOT NULL,
      is_active boolean DEFAULT true NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `);
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS tenants_code_unique ON tenants (code)`);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      tenant_id uuid,
      full_name varchar(255) NOT NULL,
      phone varchar(20) NOT NULL,
      email varchar(255),
      password_hash text,
      status varchar(32) DEFAULT 'active' NOT NULL,
      last_login_at timestamptz,
      deleted_at timestamptz,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `);
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS users_phone_unique ON users (phone)`);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS roles (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      tenant_id uuid,
      code varchar(64) NOT NULL,
      name varchar(128) NOT NULL,
      description text,
      is_system boolean DEFAULT false NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL
    )
  `);
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS roles_code_tenant_unique ON roles (tenant_id, code)`);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id uuid NOT NULL,
      role_id uuid NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      PRIMARY KEY (user_id, role_id)
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      user_id uuid NOT NULL,
      refresh_token_hash text NOT NULL,
      expires_at timestamptz NOT NULL,
      ip_address varchar(64),
      user_agent text,
      revoked_at timestamptz,
      created_at timestamptz DEFAULT now() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS security_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      user_id uuid,
      action varchar(128) NOT NULL,
      level varchar(32) DEFAULT 'info' NOT NULL,
      details jsonb DEFAULT '{}'::jsonb NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      tenant_id uuid,
      actor_user_id uuid,
      action varchar(128) NOT NULL,
      resource varchar(128) NOT NULL,
      resource_id varchar(128) NOT NULL,
      message_fa text NOT NULL,
      metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS permissions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      code varchar(128) NOT NULL,
      description text NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id uuid NOT NULL,
      permission_id uuid NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      PRIMARY KEY (role_id, permission_id)
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS system_configurations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      tenant_id uuid,
      key varchar(128) NOT NULL,
      value jsonb DEFAULT '{}'::jsonb NOT NULL,
      is_secret_ref boolean DEFAULT false NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `);
}

import { db } from "@/db";
import {
  permissions,
  rolePermissions,
  roles,
  systemConfigurations,
  tenants,
  userRoles,
  users,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/Shared/security";

const defaultPermissions = [
  "vendor:manage",
  "store:manage",
  "product:manage",
  "inventory:manage",
  "order:create",
  "order:read_self",
  "order:read",
  "order:update",
  "payment:manage",
  "crm:read",
  "crm:write",
  "crm:manage",
  "user:manage",
  "audit:read",
  "cart:manage",
  "review:create",
];

const rolePermissionMap: Record<string, string[]> = {
  super_admin: ["*"],
  admin: [
    "vendor:manage",
    "store:manage",
    "product:manage",
    "inventory:manage",
    "order:read",
    "order:update",
    "payment:manage",
    "crm:manage",
    "user:manage",
    "audit:read",
  ],
  vendor: ["store:manage", "product:manage", "inventory:manage", "order:read", "order:update", "crm:read"],
  staff: ["product:manage", "order:read", "order:update", "crm:write"],
  customer: ["cart:manage", "order:create", "order:read_self", "review:create"],
};

const roleCodes = ["super_admin", "admin", "vendor", "staff", "customer"];

export async function runSeed() {
  const tenantRows = await db
    .insert(tenants)
    .values({ name: "SUN Main Tenant", code: "sun-main", isActive: true })
    .onConflictDoNothing()
    .returning({ id: tenants.id });

  let tenantId = tenantRows[0]?.id;
  if (!tenantId) {
    const existing = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.code, "sun-main")).limit(1);
    tenantId = existing[0]?.id;
  }

  if (!tenantId) {
    throw new Error("Unable to create or find default tenant");
  }

  for (const code of roleCodes) {
    await db
      .insert(roles)
      .values({
        tenantId,
        code,
        name: code,
        description: `System role: ${code}`,
        isSystem: true,
      })
      .onConflictDoNothing();
  }

  for (const code of defaultPermissions) {
    await db
      .insert(permissions)
      .values({ code, description: `Permission for ${code}` })
      .onConflictDoNothing();
  }

  const roleRows = await db.select({ id: roles.id, code: roles.code }).from(roles).where(eq(roles.tenantId, tenantId));
  const permissionRows = await db.select({ id: permissions.id, code: permissions.code }).from(permissions);

  const permissionByCode = new Map(permissionRows.map((p) => [p.code, p.id]));

  for (const role of roleRows) {
    const grants = rolePermissionMap[role.code] ?? [];
    for (const grant of grants) {
      if (grant === "*") continue;
      const permissionId = permissionByCode.get(grant);
      if (!permissionId) continue;

      await db
        .insert(rolePermissions)
        .values({ roleId: role.id, permissionId })
        .onConflictDoNothing();
    }
  }

  await db
    .insert(systemConfigurations)
    .values({
      tenantId,
      key: "platform.default_currency",
      value: { currency: "IRR" },
      isSecretRef: false,
    })
    .onConflictDoNothing();

  const adminPhone = "09155088324";
  const adminPasswordHash = await hashPassword("admin@12345");
  const existingAdmin = await db.select({ id: users.id }).from(users).where(eq(users.phone, adminPhone)).limit(1);

  let adminId = existingAdmin[0]?.id;
  if (!adminId) {
    const created = await db
      .insert(users)
      .values({
        tenantId,
        fullName: "admin",
        phone: adminPhone,
        email: "admin",
        passwordHash: adminPasswordHash,
        status: "active",
      })
      .returning({ id: users.id });
    adminId = created[0]?.id;
  } else {
    await db
      .update(users)
      .set({
        fullName: "admin",
        email: "admin",
        passwordHash: adminPasswordHash,
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(users.id, adminId));
  }

  if (adminId) {
    const adminRole = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.code, "super_admin"))
      .limit(1);
    if (adminRole[0]) {
      await db.insert(userRoles).values({ userId: adminId, roleId: adminRole[0].id }).onConflictDoNothing();
    }
  }

  return { tenantId, adminId };
}

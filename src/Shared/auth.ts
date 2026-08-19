import { SignJWT, jwtVerify } from "jose";
import { env } from "@/Shared/env";
import { AppError } from "@/Shared/errors";
import { db } from "@/db";
import { roles, userRoles, users } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export type AuthRole = "super_admin" | "admin" | "vendor" | "staff" | "customer";

export type AccessTokenPayload = {
  sub: string;
  tenantId: string | null;
  roles: AuthRole[];
  permissions: string[];
};

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export async function signAccessToken(payload: AccessTokenPayload) {
  const exp = `${env.ACCESS_TOKEN_TTL_MINUTES}m`;
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(accessSecret);
}

export async function signRefreshToken(userId: string, sessionId: string) {
  const exp = `${env.REFRESH_TOKEN_TTL_DAYS}d`;
  return await new SignJWT({ sid: sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, accessSecret);
  return {
    sub: String(payload.sub),
    tenantId: payload.tenantId ? String(payload.tenantId) : null,
    roles: Array.isArray(payload.roles) ? (payload.roles as AuthRole[]) : [],
    permissions: Array.isArray(payload.permissions)
      ? payload.permissions.map((p) => String(p))
      : [],
  };
}

export async function verifyRefreshToken(token: string): Promise<{ sub: string; sid: string }> {
  const { payload } = await jwtVerify(token, refreshSecret);
  return { sub: String(payload.sub), sid: String(payload.sid) };
}

export function extractBearerToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    throw new AppError("توکن دسترسی ارسال نشده است", 401, "UNAUTHORIZED");
  }
  return authHeader.slice(7);
}

export async function requireAuth(req: Request) {
  const token = extractBearerToken(req);
  const payload = await verifyAccessToken(token).catch(() => {
    throw new AppError("توکن معتبر نیست", 401, "INVALID_TOKEN");
  });
  return payload;
}

export function requireAnyRole(userRolesList: string[], acceptedRoles: AuthRole[]) {
  const ok = acceptedRoles.some((role) => userRolesList.includes(role));
  if (!ok) {
    throw new AppError("دسترسی کافی ندارید", 403, "FORBIDDEN");
  }
}

export function requirePermission(userPermissions: string[], permission: string) {
  if (userPermissions.includes("*")) {
    return;
  }

  if (!userPermissions.includes(permission)) {
    throw new AppError("مجوز لازم برای این عملیات را ندارید", 403, "FORBIDDEN_PERMISSION");
  }
}

export async function buildUserAccessPayload(userId: string): Promise<AccessTokenPayload> {
  const userRows = await db
    .select({ id: users.id, tenantId: users.tenantId })
    .from(users)
    .where(and(eq(users.id, userId), isNull(users.deletedAt)))
    .limit(1);

  const user = userRows[0];
  if (!user) {
    throw new AppError("کاربر یافت نشد", 404, "USER_NOT_FOUND");
  }

  const roleRows = await db
    .select({ roleCode: roles.code })
    .from(userRoles)
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .where(eq(userRoles.userId, userId));

  const normalizedRoles = roleRows.map((r) => r.roleCode as AuthRole);

  const permissions = mapRolesToPermissions(normalizedRoles);

  return {
    sub: user.id,
    tenantId: user.tenantId,
    roles: normalizedRoles,
    permissions,
  };
}

function mapRolesToPermissions(allRoles: AuthRole[]) {
  const rolePermissionMap: Record<AuthRole, string[]> = {
    super_admin: ["*"],
    admin: [
      "vendor:manage",
      "store:manage",
      "product:manage",
      "order:manage",
      "payment:manage",
      "crm:manage",
      "user:manage",
      "audit:read",
    ],
    vendor: [
      "store:manage",
      "product:manage",
      "inventory:manage",
      "order:read",
      "order:update",
      "crm:read",
    ],
    staff: ["product:manage", "order:read", "order:update", "crm:write"],
    customer: ["cart:manage", "order:create", "order:read_self", "review:create"],
  };

  if (allRoles.includes("super_admin")) {
    return ["*"];
  }

  const perms = new Set<string>();
  for (const role of allRoles) {
    rolePermissionMap[role].forEach((p) => perms.add(p));
  }

  return Array.from(perms);
}

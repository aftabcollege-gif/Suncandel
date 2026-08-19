import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { roles, securityLogs, sessions, userRoles, users } from "@/db/schema";

export class IdentityRepository {
  async createUser(input: {
    tenantId?: string | null;
    fullName: string;
    phone: string;
    email?: string;
    passwordHash?: string | null;
  }) {
    const rows = await db
      .insert(users)
      .values({
        tenantId: input.tenantId ?? null,
        fullName: input.fullName,
        phone: input.phone,
        email: input.email ?? null,
        passwordHash: input.passwordHash ?? null,
      })
      .returning();

    return rows[0];
  }

  async findUserByPhone(phone: string) {
    const rows = await db
      .select()
      .from(users)
      .where(and(eq(users.phone, phone), isNull(users.deletedAt)))
      .limit(1);

    return rows[0] ?? null;
  }

  async findUserById(userId: string) {
    const rows = await db
      .select()
      .from(users)
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .limit(1);

    return rows[0] ?? null;
  }

  async updateUserProfile(userId: string, payload: { fullName?: string; email?: string | null }) {
    const rows = await db
      .update(users)
      .set({
        fullName: payload.fullName,
        email: payload.email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return rows[0] ?? null;
  }

  async updatePassword(userId: string, passwordHash: string) {
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async touchLastLogin(userId: string) {
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, userId));
  }

  async createSession(input: {
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    const rows = await db.insert(sessions).values(input).returning();
    return rows[0];
  }

  async findSessionById(sessionId: string) {
    const rows = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
    return rows[0] ?? null;
  }

  async revokeSession(sessionId: string) {
    await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, sessionId));
  }

  async getRoleByCode(roleCode: string) {
    const rows = await db.select().from(roles).where(eq(roles.code, roleCode)).limit(1);
    return rows[0] ?? null;
  }

  async assignRole(userId: string, roleId: string) {
    await db.insert(userRoles).values({ userId, roleId }).onConflictDoNothing();
  }

  async listRoleCodesByUserId(userId: string) {
    const rows = await db
      .select({ code: roles.code })
      .from(userRoles)
      .innerJoin(roles, eq(roles.id, userRoles.roleId))
      .where(eq(userRoles.userId, userId));
    return rows.map((r) => r.code);
  }

  async addSecurityLog(input: { userId?: string | null; action: string; level?: string; details?: unknown }) {
    await db.insert(securityLogs).values({
      userId: input.userId ?? null,
      action: input.action,
      level: input.level ?? "info",
      details: (input.details ?? {}) as Record<string, unknown>,
    });
  }
}

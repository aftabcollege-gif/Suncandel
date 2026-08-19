import { addDays } from "@/Shared/time";
import { AppError } from "@/Shared/errors";
import { buildUserAccessPayload, signAccessToken, signRefreshToken, verifyRefreshToken } from "@/Shared/auth";
import { hashPassword, hashToken, verifyPassword, verifyTokenHash } from "@/Shared/security";
import { IdentityRepository } from "@/Infrastructure/repositories/identityRepository";
import { writeAuditLog } from "@/Shared/audit";
import { env } from "@/Shared/env";

const identityRepo = new IdentityRepository();

export class IdentityService {
  async register(input: {
    tenantId?: string | null;
    fullName: string;
    phone: string;
    email?: string;
    password: string;
    roleCode?: string;
  }) {
    const existing = await identityRepo.findUserByPhone(input.phone);
    if (existing) {
      throw new AppError("این شماره موبایل قبلاً ثبت شده است", 409, "PHONE_EXISTS");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await identityRepo.createUser({
      tenantId: input.tenantId,
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      passwordHash,
    });

    const roleCode = input.roleCode ?? "customer";
    const role = await identityRepo.getRoleByCode(roleCode);
    if (role) {
      await identityRepo.assignRole(user.id, role.id);
    }

    await writeAuditLog({
      tenantId: user.tenantId,
      actorUserId: user.id,
      action: "user.register",
      resource: "user",
      resourceId: user.id,
      messageFa: `کاربر ${user.fullName} ثبت‌نام کرد`,
      metadata: { phone: user.phone },
    });

    return user;
  }

  async login(input: { phone: string; password: string; ipAddress?: string | null; userAgent?: string | null }) {
    const user = await identityRepo.findUserByPhone(input.phone);
    if (!user || !user.passwordHash) {
      throw new AppError("اطلاعات ورود نادرست است", 401, "INVALID_CREDENTIALS");
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      await identityRepo.addSecurityLog({
        userId: user.id,
        action: "login_failed",
        level: "warn",
        details: { reason: "invalid_password" },
      });
      throw new AppError("اطلاعات ورود نادرست است", 401, "INVALID_CREDENTIALS");
    }

    const expiresAt = addDays(new Date(), env.REFRESH_TOKEN_TTL_DAYS);
    const placeholderHash = await hashToken(`seed-${crypto.randomUUID()}`);
    const session = await identityRepo.createSession({
      userId: user.id,
      refreshTokenHash: placeholderHash,
      expiresAt,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    const accessPayload = await buildUserAccessPayload(user.id);
    const accessToken = await signAccessToken(accessPayload);
    const refreshToken = await signRefreshToken(user.id, session.id);
    const refreshTokenHash = await hashToken(refreshToken);

    await identityRepo.revokeSession(session.id);
    const activeSession = await identityRepo.createSession({
      userId: user.id,
      refreshTokenHash,
      expiresAt,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    await identityRepo.touchLastLogin(user.id);
    await identityRepo.addSecurityLog({
      userId: user.id,
      action: "login_success",
      details: { ipAddress: input.ipAddress, userAgent: input.userAgent },
    });

    await writeAuditLog({
      tenantId: user.tenantId,
      actorUserId: user.id,
      action: "user.login",
      resource: "session",
      resourceId: activeSession.id,
      messageFa: `کاربر ${user.fullName} وارد سیستم شد`,
    });

    return { accessToken, refreshToken, userId: user.id, tenantId: user.tenantId };
  }

  async refresh(refreshToken: string) {
    const parsed = await verifyRefreshToken(refreshToken).catch(() => {
      throw new AppError("رفرش توکن معتبر نیست", 401, "INVALID_REFRESH_TOKEN");
    });

    const session = await identityRepo.findSessionById(parsed.sid);
    if (!session || session.revokedAt || new Date(session.expiresAt) < new Date()) {
      throw new AppError("نشست معتبر نیست", 401, "SESSION_INVALID");
    }

    const ok = await verifyTokenHash(refreshToken, session.refreshTokenHash);
    if (!ok) {
      throw new AppError("رفرش توکن معتبر نیست", 401, "INVALID_REFRESH_TOKEN");
    }

    const payload = await buildUserAccessPayload(parsed.sub);
    const accessToken = await signAccessToken(payload);

    return { accessToken };
  }

  async logout(refreshToken: string) {
    const parsed = await verifyRefreshToken(refreshToken).catch(() => null);
    if (!parsed) {
      return { success: true };
    }

    await identityRepo.revokeSession(parsed.sid);

    await writeAuditLog({
      actorUserId: parsed.sub,
      action: "user.logout",
      resource: "session",
      resourceId: parsed.sid,
      messageFa: "کاربر از سیستم خارج شد",
    });

    return { success: true };
  }

  async me(userId: string) {
    const user = await identityRepo.findUserById(userId);
    if (!user) {
      throw new AppError("کاربر یافت نشد", 404, "USER_NOT_FOUND");
    }

    const roleCodes = await identityRepo.listRoleCodesByUserId(userId);

    return {
      id: user.id,
      tenantId: user.tenantId,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      status: user.status,
      roles: roleCodes,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async updateProfile(userId: string, payload: { fullName?: string; email?: string | null }) {
    const user = await identityRepo.updateUserProfile(userId, payload);
    if (!user) {
      throw new AppError("کاربر یافت نشد", 404, "USER_NOT_FOUND");
    }

    await writeAuditLog({
      tenantId: user.tenantId,
      actorUserId: user.id,
      action: "user.profile.update",
      resource: "user",
      resourceId: user.id,
      messageFa: `پروفایل کاربر ${user.fullName} به‌روزرسانی شد`,
    });

    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await identityRepo.findUserById(userId);
    if (!user?.passwordHash) {
      throw new AppError("کاربر یافت نشد", 404, "USER_NOT_FOUND");
    }

    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) {
      throw new AppError("رمز فعلی صحیح نیست", 422, "CURRENT_PASSWORD_INVALID");
    }

    const newHash = await hashPassword(newPassword);
    await identityRepo.updatePassword(userId, newHash);

    await writeAuditLog({
      tenantId: user.tenantId,
      actorUserId: user.id,
      action: "user.password.change",
      resource: "user",
      resourceId: user.id,
      messageFa: `رمز عبور کاربر ${user.fullName} تغییر کرد`,
    });

    return { success: true };
  }
}

export const identityService = new IdentityService();

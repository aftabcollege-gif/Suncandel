import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "audit:read");

    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const data = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.tenantId, auth.tenantId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(200);

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

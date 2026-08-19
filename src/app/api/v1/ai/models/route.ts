import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { aiModelRegistry } from "@/db/schema";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "audit:read");

    if (!auth.tenantId) throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");

    const data = await db
      .select()
      .from(aiModelRegistry)
      .where(and(eq(aiModelRegistry.tenantId, auth.tenantId)))
      .orderBy(desc(aiModelRegistry.createdAt));

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

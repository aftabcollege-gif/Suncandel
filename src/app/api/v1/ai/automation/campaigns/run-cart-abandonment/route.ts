import { aiCommerceService } from "@/Application/aiCommerceService";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "crm:manage");

    if (!auth.tenantId) throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");

    const data = await aiCommerceService.runCartAbandonmentAutomation({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

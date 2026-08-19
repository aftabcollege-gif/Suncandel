import { aiCommerceService } from "@/Application/aiCommerceService";
import { aiStoreScopedSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "inventory:manage");

    if (!auth.tenantId) throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");

    const body = await parseJson(req, aiStoreScopedSchema);
    const data = await aiCommerceService.vendorInventoryAssistant({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      storeId: body.storeId,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

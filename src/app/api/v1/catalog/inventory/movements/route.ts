import { catalogService } from "@/Application/catalogService";
import { inventoryAdjustSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const url = new URL(req.url);
    const variantId = url.searchParams.get("variantId");
    if (!variantId) {
      throw new AppError("variantId الزامی است", 422, "VARIANT_REQUIRED");
    }

    const data = await catalogService.inventoryHistory(auth.tenantId, variantId);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "inventory:manage");

    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const body = await parseJson(req, inventoryAdjustSchema);
    const data = await catalogService.adjustInventory({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      variantId: body.variantId,
      movementType: body.movementType,
      quantity: body.quantity,
      reason: body.reason,
      referenceType: body.referenceType,
      referenceId: body.referenceId,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

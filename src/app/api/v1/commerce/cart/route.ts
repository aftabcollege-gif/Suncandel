import { commerceService } from "@/Application/commerceService";
import { cartRemoveSchema, cartUpsertSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "cart:manage");

    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId");
    if (!storeId || !auth.tenantId) {
      throw new AppError("storeId و tenant الزامی است", 422, "INVALID_INPUT");
    }

    const data = await commerceService.getOrCreateCart({ tenantId: auth.tenantId, userId: auth.sub, storeId });
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "cart:manage");

    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const body = await parseJson(req, cartUpsertSchema);
    const data = await commerceService.addCartItem({
      tenantId: auth.tenantId,
      userId: auth.sub,
      storeId: body.storeId,
      variantId: body.variantId,
      quantity: body.quantity,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "cart:manage");

    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const body = await parseJson(req, cartRemoveSchema);
    const data = await commerceService.removeCartItem({
      tenantId: auth.tenantId,
      userId: auth.sub,
      storeId: body.storeId,
      variantId: body.variantId,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

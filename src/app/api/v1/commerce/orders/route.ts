import { commerceService } from "@/Application/commerceService";
import { createOrderSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "order:read_self");

    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const data = await commerceService.listOrders(auth.tenantId, auth.sub);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "order:create");

    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const body = await parseJson(req, createOrderSchema);
    const data = await commerceService.createOrder({
      tenantId: auth.tenantId,
      userId: auth.sub,
      storeId: body.storeId,
      shippingAddress: body.shippingAddress,
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

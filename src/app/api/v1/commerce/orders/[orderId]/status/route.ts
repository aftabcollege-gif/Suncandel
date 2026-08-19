import { commerceService } from "@/Application/commerceService";
import { updateOrderStatusSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

type Params = { params: Promise<{ orderId: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "order:update");

    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const { orderId } = await params;
    const body = await parseJson(req, updateOrderStatusSchema);

    const data = await commerceService.updateOrderStatus({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      orderId,
      nextStatus: body.nextStatus,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

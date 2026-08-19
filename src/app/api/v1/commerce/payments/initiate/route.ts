import { commerceService } from "@/Application/commerceService";
import { initiatePaymentSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "payment:manage");

    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const body = await parseJson(req, initiatePaymentSchema);
    const data = await commerceService.initiatePayment({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      orderId: body.orderId,
      gateway: body.gateway,
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

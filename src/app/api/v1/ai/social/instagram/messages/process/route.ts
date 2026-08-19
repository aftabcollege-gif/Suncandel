import { aiCommerceService } from "@/Application/aiCommerceService";
import { aiInstagramMessageSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "crm:write");

    if (!auth.tenantId) throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");

    const body = await parseJson(req, aiInstagramMessageSchema);
    const data = await aiCommerceService.processInstagramMessage({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      connectionId: body.connectionId,
      senderHandle: body.senderHandle,
      messageText: body.messageText,
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

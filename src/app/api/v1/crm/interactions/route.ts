import { crmService } from "@/Application/crmService";
import { createInteractionSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "crm:read");

    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const url = new URL(req.url);
    const customerId = url.searchParams.get("customerId") ?? undefined;

    const data = await crmService.listInteractions(auth.tenantId, customerId);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "crm:write");

    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const body = await parseJson(req, createInteractionSchema);
    const data = await crmService.createInteraction({
      tenantId: auth.tenantId,
      customerId: body.customerId,
      actorUserId: auth.sub,
      channel: body.channel,
      subject: body.subject,
      detail: body.detail,
      metadata: body.metadata,
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

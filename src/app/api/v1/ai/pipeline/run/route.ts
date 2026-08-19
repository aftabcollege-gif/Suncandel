import { aiCommerceService } from "@/Application/aiCommerceService";
import { aiPipelineSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "audit:read");

    if (!auth.tenantId) throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");

    const body = await parseJson(req, aiPipelineSchema);
    const data = await aiCommerceService.runPipeline({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      jobType: body.jobType,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

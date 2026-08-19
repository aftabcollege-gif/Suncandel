import { aiCommerceService } from "@/Application/aiCommerceService";
import { aiSearchSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (!auth.tenantId) throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");

    const body = await parseJson(req, aiSearchSchema);
    const data = await aiCommerceService.semanticSearch({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      query: body.query,
      filters: body.filters,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

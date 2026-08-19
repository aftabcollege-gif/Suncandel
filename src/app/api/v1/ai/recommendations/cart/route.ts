import { aiCommerceService } from "@/Application/aiCommerceService";
import { aiCartRecommendationSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (!auth.tenantId) throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");

    const body = await parseJson(req, aiCartRecommendationSchema);
    const data = await aiCommerceService.recommendForCart({ tenantId: auth.tenantId, variantIds: body.variantIds });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

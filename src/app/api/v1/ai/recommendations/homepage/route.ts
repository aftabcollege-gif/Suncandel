import { aiCommerceService } from "@/Application/aiCommerceService";
import { AppError } from "@/Shared/errors";
import { requireAuth } from "@/Shared/auth";
import { handleError, ok } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (!auth.tenantId) throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");

    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId") ?? undefined;

    const data = await aiCommerceService.recommendHomepage({
      tenantId: auth.tenantId,
      userId: auth.sub,
      storeId,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

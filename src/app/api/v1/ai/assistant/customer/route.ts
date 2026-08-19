import { aiCommerceService } from "@/Application/aiCommerceService";
import { aiCustomerAssistantSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    const tenantId = auth.tenantId;
    if (!tenantId) throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");

    const body = await parseJson(req, aiCustomerAssistantSchema);
    const data = await aiCommerceService.customerAssistant({
      tenantId,
      userId: auth.sub,
      query: body.query,
      storeId: body.storeId,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

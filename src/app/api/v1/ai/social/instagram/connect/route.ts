import { aiCommerceService } from "@/Application/aiCommerceService";
import { aiInstagramConnectSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "vendor:manage");

    if (!auth.tenantId) throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");

    const body = await parseJson(req, aiInstagramConnectSchema);
    const data = await aiCommerceService.connectInstagram({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      vendorId: body.vendorId,
      storeId: body.storeId,
      instagramBusinessId: body.instagramBusinessId,
      accessToken: body.accessToken,
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

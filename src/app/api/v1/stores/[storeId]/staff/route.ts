import { vendorService } from "@/Application/vendorService";
import { addStaffSchema } from "@/API/schemas";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";
import { resolveTenantId } from "@/Shared/tenant";

type Params = { params: Promise<{ storeId: string }> };

export async function GET(req: Request, { params }: Params) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "store:manage");

    const { storeId } = await params;
    const tenantId = auth.tenantId ?? (await resolveTenantId(req));
    if (!tenantId) {
      return Response.json(
        { success: false, error: { code: "TENANT_REQUIRED", message: "شناسه Tenant لازم است" } },
        { status: 422 }
      );
    }

    const data = await vendorService.listStaff(tenantId, storeId);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "store:manage");

    const { storeId } = await params;
    const tenantId = auth.tenantId ?? (await resolveTenantId(req));
    if (!tenantId) {
      return Response.json({ success: false, error: { code: "TENANT_REQUIRED", message: "شناسه Tenant لازم است" } }, { status: 422 });
    }

    const body = await parseJson(req, addStaffSchema);
    const data = await vendorService.addStaff({
      tenantId,
      actorUserId: auth.sub,
      storeId,
      userId: body.userId,
      roleCode: body.roleCode,
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

import { vendorService } from "@/Application/vendorService";
import { createVendorSchema } from "@/API/schemas";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";
import { resolveTenantId } from "@/Shared/tenant";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "vendor:manage");

    const tenantId = auth.tenantId ?? (await resolveTenantId(req));
    if (!tenantId) {
      return Response.json({ success: false, error: { code: "TENANT_REQUIRED", message: "شناسه Tenant لازم است" } }, { status: 422 });
    }

    const data = await vendorService.listVendors(tenantId);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "vendor:manage");

    const tenantId = auth.tenantId ?? (await resolveTenantId(req));
    if (!tenantId) {
      return Response.json({ success: false, error: { code: "TENANT_REQUIRED", message: "شناسه Tenant لازم است" } }, { status: 422 });
    }

    const body = await parseJson(req, createVendorSchema);
    const data = await vendorService.createVendor({
      tenantId,
      ownerUserId: auth.sub,
      legalName: body.legalName,
      nationalId: body.nationalId,
      businessInfo: body.businessInfo,
      financialInfo: body.financialInfo,
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

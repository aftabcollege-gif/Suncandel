import { customerService } from "@/Application/customerService";
import { activitySchema } from "@/API/schemas";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "crm:manage");

    if (!auth.tenantId) {
      return Response.json(
        { success: false, error: { code: "TENANT_REQUIRED", message: "شناسه Tenant لازم است" } },
        { status: 422 }
      );
    }

    const url = new URL(req.url);
    const customerId = url.searchParams.get("customerId") ?? undefined;

    const data = await customerService.listActivities(auth.tenantId, customerId);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);

    const body = await parseJson(req, activitySchema);
    const data = await customerService.trackActivity({
      userId: auth.sub,
      tenantId: auth.tenantId ?? undefined,
      type: body.type,
      meta: body.meta,
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

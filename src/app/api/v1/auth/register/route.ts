import { identityService } from "@/Application/identityService";
import { registerSchema } from "@/API/schemas";
import { handleError, ok, parseJson } from "@/Shared/http";
import { resolveTenantId } from "@/Shared/tenant";

export async function POST(req: Request) {
  try {
    const body = await parseJson(req, registerSchema);
    const tenantId = await resolveTenantId(req);

    const user = await identityService.register({
      tenantId,
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      password: body.password,
      roleCode: body.roleCode,
    });

    return ok({ id: user.id, tenantId: user.tenantId, fullName: user.fullName, phone: user.phone }, 201);
  } catch (error) {
    return handleError(error);
  }
}

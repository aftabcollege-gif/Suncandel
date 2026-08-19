import { customerService } from "@/Application/customerService";
import { customerAddressSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const body = await parseJson(req, customerAddressSchema);
    const data = await customerService.addAddress({
      userId: auth.sub,
      tenantId: auth.tenantId,
      province: body.province,
      city: body.city,
      line1: body.line1,
      postalCode: body.postalCode,
      isDefault: body.isDefault,
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

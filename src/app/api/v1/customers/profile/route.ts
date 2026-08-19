import { customerService } from "@/Application/customerService";
import { customerPreferencesSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const data = await customerService.getProfile(auth.sub, auth.tenantId);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (!auth.tenantId) {
      throw new AppError("tenant الزامی است", 422, "TENANT_REQUIRED");
    }

    const body = await parseJson(req, customerPreferencesSchema);
    const data = await customerService.updatePreferences({
      userId: auth.sub,
      tenantId: auth.tenantId,
      preferences: body.preferences,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

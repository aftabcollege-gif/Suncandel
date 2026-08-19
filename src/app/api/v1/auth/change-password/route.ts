import { identityService } from "@/Application/identityService";
import { changePasswordSchema } from "@/API/schemas";
import { handleError, ok, parseJson } from "@/Shared/http";
import { requireAuth } from "@/Shared/auth";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    const body = await parseJson(req, changePasswordSchema);
    const data = await identityService.changePassword(auth.sub, body.currentPassword, body.newPassword);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

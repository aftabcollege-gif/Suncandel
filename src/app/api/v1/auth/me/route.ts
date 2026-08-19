import { identityService } from "@/Application/identityService";
import { updateProfileSchema } from "@/API/schemas";
import { handleError, ok, parseJson } from "@/Shared/http";
import { requireAuth } from "@/Shared/auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    const me = await identityService.me(auth.sub);
    return ok(me);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAuth(req);
    const body = await parseJson(req, updateProfileSchema);
    const user = await identityService.updateProfile(auth.sub, body);
    return ok(user);
  } catch (error) {
    return handleError(error);
  }
}

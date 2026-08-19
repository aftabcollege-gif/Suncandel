import { identityService } from "@/Application/identityService";
import { logoutSchema } from "@/API/schemas";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const body = await parseJson(req, logoutSchema);
    const data = await identityService.logout(body.refreshToken);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

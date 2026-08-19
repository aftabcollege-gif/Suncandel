import { identityService } from "@/Application/identityService";
import { refreshSchema } from "@/API/schemas";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const body = await parseJson(req, refreshSchema);
    const data = await identityService.refresh(body.refreshToken);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

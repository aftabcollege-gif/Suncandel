import { identityService } from "@/Application/identityService";
import { loginSchema } from "@/API/schemas";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function POST(req: Request) {
  try {
    const body = await parseJson(req, loginSchema);

    const result = await identityService.login({
      phone: body.phone,
      password: body.password,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    });

    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}

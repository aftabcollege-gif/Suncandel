import { commerceService } from "@/Application/commerceService";
import { paymentCallbackSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { handleError, ok } from "@/Shared/http";
import { verifyPayloadSignature } from "@/Shared/webhook";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-callback-signature");
    if (!signature) {
      throw new AppError("امضای callback ارسال نشده است", 401, "MISSING_SIGNATURE");
    }

    const raw = await req.text();
    const validSignature = verifyPayloadSignature(raw, signature);
    if (!validSignature) {
      throw new AppError("امضای callback معتبر نیست", 401, "INVALID_SIGNATURE");
    }

    const json = JSON.parse(raw) as unknown;
    const parsed = paymentCallbackSchema.safeParse(json);
    if (!parsed.success) {
      throw new AppError("payload callback نامعتبر است", 422, "VALIDATION_ERROR", parsed.error.flatten());
    }

    const body = parsed.data;
    const data = await commerceService.paymentCallback({
      paymentId: body.paymentId,
      status: body.status,
      transactionRef: body.transactionRef,
      payload: body.payload,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

import { z } from "zod";
import { AppError, isAppError } from "@/Shared/errors";
import { appLog } from "@/Shared/logger";

export function ok<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function fail(message: string, status = 400, code = "BAD_REQUEST", details?: unknown) {
  return Response.json(
    {
      success: false,
      error: { code, message, details },
    },
    { status }
  );
}

export async function parseJson<T>(req: Request, schema: z.Schema<T>): Promise<T> {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new AppError("نوع محتوای درخواست باید JSON باشد", 415, "UNSUPPORTED_MEDIA_TYPE");
  }

  const contentLength = Number(req.headers.get("content-length") ?? "0");
  const maxBytes = 256 * 1024;
  if (contentLength > maxBytes) {
    throw new AppError("حجم درخواست بیش از حد مجاز است", 413, "PAYLOAD_TOO_LARGE", {
      maxBytes,
      receivedBytes: contentLength,
    });
  }

  const body = await req.json().catch(() => {
    throw new AppError("بدنه درخواست معتبر نیست", 400, "INVALID_JSON");
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new AppError("ورودی نامعتبر است", 422, "VALIDATION_ERROR", parsed.error.flatten());
  }

  return parsed.data;
}

export function handleError(error: unknown) {
  if (isAppError(error)) {
    appLog("warn", "Handled application error", {
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    });

    return fail(error.message, error.statusCode, error.code, error.details);
  }

  appLog("error", "Unhandled exception", {
    error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
  });

  return fail("خطای داخلی سرور", 500, "INTERNAL_SERVER_ERROR");
}

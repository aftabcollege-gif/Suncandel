import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/Shared/env";

export function signPayload(payload: string) {
  return createHmac("sha256", env.PAYMENT_CALLBACK_SECRET).update(payload).digest("hex");
}

export function verifyPayloadSignature(payload: string, receivedSignature: string) {
  const expected = signPayload(payload);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(receivedSignature, "utf8");

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

import { AppError } from "@/Shared/errors";

export const ORDER_TRANSITIONS: Record<string, string[]> = {
  created: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipping", "cancelled"],
  shipping: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function assertValidOrderTransition(current: string, next: string) {
  const allowed = ORDER_TRANSITIONS[current] ?? [];
  if (!allowed.includes(next)) {
    throw new AppError(
      `تغییر وضعیت سفارش از ${current} به ${next} مجاز نیست`,
      422,
      "INVALID_ORDER_TRANSITION"
    );
  }
}

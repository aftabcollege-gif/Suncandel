import { AppError } from "@/Shared/errors";

export function assertEnoughStock(available: number, requested: number, sku: string) {
  if (requested <= 0) {
    throw new AppError("تعداد انتخاب‌شده نامعتبر است", 422, "INVALID_QUANTITY");
  }

  if (available < requested) {
    throw new AppError(`موجودی SKU ${sku} کافی نیست`, 422, "INSUFFICIENT_STOCK");
  }
}

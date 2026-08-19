export function PriceTag({ price, discount }: { price: number; discount?: number }) {
  const hasDiscount = Boolean(discount && discount > 0);
  const finalPrice = hasDiscount ? price * (1 - (discount ?? 0) / 100) : price;

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold">{Math.round(finalPrice).toLocaleString("fa-IR")} تومان</span>
      {hasDiscount ? (
        <>
          <span className="text-sm text-muted line-through">{Math.round(price).toLocaleString("fa-IR")}</span>
          <span className="rounded-lg bg-[var(--color-error)]/15 px-2 py-1 text-xs text-[var(--color-error)]">
            {discount}%
          </span>
        </>
      ) : null}
    </div>
  );
}

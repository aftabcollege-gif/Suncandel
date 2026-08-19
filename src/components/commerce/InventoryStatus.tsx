export function InventoryStatus({ stock }: { stock: number }) {
  if (stock <= 0) {
    return <span className="rounded-lg bg-[var(--color-error)]/10 px-2 py-1 text-xs text-[var(--color-error)]">ناموجود</span>;
  }

  if (stock < 5) {
    return <span className="rounded-lg bg-[var(--color-warning)]/12 px-2 py-1 text-xs text-[var(--color-warning)]">موجودی محدود</span>;
  }

  return <span className="rounded-lg bg-[var(--color-success)]/12 px-2 py-1 text-xs text-[var(--color-success)]">موجود</span>;
}

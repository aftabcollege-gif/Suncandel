"use client";

import { useMemo, useState } from "react";
import { commerceService } from "@/services/commerce-service";
import { useApiAction } from "@/hooks/useApiAction";
import { useAuthStore } from "@/store/auth-store";

type CartItem = { id: string; title: string; price: number; qty: number; variantId: string; storeId: string };

const initialItems: CartItem[] = [
  { id: "c1", title: "شمع معطر", price: 329000, qty: 1, variantId: "00000000-0000-0000-0000-000000000001", storeId: "00000000-0000-0000-0000-000000000011" },
  { id: "c2", title: "پکیج جشن", price: 599000, qty: 2, variantId: "00000000-0000-0000-0000-000000000002", storeId: "00000000-0000-0000-0000-000000000011" },
];

export function CartClient() {
  const [items, setItems] = useState(initialItems);
  const { accessToken } = useAuthStore();
  const { execute, loading, error } = useApiAction(commerceService.removeFromCart);

  const total = useMemo(() => items.reduce((s, item) => s + item.price * item.qty, 0), [items]);

  const removeItem = async (item: CartItem) => {
    const previous = items;
    setItems((prev) => prev.filter((p) => p.id !== item.id));

    if (!accessToken) return;

    try {
      await execute({ storeId: item.storeId, variantId: item.variantId }, accessToken);
    } catch {
      setItems(previous);
    }
  };

  return (
    <section className="surface rounded-3xl p-5">
      <h2 className="mb-4 text-xl font-bold">سبد خرید</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] p-3">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted">{item.qty} × {item.price.toLocaleString("fa-IR")} تومان</p>
            </div>
            <button className="btn-ghost" onClick={() => removeItem(item)} disabled={loading}>حذف</button>
          </div>
        ))}
      </div>
      {error ? <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p> : null}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <span className="text-sm text-muted">جمع کل</span>
        <strong>{total.toLocaleString("fa-IR")} تومان</strong>
      </div>
    </section>
  );
}

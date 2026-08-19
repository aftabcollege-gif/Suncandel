"use client";

import { useStorefront } from "@/store/storefront-store";

export function StorefrontBanner() {
  const store = useStorefront();

  return (
    <section className="surface rounded-3xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted">Storefront Context</p>
          <h3 className="text-lg font-bold">{store.logoMark} • {store.nameFa}</h3>
          <p className="text-sm text-muted">{store.taglineFa}</p>
        </div>
        <div className="text-xs text-muted">
          <p>Store Code: {store.code}</p>
          <p>Default Theme: {store.defaultTheme}</p>
        </div>
      </div>
    </section>
  );
}

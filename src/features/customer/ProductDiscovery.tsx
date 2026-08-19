"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Input } from "@/components/forms/Fields";
import { candles } from "@/data/candles";

export function ProductDiscovery() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return candles;
    const q = query.toLowerCase();
    return candles.filter((p) => `${p.title} ${p.scent} ${p.notes}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <h1 className="display text-4xl text-[#f4f1ea] md:text-5xl">کالکشن شمع</h1>
      <p className="mt-3 max-w-[40ch] text-[#dce4dc]">جستجو بر اساس نام یا رایحه.</p>
      <div className="mt-8 max-w-xl">
        <label className="mb-2 block text-sm text-[#dce4dc]" htmlFor="candle-search">
          جستجو
        </label>
        <Input
          id="candle-search"
          placeholder="اسطوخودوس، عود، جشن"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <section className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}

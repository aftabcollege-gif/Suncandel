"use client";

import { useMemo, useState } from "react";
import { ProductCard, type ProductCardModel } from "@/components/commerce/ProductCard";
import { Input } from "@/components/forms/Fields";

const allProducts: ProductCardModel[] = [
  { id: "p1", title: "شمع لوکس طلایی", description: "شمع دست‌ساز مناسب مهمانی و هدیه", price: 420000, discountPercent: 10, stock: 12, rating: 5 },
  { id: "p2", title: "ست جشن تولد", description: "پکیج کامل جشن و تزئین", price: 790000, discountPercent: 5, stock: 7, rating: 4 },
  { id: "p3", title: "شمعدان برنز", description: "پایه فلزی برای شعله بلند", price: 330000, discountPercent: 0, stock: 3, rating: 4 },
  { id: "p4", title: "بسته‌بندی هدیه", description: "جعبه هدیه تیره با روبان طلایی", price: 149000, discountPercent: 0, stock: 22, rating: 5 },
];

export function ProductDiscovery() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return allProducts;
    const q = query.toLowerCase();
    return allProducts.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-10">
      <header>
        <p className="kicker">collection</p>
        <h1 className="display mt-3 text-4xl md:text-6xl">کالکشن شمع</h1>
        <div className="gold-rule my-8" />
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input placeholder="جستجوی شمع، رایحه، جشن..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="button" className="btn-primary">جستجو</button>
        </div>
      </header>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}

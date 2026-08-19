"use client";

import { useMemo, useState } from "react";
import { ProductCard, type ProductCardModel } from "@/components/commerce/ProductCard";
import { Input } from "@/components/forms/Fields";

const allProducts: ProductCardModel[] = [
  { id: "p1", title: "شمع لوکس طلایی", description: "شمع دست‌ساز مناسب مهمانی و هدیه", price: 420000, discountPercent: 10, stock: 12, rating: 5 },
  { id: "p2", title: "ست جشن تولد", description: "پکیج کامل جشن و تزئین", price: 790000, discountPercent: 5, stock: 7, rating: 4 },
  { id: "p3", title: "ابزار خامه‌کشی", description: "ابزار قنادی حرفه‌ای", price: 330000, discountPercent: 0, stock: 3, rating: 4 },
  { id: "p4", title: "بسته‌بندی هدیه", description: "جعبه هدیه پریمیوم", price: 149000, discountPercent: 0, stock: 22, rating: 5 },
];

export function ProductDiscovery() {
  const [query, setQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allProducts;
    const q = query.toLowerCase();
    return allProducts.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(q));
  }, [query]);

  const recommended = useMemo(() => allProducts.filter((p) => p.rating >= 5).slice(0, 2), []);
  const recentlyViewed = useMemo(() => allProducts.slice(1, 4), []);

  return (
    <div className="space-y-6">
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">Premium Product Discovery</h2>
        <p className="text-sm text-muted">جستجوی هوشمند، پیشنهادات و کشف سریع محصولات تخصصی</p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <Input placeholder="جستجو: شمع رمانتیک برای سالگرد..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn-secondary">Smart Search</button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold">نتایج محصولات</h3>
          <p className="text-sm text-muted">{filtered.length.toLocaleString("fa-IR")} مورد</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <div key={product.id} className="space-y-2">
              <ProductCard product={product} />
              <button
                className={wishlist.includes(product.id) ? "btn-primary w-full text-xs" : "btn-ghost w-full text-xs"}
                onClick={() =>
                  setWishlist((prev) =>
                    prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
                  )
                }
              >
                {wishlist.includes(product.id) ? "در Wishlist" : "افزودن به Wishlist"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="surface rounded-3xl p-4">
          <h4 className="font-bold">پیشنهاد برای شما</h4>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {recommended.map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
          </ul>
        </article>
        <article className="surface rounded-3xl p-4">
          <h4 className="font-bold">Recently Viewed</h4>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {recentlyViewed.map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { IwanHero } from "@/components/experience/IwanHero";
import { ChronicleScroll } from "@/components/experience/ChronicleScroll";

const products = [
  { id: "p1", title: "شمع اسطوخودوس", description: "موم طبیعی، شعله آرام شب", price: 329000, discountPercent: 12, stock: 18, rating: 5 },
  { id: "p2", title: "ست جشن طلایی", description: "شمع ستونی و بسته‌بندی کادویی", price: 599000, discountPercent: 0, stock: 4, rating: 4 },
  { id: "p3", title: "شمعدان برنز", description: "پایه فلزی برای سفره و یلدا", price: 749000, discountPercent: 8, stock: 6, rating: 4 },
];

export function HomeLanding() {
  return (
    <div>
      <IwanHero />
      <ChronicleScroll />

      <section className="container-main pb-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">collection</p>
            <h2 className="display mt-3 text-4xl md:text-5xl">کالکشن شمع</h2>
          </div>
          <Link href="/products" className="btn-primary">همه محصولات</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { IwanHero } from "@/components/experience/IwanHero";
import { ChronicleScroll } from "@/components/experience/ChronicleScroll";

const products = [
  { id: "p1", title: "شمع اسطوخودوس", description: "موم طبیعی برای شب آرام", price: 329000, discountPercent: 12, stock: 18, rating: 5 },
  { id: "p2", title: "ست جشن طلایی", description: "شمع ستونی و جعبه کادو", price: 599000, discountPercent: 0, stock: 4, rating: 4 },
  { id: "p3", title: "شمعدان برنز", description: "پایه فلزی برای سفره عقد", price: 749000, discountPercent: 8, stock: 6, rating: 4 },
];

export function HomeLanding() {
  return (
    <div>
      <IwanHero />
      <ChronicleScroll />
      <section className="bg-[#0a100d] py-20">
        <div className="container-main">
          <h2 className="display text-4xl text-[#f5f2e8] md:text-5xl">کالکشن شمع</h2>
          <p className="mt-3 max-w-[48ch] text-base leading-8 text-[#d7e0d6]">
            همان شمع‌هایی که در کارگاه می‌بینید، آماده ارسال هستند.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Link href="/products" className="btn-primary mt-10 inline-flex">
            همه محصولات
          </Link>
        </div>
      </section>
    </div>
  );
}

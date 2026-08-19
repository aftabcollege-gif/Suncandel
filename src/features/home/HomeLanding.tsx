import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { IwanHero } from "@/components/experience/IwanHero";
import { ChronicleScroll } from "@/components/experience/ChronicleScroll";
import { candles } from "@/data/candles";

export function HomeLanding() {
  return (
    <div>
      <IwanHero />
      <ChronicleScroll />
      <section className="bg-[#0c1210] py-20">
        <div className="container-main">
          <h2 className="display text-4xl text-[#f4f1ea] md:text-5xl">کالکشن</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {candles.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Link href="/products" className="btn-primary mt-12 inline-flex">
            همه شمع‌ها
          </Link>
        </div>
      </section>
    </div>
  );
}

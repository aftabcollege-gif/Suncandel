import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { IwanHero } from "@/components/experience/IwanHero";
import { ChronicleScroll } from "@/components/experience/ChronicleScroll";

const products = [
  {
    id: "p1",
    title: "شمع عطری اسطوخودوس",
    description: "موم طبیعی، شعله آرام، مناسب شب و هدیه",
    price: 329000,
    discountPercent: 12,
    stock: 18,
    rating: 5,
  },
  {
    id: "p2",
    title: "ست جشن طلایی SUN",
    description: "شمع ستونی، روبان و بسته‌بندی کادویی برای تولد",
    price: 599000,
    discountPercent: 0,
    stock: 4,
    rating: 4,
  },
  {
    id: "p3",
    title: "شمعدان کارگاه",
    description: "پایه برنزی برای شعله بلند سفره عقد و یلدا",
    price: 749000,
    discountPercent: 8,
    stock: 0,
    rating: 4,
  },
];

export function HomeLanding() {
  return (
    <div>
      <IwanHero />
      <ChronicleScroll />

      <section className="container-main pb-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">کالکشن</p>
            <h2 className="display mt-3 text-4xl">شمع‌هایی که باید روشن شوند</h2>
          </div>
          <Link href="/products" className="btn-secondary">
            همه محصولات
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-main mb-20 overflow-hidden border border-[var(--color-border)]">
        <div className="grid md:grid-cols-2">
          <div className="min-h-72 bg-cover bg-center" style={{ backgroundImage: "url('/heritage/atelier-candle.jpg')" }} />
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="kicker">فروشنده شو</p>
            <h2 className="display mt-3 text-3xl">اگر شمع می‌سازی، اینجا ویترین توست</h2>
            <p className="mt-3 text-sm text-muted">
              SUN بازار چندفروشندگی شمع و جشن است. کارگاه خودت را با همان زبان نور معرفی کن.
            </p>
            <Link href="/vendor/dashboard" className="btn-primary mt-6 w-fit">
              ورود فروشنده
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

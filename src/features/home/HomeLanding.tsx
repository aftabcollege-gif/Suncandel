import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { MegaMenu } from "@/components/navigation/MegaMenu";
import { ThemeShowcase } from "@/features/home/ThemeShowcase";
import { PremiumHeroExperience } from "@/components/experience/PremiumHeroExperience";
import { StorefrontBanner } from "@/features/home/StorefrontBanner";
import { BrandStorySection } from "@/features/home/BrandStorySection";
import { ConversionJourneySection } from "@/features/home/ConversionJourneySection";

const products = [
  {
    id: "p1",
    title: "شمع دست‌ساز عطری اسطوخودوس",
    description: "ساخته‌شده با موم طبیعی و رایحه آرامش‌بخش برای دکور و هدیه",
    price: 329000,
    discountPercent: 12,
    stock: 18,
    rating: 5,
  },
  {
    id: "p2",
    title: "پکیج تولد مینیمال طلایی",
    description: "ست کامل تزئین جشن با طراحی مدرن و بسته‌بندی کادویی",
    price: 599000,
    discountPercent: 0,
    stock: 4,
    rating: 4,
  },
  {
    id: "p3",
    title: "ابزار دکور کیک حرفه‌ای",
    description: "مناسب قنادان خانگی و حرفه‌ای با کیفیت صنعتی",
    price: 749000,
    discountPercent: 8,
    stock: 0,
    rating: 4,
  },
];

export function HomeLanding() {
  return (
    <div className="space-y-6">
      <section className="hero rounded-3xl p-8 md:p-10">
        <p className="inline-flex rounded-xl bg-[var(--color-primary)]/10 px-3 py-1 text-xs">
          Social Commerce • Multi Vendor • Multi Store • AI Commerce
        </p>
        <h2 className="mt-4 text-3xl font-bold md:text-4xl">تجربه خرید لوکس و تعاملی نسل جدید برای بازار ایران</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          SUN اکنون با موتور تجربه سه‌بعدی، داستان‌پردازی اسکرولی، پیشنهاد هوشمند و پنل‌های Enterprise
          برای فروشنده و ادمین، یک تجربه Premium در سطح برندهای جهانی ارائه می‌دهد.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/products" className="btn-primary">Explore Collection</Link>
          <Link href="/vendor/dashboard" className="btn-secondary">ورود به پنل فروشنده</Link>
        </div>
      </section>

      <StorefrontBanner />
      <PremiumHeroExperience />
      <BrandStorySection />
      <ConversionJourneySection />
      <ThemeShowcase />
      <MegaMenu />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">پیشنهادهای ویژه امروز</h2>
          <Link href="/products" className="text-sm text-muted underline">مشاهده همه</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

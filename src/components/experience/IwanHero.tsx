"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { IwanArch, ShamseMark } from "@/components/heritage/PersianMotifs";

const PalaceCourtyard = dynamic(
  () => import("@/components/experience/PalaceCourtyard").then((m) => m.PalaceCourtyard),
  {
    ssr: false,
    loading: () => <div className="h-full bg-[#140c08]" />,
  }
);

export function IwanHero() {
  return (
    <section className="iwan-frame relative min-h-[100svh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/heritage/iwan-night.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#140c08]/40 via-[#140c08]/35 to-[#140c08]" />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl items-center gap-8 px-4 py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="kicker">SUN · Candle Atelier</p>
          <div className="mt-5 flex items-center gap-3 text-[var(--color-primary)]">
            <ShamseMark className="h-10 w-10" />
            <span className="text-sm tracking-[0.32em]">خورشیدِ موم</span>
          </div>
          <h1 className="display mt-5 text-5xl text-[var(--color-ivory)] md:text-7xl">
            SUN؛ شمعی که مثل خورشید روشن می‌ماند
          </h1>
          <p className="mt-5 max-w-xl text-base text-[var(--color-muted-text)] md:text-lg">
            آتلیه شمع دست‌ساز و لوازم جشن. نقش شمسه ایرانی همان لوگوی نور ماست؛
            ایوان، قاب شعله است نه موزه. شمع را بچرخانید، داستان موم را اسکرول کنید، بعد بخرید.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">
              کالکشن شمع
            </Link>
            <Link href="#chronicle" className="btn-secondary">
              از موم تا شعله
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
          <IwanArch className="pointer-events-none absolute inset-0 z-10 text-[var(--color-primary)]" />
          <div className="absolute inset-[9%] overflow-hidden bg-black/50">
            <PalaceCourtyard />
          </div>
        </div>
      </div>
    </section>
  );
}

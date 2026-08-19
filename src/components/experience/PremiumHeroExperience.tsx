"use client";

import dynamic from "next/dynamic";

const Hero3DSlider = dynamic(
  () => import("@/components/experience/Hero3DSlider").then((m) => m.Hero3DSlider),
  {
    ssr: false,
    loading: () => (
      <section className="surface rounded-3xl p-8 text-center">
        <p className="text-sm text-muted">در حال بارگذاری تجربه سه‌بعدی...</p>
      </section>
    ),
  }
);

const ScrollStorytelling = dynamic(
  () => import("@/components/experience/ScrollStorytelling").then((m) => m.ScrollStorytelling),
  { ssr: false }
);

export function PremiumHeroExperience() {
  return (
    <div className="space-y-6">
      <Hero3DSlider />
      <ScrollStorytelling />
    </div>
  );
}

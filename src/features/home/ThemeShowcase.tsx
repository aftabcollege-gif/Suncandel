"use client";

import { useThemeEngine } from "@/hooks/useThemeEngine";

const notes: Record<string, string> = {
  minimalism: "لوکس و خلوت، مناسب برندهای پریمیوم",
  glassmorphism: "سطوح شیشه‌ای و شفاف با افکت blur",
  neomorphism: "کنترل‌های نرم با سایه داخلی و بیرونی",
  skeuomorphism: "الهام از متریال واقعی چرم/چوب/فلز",
  spatial: "عمق فضایی و لایه‌های معلق آینده‌نگر",
  "liquid-glass": "حرکت سیال، فرم‌های منعطف و تجربه پریمیوم",
};

export function ThemeShowcase() {
  const { theme, nextTheme, tokens } = useThemeEngine();

  return (
    <section className="surface rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">موتور چندتم SUN</h2>
          <p className="mt-1 text-sm text-muted">{notes[theme]}</p>
          <p className="mt-1 text-xs text-muted">
            Density: {tokens.layoutDensity} • Motion: {tokens.motionStyle} • Interaction: {tokens.interactionStyle}
          </p>
        </div>
        <button className="btn-primary" onClick={nextTheme}>تغییر تم بدون Refresh</button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="surface-soft rounded-2xl p-4">
          <p className="text-xs text-muted">Primary</p>
          <div className="mt-2 h-10 rounded-xl bg-[var(--color-primary)]" />
        </div>
        <div className="surface-soft rounded-2xl p-4">
          <p className="text-xs text-muted">Secondary</p>
          <div className="mt-2 h-10 rounded-xl bg-[var(--color-secondary)]" />
        </div>
        <div className="surface-soft rounded-2xl p-4">
          <p className="text-xs text-muted">Accent</p>
          <div className="mt-2 h-10 rounded-xl bg-[var(--color-accent)]" />
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import { useStorefront } from "@/store/storefront-store";

export function Header() {
  const { theme, setTheme, allThemes } = useThemeEngine();
  const storefront = useStorefront();

  return (
    <header className="surface sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="container-main flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-[var(--color-background)]">
            {storefront.logoMark}
          </span>
          <div>
            <p className="text-xs text-muted">{storefront.accentNote}</p>
            <h1 className="text-lg font-bold">{storefront.nameFa}</h1>
            <p className="text-xs text-muted">{storefront.taglineFa}</p>
          </div>
        </div>

        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/">خانه</Link>
          <Link href="/products">محصولات</Link>
          <Link href="/ai-lab">AI Lab</Link>
          <Link href="/vendor/dashboard">پنل فروشنده</Link>
          <Link href="/admin/dashboard">پنل ادمین</Link>
          <Link href="/faq">FAQ</Link>
        </nav>

        <div className="flex items-center gap-2">
          <label className="text-xs text-muted" htmlFor="theme-selector">
            تم
          </label>
          <select
            id="theme-selector"
            className="input-base min-w-36"
            value={theme}
            onChange={(e) => setTheme(e.target.value as keyof typeof allThemes)}
            aria-label="انتخاب تم"
          >
            {Object.values(allThemes).map((t) => (
              <option key={t.name} value={t.name}>
                {t.labelFa}
              </option>
            ))}
          </select>
          <Link className="btn-ghost text-xs" href="/login">
            ورود مشتری
          </Link>
          <Link className="btn-ghost text-xs" href="/vendor/login">
            ورود فروشنده
          </Link>
          <Link className="btn-ghost text-xs" href="/admin/login">
            ورود ادمین
          </Link>
        </div>
      </div>
    </header>
  );
}

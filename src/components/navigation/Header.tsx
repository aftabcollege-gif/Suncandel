"use client";

import Link from "next/link";
import { ShamseMark } from "@/components/heritage/PersianMotifs";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[#140c08]/80 backdrop-blur-md">
      <div className="container-main flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-[var(--color-primary)]">
          <ShamseMark className="h-9 w-9" />
          <span>
            <strong className="display block text-xl leading-none text-[var(--color-ivory)]">SUN</strong>
            <span className="text-[10px] tracking-[0.28em]">CANDLE ATELIER</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          <Link href="/products">شمع‌ها</Link>
          <Link href="/categories/celebration">جشن</Link>
          <Link href="/faq">راهنما</Link>
        </nav>

        <div className="flex items-center gap-2">
          <span className="flame hidden sm:block" aria-hidden="true" />
          <Link className="btn-ghost text-xs" href="/login">
            ورود
          </Link>
          <Link className="btn-secondary text-xs" href="/cart">
            سبد
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { ShamseMark } from "@/components/heritage/PersianMotifs";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[#050705]/85 backdrop-blur-md">
      <div className="container-main flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <ShamseMark className="h-8 w-8 text-[var(--color-primary)]" />
          <span className="display text-2xl leading-none">SUN</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/products">کالکشن</Link>
          <Link href="/#story">داستان</Link>
          <Link href="/faq">راهنما</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link className="btn-ghost text-xs" href="/login">ورود</Link>
          <Link className="btn-primary text-xs" href="/cart">سبد</Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#24332b] bg-[#0c1210]/92 backdrop-blur-md">
      <div className="container-main flex h-16 items-center justify-between">
        <Link href="/" className="display text-2xl tracking-wide">
          SUN
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/products">کالکشن</Link>
          <Link href="/#atelier">کارگاه</Link>
          <Link href="/faq">راهنما</Link>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/login">ورود</Link>
          <Link href="/cart" className="btn-primary !min-h-10 px-4 text-sm">
            سبد
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-background)] p-6">
      <section className="surface max-w-lg rounded-3xl p-8 text-center">
        <p className="text-sm text-[var(--color-error)]">خطای برنامه</p>
        <h1 className="mt-2 text-2xl font-bold">مشکلی رخ داد</h1>
        <p className="mt-2 text-sm text-muted">در صورت تکرار، با پشتیبانی SUN تماس بگیرید.</p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button className="btn-secondary" onClick={reset}>تلاش مجدد</button>
          <Link href="/" className="btn-primary">خانه</Link>
        </div>
      </section>
    </main>
  );
}

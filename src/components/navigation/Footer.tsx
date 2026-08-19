import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[#050705]">
      <div className="container-main grid gap-8 py-14 md:grid-cols-3">
        <div>
          <p className="display text-3xl">SUN</p>
          <p className="mt-3 max-w-xs text-sm text-muted">آتلیه شمع. مشکی، سبز تیره، طلا.</p>
        </div>
        <div>
          <p className="kicker">shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/products">کالکشن</Link></li>
            <li><Link href="/faq">پرسش‌ها</Link></li>
            <li><Link href="/vendor/login">فروشنده</Link></li>
          </ul>
        </div>
        <div>
          <p className="kicker">care</p>
          <p className="mt-4 text-sm text-muted">ارسال امن، شعله آزمایش‌شده، بسته‌بندی ضدشکست.</p>
        </div>
      </div>
    </footer>
  );
}

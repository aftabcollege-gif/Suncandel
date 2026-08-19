import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-black/30">
      <div className="container-main grid gap-8 py-12 md:grid-cols-3">
        <div>
          <h3 className="display text-2xl">SUN</h3>
          <p className="mt-2 text-sm text-muted">آتلیه شمع و بازار جشن. خورشید کوچک روی میز شما.</p>
        </div>
        <div>
          <h3 className="text-sm font-bold">فروشگاه</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            <li>
              <Link href="/products">کالکشن شمع</Link>
            </li>
            <li>
              <Link href="/faq">پرسش‌ها</Link>
            </li>
            <li>
              <Link href="/help-center">پشتیبانی</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold">نور امن</h3>
          <p className="mt-2 text-sm text-muted">پرداخت امن، ارسال با بسته‌بندی ضدشکست، شعله آزمایش‌شده.</p>
        </div>
      </div>
    </footer>
  );
}

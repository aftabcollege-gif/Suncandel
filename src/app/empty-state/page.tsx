import Link from "next/link";
import { AppShell } from "@/layouts/AppShell";

export default function EmptyStatePage() {
  return (
    <AppShell>
      <section className="surface rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-bold">هنوز داده‌ای برای نمایش نیست</h2>
        <p className="mt-2 text-sm text-muted">وقتی محصول یا سفارش جدید ثبت شود، این بخش تکمیل خواهد شد.</p>
        <Link href="/products" className="btn-primary mt-4 inline-flex">مشاهده محصولات</Link>
      </section>
    </AppShell>
  );
}

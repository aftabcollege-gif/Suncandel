import { AppShell } from "@/layouts/AppShell";

export default function HelpCenterPage() {
  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">مرکز راهنما</h2>
        <p className="mt-2 text-sm text-muted">راهنمای شروع، مدیریت حساب، پرداخت، بازگشت کالا و پشتیبانی فنی</p>
        <ul className="mt-4 list-disc space-y-2 pr-5 text-sm text-muted">
          <li>راهنمای شروع سریع مشتری</li>
          <li>راهنمای پنل فروشنده و مدیریت محصول</li>
          <li>راهنمای مدیریت سفارش و فاکتور</li>
          <li>سیاست‌های امنیت حساب و حریم خصوصی</li>
        </ul>
      </section>
    </AppShell>
  );
}

import { AppShell } from "@/layouts/AppShell";
import { Accordion } from "@/components/interaction/Interactive";

export default function FaqPage() {
  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">پرسش‌های متداول</h2>
        <div className="mt-4">
          <Accordion
            items={[
              { title: "چگونه از SUN خرید کنم؟", content: "محصول را به سبد اضافه کرده و فرآیند پرداخت را تکمیل کنید." },
              { title: "چطور فروشنده شوم؟", content: "در پنل Vendor ثبت‌نام و اطلاعات کسب‌وکار را تکمیل کنید." },
              { title: "ارسال سفارش چطور انجام می‌شود؟", content: "پس از تایید سفارش، کد رهگیری برای شما ارسال می‌گردد." },
            ]}
          />
        </div>
      </section>
    </AppShell>
  );
}

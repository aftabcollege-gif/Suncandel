"use client";

import { useState } from "react";
import { AppShell } from "@/layouts/AppShell";
import { Input } from "@/components/forms/Fields";

export default function CheckoutPage() {
  const [done, setDone] = useState(false);

  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">تسویه‌حساب</h2>
        <p className="text-sm text-muted">ثبت آدرس و تکمیل سفارش با پرداخت امن</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input placeholder="نام و نام خانوادگی" />
          <Input placeholder="شماره تماس" />
          <Input placeholder="استان" />
          <Input placeholder="شهر" />
          <Input className="md:col-span-2" placeholder="آدرس کامل" />
        </div>
        <button className="btn-primary mt-4" onClick={() => setDone(true)}>ثبت سفارش</button>
        {done ? <p className="mt-3 text-sm text-[var(--color-success)]">سفارش شما ثبت شد و در انتظار پرداخت است.</p> : null}
      </section>
    </AppShell>
  );
}

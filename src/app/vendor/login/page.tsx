"use client";

import { useState } from "react";
import { Input } from "@/components/forms/Fields";

export default function VendorLoginPage() {
  const [message, setMessage] = useState("");

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-background)] p-6">
      <section className="surface w-full max-w-md rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.08em] text-muted">Vendor Access</p>
        <h1 className="mt-2 text-2xl font-bold">ورود فروشنده</h1>
        <p className="mt-1 text-sm text-muted">دسترسی به فروش، سفارش‌ها، انبار و AI Copilot فروشگاه</p>
        <div className="mt-4 space-y-3">
          <Input placeholder="شماره موبایل" />
          <Input type="password" placeholder="رمز عبور" />
          <button className="btn-primary w-full" onClick={() => setMessage("در این نسخه، احراز هویت از API /login قابل استفاده است.")}>ورود فروشنده</button>
        </div>
        {message ? <p className="mt-3 text-xs text-muted">{message}</p> : null}
      </section>
    </main>
  );
}

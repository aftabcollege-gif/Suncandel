"use client";

import { useState } from "react";
import { AppShell } from "@/layouts/AppShell";
import { Input } from "@/components/forms/Fields";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export default function ProfilePage() {
  const { accessToken } = useAuthStore();
  const [info, setInfo] = useState<string>("برای دریافت پروفایل، ابتدا وارد شوید.");

  const load = async () => {
    if (!accessToken) {
      setInfo("توکن ورود موجود نیست.");
      return;
    }

    try {
      const data = await authService.me(accessToken);
      setInfo(JSON.stringify(data, null, 2));
    } catch (error) {
      setInfo(error instanceof Error ? error.message : "خطا");
    }
  };

  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">پروفایل مشتری</h2>
        <p className="mt-1 text-sm text-muted">مدیریت اطلاعات شخصی، آدرس‌ها و ترجیحات</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input placeholder="نام" />
          <Input placeholder="ایمیل" />
        </div>
        <button className="btn-secondary mt-4" onClick={load}>خواندن پروفایل از API</button>
        <pre className="mt-4 overflow-auto rounded-2xl border border-[var(--color-border)] p-3 text-xs">{info}</pre>
      </section>
    </AppShell>
  );
}

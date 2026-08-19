"use client";

import { useState } from "react";
import { AppShell } from "@/layouts/AppShell";
import { Input } from "@/components/forms/Fields";
import { authService } from "@/services/auth-service";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    setMessage(null);
    try {
      await authService.register({ fullName, phone, password });
      setMessage("ثبت‌نام با موفقیت انجام شد");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در ثبت‌نام");
    }
  };

  return (
    <AppShell>
      <section className="surface mx-auto w-full max-w-md rounded-3xl p-5">
        <h2 className="text-2xl font-bold">ایجاد حساب</h2>
        <div className="mt-4 space-y-3">
          <Input placeholder="نام و نام خانوادگی" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input placeholder="شماره موبایل" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input type="password" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn-primary w-full" onClick={submit}>ثبت‌نام</button>
          {message ? <p className="text-sm text-muted">{message}</p> : null}
        </div>
      </section>
    </AppShell>
  );
}

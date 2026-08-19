"use client";

import { useState } from "react";
import { AppShell } from "@/layouts/AppShell";
import { Input } from "@/components/forms/Fields";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await authService.login({ phone, password });
      setAuth(data);
      setMessage("ورود موفق انجام شد");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در ورود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <section className="surface mx-auto w-full max-w-md rounded-3xl p-5">
        <h2 className="text-2xl font-bold">ورود</h2>
        <div className="mt-4 space-y-3">
          <Input placeholder="موبایل یا نام کاربری" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input type="password" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn-primary w-full" disabled={loading} onClick={submit}>ورود به حساب</button>
          {message ? <p className="text-sm text-muted">{message}</p> : null}
        </div>
      </section>
    </AppShell>
  );
}

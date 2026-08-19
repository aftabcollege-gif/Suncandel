"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/forms/Fields";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await authService.login({ phone: login, password });
      setAuth(data);
      router.push("/admin/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "ورود ناموفق بود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-background)] p-6">
      <section className="surface w-full max-w-md rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.08em] text-muted">Admin Access</p>
        <h1 className="mt-2 text-2xl font-bold">ورود ادمین</h1>
        <div className="mt-4 space-y-3">
          <Input
            placeholder="نام کاربری یا موبایل"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-primary w-full" disabled={loading} onClick={submit}>
            ورود ادمین
          </button>
        </div>
        {message ? <p className="mt-3 text-xs text-muted">{message}</p> : null}
      </section>
    </main>
  );
}

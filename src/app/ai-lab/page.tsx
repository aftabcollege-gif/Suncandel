"use client";

import { useState } from "react";
import { AppShell } from "@/layouts/AppShell";
import { Input } from "@/components/forms/Fields";
import { aiService } from "@/services/ai-service";
import { useAuthStore } from "@/store/auth-store";

export default function AILabPage() {
  const { accessToken } = useAuthStore();
  const [query, setQuery] = useState("برای تولد دختر ۸ ساله چه شمعی پیشنهاد می‌کنی؟");
  const [answer, setAnswer] = useState<string>("-");
  const [results, setResults] = useState<Array<{ title: string; score: number; link: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const runAssistant = async () => {
    if (!accessToken) {
      setError("ابتدا از صفحه ورود، لاگین کنید.");
      return;
    }

    setError(null);
    try {
      const data = (await aiService.customerAssistant({ query }, accessToken)) as {
        answer: string;
        suggestions: Array<{ title: string; score: number; link: string }>;
      };
      setAnswer(data.answer);
      setResults(data.suggestions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در دستیار AI");
    }
  };

  const runSearch = async () => {
    if (!accessToken) {
      setError("ابتدا از صفحه ورود، لاگین کنید.");
      return;
    }

    setError(null);
    try {
      const data = (await aiService.search({ query }, accessToken)) as Array<{
        title: string;
        score: number;
        link: string;
      }>;
      setAnswer("نتایج جستجوی معنایی آماده شد.");
      setResults(data.slice(0, 5));
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در جستجوی AI");
    }
  };

  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">AI Lab — SUN Intelligence</h2>
        <p className="mt-1 text-sm text-muted">تجربه دستیار مشتری، جستجوی معنایی و پیشنهاد هوشمند</p>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="سوال یا کوئری خود را بنویسید" />
          <button className="btn-primary" onClick={runAssistant}>دستیار مشتری</button>
          <button className="btn-secondary" onClick={runSearch}>Semantic Search</button>
        </div>

        {error ? <p className="mt-3 text-sm text-[var(--color-error)]">{error}</p> : null}

        <div className="mt-5 rounded-2xl border border-[var(--color-border)] p-4">
          <h3 className="font-semibold">پاسخ AI</h3>
          <pre className="mt-2 whitespace-pre-wrap text-sm text-muted">{answer}</pre>
        </div>

        <div className="mt-4 space-y-2">
          {results.map((r) => (
            <div key={r.link} className="rounded-xl border border-[var(--color-border)] p-3 text-sm">
              <p className="font-medium">{r.title}</p>
              <p className="text-muted">امتیاز: {r.score.toFixed(3)}</p>
              <a className="underline" href={r.link}>مشاهده محصول</a>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

"use client";

import { useState } from "react";
import { AppShell } from "@/layouts/AppShell";
import { Input } from "@/components/forms/Fields";

export default function VendorAIAssistantPage() {
  const [prompt, setPrompt] = useState("برای محصول جدید من عنوان و توضیح سئو بنویس");
  const [output, setOutput] = useState("-\n");

  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">Vendor AI Assistant</h2>
        <p className="mt-1 text-sm text-muted">کمک به تولید محتوا، قیمت‌گذاری و تحلیل فروش</p>
        <div className="mt-4 flex gap-2">
          <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button className="btn-primary" onClick={() => setOutput(`AI Draft:\n${prompt}\n\nپیشنهاد شده برای نمایش در صفحه محصول.`)}>
            Generate
          </button>
        </div>
        <pre className="mt-4 rounded-2xl border border-[var(--color-border)] p-4 text-sm text-muted">{output}</pre>
      </section>
    </AppShell>
  );
}

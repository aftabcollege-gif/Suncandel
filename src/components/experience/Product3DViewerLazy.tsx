"use client";

import dynamic from "next/dynamic";

export const Product3DViewerLazy = dynamic(
  () => import("@/components/experience/Product3DViewer").then((m) => m.Product3DViewer),
  {
    ssr: false,
    loading: () => (
      <section className="surface rounded-3xl p-8 text-center">
        <p className="text-sm text-muted">در حال بارگذاری نمایشگر سه‌بعدی...</p>
      </section>
    ),
  }
);

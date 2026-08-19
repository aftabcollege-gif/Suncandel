"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    title: "Luxury Handmade DNA",
    desc: "از انتخاب مواد اولیه تا بسته‌بندی نهایی، هر محصول با استاندارد لوکس و کنترل کیفیت چندمرحله‌ای ارائه می‌شود.",
  },
  {
    title: "Trust & Secure Commerce",
    desc: "پرداخت امن، رهگیری سفارش، امتیاز کاربران و سیاست بازگشت شفاف برای افزایش اعتماد خرید.",
  },
  {
    title: "AI-Assisted Shopping",
    desc: "پیشنهاد هوشمند محصول، جستجوی معنایی فارسی و راهنمای خرید متناسب با مناسبت و بودجه مشتری.",
  },
];

export function BrandStorySection() {
  return (
    <section className="surface rounded-3xl p-6 md:p-8">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.08em] text-muted">Brand Story + Trust + Conversion</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">SUN فقط فروشگاه نیست؛ اکوسیستم برندهای تخصصی است</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((pillar, i) => (
          <motion.article
            key={pillar.title}
            className="surface-soft rounded-2xl p-4"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
          >
            <h3 className="text-base font-bold">{pillar.title}</h3>
            <p className="mt-2 text-sm text-muted">{pillar.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

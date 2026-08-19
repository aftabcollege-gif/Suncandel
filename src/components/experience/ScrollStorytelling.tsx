"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const storySteps = [
  { title: "مواد اولیه", detail: "پارافین طبیعی، رنگ‌های خوراکی و اسانس‌های استاندارد انتخاب می‌شوند." },
  { title: "ذوب پارافین", detail: "در دمای کنترل‌شده ذوب می‌شود تا شفافیت و بافت مطلوب ایجاد شود." },
  { title: "قالب‌گیری", detail: "ریختن دقیق پارافین در قالب‌های هنری برای ساخت فرم نهایی." },
  { title: "افزودن رنگ", detail: "با لایه‌بندی رنگی، جلوه بصری اختصاصی برای هر کالکشن ایجاد می‌گردد." },
  { title: "افزودن رایحه", detail: "رایحه‌های سفارشی برای تجربه احساسی و ماندگار ترکیب می‌شوند." },
  { title: "بسته‌بندی", detail: "بسته‌بندی لوکس و مناسب هدیه برای ارسال امن آماده می‌شود." },
  { title: "محصول نهایی", detail: "کنترل کیفیت نهایی و آماده‌سازی برای نمایش در فروشگاه." },
  { title: "خرید", detail: "کاربر با تجربه تعاملی، محصول را انتخاب و خرید را تکمیل می‌کند." },
];

export function ScrollStorytelling() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = gsap.utils.toArray<HTMLElement>(".story-card", root);
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0.2, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
          delay: index * 0.04,
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section ref={rootRef} className="surface rounded-3xl p-6 md:p-8">
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.08em] text-muted">Scroll Driven Storytelling</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">داستان خلق یک شمع لوکس</h2>
      </div>

      <div className="relative">
        <div className="story-line absolute right-4 top-0 h-full w-px bg-[var(--color-border)] md:right-1/2" />
        <div className="space-y-4">
          {storySteps.map((step, idx) => (
            <motion.article
              key={step.title}
              className="story-card surface-soft relative mr-0 rounded-2xl p-4 md:mr-0"
              initial={{ opacity: 0.5, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              <span className="story-index">{idx + 1}</span>
              <h3 className="text-base font-bold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

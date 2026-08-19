"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    sun: "طلوع",
    title: "خورشید، اسم ماست",
    text: "SUN از شمسه آمده؛ دایرهٔ نور ایرانی. هر شمع باید مثل یک خورشید کوچک روی میز بنشیند.",
    image: "/heritage/lotfollah-dome.jpg",
  },
  {
    sun: "موم",
    title: "کارگاه و بوی موم گرم",
    text: "موم طبیعی ذوب می‌شود، رایحه لایه می‌گیرد، فتیله در مرکز می‌ایستد. این بخش محصول است، نه دکور.",
    image: "/heritage/atelier-candle.jpg",
  },
  {
    sun: "ستون نور",
    title: "شعله در ایوان",
    text: "معماری فقط فانوس است: ستون‌های تخت‌جمشید مثل شمعدان، ایوان صفوی مثل قاب شعله.",
    image: "/heritage/persepolis-columns.jpg",
  },
  {
    sun: "جشن",
    title: "شب روشن می‌ماند",
    text: "تولد، عقد، شب یلدا، هدیه. SUN برای لحظه‌ای است که کسی کبریت می‌کشد و اتاق عوض می‌شود.",
    image: "/heritage/iwan-night.jpg",
  },
];

export function ChronicleScroll() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const cards = gsap.utils.toArray<HTMLElement>(".sun-chapter", el);
    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 28,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 86%" },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="chronicle" ref={root} className="container-main py-20">
      <p className="kicker">از موم تا شعله</p>
      <h2 className="display mt-4 max-w-3xl text-4xl md:text-5xl">داستان محصول SUN، نه تور معماری</h2>
      <p className="mt-3 max-w-2xl text-muted">
        اسکرول یعنی مسیر ساخت یک شمع: خورشید، موم، شعله، جشن.
      </p>
      <div className="mt-12 space-y-10">
        {chapters.map((chapter, index) => (
          <article
            key={chapter.title}
            className={`sun-chapter grid items-center gap-6 overflow-hidden border border-[var(--color-border)] bg-black/25 md:grid-cols-2 ${
              index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="relative min-h-64 bg-cover bg-center" style={{ backgroundImage: `url('${chapter.image}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-4 right-4 text-xs tracking-[0.28em] text-[var(--color-primary)]">
                {chapter.sun}
              </span>
            </div>
            <div className="p-6 md:p-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="flame" />
                <span className="text-xs text-muted">فصل {index + 1}</span>
              </div>
              <h3 className="display text-3xl">{chapter.title}</h3>
              <p className="mt-3 text-sm leading-8 text-muted">{chapter.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

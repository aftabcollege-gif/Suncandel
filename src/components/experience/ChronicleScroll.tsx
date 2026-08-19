"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: "01", title: "موم", text: "موم طبیعی ذوب می‌شود تا بافتی مخملی و سبز-طلایی بگیرد." },
  { n: "02", title: "فتیله", text: "مرکز دقیق؛ شعله باید صاف و بی‌دود بسوزد." },
  { n: "03", title: "شعله", text: "طلای SUN همان لحظه‌ای است که کبریت به فتیله می‌رسد." },
  { n: "04", title: "جشن", text: "سفره، هدیه، شب. شمع برای روشن کردن جمع است." },
];

export function ChronicleScroll() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".lux-step", {
        opacity: 0,
        y: 32,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={root} className="container-main py-24">
      <p className="kicker">process</p>
      <h2 className="display mt-4 text-4xl md:text-6xl">از موم تا شعله</h2>
      <div className="gold-rule my-10" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => (
          <motion.article key={step.n} className="lux-step border border-[var(--color-border)] bg-[#0b1410] p-6">
            <p className="text-xs tracking-[0.3em] text-[var(--color-primary)]">{step.n}</p>
            <h3 className="display mt-4 text-3xl">{step.title}</h3>
            <p className="mt-3 text-sm text-muted">{step.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

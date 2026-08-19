"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    title: "ذوب موم",
    text: "موم زنبور در دیگ مسی گرم می‌شود تا شفاف و طلایی شود.",
    image: "/heritage/stage-melt.jpg",
    alt: "ذوب موم طلایی در دیگ مسی",
  },
  {
    title: "ریختن در قالب",
    text: "موم مذاب در قالب‌های استوانه‌ای ریخته می‌شود تا بدنه شمع شکل بگیرد.",
    image: "/heritage/stage-pour.jpg",
    alt: "ریختن موم مذاب در قالب شمع",
  },
  {
    title: "رایحه",
    text: "روغن اسطوخودوس و رایحه جشن به موم گرم اضافه می‌شود.",
    image: "/heritage/stage-scent.jpg",
    alt: "افزودن روغن معطر به موم گرم",
  },
  {
    title: "شعله نهایی",
    text: "فتیله ثابت می‌شود، سطح صاف می‌شود، شمع آماده روشن شدن است.",
    image: "/heritage/stage-finish.jpg",
    alt: "شمع‌های آماده با شعله طلایی",
  },
];

export function ChronicleScroll() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="atelier" ref={wrap} className="relative overflow-hidden bg-[#0a100d]">
      <div ref={track} className="flex w-full flex-col md:h-[100dvh] md:flex-row md:items-stretch">
        {stages.map((stage) => (
          <article
            key={stage.title}
            className="relative min-h-[88vh] w-full shrink-0 md:h-full md:w-[88vw]"
          >
            <Image src={stage.image} alt={stage.alt} fill sizes="90vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050805] via-[#050805]/70 to-[#050805]/15" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
              <h2 className="display max-w-[16ch] text-4xl text-[#f5f2e8] md:text-6xl">{stage.title}</h2>
              <p className="mt-4 max-w-[42ch] text-base leading-8 text-[#e8eee6] md:text-lg">{stage.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

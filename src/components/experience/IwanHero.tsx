"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const PalaceCourtyard = dynamic(
  () => import("@/components/experience/PalaceCourtyard").then((m) => m.PalaceCourtyard),
  { ssr: false, loading: () => <div className="h-full bg-[#0a100d]" /> }
);

export function IwanHero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#0a100d]">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1280px] items-center gap-8 px-4 py-16 lg:grid-cols-[1fr_1.15fr] lg:py-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="display max-w-[14ch] text-4xl text-[#f5f2e8] md:text-6xl">
            شمع دست‌ساز SUN
          </h1>
          <p className="mt-5 max-w-[36ch] text-base leading-8 text-[#d7e0d6] md:text-lg">
            موم طبیعی، شعله طلایی، بسته‌بندی جشن. کارگاه را ببینید، بعد بخرید.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">
              کالکشن
            </Link>
            <Link href="#atelier" className="btn-secondary">
              مراحل ساخت
            </Link>
          </div>
        </motion.div>

        <div className="grid min-h-[52vh] grid-rows-2 gap-3 lg:min-h-[70vh]">
          <div className="relative overflow-hidden border border-[var(--color-border)] bg-[#07110c]">
            <PalaceCourtyard />
          </div>
          <div className="relative overflow-hidden border border-[var(--color-border)]">
            <Image
              src="/heritage/stage-finish.jpg"
              alt="سه شمع ستونی روشن روی سینی طلایی"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const PalaceCourtyard = dynamic(
  () => import("@/components/experience/PalaceCourtyard").then((m) => m.PalaceCourtyard),
  { ssr: false, loading: () => <div className="h-full bg-[#0c1210]" /> }
);

export function IwanHero() {
  const reduce = useReducedMotion();

  return (
    <section className="min-h-[100dvh] bg-[#0c1210]">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1120px] items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="display text-5xl text-[#f4f1ea] md:text-6xl">شمع SUN</h1>
          <p className="mt-5 max-w-[34ch] text-[1.05rem] leading-8 text-[#dce4dc]">
            موم طبیعی، رایحه مشخص، شعله آرام. ساخته‌شده در کارگاه، آماده روشن شدن.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">
              خرید شمع
            </Link>
            <Link href="#atelier" className="btn-secondary">
              ساخت در کارگاه
            </Link>
          </div>
        </motion.div>

        <div className="relative h-[52vh] min-h-[320px] lg:h-[68vh]">
          <PalaceCourtyard />
        </div>
      </div>
    </section>
  );
}

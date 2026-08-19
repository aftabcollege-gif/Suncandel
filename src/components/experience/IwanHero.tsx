"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShamseMark } from "@/components/heritage/PersianMotifs";

const PalaceCourtyard = dynamic(
  () => import("@/components/experience/PalaceCourtyard").then((m) => m.PalaceCourtyard),
  { ssr: false, loading: () => <div className="h-full bg-[#050705]" /> }
);

export function IwanHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#050705]">
      <div className="pointer-events-none absolute inset-0">
        <span className="ember" style={{ right: "18%", bottom: "22%", animationDelay: "0s" }} />
        <span className="ember" style={{ right: "28%", bottom: "18%", animationDelay: "2s" }} />
        <span className="ember" style={{ right: "38%", bottom: "26%", animationDelay: "3.4s" }} />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1180px] items-center gap-10 px-4 py-24 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="kicker">SUN candle house</p>
          <div className="mt-6 flex items-center gap-3 text-[var(--color-primary)]">
            <ShamseMark className="h-8 w-8" />
            <span className="text-xs tracking-[0.4em]">BLACK · EMERALD · GOLD</span>
          </div>
          <h1 className="display mt-6 text-5xl md:text-7xl">نورِ سیاه‌پوش</h1>
          <p className="mt-5 max-w-md text-base text-[var(--color-muted-text)]">
            آتلیه شمع SUN. مشکی برای شب، سبز تیره برای جنگل موم، طلا برای شعله.
            شمع سه‌بعدی را بچرخانید؛ بعد وارد کالکشن شوید.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">مشاهده کالکشن</Link>
            <Link href="#story" className="btn-secondary">داستان شعله</Link>
          </div>
        </motion.div>

        <motion.div
          className="relative h-[58vh] min-h-[360px] border border-[var(--color-border)] bg-[#070b08]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <PalaceCourtyard />
        </motion.div>
      </div>
    </section>
  );
}

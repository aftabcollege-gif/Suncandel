"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import type { Group } from "three";
import { useRef } from "react";

type Slide = {
  title: string;
  description: string;
  cta?: string;
  palette: [string, string, string];
};

const slides: Slide[] = [
  {
    title: "کارگاه شمع‌سازی SUN",
    description: "نمای سه‌بعدی از مرحله ذوب پارافین با حرکت آرام دوربین و نور محیطی لوکس.",
    palette: ["#f3dec5", "#c79d62", "#9c6a2d"],
  },
  {
    title: "قالب‌گیری دقیق",
    description: "پارافین مذاب در قالب‌های هنری با Depth و انتقال نرم بین صحنه‌ها.",
    palette: ["#f6efe6", "#d6ab6e", "#6f4a1e"],
  },
  {
    title: "رنگ و رایحه اختصاصی",
    description: "نمای نزدیک Texture و Material برای تجربه حسی محصول پیش از خرید.",
    palette: ["#f2e8ff", "#ad90ff", "#5d43bb"],
  },
  {
    title: "محصول نهایی پریمیوم",
    description: "چیدمان لوکس شمع روی میز با نور نرم و بازتاب ظریف.",
    palette: ["#fdf4e8", "#f2c581", "#8d5a1d"],
  },
  {
    title: "Explore Collection",
    description: "مجموعه کامل فروشندگان منتخب SUN را کشف کنید.",
    cta: "مشاهده کالکشن",
    palette: ["#ebf5ff", "#78b0ff", "#2b65bb"],
  },
];

function CandleCluster({ slideIndex }: { slideIndex: number }) {
  const groupRef = useRef<Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15 + slideIndex * 0.35;
  });

  const colors = slides[slideIndex].palette;

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[-1.4, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.65, 2.1, 48]} />
          <meshStandardMaterial color={colors[0]} roughness={0.18} metalness={0.12} />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.7}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.52, 0.68, 2.35, 48]} />
          <meshStandardMaterial color={colors[1]} roughness={0.15} metalness={0.2} />
        </mesh>
      </Float>
      <Float speed={2.4} rotationIntensity={0.45} floatIntensity={0.6}>
        <mesh position={[1.35, -0.05, 0]}>
          <cylinderGeometry args={[0.48, 0.62, 2.0, 48]} />
          <meshStandardMaterial color={colors[2]} roughness={0.24} metalness={0.17} />
        </mesh>
      </Float>
    </group>
  );
}

export function Hero3DSlider() {
  const [active, setActive] = useState(0);
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    setLightMode(mq.matches || reduce.matches);

    const onChange = () => setLightMode(mq.matches || reduce.matches);
    mq.addEventListener("change", onChange);
    reduce.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      reduce.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".hero-caption",
      { y: 20, opacity: 0.2 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" }
    );
  }, [active]);

  const current = useMemo(() => slides[active], [active]);

  return (
    <section className="hero-3d surface relative overflow-hidden rounded-3xl p-6 md:p-8">
      <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="hero-caption relative z-10">
          <p className="text-xs uppercase tracking-[0.08em] text-muted">VisionOS Grade Commerce Experience</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{current.title}</h2>
          <p className="mt-3 max-w-xl text-sm text-muted">{current.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={i === active ? "hero-dot active" : "hero-dot"}
                aria-label={`نمایش اسلاید ${i + 1}`}
              />
            ))}
          </div>
          <AnimatePresence>
            {current.cta ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="btn-primary mt-5"
              >
                {current.cta}
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="relative h-[360px] overflow-hidden rounded-3xl border border-[var(--color-border)] bg-black/10 md:h-[420px]">
          {lightMode ? (
            <div className="grid h-full place-items-center p-6 text-center">
              <div>
                <p className="text-sm text-muted">نسخه سبک برای دستگاه موبایل/کم‌قدرت فعال است.</p>
                <div className="mx-auto mt-4 h-40 w-40 rounded-full bg-gradient-to-tr from-[var(--color-secondary)]/40 to-[var(--color-accent)]/40 blur-2xl" />
              </div>
            </div>
          ) : (
            <Canvas camera={{ position: [0, 1.8, 5], fov: 45 }} dpr={[1, 1.5]}>
              <ambientLight intensity={0.55} />
              <directionalLight position={[2, 5, 2]} intensity={1.2} />
              <spotLight position={[-3, 4, 5]} intensity={0.95} angle={0.45} penumbra={0.8} />
              <CandleCluster slideIndex={active} />
              <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[3.6, 64]} />
                <meshStandardMaterial color="#fff5e6" roughness={0.8} metalness={0.02} />
              </mesh>
              <Environment preset="city" />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
            </Canvas>
          )}
        </div>
      </div>
    </section>
  );
}

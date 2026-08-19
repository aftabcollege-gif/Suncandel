"use client";

import { useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import type { Mesh } from "three";
import { useRef } from "react";

function CandleModel({ color, size }: { color: string; size: "small" | "medium" | "large" }) {
  const meshRef = useRef<Mesh>(null);
  const scale = useMemo(() => (size === "small" ? 0.8 : size === "large" ? 1.2 : 1), [size]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
  });

  return (
    <group scale={scale}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.72, 2.2, 64]} />
        <meshStandardMaterial color={color} roughness={0.17} metalness={0.22} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#ffb347" emissive="#ff9f2e" emissiveIntensity={1.1} />
      </mesh>
      <RoundedBox args={[2.8, 0.2, 2.8]} radius={0.08} position={[0, -1.2, 0]}>
        <meshStandardMaterial color="#f6efe8" roughness={0.9} metalness={0.05} />
      </RoundedBox>
    </group>
  );
}

export function Product3DViewer() {
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [color, setColor] = useState("#f4d9b6");

  return (
    <section className="surface rounded-3xl p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold">نمایشگر سه‌بعدی محصول</h3>
        <div className="flex gap-2">
          {(["small", "medium", "large"] as const).map((s) => (
            <button key={s} className={s === size ? "btn-primary text-xs" : "btn-ghost text-xs"} onClick={() => setSize(s)}>
              {s === "small" ? "کوچک" : s === "medium" ? "متوسط" : "بزرگ"}
            </button>
          ))}
          <input
            aria-label="انتخاب رنگ"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-xl border border-[var(--color-border)]"
          />
        </div>
      </div>

      <div className="h-[380px] rounded-2xl border border-[var(--color-border)] bg-gradient-to-tr from-white/20 to-[var(--color-secondary)]/10">
        <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 4, 3]} intensity={1.2} />
          <spotLight position={[-3, 4, 4]} intensity={0.8} />
          <CandleModel color={color} size={size} />
          <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
        </Canvas>
      </div>
    </section>
  );
}

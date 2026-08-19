"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import type { Group } from "three";

function Candle({
  x,
  z,
  h,
  color,
}: {
  x: number;
  z: number;
  h: number;
  color: string;
}) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.16, 0.2, h, 28]} />
        <meshStandardMaterial color={color} roughness={0.32} metalness={0.06} />
      </mesh>
      <mesh position={[0, h + 0.08, 0]}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshStandardMaterial color="#ffb347" emissive="#ff8a1a" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

function CandleCluster() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.16;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.28}>
      <group ref={group}>
        <Candle x={0} z={0} h={1.45} color="#f3d7a6" />
        <Candle x={-0.55} z={0.25} h={1.05} color="#e8c56b" />
        <Candle x={0.52} z={0.18} h={1.18} color="#f6e2b8" />
      </group>
    </Float>
  );
}

export function PalaceCourtyard() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 900px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      webgl = false;
    }
    setEnabled(!narrow && !reduce && webgl);
  }, []);

  if (!enabled) {
    return (
      <div className="grid h-full place-items-center bg-[url('/heritage/atelier-candle.jpg')] bg-cover bg-center">
        <div className="flex items-center gap-3 rounded-sm border border-[var(--color-border)] bg-black/45 px-4 py-3">
          <span className="flame" />
          <p className="text-sm text-[var(--color-ivory)]">شعله SUN — نسخه سبک</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 1.55, 3.8], fov: 46 }} dpr={[1, 1.5]}>
      <color attach="background" args={["#100805"]} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[2.4, 4.2, 2]} intensity={0.85} color="#ffe2a8" />
      <pointLight position={[0, 2.2, 0.4]} intensity={1.8} color="#ffb347" distance={6} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[3.4, 40]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.92} />
      </mesh>
      <CandleCluster />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.32} />
    </Canvas>
  );
}

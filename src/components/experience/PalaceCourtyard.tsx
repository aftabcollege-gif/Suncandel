"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";

function SingleCandle() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.08, 40]} />
        <meshStandardMaterial color="#2a332c" roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 1.7, 40]} />
        <meshStandardMaterial color="#efe0b8" roughness={0.38} />
      </mesh>
      <mesh position={[0, 1.86, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#fff4c8" emissive="#c9a227" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

export function PalaceCourtyard() {
  const [mode, setMode] = useState<"photo" | "3d">("photo");

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gl = false;
    try {
      const canvas = document.createElement("canvas");
      gl = Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      gl = false;
    }
    setMode(!mobile && !reduce && gl ? "3d" : "photo");
  }, []);

  if (mode === "photo") {
    return (
      <Image
        src="/heritage/stage-finish.jpg"
        alt="شمع‌های روشن SUN"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="object-cover"
      />
    );
  }

  return (
    <Canvas camera={{ position: [0, 1.35, 3.1], fov: 38 }} dpr={[1, 1.4]}>
      <color attach="background" args={["#0c1210"]} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[2.2, 3.4, 2]} intensity={0.85} color="#f0e2b0" />
      <pointLight position={[0, 2.1, 0.4]} intensity={1.4} color="#c9a227" distance={5} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.2, 48]} />
        <meshStandardMaterial color="#14241c" roughness={0.92} />
      </mesh>
      <SingleCandle />
    </Canvas>
  );
}

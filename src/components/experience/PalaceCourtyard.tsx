"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import type { Group } from "three";

function Candle({ x, z, h, wax }: { x: number; z: number; h: number; wax: string }) {
  return (
    <group position={[x, 0.12, z]}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.1, 32]} />
        <meshStandardMaterial color="#bfa14a" metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[0, h / 2 + 0.1, 0]}>
        <cylinderGeometry args={[0.15, 0.18, h, 36]} />
        <meshStandardMaterial color={wax} roughness={0.34} metalness={0.05} />
      </mesh>
      <mesh position={[0, h + 0.18, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffe29a" emissive="#d4af37" emissiveIntensity={2.2} />
      </mesh>
    </group>
  );
}

function Cluster() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
  });
  return (
    <Float speed={1.2} floatIntensity={0.22} rotationIntensity={0.08}>
      <group ref={ref}>
        <Candle x={0} z={0} h={1.55} wax="#f2e2b8" />
        <Candle x={-0.62} z={0.28} h={1.12} wax="#e7d39a" />
        <Candle x={0.58} z={0.22} h={1.28} wax="#f7ebc8" />
      </group>
    </Float>
  );
}

export function PalaceCourtyard() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gl = false;
    try {
      const c = document.createElement("canvas");
      gl = Boolean(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch {
      gl = false;
    }
    setOn(!mobile && !reduce && gl);
  }, []);

  if (!on) {
    return (
      <div className="grid h-full place-items-center bg-[#08110d]">
        <div className="flex items-center gap-3">
          <span className="flame" />
          <p className="text-sm text-[var(--color-primary)]">SUN</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 1.45, 3.6], fov: 42 }} dpr={[1, 1.5]}>
      <color attach="background" args={["#050705"]} />
      <fog attach="fog" args={["#050705", 4.5, 9]} />
      <ambientLight intensity={0.18} />
      <directionalLight position={[2, 4, 2]} intensity={0.7} color="#d4af37" />
      <pointLight position={[0, 2.1, 0.3]} intensity={2.1} color="#e6c56a" distance={7} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.8, 64]} />
        <meshStandardMaterial color="#102018" roughness={0.88} metalness={0.12} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.15, 1.22, 64]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.25} />
      </mesh>
      <Cluster />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.4} />
    </Canvas>
  );
}

// src/components/StudioPedestal.tsx
"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function StudioPedestal({ color = "#D4AF37" }: { color?: string }) {
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.1;
    if (ringRef2.current) ringRef2.current.rotation.z -= delta * 0.08;
  });

  return (
    <group position={[0, -1.25, 0]}>
      {/* 1. Brushed Obsidian Titanium Stage Base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.65, 0.1, 48]} />
        <meshStandardMaterial
          color="#0d0e14"
          metalness={0.92}
          roughness={0.25}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* 2. Outer Chamfer Gold Ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.42, 2.46, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Rotating Inner Millimeter Calibration Rings */}
      <mesh ref={ringRef1} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.75, 1.78, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ringRef2} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.12, 36]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* 4. Center Holographic Core Glow */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.85, 32]} />
        <meshBasicMaterial color="#0c1220" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

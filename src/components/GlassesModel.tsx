// src/components/GlassesModel.tsx
"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

export interface MaterialOption {
  id: string;
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  badge: string;
  lensTint: string;
}

export const FRAME_MATERIALS: MaterialOption[] = [
  { id: "gold", name: "24K Champagne Gold", color: "#D4AF37", metalness: 0.96, roughness: 0.14, badge: "Royal Titanium", lensTint: "#e0f2fe" },
  { id: "onyx", name: "Matte Onyx Black", color: "#16171B", metalness: 0.55, roughness: 0.35, badge: "Italian Acetate", lensTint: "#bae6fd" },
  { id: "rose", name: "Rose Gold Mirage", color: "#C5838C", metalness: 0.92, roughness: 0.18, badge: "Aerospace Alloy", lensTint: "#fce7f3" },
  { id: "silver", name: "Arctic Chrome", color: "#E8ECF2", metalness: 0.98, roughness: 0.08, badge: "Pure Platinum", lensTint: "#e0f2fe" },
  { id: "emerald", name: "Firozabad Emerald", color: "#0F5240", metalness: 0.72, roughness: 0.22, badge: "Heritage Glass", lensTint: "#d1fae5" },
];

export default function GlassesModel({
  materialId = "gold",
  scrollYProgress
}: {
  materialId?: string;
  scrollYProgress?: MotionValue<number> | React.MutableRefObject<number> | number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLensRef = useRef<THREE.Mesh>(null);
  const rightLensRef = useRef<THREE.Mesh>(null);

  const selectedMat = useMemo(
    () => FRAME_MATERIALS.find((m) => m.id === materialId) || FRAME_MATERIALS[0],
    [materialId]
  );

  // Ultra-Luxury PBR Frame Material
  const frameMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedMat.color),
      metalness: selectedMat.metalness,
      roughness: selectedMat.roughness,
      envMapIntensity: 2.8,
    });
  }, [selectedMat]);

  // Jewelry Accent Material for Micro-Pins & Screws
  const accentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#FFD700",
      metalness: 0.98,
      roughness: 0.1,
      envMapIntensity: 3.0,
    });
  }, []);

  // Optical Sapphire Crystal Glass Lens with Blue-Cut Anti-Glare Sheen
  const lensMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedMat.lensTint),
      transmission: 0.94,
      opacity: 0.92,
      transparent: true,
      roughness: 0.03,
      ior: 1.52,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      attenuationColor: new THREE.Color("#38bdf8"),
      attenuationDistance: 0.7,
    });
  }, [selectedMat]);

  // Interactive Mouse + Scroll 3D Dynamics
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Pointer-driven gentle rotation
    const mouseX = state.pointer.x * 0.45;
    const mouseY = state.pointer.y * 0.3;

    // Scroll progress read directly from motion value or ref without React re-render
    let scroll = 0;
    if (typeof scrollYProgress === "number") {
      scroll = scrollYProgress;
    } else if (scrollYProgress && "get" in scrollYProgress) {
      scroll = (scrollYProgress as MotionValue<number>).get();
    } else if (scrollYProgress && "current" in scrollYProgress) {
      scroll = (scrollYProgress as React.MutableRefObject<number>).current;
    }

    const scrollRotX = scroll * -0.6;
    const scrollRotY = scroll * 0.8;
    const scrollScale = 1.0 + scroll * 0.25;

    const targetRotX = -mouseY + scrollRotX;
    const targetRotY = mouseX + scrollRotY;
    const targetPosZ = scroll * 0.5;

    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4.5, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4.5, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetPosZ, 4.5, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, 1.45 * scrollScale, 4.5, delta));
  });

  return (
    <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.35} floatingRange={[-0.04, 0.04]}>
      <group ref={groupRef} position={[0, 0, 0]} scale={1.45}>
        {/* Left Rim (Rounded Architectural Wireframe) */}
        <mesh position={[-0.92, 0, 0]} material={frameMaterial} castShadow>
          <torusGeometry args={[0.7, 0.042, 20, 54]} />
        </mesh>
        {/* Left Lens */}
        <mesh ref={leftLensRef} position={[-0.92, 0, 0]} material={lensMaterial}>
          <cylinderGeometry args={[0.68, 0.68, 0.015, 36]} />
        </mesh>

        {/* Right Rim */}
        <mesh position={[0.92, 0, 0]} material={frameMaterial} castShadow>
          <torusGeometry args={[0.7, 0.042, 20, 54]} />
        </mesh>
        {/* Right Lens */}
        <mesh ref={rightLensRef} position={[0.92, 0, 0]} material={lensMaterial}>
          <cylinderGeometry args={[0.68, 0.68, 0.015, 36]} />
        </mesh>

        {/* Keyhole Nose Bridge (Upper Arch) */}
        <mesh position={[0, 0.28, 0.01]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
          <cylinderGeometry args={[0.034, 0.034, 0.44, 18]} />
        </mesh>

        {/* Bridge Lower Accent Bar */}
        <mesh position={[0, 0.12, 0]} rotation={[0, 0, Math.PI / 2]} material={accentMaterial}>
          <cylinderGeometry args={[0.02, 0.02, 0.38, 16]} />
        </mesh>

        {/* Left Endpiece & Temple */}
        <mesh position={[-1.65, 0.12, 0]} material={accentMaterial}>
          <sphereGeometry args={[0.065, 16, 16]} />
        </mesh>
        <mesh position={[-1.68, 0.12, -0.95]} rotation={[0, 0.16, 0]} material={frameMaterial} castShadow>
          <boxGeometry args={[0.038, 0.038, 1.9]} />
        </mesh>
        {/* Left Curved Ear Tip */}
        <mesh position={[-1.84, -0.06, -1.95]} rotation={[0.4, 0, 0]} material={frameMaterial}>
          <cylinderGeometry args={[0.035, 0.025, 0.45, 14]} />
        </mesh>

        {/* Right Endpiece & Temple */}
        <mesh position={[1.65, 0.12, 0]} material={accentMaterial}>
          <sphereGeometry args={[0.065, 16, 16]} />
        </mesh>
        <mesh position={[1.68, 0.12, -0.95]} rotation={[0, -0.16, 0]} material={frameMaterial} castShadow>
          <boxGeometry args={[0.038, 0.038, 1.9]} />
        </mesh>
        {/* Right Curved Ear Tip */}
        <mesh position={[1.84, -0.06, -1.95]} rotation={[0.4, 0, 0]} material={frameMaterial}>
          <cylinderGeometry args={[0.035, 0.025, 0.45, 14]} />
        </mesh>

        {/* Nose Pads */}
        <mesh position={[-0.26, -0.08, -0.12]} rotation={[0, 0.3, 0]} material={lensMaterial}>
          <capsuleGeometry args={[0.045, 0.12, 10, 14]} />
        </mesh>
        <mesh position={[0.26, -0.08, -0.12]} rotation={[0, -0.3, 0]} material={lensMaterial}>
          <capsuleGeometry args={[0.045, 0.12, 10, 14]} />
        </mesh>
      </group>
    </Float>
  );
}

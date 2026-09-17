"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";

export interface MaterialOption {
  id: string;
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  badge: string;
}

export const FRAME_MATERIALS: MaterialOption[] = [
  { id: "gold", name: "24K Champagne Gold", color: "#D4AF37", metalness: 0.94, roughness: 0.16, badge: "Royal Titanium" },
  { id: "onyx", name: "Matte Onyx Black", color: "#16171B", metalness: 0.45, roughness: 0.38, badge: "Italian Acetate" },
  { id: "rose", name: "Rose Gold Mirage", color: "#B76E79", metalness: 0.88, roughness: 0.22, badge: "Aerospace Alloy" },
  { id: "silver", name: "Arctic Chrome", color: "#E0E5EC", metalness: 0.96, roughness: 0.12, badge: "Pure Platinum" },
  { id: "emerald", name: "Firozabad Emerald", color: "#0F4C3A", metalness: 0.65, roughness: 0.25, badge: "Heritage Glass" },
];

export default function GlassesModel({ materialId = "gold" }: { materialId?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/glasses.glb");

  const selectedMat = useMemo(
    () => FRAME_MATERIALS.find((m) => m.id === materialId) || FRAME_MATERIALS[0],
    [materialId]
  );

  // Clone scene and dynamically apply chosen luxury material finishes
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();

          const name = (mesh.name || "").toLowerCase();
          if (name.includes("lens") || name.includes("glass")) {
            mat.transparent = true;
            mat.opacity = 0.84;
            mat.roughness = 0.04;
            mat.metalness = 0.15;
            mat.color = new THREE.Color("#0a1220");
            mat.envMapIntensity = 2.2;
          } else {
            mat.metalness = selectedMat.metalness;
            mat.roughness = selectedMat.roughness;
            mat.color = new THREE.Color(selectedMat.color);
            mat.envMapIntensity = 1.9;
          }
          mesh.material = mat;
        }
      }
    });

    return clone;
  }, [scene, selectedMat]);

  // Mouse Tracking with Linear Interpolation (lerp)
  useFrame((state) => {
    if (!groupRef.current) return;

    const targetX = -state.pointer.y * 0.42;
    const targetY = state.pointer.x * 0.72;
    const targetPosX = state.pointer.x * 0.25;
    const targetPosY = state.pointer.y * 0.18;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.05
    );
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetPosX,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetPosY,
      0.05
    );
  });

  return (
    <Float
      speed={2.2}
      rotationIntensity={0.35}
      floatIntensity={0.8}
      floatingRange={[-0.08, 0.08]}
    >
      <group ref={groupRef} scale={44} position={[0, 0, 0]}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

useGLTF.preload("/models/glasses.glb");

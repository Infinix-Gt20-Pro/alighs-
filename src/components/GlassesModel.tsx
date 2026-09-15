"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";

export default function GlassesModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/glasses.glb");

  // Clone scene and apply premium material finishes
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();

          // Check if mesh represents the lenses or frame
          const name = (mesh.name || "").toLowerCase();
          if (name.includes("lens") || name.includes("glass")) {
            mat.transparent = true;
            mat.opacity = 0.82;
            mat.roughness = 0.04;
            mat.metalness = 0.15;
            mat.color = new THREE.Color("#0c1322");
            mat.envMapIntensity = 2.0;
          } else {
            // Metallic titanium & hand-polished acetate frame finish
            mat.metalness = 0.88;
            mat.roughness = 0.22;
            mat.color = new THREE.Color("#1a1c23");
            mat.envMapIntensity = 1.6;
          }
          mesh.material = mat;
        }
      }
    });

    return clone;
  }, [scene]);

  // Mouse Tracking with Linear Interpolation (lerp)
  useFrame((state) => {
    if (!groupRef.current) return;

    // state.pointer has normalized coordinates between -1 and 1
    const targetX = -state.pointer.y * 0.42; // Tilt up/down
    const targetY = state.pointer.x * 0.72;  // Rotate left/right
    const targetPosX = state.pointer.x * 0.25; // Subtle parallax shift
    const targetPosY = state.pointer.y * 0.18;

    // Ultra-fluid linear interpolation
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
      speed={2.2}            // Continuous hovering animation speed
      rotationIntensity={0.35} // Gentle wobble
      floatIntensity={0.8}    // Vertical floating amplitude
      floatingRange={[-0.08, 0.08]}
    >
      <group ref={groupRef} scale={44} position={[0, 0, 0]}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

useGLTF.preload("/models/glasses.glb");

// src/components/GlassesHeroCanvas.tsx
"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import GlassesModel from "./GlassesModel";
import { useInViewFast } from "@/hooks/useInViewFast";
import * as THREE from "three";

function DynamicStudioRig({ scrollProgress }: { scrollProgress: number }) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(scrollProgress, 0, 1);

    // Camera cinematic path:
    // 0.0: Far center, majestic full view
    // 0.4: Close approach, shifting right to leave space for left specs
    // 0.8: Profile inspection angle with macro focus
    const startPos = new THREE.Vector3(0, 0.12, 4.4);
    const midPos = new THREE.Vector3(0.55, 0.08, 3.2);
    const endPos = new THREE.Vector3(1.1, 0.15, 2.7);

    let targetCamPos: THREE.Vector3;
    if (t < 0.5) {
      const p = t / 0.5;
      targetCamPos = startPos.clone().lerp(midPos, p);
    } else {
      const p = (t - 0.5) / 0.5;
      targetCamPos = midPos.clone().lerp(endPos, p);
    }

    state.camera.position.lerp(targetCamPos, 0.08);

    // Dynamic camera target
    const targetLook = new THREE.Vector3(
      THREE.MathUtils.lerp(0, -0.2, t),
      THREE.MathUtils.lerp(0.04, 0.06, t),
      0
    );
    state.camera.lookAt(targetLook);
    state.camera.updateProjectionMatrix();

    // Natural shifting lighting rig based on user scroll
    if (dirLightRef.current) {
      dirLightRef.current.position.x = THREE.MathUtils.lerp(4, -3, t);
      dirLightRef.current.position.y = THREE.MathUtils.lerp(6, 4.5, t);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(2.8, 3.4, t);
    }
    if (rimLightRef.current) {
      rimLightRef.current.position.x = THREE.MathUtils.lerp(-3, 3, t);
      rimLightRef.current.intensity = THREE.MathUtils.lerp(1.2, 2.0, t);
    }
  });

  return (
    <>
      {/* Studio Lighting with Shifting Warm Gold Highlights */}
      <ambientLight intensity={1.5} color="#FFF9E6" />
      <directionalLight
        ref={dirLightRef}
        position={[4, 6, 5]}
        intensity={2.8}
        color="#FFF2D6"
        castShadow
      />
      <directionalLight position={[-4, -2, -3]} intensity={1.0} color="#F7EFE1" />
      <pointLight position={[0, 3, 2.5]} intensity={1.2} color="#FFD875" />
      {/* Rim light defining the brushed metallic titanium edges */}
      <pointLight
        ref={rimLightRef}
        position={[-3, 1.2, -2.5]}
        intensity={1.4}
        color="#E2C485"
      />
    </>
  );
}

export default function GlassesHeroCanvas({
  materialId = "gold",
  scrollProgress = 0,
}: {
  materialId?: string;
  scrollProgress?: number;
  lightingTheme?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInViewFast(containerRef, "200px");

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ touchAction: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0.12, 4.4], fov: 34 }}
        frameloop={isInView ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1}
      >
        <DynamicStudioRig scrollProgress={scrollProgress} />

        <Suspense fallback={null}>
          <Environment preset="studio" />

          {/* Luxury 3D Eyewear Model with Scroll-Driven Rotation */}
          <GlassesModel
            materialId={materialId}
            viewAngle="orbit"
            autoRotate={false}
            scrollProgress={scrollProgress}
          />

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -0.62, 0]}
            opacity={0.36}
            scale={5.8}
            blur={2.4}
            far={2.5}
            color="#5C3D2E"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

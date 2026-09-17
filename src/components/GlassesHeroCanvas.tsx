// src/components/GlassesHeroCanvas.tsx
"use client";

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import GlassesModel, { FRAME_MATERIALS } from "./GlassesModel";
import { useInViewFast } from "@/hooks/useInViewFast";

export default function GlassesHeroCanvas({
  materialId = "gold",
  viewAngle = "orbit",
}: {
  materialId?: string;
  viewAngle?: "orbit" | "front" | "profile" | "macro";
  lightingTheme?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInViewFast(containerRef, "200px");

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: "pan-y" }}
    >
      <Canvas
        camera={{ position: [0, 0.25, 4.4], fov: 36 }}
        frameloop={isInView ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1}
      >
        {/* Soft, High-End Studio Photographic Lighting */}
        <ambientLight intensity={1.4} color="#f8fafc" />
        <directionalLight position={[4, 6, 5]} intensity={2.6} color="#fffbeb" />
        <directionalLight position={[-4, -1, -3]} intensity={1.4} color="#e0f2fe" />
        <pointLight position={[0, 2.8, 2]} intensity={1.0} color="#fef08a" />

        <Suspense fallback={null}>
          <Environment preset="studio" />

          {/* Slender, Physically-Proportioned Eyewear */}
          <GlassesModel materialId={materialId} viewAngle={viewAngle} autoRotate={viewAngle === "orbit"} />

          {/* Clean, Natural Soft Studio Drop Shadow (No cartoon pedestal) */}
          <ContactShadows
            position={[0, -0.65, 0]}
            opacity={0.48}
            scale={4.8}
            blur={2.0}
            far={2.2}
            color="#000000"
          />

          {/* Interactive 360 Drag Orbit Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 1.8}
            dampingFactor={0.06}
            enableDamping={true}
            rotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

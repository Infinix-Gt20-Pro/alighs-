// src/components/GlassesHeroCanvas.tsx
"use client";

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import GlassesModel, { FRAME_MATERIALS } from "./GlassesModel";
import StudioPedestal from "./StudioPedestal";
import { useInViewFast } from "@/hooks/useInViewFast";

export default function GlassesHeroCanvas({
  materialId = "gold",
  viewAngle = "orbit",
  lightingTheme = "obsidian",
}: {
  materialId?: string;
  viewAngle?: "orbit" | "front" | "profile" | "macro";
  lightingTheme?: "obsidian" | "champagne" | "cyber";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInViewFast(containerRef, "200px");

  const activeMat = FRAME_MATERIALS.find((m) => m.id === materialId) || FRAME_MATERIALS[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[420px] md:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none" style={{ touchAction: "pan-y" }}
    >
      <Canvas
        camera={{ position: [0, 0.35, 4.6], fov: 38 }}
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
        {/* Dynamic Studio Lighting Rig */}
        {lightingTheme === "champagne" ? (
          <>
            <ambientLight intensity={1.8} color="#fffbeb" />
            <directionalLight position={[6, 8, 6]} intensity={3.5} color="#fef08a" castShadow />
            <directionalLight position={[-6, -2, -4]} intensity={1.8} color="#fed7aa" />
            <pointLight position={[0, 4, 3]} intensity={2.2} color="#fbbf24" />
          </>
        ) : lightingTheme === "cyber" ? (
          <>
            <ambientLight intensity={1.5} color="#ecfeff" />
            <directionalLight position={[6, 8, 6]} intensity={3.2} color="#38bdf8" castShadow />
            <directionalLight position={[-6, -2, -4]} intensity={2.0} color="#a855f7" />
            <pointLight position={[0, 4, 3]} intensity={2.0} color="#06b6d4" />
          </>
        ) : (
          /* Default: Obsidian Luxury Studio */
          <>
            <ambientLight intensity={1.7} />
            <directionalLight position={[6, 8, 6]} intensity={3.4} castShadow />
            <directionalLight position={[-6, -3, -4]} intensity={1.8} color="#38bdf8" />
            <pointLight position={[0, 3, 3]} intensity={1.8} color="#fef08a" />
            <pointLight position={[0, -2, 2]} intensity={1.4} color="#06b6d4" />
          </>
        )}

        <Suspense fallback={null}>
          <Environment preset="city" />

          {/* Luxury Eyewear Model */}
          <GlassesModel materialId={materialId} viewAngle={viewAngle} autoRotate={viewAngle === "orbit"} />

          {/* Floating Titanium Studio Pedestal with Calibration Rings */}
          <StudioPedestal color={activeMat.color} />

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -1.24, 0]}
            opacity={0.7}
            scale={7.5}
            blur={2.5}
            far={4.5}
            color="#000000"
          />

          {/* Interactive 360 Drag Orbit Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 1.75}
            dampingFactor={0.06}
            enableDamping={true}
            rotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

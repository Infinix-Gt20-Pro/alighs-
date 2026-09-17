// src/components/GlassesHeroCanvas.tsx
"use client";

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import GlassesModel from "./GlassesModel";
import { useInViewFast } from "@/hooks/useInViewFast";

export default function GlassesHeroCanvas({
  materialId = "gold",
  scrollYProgress
}: {
  materialId?: string;
  scrollYProgress?: MotionValue<number> | React.MutableRefObject<number> | number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInViewFast(containerRef, "200px");

  return (
    <div ref={containerRef} className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 36 }}
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
        {/* Three-Point Studio Lighting */}
        <ambientLight intensity={1.8} />
        <directionalLight position={[6, 7, 6]} intensity={3.2} castShadow />
        <directionalLight position={[-6, -3, -4]} intensity={1.6} color="#38bdf8" />
        <pointLight position={[0, 3, 3]} intensity={1.8} color="#fef08a" />
        <pointLight position={[0, -3, 2]} intensity={1.2} color="#06b6d4" />

        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <GlassesModel materialId={materialId} scrollYProgress={scrollYProgress} />

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -1.05, 0]}
            opacity={0.65}
            scale={7.0}
            blur={2.4}
            far={4}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

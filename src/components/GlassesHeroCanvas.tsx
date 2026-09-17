// src/components/GlassesHeroCanvas.tsx
"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import GlassesModel from "./GlassesModel";

function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border border-amber-400/20 border-t-amber-400 animate-spin" />
    </div>
  );
}

export default function GlassesHeroCanvas({
  materialId = "gold",
  scrollYProgress = 0
}: {
  materialId?: string;
  scrollYProgress?: number;
}) {
  return (
    <div className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
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

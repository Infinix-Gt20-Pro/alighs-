"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, ContactShadows, Environment } from "@react-three/drei";
import GlassesModel from "./GlassesModel";

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

export default function GlassesHeroCanvas({ materialId = "gold" }: { materialId?: string }) {
  return (
    <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        {/* Cinematic Studio Lighting Setup */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 6]} intensity={2.8} castShadow />
        <directionalLight position={[-6, -2, -3]} intensity={1.5} color="#818cf8" />
        <pointLight position={[0, 4, 3]} intensity={2.2} color="#fef3c7" />
        <pointLight position={[0, -3, 2]} intensity={1.2} color="#38bdf8" />

        <Suspense fallback={<Loader />}>
          <Environment preset="city" />
          <Center top>
            <GlassesModel materialId={materialId} />
          </Center>

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -1.15, 0]}
            opacity={0.55}
            scale={7.5}
            blur={2.8}
            far={4}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

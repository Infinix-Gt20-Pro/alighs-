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

export default function GlassesHeroCanvas() {
  return (
    <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] flex items-center justify-center">
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
        <ambientLight intensity={1.4} />
        <directionalLight position={[5, 8, 6]} intensity={2.6} castShadow />
        <directionalLight position={[-6, -2, -3]} intensity={1.4} color="#818cf8" />
        <pointLight position={[0, 4, 3]} intensity={2.0} color="#e0e7ff" />
        <pointLight position={[0, -3, 2]} intensity={1.0} color="#c084fc" />

        <Suspense fallback={<Loader />}>
          <Environment preset="city" />
          <Center top>
            <GlassesModel />
          </Center>

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -1.15, 0]}
            opacity={0.5}
            scale={7}
            blur={2.6}
            far={4}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

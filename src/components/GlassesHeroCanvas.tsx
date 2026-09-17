// src/components/GlassesHeroCanvas.tsx
"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import GlassesModel from "./GlassesModel";
import * as THREE from "three";

function DynamicStudioRig({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = THREE.MathUtils.clamp(scrollProgress, 0, 1);
    const isMobile = state.size.width < 768;

    // Responsive Camera Setup for [GIANT 3D FRAME]:
    // Perfectly framed in center between headline and CTAs
    const targetZ = isMobile ? 4.9 : 4.3;
    const targetY = isMobile ? -0.05 : 0.0;
    state.camera.position.set(0, targetY, targetZ);
    state.camera.lookAt(0, isMobile ? -0.05 : 0.0, 0);

    // Natural shifting lighting rig based on scroll
    if (dirLightRef.current) {
      dirLightRef.current.position.x = THREE.MathUtils.lerp(4, -3, t);
      dirLightRef.current.position.y = THREE.MathUtils.lerp(6, 4.5, t);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(2.8, 3.4, t);
    }
    if (rimLightRef.current) {
      rimLightRef.current.position.x = THREE.MathUtils.lerp(-3, 3, t);
      rimLightRef.current.intensity = THREE.MathUtils.lerp(1.6, 2.4, t);
    }
  });

  return (
    <>
      {/* 100% Procedural Golden Atelier Lighting — No external network HDR needed */}
      <ambientLight intensity={1.8} color="#FFF9EF" />
      <directionalLight
        ref={dirLightRef}
        position={[4, 6, 5]}
        intensity={3.0}
        color="#FFFDF5"
      />
      <directionalLight position={[-4, 2, -3]} intensity={1.5} color="#E8D2A8" />
      <directionalLight position={[0, -4, 3]} intensity={0.8} color="#F4E9D5" />
      <pointLight position={[0, 4, 3]} intensity={1.8} color="#D4AF62" />
      {/* Golden rim light defining the brushed metallic titanium edges */}
      <pointLight
        ref={rimLightRef}
        position={[-3, 1.5, -2.5]}
        intensity={2.0}
        color="#B88A32"
      />
      <pointLight position={[3, -1.5, 2.5]} intensity={1.2} color="#FFF9EF" />
    </>
  );
}

export default function GlassesHeroCanvas({
  materialId = "gold",
  scrollProgress = 0,
  viewAngle = "orbit",
  interactive = true,
  dragOffset: externalDragOffset,
  onDragChange,
}: {
  materialId?: string;
  scrollProgress?: number;
  viewAngle?: "orbit" | "front" | "side" | "temple" | "hinge" | "lens";
  interactive?: boolean;
  dragOffset?: { x: number; y: number };
  onDragChange?: (offset: { x: number; y: number }) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalDrag, setInternalDrag] = React.useState({ x: 0, y: 0 });
  const isPointerDown = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const currentDrag = externalDragOffset || internalDrag;

  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDown.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    const newOffset = {
      x: Math.max(-1.2, Math.min(1.2, currentDrag.x + dy * 0.007)),
      y: currentDrag.y + dx * 0.007,
    };

    setInternalDrag(newOffset);
    if (onDragChange) {
      onDragChange(newOffset);
    }
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-full min-h-[380px] sm:min-h-[460px] md:min-h-[520px] transition-colors ${
        interactive ? "cursor-grab active:cursor-grabbing pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ touchAction: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0.0, 4.3], fov: 34 }}
        frameloop="always"
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
          {/* Luxury GIANT 3D Eyewear Model with Drag & Scroll Interpolation */}
          <GlassesModel
            materialId={materialId}
            viewAngle={viewAngle}
            autoRotate={false}
            scrollProgress={scrollProgress}
            dragOffset={currentDrag}
          />

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -0.72, 0]}
            opacity={0.42}
            scale={5.8}
            blur={2.4}
            far={2.5}
            color="#3C2415"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

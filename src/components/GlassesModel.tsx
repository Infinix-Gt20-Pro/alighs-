// src/components/GlassesModel.tsx
"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export interface MaterialOption {
  id: string;
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  badge: string;
  lensTint: string;
  accentColor?: string;
}

export const FRAME_MATERIALS: MaterialOption[] = [
  { id: "gold", name: "24K Champagne Gold", color: "#D4AF37", metalness: 0.96, roughness: 0.14, badge: "Royal Titanium", lensTint: "#e0f2fe", accentColor: "#FFE57F" },
  { id: "onyx", name: "Matte Onyx Black", color: "#16171B", metalness: 0.55, roughness: 0.35, badge: "Italian Acetate", lensTint: "#bae6fd", accentColor: "#D4AF37" },
  { id: "rose", name: "Rose Gold Mirage", color: "#C5838C", metalness: 0.92, roughness: 0.18, badge: "Aerospace Alloy", lensTint: "#fce7f3", accentColor: "#FFF0F5" },
  { id: "silver", name: "Arctic Chrome", color: "#E8ECF2", metalness: 0.98, roughness: 0.08, badge: "Pure Platinum", lensTint: "#e0f2fe", accentColor: "#38bdf8" },
  { id: "emerald", name: "Firozabad Emerald", color: "#0F5240", metalness: 0.72, roughness: 0.22, badge: "Heritage Glass", lensTint: "#d1fae5", accentColor: "#34D399" },
];

export default function GlassesModel({
  materialId = "gold",
  viewAngle = "orbit",
  autoRotate = true,
}: {
  materialId?: string;
  viewAngle?: "orbit" | "front" | "profile" | "macro";
  autoRotate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLensRef = useRef<THREE.Mesh>(null);
  const rightLensRef = useRef<THREE.Mesh>(null);

  const selectedMat = useMemo(
    () => FRAME_MATERIALS.find((m) => m.id === materialId) || FRAME_MATERIALS[0],
    [materialId]
  );

  // Ultra-Luxury PBR Materials
  const materials = useMemo(() => {
    // 1. Primary Frame Material
    const frame = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedMat.color),
      metalness: selectedMat.metalness,
      roughness: selectedMat.roughness,
      envMapIntensity: 2.8,
    });

    // 2. High-Polish Specular Chamfer Bevels
    const bevel = new THREE.MeshStandardMaterial({
      color: selectedMat.accentColor || "#FFD700",
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 3.2,
    });

    // 3. Jewelry Accent for Micro-Screws & Rivets
    const goldAccent = new THREE.MeshStandardMaterial({
      color: "#fbbf24",
      metalness: 0.98,
      roughness: 0.1,
      envMapIntensity: 3.0,
    });

    // 4. Optical Sapphire Crystal Lens with Blue-Cut Anti-Glare Sheen
    const lens = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedMat.lensTint),
      transmission: 0.95,
      opacity: 0.94,
      transparent: true,
      roughness: 0.02,
      ior: 1.54,
      reflectivity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      attenuationColor: new THREE.Color("#38bdf8"),
      attenuationDistance: 0.8,
    });

    // 5. Medical Silicone Nose Pads
    const silicone = new THREE.MeshPhysicalMaterial({
      color: "#f8fafc",
      transparent: true,
      opacity: 0.75,
      roughness: 0.3,
      transmission: 0.6,
      ior: 1.42,
    });

    // 6. Midnight Acetate Ear Tips
    const acetate = new THREE.MeshPhysicalMaterial({
      color: "#0a0d14",
      roughness: 0.1,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 2.0,
    });

    return { frame, bevel, goldAccent, lens, silicone, acetate };
  }, [selectedMat]);

  // Architectural Luxury Geometric Contours (Pantos Browline Profile)
  const { leftRimGeo, rightRimGeo, leftLensGeo, rightLensGeo } = useMemo(() => {
    const createPoints = (isLeft: boolean) => {
      const s = isLeft ? -1 : 1;
      return [
        new THREE.Vector3(s * 0.22, 0.58, 0.04),
        new THREE.Vector3(s * 0.72, 0.65, 0.01),
        new THREE.Vector3(s * 1.25, 0.54, -0.05),
        new THREE.Vector3(s * 1.46, 0.28, -0.11),
        new THREE.Vector3(s * 1.48, -0.08, -0.13),
        new THREE.Vector3(s * 1.32, -0.48, -0.09),
        new THREE.Vector3(s * 0.94, -0.74, -0.04),
        new THREE.Vector3(s * 0.48, -0.66, 0.01),
        new THREE.Vector3(s * 0.24, -0.34, 0.05),
        new THREE.Vector3(s * 0.18, 0.18, 0.06),
      ];
    };

    const leftCurve = new THREE.CatmullRomCurve3(createPoints(true), true, "centripetal");
    const rightCurve = new THREE.CatmullRomCurve3(createPoints(false), true, "centripetal");

    const leftRim = new THREE.TubeGeometry(leftCurve, 64, 0.038, 12, true);
    const rightRim = new THREE.TubeGeometry(rightCurve, 64, 0.038, 12, true);

    const createLensShape = (isLeft: boolean) => {
      const shape = new THREE.Shape();
      const pts = createPoints(isLeft);
      shape.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        shape.lineTo(pts[i].x, pts[i].y);
      }
      shape.closePath();
      return shape;
    };

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.03,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    };

    const leftLens = new THREE.ExtrudeGeometry(createLensShape(true), extrudeSettings);
    const rightLens = new THREE.ExtrudeGeometry(createLensShape(false), extrudeSettings);
    leftLens.translate(0, 0, -0.015);
    rightLens.translate(0, 0, -0.015);

    return { leftRimGeo: leftRim, rightRimGeo: rightRim, leftLensGeo: leftLens, rightLensGeo: rightLens };
  }, []);

  // Temples, Bridges & Hardware
  const {
    topBarGeo,
    keyholeBridgeGeo,
    leftTempleArmGeo,
    rightTempleArmGeo,
    leftEarSockGeo,
    rightEarSockGeo,
    leftPadArmGeo,
    rightPadArmGeo
  } = useMemo(() => {
    const topBarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.65, 0.63, 0.02),
      new THREE.Vector3(0.0, 0.66, 0.04),
      new THREE.Vector3(0.65, 0.63, 0.02),
    ]);

    const keyholeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.24, 0.12, 0.06),
      new THREE.Vector3(-0.16, 0.26, 0.08),
      new THREE.Vector3(0.0, 0.32, 0.09),
      new THREE.Vector3(0.16, 0.26, 0.08),
      new THREE.Vector3(0.24, 0.12, 0.06),
    ]);

    const leftTempleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.46, 0.28, -0.11),
      new THREE.Vector3(-1.48, 0.27, -0.6),
      new THREE.Vector3(-1.49, 0.25, -1.3),
      new THREE.Vector3(-1.50, 0.23, -2.0),
    ]);

    const rightTempleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.46, 0.28, -0.11),
      new THREE.Vector3(1.48, 0.27, -0.6),
      new THREE.Vector3(1.49, 0.25, -1.3),
      new THREE.Vector3(1.50, 0.23, -2.0),
    ]);

    const leftEarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.50, 0.23, -2.0),
      new THREE.Vector3(-1.51, 0.15, -2.4),
      new THREE.Vector3(-1.50, -0.12, -2.75),
      new THREE.Vector3(-1.48, -0.36, -2.95),
    ]);

    const rightEarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.50, 0.23, -2.0),
      new THREE.Vector3(1.51, 0.15, -2.4),
      new THREE.Vector3(1.50, -0.12, -2.75),
      new THREE.Vector3(1.48, -0.36, -2.95),
    ]);

    const leftArmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.20, -0.15, 0.05),
      new THREE.Vector3(-0.25, -0.26, 0.16),
      new THREE.Vector3(-0.28, -0.32, 0.25),
    ]);
    const rightArmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.20, -0.15, 0.05),
      new THREE.Vector3(0.25, -0.26, 0.16),
      new THREE.Vector3(0.28, -0.32, 0.25),
    ]);

    return {
      topBarGeo: new THREE.TubeGeometry(topBarCurve, 28, 0.034, 10, false),
      keyholeBridgeGeo: new THREE.TubeGeometry(keyholeCurve, 28, 0.036, 10, false),
      leftTempleArmGeo: new THREE.TubeGeometry(leftTempleCurve, 36, 0.034, 10, false),
      rightTempleArmGeo: new THREE.TubeGeometry(rightTempleCurve, 36, 0.034, 10, false),
      leftEarSockGeo: new THREE.TubeGeometry(leftEarCurve, 28, 0.052, 12, false),
      rightEarSockGeo: new THREE.TubeGeometry(rightEarCurve, 28, 0.052, 12, false),
      leftPadArmGeo: new THREE.TubeGeometry(leftArmCurve, 20, 0.02, 8, false),
      rightPadArmGeo: new THREE.TubeGeometry(rightArmCurve, 20, 0.02, 8, false),
    };
  }, []);

  // Studio Turntable Rotation & View Presets
  const targetRotation = useRef({ x: 0.08, y: -0.35, z: 0 });
  const targetPosition = useRef({ x: 0, y: 0.1, z: 0 });
  const targetScale = useRef(1.35);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (viewAngle === "front") {
      targetRotation.current = { x: 0.02, y: 0, z: 0 };
      targetPosition.current = { x: 0, y: 0.05, z: 0.2 };
      targetScale.current = 1.45;
    } else if (viewAngle === "profile") {
      targetRotation.current = { x: 0.12, y: -0.75, z: 0.04 };
      targetPosition.current = { x: 0.1, y: 0.08, z: 0.1 };
      targetScale.current = 1.42;
    } else if (viewAngle === "macro") {
      targetRotation.current = { x: 0.18, y: -1.35, z: 0.06 };
      targetPosition.current = { x: 0.6, y: 0.0, z: 0.8 };
      targetScale.current = 1.95;
    } else {
      // "orbit" mode: Gentle slow luxury turntable spin
      if (autoRotate) {
        groupRef.current.rotation.y += delta * 0.35;
      }
      const mouseX = state.pointer.x * 0.18;
      const mouseY = state.pointer.y * 0.12;
      targetRotation.current.x = 0.12 - mouseY;
      targetPosition.current = { x: 0, y: 0.08, z: 0 };
      targetScale.current = 1.38;
    }

    if (viewAngle !== "orbit") {
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotation.current.y, 4.0, delta);
    }
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotation.current.x, 4.0, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotation.current.z, 4.0, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosition.current.x, 4.0, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPosition.current.y, 4.0, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetPosition.current.z, 4.0, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale.current, 4.0, delta));
  });

  return (
    <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.25} floatingRange={[-0.03, 0.03]}>
      <group ref={groupRef} position={[0, 0.08, 0]} scale={1.38}>
        {/* Core Rims & Specular Bevels */}
        <mesh geometry={leftRimGeo} material={materials.frame} castShadow receiveShadow />
        <mesh geometry={rightRimGeo} material={materials.frame} castShadow receiveShadow />
        <mesh geometry={leftRimGeo} material={materials.bevel} scale={[0.985, 0.985, 0.985]} />
        <mesh geometry={rightRimGeo} material={materials.bevel} scale={[0.985, 0.985, 0.985]} />

        {/* Sapphire Crystal Lenses with Anti-Reflective Sheen */}
        <mesh ref={leftLensRef} geometry={leftLensGeo} material={materials.lens} />
        <mesh ref={rightLensRef} geometry={rightLensGeo} material={materials.lens} />

        {/* Double Architectural Brow Bar & Keyhole Bridge */}
        <mesh geometry={topBarGeo} material={materials.bevel} castShadow />
        <mesh geometry={keyholeBridgeGeo} material={materials.frame} castShadow />
        <mesh position={[0, 0.32, 0.09]} material={materials.goldAccent}>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>

        {/* 5-Barrel Precision Titanium Hinges with Gold Screws */}
        <group position={[-1.46, 0.28, -0.11]}>
          <mesh material={materials.bevel} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.16, 14]} />
          </mesh>
          <mesh position={[0, 0.09, 0]} material={materials.goldAccent}>
            <cylinderGeometry args={[0.038, 0.038, 0.03, 10]} />
          </mesh>
          <mesh position={[0, -0.09, 0]} material={materials.goldAccent}>
            <cylinderGeometry args={[0.038, 0.038, 0.03, 10]} />
          </mesh>
        </group>

        <group position={[1.46, 0.28, -0.11]}>
          <mesh material={materials.bevel} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.16, 14]} />
          </mesh>
          <mesh position={[0, 0.09, 0]} material={materials.goldAccent}>
            <cylinderGeometry args={[0.038, 0.038, 0.03, 10]} />
          </mesh>
          <mesh position={[0, -0.09, 0]} material={materials.goldAccent}>
            <cylinderGeometry args={[0.038, 0.038, 0.03, 10]} />
          </mesh>
        </group>

        {/* Temple Arms with Midnight Acetate Ear Socks */}
        <mesh geometry={leftTempleArmGeo} material={materials.frame} castShadow />
        <mesh geometry={rightTempleArmGeo} material={materials.frame} castShadow />
        <mesh geometry={leftEarSockGeo} material={materials.acetate} castShadow />
        <mesh geometry={rightEarSockGeo} material={materials.acetate} castShadow />

        {/* Gold Accent Joints on Temples */}
        <mesh position={[-1.50, 0.23, -2.0]} material={materials.goldAccent}>
          <cylinderGeometry args={[0.054, 0.054, 0.04, 14]} />
        </mesh>
        <mesh position={[1.50, 0.23, -2.0]} material={materials.goldAccent}>
          <cylinderGeometry args={[0.054, 0.054, 0.04, 14]} />
        </mesh>

        {/* Hypoallergenic Silicone Nose Pads on Titanium Goose-Necks */}
        <mesh geometry={leftPadArmGeo} material={materials.bevel} />
        <mesh geometry={rightPadArmGeo} material={materials.bevel} />
        <group position={[-0.28, -0.32, 0.25]} rotation={[0.25, -0.4, 0.2]}>
          <mesh material={materials.silicone}>
            <capsuleGeometry args={[0.055, 0.14, 8, 14]} />
          </mesh>
        </group>
        <group position={[0.28, -0.32, 0.25]} rotation={[0.25, 0.4, -0.2]}>
          <mesh material={materials.silicone}>
            <capsuleGeometry args={[0.055, 0.14, 8, 14]} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

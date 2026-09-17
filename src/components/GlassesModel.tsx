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
  {
    id: "gold",
    name: "24K Champagne Gold",
    color: "#C6A463",
    metalness: 0.98,
    roughness: 0.18,
    badge: "Beta Titanium",
    lensTint: "#f0f9ff",
    accentColor: "#E2C485"
  },
  {
    id: "onyx",
    name: "Matte Onyx Black",
    color: "#1E1F24",
    metalness: 0.7,
    roughness: 0.32,
    badge: "Italian Acetate",
    lensTint: "#e0f2fe",
    accentColor: "#C6A463"
  },
  {
    id: "rose",
    name: "Rose Gold Mirage",
    color: "#C99494",
    metalness: 0.95,
    roughness: 0.2,
    badge: "Aerospace Alloy",
    lensTint: "#fdf2f8",
    accentColor: "#E8BABA"
  },
  {
    id: "silver",
    name: "Arctic Chrome",
    color: "#DFE3EA",
    metalness: 0.99,
    roughness: 0.12,
    badge: "Pure Platinum",
    lensTint: "#f0f9ff",
    accentColor: "#FFFFFF"
  },
  {
    id: "emerald",
    name: "Firozabad Emerald",
    color: "#163E32",
    metalness: 0.8,
    roughness: 0.25,
    badge: "Heritage Edition",
    lensTint: "#ecfdf5",
    accentColor: "#C6A463"
  },
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

  // Physically-Accurate High-End Materials
  const materials = useMemo(() => {
    // 1. Primary Titanium Frame Wire
    const frame = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedMat.color),
      metalness: selectedMat.metalness,
      roughness: selectedMat.roughness,
      envMapIntensity: 1.6,
    });

    // 2. High-Polish Specular Chamfers
    const bevel = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedMat.accentColor || selectedMat.color),
      metalness: 0.99,
      roughness: 0.1,
      envMapIntensity: 2.0,
    });

    // 3. Micro Precision Screws & Core Hinges
    const screw = new THREE.MeshStandardMaterial({
      color: "#E5E7EB",
      metalness: 0.98,
      roughness: 0.15,
      envMapIntensity: 1.8,
    });

    // 4. Genuine Sapphire Crystal Lens with 420nm Blue-Cut Anti-Reflective Sheen
    const lens = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedMat.lensTint),
      transmission: 0.96,
      opacity: 0.98,
      transparent: true,
      roughness: 0.015,
      ior: 1.52,
      reflectivity: 0.65,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      attenuationColor: new THREE.Color("#38bdf8"),
      attenuationDistance: 0.9,
    });

    // 5. Translucent Medical Silicone Nose Pads
    const silicone = new THREE.MeshPhysicalMaterial({
      color: "#FFFFFF",
      transparent: true,
      opacity: 0.7,
      roughness: 0.25,
      transmission: 0.8,
      ior: 1.41,
    });

    // 6. Midnight Italian Acetate Temple Tips
    const acetate = new THREE.MeshPhysicalMaterial({
      color: "#0F1117",
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.4,
    });

    return { frame, bevel, screw, lens, silicone, acetate };
  }, [selectedMat]);

  // Slender, Ultra-Refined Eyewear Contours (Refined Pantos Profile)
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

    // Ultra-thin 0.0125 wire radius for true luxury realism
    const leftRim = new THREE.TubeGeometry(leftCurve, 128, 0.0125, 16, true);
    const rightRim = new THREE.TubeGeometry(rightCurve, 128, 0.0125, 16, true);

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
      depth: 0.005,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    };

    const leftLens = new THREE.ExtrudeGeometry(createLensShape(true), extrudeSettings);
    const rightLens = new THREE.ExtrudeGeometry(createLensShape(false), extrudeSettings);
    leftLens.translate(0, 0, -0.004);
    rightLens.translate(0, 0, -0.004);

    return { leftRimGeo: leftRim, rightRimGeo: rightRim, leftLensGeo: leftLens, rightLensGeo: rightLens };
  }, []);

  // Temples, Bridges & Hardware (Slender, physically proportionate)
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
      new THREE.Vector3(0.0, 0.65, 0.04),
      new THREE.Vector3(0.65, 0.63, 0.02),
    ]);

    const keyholeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.24, 0.12, 0.06),
      new THREE.Vector3(-0.16, 0.25, 0.08),
      new THREE.Vector3(0.0, 0.30, 0.085),
      new THREE.Vector3(0.16, 0.25, 0.08),
      new THREE.Vector3(0.24, 0.12, 0.06),
    ]);

    const leftTempleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.46, 0.28, -0.11),
      new THREE.Vector3(-1.48, 0.27, -0.6),
      new THREE.Vector3(-1.49, 0.25, -1.3),
      new THREE.Vector3(-1.50, 0.23, -1.95),
    ]);

    const rightTempleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.46, 0.28, -0.11),
      new THREE.Vector3(1.48, 0.27, -0.6),
      new THREE.Vector3(1.49, 0.25, -1.3),
      new THREE.Vector3(1.50, 0.23, -1.95),
    ]);

    const leftEarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.50, 0.23, -1.95),
      new THREE.Vector3(-1.51, 0.16, -2.35),
      new THREE.Vector3(-1.50, -0.10, -2.70),
      new THREE.Vector3(-1.48, -0.32, -2.90),
    ]);

    const rightEarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.50, 0.23, -1.95),
      new THREE.Vector3(1.51, 0.16, -2.35),
      new THREE.Vector3(1.50, -0.10, -2.70),
      new THREE.Vector3(1.48, -0.32, -2.90),
    ]);

    const leftArmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.20, -0.15, 0.05),
      new THREE.Vector3(-0.24, -0.24, 0.14),
      new THREE.Vector3(-0.26, -0.30, 0.22),
    ]);
    const rightArmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.20, -0.15, 0.05),
      new THREE.Vector3(0.24, -0.24, 0.14),
      new THREE.Vector3(0.26, -0.30, 0.22),
    ]);

    return {
      topBarGeo: new THREE.TubeGeometry(topBarCurve, 48, 0.009, 12, false),
      keyholeBridgeGeo: new THREE.TubeGeometry(keyholeCurve, 48, 0.011, 12, false),
      leftTempleArmGeo: new THREE.TubeGeometry(leftTempleCurve, 48, 0.0095, 12, false),
      rightTempleArmGeo: new THREE.TubeGeometry(rightTempleCurve, 48, 0.0095, 12, false),
      leftEarSockGeo: new THREE.TubeGeometry(leftEarCurve, 36, 0.016, 14, false),
      rightEarSockGeo: new THREE.TubeGeometry(rightEarCurve, 36, 0.016, 14, false),
      leftPadArmGeo: new THREE.TubeGeometry(leftArmCurve, 24, 0.0055, 8, false),
      rightPadArmGeo: new THREE.TubeGeometry(rightArmCurve, 24, 0.0055, 8, false),
    };
  }, []);

  // Studio Turntable Rotation & View Presets
  const targetRotation = useRef({ x: 0.05, y: -0.25, z: 0 });
  const targetPosition = useRef({ x: 0, y: 0.05, z: 0 });
  const targetScale = useRef(1.42);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (viewAngle === "front") {
      targetRotation.current = { x: 0.0, y: 0, z: 0 };
      targetPosition.current = { x: 0, y: 0.02, z: 0.1 };
      targetScale.current = 1.48;
    } else if (viewAngle === "profile") {
      targetRotation.current = { x: 0.08, y: -0.75, z: 0.02 };
      targetPosition.current = { x: 0.05, y: 0.05, z: 0.05 };
      targetScale.current = 1.44;
    } else if (viewAngle === "macro") {
      targetRotation.current = { x: 0.12, y: -1.2, z: 0.04 };
      targetPosition.current = { x: 0.5, y: 0.0, z: 0.7 };
      targetScale.current = 1.95;
    } else {
      // orbit mode: Gentle slow luxury turntable spin
      if (autoRotate) {
        groupRef.current.rotation.y += delta * 0.28;
      }
      const mouseX = state.pointer.x * 0.14;
      const mouseY = state.pointer.y * 0.08;
      targetRotation.current.x = 0.06 - mouseY;
      targetPosition.current = { x: 0, y: 0.05, z: 0 };
      targetScale.current = 1.42;
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
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15} floatingRange={[-0.02, 0.02]}>
      <group ref={groupRef} position={[0, 0.05, 0]} scale={1.42}>
        {/* Slender Titanium Wire Rims */}
        <mesh geometry={leftRimGeo} material={materials.frame} castShadow receiveShadow />
        <mesh geometry={rightRimGeo} material={materials.frame} castShadow receiveShadow />

        {/* Optical Sapphire Crystal Lenses */}
        <mesh ref={leftLensRef} geometry={leftLensGeo} material={materials.lens} />
        <mesh ref={rightLensRef} geometry={rightLensGeo} material={materials.lens} />

        {/* Clean Double Bridge */}
        <mesh geometry={topBarGeo} material={materials.bevel} castShadow />
        <mesh geometry={keyholeBridgeGeo} material={materials.frame} castShadow />

        {/* Precision Micro Hinges */}
        <group position={[-1.46, 0.28, -0.11]}>
          <mesh material={materials.frame} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.07, 14]} />
          </mesh>
          <mesh position={[0, 0.04, 0]} material={materials.screw}>
            <cylinderGeometry args={[0.014, 0.014, 0.012, 10]} />
          </mesh>
        </group>

        <group position={[1.46, 0.28, -0.11]}>
          <mesh material={materials.frame} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.07, 14]} />
          </mesh>
          <mesh position={[0, 0.04, 0]} material={materials.screw}>
            <cylinderGeometry args={[0.014, 0.014, 0.012, 10]} />
          </mesh>
        </group>

        {/* Slender Temple Arms & Midnight Acetate Tips */}
        <mesh geometry={leftTempleArmGeo} material={materials.frame} castShadow />
        <mesh geometry={rightTempleArmGeo} material={materials.frame} castShadow />
        <mesh geometry={leftEarSockGeo} material={materials.acetate} castShadow />
        <mesh geometry={rightEarSockGeo} material={materials.acetate} castShadow />

        {/* Discreet Silicone Nose Pads on Goose-Necks */}
        <mesh geometry={leftPadArmGeo} material={materials.bevel} />
        <mesh geometry={rightPadArmGeo} material={materials.bevel} />
        <group position={[-0.26, -0.30, 0.22]} rotation={[0.3, -0.35, 0.15]}>
          <mesh material={materials.silicone}>
            <cylinderGeometry args={[0.035, 0.035, 0.012, 16]} />
          </mesh>
          <mesh position={[0, 0, -0.006]} material={materials.frame}>
            <cylinderGeometry args={[0.018, 0.018, 0.005, 12]} />
          </mesh>
        </group>
        <group position={[0.26, -0.30, 0.22]} rotation={[0.3, 0.35, -0.15]}>
          <mesh material={materials.silicone}>
            <cylinderGeometry args={[0.035, 0.035, 0.012, 16]} />
          </mesh>
          <mesh position={[0, 0, -0.006]} material={materials.frame}>
            <cylinderGeometry args={[0.018, 0.018, 0.005, 12]} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

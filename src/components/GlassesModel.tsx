"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useDeviceTier } from "@/hooks/useDeviceTier";

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
    color: "#B88A32",
    metalness: 0.98,
    roughness: 0.12,
    badge: "BETA TITANIUM",
    lensTint: "#EAF6FF",
    accentColor: "#D4AF62",
  },
  {
    id: "onyx",
    name: "Matte Onyx Black",
    color: "#1E1F24",
    metalness: 0.85,
    roughness: 0.28,
    badge: "MAZZUCCHELLI ACETATE",
    lensTint: "#DDE9F8",
    accentColor: "#B88A32",
  },
  {
    id: "rose",
    name: "Rose Gold Mirage",
    color: "#C99494",
    metalness: 0.96,
    roughness: 0.14,
    badge: "TENSILE ALLOY",
    lensTint: "#FFF5EE",
    accentColor: "#E2B8B8",
  },
  {
    id: "silver",
    name: "Arctic Chrome",
    color: "#DFE3EA",
    metalness: 0.99,
    roughness: 0.08,
    badge: "MONOBLOC TITANIUM",
    lensTint: "#EBF3FA",
    accentColor: "#FFFFFF",
  },
];

export default function GlassesModel({
  materialId = "gold",
  viewAngle = "orbit",
  autoRotate = false,
  scrollProgress = 0,
  dragOffset = { x: 0, y: 0 },
}: {
  materialId?: string;
  viewAngle?: "orbit" | "front" | "side" | "temple" | "hinge" | "lens" | "profile" | "macro";
  autoRotate?: boolean;
  scrollProgress?: number;
  dragOffset?: { x: number; y: number };
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLensRef = useRef<THREE.Mesh>(null);
  const rightLensRef = useRef<THREE.Mesh>(null);
  const { enableFloat, geometryDetail, lensMaterialMode, tier } = useDeviceTier();

  const selectedMat = useMemo(
    () => FRAME_MATERIALS.find((m) => m.id === materialId) || FRAME_MATERIALS[0],
    [materialId]
  );

  // Physically-Accurate Materials with graceful degradation per tier
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

    // 4. Optical Sapphire Crystal Lens
    // LOW: Standard transparent material (completely bypasses expensive WebGL transmission refraction pass)
    // MEDIUM: Lighter transmission without heavy attenuation
    // HIGH: Full physically accurate refraction with 420nm blue-cut sheen
    const lens =
      lensMaterialMode === "standard"
        ? new THREE.MeshStandardMaterial({
            color: new THREE.Color(selectedMat.lensTint),
            transparent: true,
            opacity: 0.45,
            roughness: 0.08,
            metalness: 0.1,
          })
        : new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(selectedMat.lensTint),
            transmission: tier === "MEDIUM" ? 0.85 : 0.96,
            opacity: 0.98,
            transparent: true,
            roughness: 0.015,
            ior: 1.52,
            reflectivity: 0.65,
            clearcoat: tier === "MEDIUM" ? 0.3 : 1.0,
            clearcoatRoughness: 0.03,
            attenuationColor: new THREE.Color("#38bdf8"),
            attenuationDistance: 0.9,
          });

    // 5. Medical Silicone Nose Pads
    const silicone =
      lensMaterialMode === "standard"
        ? new THREE.MeshStandardMaterial({
            color: "#FFFFFF",
            transparent: true,
            opacity: 0.6,
            roughness: 0.3,
          })
        : new THREE.MeshPhysicalMaterial({
            color: "#FFFFFF",
            transparent: true,
            opacity: 0.7,
            roughness: 0.25,
            transmission: 0.8,
            ior: 1.41,
          });

    // 6. Midnight Italian Acetate Temple Tips
    const acetate =
      lensMaterialMode === "standard"
        ? new THREE.MeshStandardMaterial({
            color: "#0F1117",
            roughness: 0.2,
            metalness: 0.1,
          })
        : new THREE.MeshPhysicalMaterial({
            color: "#0F1117",
            roughness: 0.08,
            metalness: 0.1,
            clearcoat: tier === "MEDIUM" ? 0.3 : 1.0,
            clearcoatRoughness: 0.03,
            envMapIntensity: 1.4,
          });

    return { frame, bevel, screw, lens, silicone, acetate };
  }, [selectedMat, lensMaterialMode, tier]);

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

    // Dynamic tessellation based on performance tier
    const tubeSegs = geometryDetail === "low" ? 64 : geometryDetail === "mid" ? 96 : 128;
    const radSegs = geometryDetail === "low" ? 8 : geometryDetail === "mid" ? 12 : 16;
    const leftRim = new THREE.TubeGeometry(leftCurve, tubeSegs, 0.0125, radSegs, true);
    const rightRim = new THREE.TubeGeometry(rightCurve, tubeSegs, 0.0125, radSegs, true);

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
      bevelSegments: geometryDetail === "low" ? 1 : 2,
      steps: 1,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    };

    const leftLens = new THREE.ExtrudeGeometry(createLensShape(true), extrudeSettings);
    const rightLens = new THREE.ExtrudeGeometry(createLensShape(false), extrudeSettings);
    leftLens.translate(0, 0, -0.004);
    rightLens.translate(0, 0, -0.004);

    return { leftRimGeo: leftRim, rightRimGeo: rightRim, leftLensGeo: leftLens, rightLensGeo: rightLens };
  }, [geometryDetail]);

  // Temples, Bridges & Hardware (Slender, physically proportionate)
  const {
    topBarGeo,
    keyholeBridgeGeo,
    leftTempleArmGeo,
    rightTempleArmGeo,
    leftEarSockGeo,
    rightEarSockGeo,
    leftPadArmGeo,
    rightPadArmGeo,
  } = useMemo(() => {
    const armSegs = geometryDetail === "low" ? 24 : geometryDetail === "mid" ? 36 : 48;
    const armRad = geometryDetail === "low" ? 8 : geometryDetail === "mid" ? 10 : 12;

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
      topBarGeo: new THREE.TubeGeometry(topBarCurve, armSegs, 0.009, armRad, false),
      keyholeBridgeGeo: new THREE.TubeGeometry(keyholeCurve, armSegs, 0.011, armRad, false),
      leftTempleArmGeo: new THREE.TubeGeometry(leftTempleCurve, armSegs, 0.0095, armRad, false),
      rightTempleArmGeo: new THREE.TubeGeometry(rightTempleCurve, armSegs, 0.0095, armRad, false),
      leftEarSockGeo: new THREE.TubeGeometry(leftEarCurve, Math.round(armSegs * 0.75), 0.016, armRad, false),
      rightEarSockGeo: new THREE.TubeGeometry(rightEarCurve, Math.round(armSegs * 0.75), 0.016, armRad, false),
      leftPadArmGeo: new THREE.TubeGeometry(leftArmCurve, Math.round(armSegs * 0.5), 0.0055, 8, false),
      rightPadArmGeo: new THREE.TubeGeometry(rightArmCurve, Math.round(armSegs * 0.5), 0.0055, 8, false),
    };
  }, [geometryDetail]);

  // Clean disposal of GPU resources on unmount (prevents WebGL memory leaks)
  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
      leftRimGeo.dispose();
      rightRimGeo.dispose();
      leftLensGeo.dispose();
      rightLensGeo.dispose();
      topBarGeo.dispose();
      keyholeBridgeGeo.dispose();
      leftTempleArmGeo.dispose();
      rightTempleArmGeo.dispose();
      leftEarSockGeo.dispose();
      rightEarSockGeo.dispose();
      leftPadArmGeo.dispose();
      rightPadArmGeo.dispose();
    };
  }, [
    materials,
    leftRimGeo,
    rightRimGeo,
    leftLensGeo,
    rightLensGeo,
    topBarGeo,
    keyholeBridgeGeo,
    leftTempleArmGeo,
    rightTempleArmGeo,
    leftEarSockGeo,
    rightEarSockGeo,
    leftPadArmGeo,
    rightPadArmGeo,
  ]);

  // Responsive calculations: GIANT 3D frame that fills mobile viewport with safe margins
  const { viewport, size } = useThree();
  const isMobile = size.width < 768;

  const responsiveScale = useMemo(() => {
    if (isMobile) {
      return Math.min(Math.max((viewport.width * 0.86) / 3.1, 0.45), 0.7);
    }
    return 0.98;
  }, [viewport.width, isMobile]);

  const baseY = isMobile ? -0.16 : -0.06;

  // Studio Turntable Rotation & View Presets (reusable objects to avoid allocations in useFrame)
  const targetRotation = useRef({ x: 0.02, y: 0.0, z: 0 });
  const targetPosition = useRef({ x: 0, y: -0.06, z: 0 });
  const targetScale = useRef(0.98);

  // 5 Architectural Poses - Memoized outside of useFrame to prevent per-frame object allocation
  const poses = useMemo(
    () => ({
      front: {
        rot: { x: 0.02, y: 0.0, z: 0.0 },
        pos: { x: 0, y: baseY, z: 0.05 },
        scaleMult: 1.0,
      },
      side: {
        rot: { x: 0.04, y: -1.52, z: 0.02 },
        pos: { x: isMobile ? 0.06 : 0.16, y: baseY, z: 0.02 },
        scaleMult: 1.05,
      },
      temple: {
        rot: { x: 0.2, y: -2.35, z: 0.04 },
        pos: { x: isMobile ? -0.14 : -0.26, y: baseY - 0.03, z: 0.22 },
        scaleMult: 1.25,
      },
      hinge: {
        rot: { x: 0.22, y: -0.85, z: -0.05 },
        pos: { x: isMobile ? 0.52 : 0.8, y: baseY - 0.18, z: 0.65 },
        scaleMult: isMobile ? 1.55 : 1.95,
      },
      lens: {
        rot: { x: 0.04, y: -0.22, z: 0.0 },
        pos: { x: isMobile ? 0.24 : 0.4, y: baseY + 0.02, z: 0.6 },
        scaleMult: isMobile ? 1.4 : 1.7,
      },
    }),
    [baseY, isMobile]
  );

  const poseKeys = useMemo(() => ["front", "side", "temple", "hinge", "lens"] as const, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const mouseX = state.pointer.x * 0.12;
    const mouseY = state.pointer.y * 0.06;

    if (viewAngle === "front" || viewAngle === "side" || viewAngle === "temple" || viewAngle === "hinge" || viewAngle === "lens") {
      const p = poses[viewAngle];
      targetRotation.current.x = p.rot.x - mouseY * 0.3;
      targetRotation.current.y = p.rot.y + mouseX * 0.3;
      targetRotation.current.z = p.rot.z;
      targetPosition.current.x = p.pos.x;
      targetPosition.current.y = p.pos.y;
      targetPosition.current.z = p.pos.z;
      targetScale.current = responsiveScale * p.scaleMult;
    } else if (viewAngle === "profile") {
      const p = poses.side;
      targetRotation.current.x = p.rot.x - mouseY * 0.3;
      targetRotation.current.y = p.rot.y + mouseX * 0.3;
      targetRotation.current.z = p.rot.z;
      targetPosition.current.x = p.pos.x;
      targetPosition.current.y = p.pos.y;
      targetPosition.current.z = p.pos.z;
      targetScale.current = responsiveScale * p.scaleMult;
    } else if (viewAngle === "macro") {
      const p = poses.hinge;
      targetRotation.current.x = p.rot.x - mouseY * 0.3;
      targetRotation.current.y = p.rot.y + mouseX * 0.3;
      targetRotation.current.z = p.rot.z;
      targetPosition.current.x = p.pos.x;
      targetPosition.current.y = p.pos.y;
      targetPosition.current.z = p.pos.z;
      targetScale.current = responsiveScale * p.scaleMult;
    } else {
      // orbit mode: continuous scroll inspection through FRONT -> SIDE -> TEMPLE -> HINGE -> LENS
      if (typeof scrollProgress === "number") {
        if (scrollProgress < 0.16) {
          targetRotation.current.x = 0.04 - mouseY;
          targetRotation.current.y = mouseX;
          targetRotation.current.z = 0;
          targetPosition.current.x = 0;
          targetPosition.current.y = baseY;
          targetPosition.current.z = 0;
          targetScale.current = responsiveScale;
        } else {
          const progressNorm = Math.min(Math.max((scrollProgress - 0.16) / 0.84, 0), 1);
          const totalSegments = poseKeys.length - 1;
          const segmentVal = progressNorm * totalSegments;
          const idx = Math.min(Math.floor(segmentVal), totalSegments - 1);
          const frac = segmentVal - idx;
          const s = frac * frac * (3 - 2 * frac);

          const pA = poses[poseKeys[idx]];
          const pB = poses[poseKeys[idx + 1]];

          targetRotation.current.x = THREE.MathUtils.lerp(pA.rot.x, pB.rot.x, s) - mouseY * 0.35;
          targetRotation.current.y = THREE.MathUtils.lerp(pA.rot.y, pB.rot.y, s) + mouseX * 0.35;
          targetRotation.current.z = THREE.MathUtils.lerp(pA.rot.z, pB.rot.z, s);

          targetPosition.current.x = THREE.MathUtils.lerp(pA.pos.x, pB.pos.x, s);
          targetPosition.current.y = THREE.MathUtils.lerp(pA.pos.y, pB.pos.y, s);
          targetPosition.current.z = THREE.MathUtils.lerp(pA.pos.z, pB.pos.z, s);
          targetScale.current = responsiveScale * THREE.MathUtils.lerp(pA.scaleMult, pB.scaleMult, s);

          if (scrollProgress > 0.86) {
            const exitFrac = Math.min((scrollProgress - 0.86) / 0.14, 1);
            const exitEase = exitFrac * exitFrac;
            targetPosition.current.x += (isMobile ? 0.75 : 1.6) * exitEase;
            targetPosition.current.z += 0.8 * exitEase;
          }
        }
      } else if (autoRotate) {
        groupRef.current.rotation.y += delta * 0.28;
      }
    }

    // Apply interactive 360 drag inspection offset
    const finalRotX = targetRotation.current.x + (dragOffset.x || 0);
    const finalRotY = targetRotation.current.y + (dragOffset.y || 0);
    const finalRotZ = targetRotation.current.z;

    // Smooth damping physics for seamless transitions (safeDelta prevents re-entry jumps)
    const safeDelta = Math.min(Math.max(delta, 0), 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, finalRotX, 4.5, safeDelta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, finalRotY, 4.5, safeDelta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, finalRotZ, 4.5, safeDelta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosition.current.x, 4.5, safeDelta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPosition.current.y, 4.5, safeDelta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetPosition.current.z, 4.5, safeDelta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale.current, 4.5, safeDelta));
  });

  const modelContent = (
    <group ref={groupRef} position={[0, baseY, 0]} scale={responsiveScale}>
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
          <cylinderGeometry args={[0.018, 0.018, 0.07, geometryDetail === "low" ? 8 : 14]} />
        </mesh>
        <mesh position={[0, 0.04, 0]} material={materials.screw}>
          <cylinderGeometry args={[0.014, 0.014, 0.012, geometryDetail === "low" ? 6 : 10]} />
        </mesh>
      </group>

      <group position={[1.46, 0.28, -0.11]}>
        <mesh material={materials.frame} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.07, geometryDetail === "low" ? 8 : 14]} />
        </mesh>
        <mesh position={[0, 0.04, 0]} material={materials.screw}>
          <cylinderGeometry args={[0.014, 0.014, 0.012, geometryDetail === "low" ? 6 : 10]} />
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
      <group position={[-0.26, -0.3, 0.22]} rotation={[0.3, -0.35, 0.15]}>
        <mesh material={materials.silicone}>
          <cylinderGeometry args={[0.035, 0.035, 0.012, geometryDetail === "low" ? 8 : 16]} />
        </mesh>
        <mesh position={[0, 0, -0.006]} material={materials.frame}>
          <cylinderGeometry args={[0.018, 0.018, 0.005, geometryDetail === "low" ? 6 : 12]} />
        </mesh>
      </group>
      <group position={[0.26, -0.3, 0.22]} rotation={[0.3, 0.35, -0.15]}>
        <mesh material={materials.silicone}>
          <cylinderGeometry args={[0.035, 0.035, 0.012, geometryDetail === "low" ? 8 : 16]} />
        </mesh>
        <mesh position={[0, 0, -0.006]} material={materials.frame}>
          <cylinderGeometry args={[0.018, 0.018, 0.005, geometryDetail === "low" ? 6 : 12]} />
        </mesh>
      </group>
    </group>
  );

  if (!enableFloat) {
    return modelContent;
  }

  return (
    <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.1} floatingRange={[-0.015, 0.015]}>
      {modelContent}
    </Float>
  );
}

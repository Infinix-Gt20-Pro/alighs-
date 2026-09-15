"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface ExplodedGlasses3DProps {
  progressRef: React.MutableRefObject<number>;
}

export default function ExplodedGlasses3D({ progressRef }: ExplodedGlasses3DProps) {
  const mainGroup = useRef<THREE.Group>(null);

  // Component groups for exploded detachment
  const frameFrontRef = useRef<THREE.Group>(null);
  const leftLensRef = useRef<THREE.Group>(null);
  const rightLensRef = useRef<THREE.Group>(null);
  const bridgeRef = useRef<THREE.Group>(null);
  const nosePadsRef = useRef<THREE.Group>(null);
  const leftHingeRef = useRef<THREE.Group>(null);
  const rightHingeRef = useRef<THREE.Group>(null);
  const leftTempleRef = useRef<THREE.Group>(null);
  const rightTempleRef = useRef<THREE.Group>(null);

  const currentProgress = useRef(0);

  // ==========================================================================
  // Ultra-Luxury PBR Materials with Real Photorealistic Optical Characteristics
  // ==========================================================================
  const materials = useMemo(() => {
    // 1. Aerospace Brushed Japanese Titanium (Frame Rims)
    const titanium = new THREE.MeshStandardMaterial({
      color: "#2e3138",
      metalness: 0.94,
      roughness: 0.16,
      envMapIntensity: 2.2,
    });

    // 2. High-Polish Mirror Platinum / Silver Chrome (Bevels & Bridge)
    const platinum = new THREE.MeshStandardMaterial({
      color: "#f1f5f9",
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 2.6,
    });

    // 3. 24K Jewelry Gold Micro-Screws & Pin Accents
    const goldAccent = new THREE.MeshStandardMaterial({
      color: "#fbbf24",
      metalness: 0.98,
      roughness: 0.12,
      envMapIntensity: 2.4,
    });

    // 4. Optical Sapphire Crystal Lens with True Glass Transmission & AR Blue-Cut Sheen
    const sapphireLens = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      transmission: 0.95,
      opacity: 1.0,
      transparent: true,
      roughness: 0.015,
      metalness: 0.04,
      ior: 1.54,
      thickness: 0.8,
      specularColor: new THREE.Color("#38bdf8"),
      specularIntensity: 2.2,
      attenuationColor: new THREE.Color("#93c5fd"),
      attenuationDistance: 2.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.0,
    });

    // 5. Medical-Grade Soft Hypoallergenic Translucent Silicone (Nose Pads)
    const silicone = new THREE.MeshPhysicalMaterial({
      color: "#f8fafc",
      transparent: true,
      opacity: 0.72,
      roughness: 0.35,
      transmission: 0.55,
      thickness: 0.4,
      metalness: 0.0,
      ior: 1.42,
    });

    // 6. Hand-Polished Firozabad Midnight Acetate (Temple Ear Tips)
    const acetateTip = new THREE.MeshPhysicalMaterial({
      color: "#090d16",
      roughness: 0.08,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.8,
    });

    return { titanium, platinum, goldAccent, sapphireLens, silicone, acetateTip };
  }, []);

  // ==========================================================================
  // Designer Eyewear Contour Curves (Pantos/Aviator Luxury Teardrop Profile)
  // ==========================================================================
  const { leftRimGeo, rightRimGeo, leftLensGeo, rightLensGeo } = useMemo(() => {
    // Generate organic luxury frame contour points with subtle facial wrap along Z
    const createPoints = (isLeft: boolean) => {
      const s = isLeft ? -1 : 1;
      return [
        new THREE.Vector3(s * 0.22, 0.58, 0.04),   // Top inner brow
        new THREE.Vector3(s * 0.72, 0.65, 0.01),   // Top center peak
        new THREE.Vector3(s * 1.25, 0.54, -0.05),  // Top outer corner
        new THREE.Vector3(s * 1.46, 0.28, -0.11),  // Upper temple lug
        new THREE.Vector3(s * 1.48, -0.08, -0.13), // Mid cheek curve
        new THREE.Vector3(s * 1.32, -0.48, -0.09), // Lower outer sweep
        new THREE.Vector3(s * 0.94, -0.74, -0.04), // Teardrop bottom lowest point
        new THREE.Vector3(s * 0.48, -0.66, 0.01),  // Lower inner jaw
        new THREE.Vector3(s * 0.24, -0.34, 0.05),  // Lower nose clearance
        new THREE.Vector3(s * 0.18, 0.18, 0.06),   // Upper nose clearance
      ];
    };

    const leftCurve = new THREE.CatmullRomCurve3(createPoints(true), true, "centripetal");
    const rightCurve = new THREE.CatmullRomCurve3(createPoints(false), true, "centripetal");

    // Titanium Rim Tube (slender 0.032 wire with fine facet detail)
    const leftRim = new THREE.TubeGeometry(leftCurve, 84, 0.034, 12, true);
    const rightRim = new THREE.TubeGeometry(rightCurve, 84, 0.034, 12, true);

    // Realistic curved 2D Shape for the Sapphire Crystal Lens
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

    const leftShape = createLensShape(true);
    const rightShape = createLensShape(false);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    };

    const leftLens = new THREE.ExtrudeGeometry(leftShape, extrudeSettings);
    const rightLens = new THREE.ExtrudeGeometry(rightShape, extrudeSettings);

    // Center extruded lenses slightly along Z
    leftLens.translate(0, 0, -0.02);
    rightLens.translate(0, 0, -0.02);

    return {
      leftRimGeo: leftRim,
      rightRimGeo: rightRim,
      leftLensGeo: leftLens,
      rightLensGeo: rightLens,
    };
  }, []);

  // Temple (Arm) Paths
  const { leftTempleArmGeo, rightTempleArmGeo, leftEarSockGeo, rightEarSockGeo } = useMemo(() => {
    // Left Temple: Starts at outer lug, extends back along -Z with ear hook curve
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

    // Acetate Ear Sock (Ear hook) curving downward over the ear
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

    return {
      leftTempleArmGeo: new THREE.TubeGeometry(leftTempleCurve, 48, 0.032, 10, false),
      rightTempleArmGeo: new THREE.TubeGeometry(rightTempleCurve, 48, 0.032, 10, false),
      leftEarSockGeo: new THREE.TubeGeometry(leftEarCurve, 36, 0.052, 12, false),
      rightEarSockGeo: new THREE.TubeGeometry(rightEarCurve, 36, 0.052, 12, false),
    };
  }, []);

  // Double Architectural Brow Bar & Keyhole Bridge
  const { topBarGeo, keyholeBridgeGeo } = useMemo(() => {
    // Upper Brow Bar: Sleek aerodynamic cross-bridge
    const topBarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.65, 0.63, 0.02),
      new THREE.Vector3(0.0, 0.66, 0.04),
      new THREE.Vector3(0.65, 0.63, 0.02),
    ]);

    // Lower Keyhole Saddle Bridge
    const keyholeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.24, 0.12, 0.06),
      new THREE.Vector3(-0.16, 0.26, 0.08),
      new THREE.Vector3(0.0, 0.32, 0.09),
      new THREE.Vector3(0.16, 0.26, 0.08),
      new THREE.Vector3(0.24, 0.12, 0.06),
    ]);

    return {
      topBarGeo: new THREE.TubeGeometry(topBarCurve, 32, 0.03, 10, false),
      keyholeBridgeGeo: new THREE.TubeGeometry(keyholeCurve, 32, 0.032, 10, false),
    };
  }, []);

  // Goose-Neck Pad Arms
  const { leftPadArmGeo, rightPadArmGeo } = useMemo(() => {
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
      leftPadArmGeo: new THREE.TubeGeometry(leftArmCurve, 24, 0.018, 8, false),
      rightPadArmGeo: new THREE.TubeGeometry(rightArmCurve, 24, 0.018, 8, false),
    };
  }, []);

  // ==========================================================================
  // 60FPS Continuous Animation & Scroll-Pinned Exploded Interpolation
  // ==========================================================================
  useFrame((state) => {
    const target = progressRef.current;
    currentProgress.current = THREE.MathUtils.lerp(currentProgress.current, target, 0.08);
    const p = currentProgress.current; // 0 = assembled beauty pose, 1 = fully exploded

    // Mouse Tracking Parallax
    const mouseX = state.pointer.x * 0.18;
    const mouseY = state.pointer.y * 0.15;

    // 1. Whole Assembly Dramatic 3/4 Isometric Presentation Angle
    // When assembled (p=0), shows elegant 3/4 luxury perspective so temples and depth are visible
    if (mainGroup.current) {
      mainGroup.current.rotation.y = THREE.MathUtils.lerp(-0.35, 0.58, p) + mouseX;
      mainGroup.current.rotation.x = THREE.MathUtils.lerp(0.14, 0.24, p) - mouseY;
      mainGroup.current.position.y = THREE.MathUtils.lerp(0.05, 0.12, p);
    }

    // 2. Sapphire Lenses Explode Forward along +Z with subtle tilt
    if (leftLensRef.current) {
      leftLensRef.current.position.z = p * 2.5;
      leftLensRef.current.position.x = -p * 0.35;
      leftLensRef.current.position.y = p * 0.25;
      leftLensRef.current.rotation.y = -p * 0.2;
    }
    if (rightLensRef.current) {
      rightLensRef.current.position.z = p * 2.5;
      rightLensRef.current.position.x = p * 0.35;
      rightLensRef.current.position.y = p * 0.25;
      rightLensRef.current.rotation.y = p * 0.2;
    }

    // 3. Double Brow Bar & Keyhole Bridge lift forward and upward (+Z, +Y)
    if (bridgeRef.current) {
      bridgeRef.current.position.z = p * 1.1;
      bridgeRef.current.position.y = p * 0.6;
    }

    // 4. Titanium 5-Barrel Hinges Detach Outward (±X) and slightly back (-Z)
    if (leftHingeRef.current) {
      leftHingeRef.current.position.x = -p * 0.9;
      leftHingeRef.current.position.z = -p * 0.45;
      leftHingeRef.current.rotation.z = -p * 0.25;
    }
    if (rightHingeRef.current) {
      rightHingeRef.current.position.x = p * 0.9;
      rightHingeRef.current.position.z = -p * 0.45;
      rightHingeRef.current.rotation.z = p * 0.25;
    }

    // 5. Temple Arms Expand Outward (±X) and glide backward along -Z, unfolding outwards
    if (leftTempleRef.current) {
      leftTempleRef.current.position.x = -p * 1.6;
      leftTempleRef.current.position.z = -p * 2.1;
      leftTempleRef.current.position.y = -p * 0.2;
      leftTempleRef.current.rotation.y = -p * 0.45;
    }
    if (rightTempleRef.current) {
      rightTempleRef.current.position.x = p * 1.6;
      rightTempleRef.current.position.z = -p * 2.1;
      rightTempleRef.current.position.y = -p * 0.2;
      rightTempleRef.current.rotation.y = p * 0.45;
    }

    // 6. Goose-Neck Silicone Nose Pads Detach Downward (-Y) & forward
    if (nosePadsRef.current) {
      nosePadsRef.current.position.y = -p * 0.95;
      nosePadsRef.current.position.z = p * 0.8;
    }

    // 7. Core Frame Front shifts back slightly (-Z) to create depth separation
    if (frameFrontRef.current) {
      frameFrontRef.current.position.z = -p * 0.35;
    }
  });

  return (
    <Float speed={2.0} rotationIntensity={0.25} floatIntensity={0.5} floatingRange={[-0.06, 0.06]}>
      <group ref={mainGroup} scale={1.22} position={[0, 0, 0]}>
        
        {/* ==================================================================
            1. CORE AEROSPACE TITANIUM FRAME RIMS
            ================================================================== */}
        <group ref={frameFrontRef}>
          {/* Left Titanium Wireframe Rim */}
          <mesh geometry={leftRimGeo} material={materials.titanium} castShadow receiveShadow />

          {/* Right Titanium Wireframe Rim */}
          <mesh geometry={rightRimGeo} material={materials.titanium} castShadow receiveShadow />

          {/* Platinum Inner Bevel Rings for Specular Glint */}
          <mesh geometry={leftRimGeo} material={materials.platinum} scale={[0.985, 0.985, 0.985]} />
          <mesh geometry={rightRimGeo} material={materials.platinum} scale={[0.985, 0.985, 0.985]} />
        </group>

        {/* ==================================================================
            2. DETACHABLE SAPPHIRE CRYSTAL BLUE-CUT LENSES (+Z Exploded)
            ================================================================== */}
        {/* Left Lens */}
        <group ref={leftLensRef}>
          <mesh geometry={leftLensGeo} material={materials.sapphireLens} castShadow receiveShadow />
          {/* Platinum Chamfer Bevel Ring on Lens Edge */}
          <mesh geometry={leftRimGeo} material={materials.platinum} scale={[0.99, 0.99, 0.3]} />
        </group>

        {/* Right Lens */}
        <group ref={rightLensRef}>
          <mesh geometry={rightLensGeo} material={materials.sapphireLens} castShadow receiveShadow />
          {/* Platinum Chamfer Bevel Ring on Lens Edge */}
          <mesh geometry={rightRimGeo} material={materials.platinum} scale={[0.99, 0.99, 0.3]} />
        </group>

        {/* ==================================================================
            3. DOUBLE BROW BAR & KEYHOLE SADDLE BRIDGE (+Y / +Z Exploded)
            ================================================================== */}
        <group ref={bridgeRef}>
          {/* Upper Aerodynamic Brow Bar */}
          <mesh geometry={topBarGeo} material={materials.platinum} castShadow />

          {/* Lower Keyhole Saddle Bridge */}
          <mesh geometry={keyholeBridgeGeo} material={materials.titanium} castShadow />

          {/* Center Gold Medallion / Laser-Etched Micro Emblem */}
          <mesh position={[0, 0.32, 0.09]} material={materials.goldAccent}>
            <sphereGeometry args={[0.045, 16, 16]} />
          </mesh>
        </group>

        {/* ==================================================================
            4. TITANIUM 5-BARREL HINGES & 24K GOLD SCREWS (±X Exploded)
            ================================================================== */}
        {/* Left Hinge */}
        <group ref={leftHingeRef}>
          <group position={[-1.46, 0.28, -0.11]}>
            {/* Interlocking Hinge Barrels */}
            <mesh material={materials.platinum} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.16, 16]} />
            </mesh>
            {/* Top Gold Pivot Screw */}
            <mesh position={[0, 0.09, 0]} material={materials.goldAccent}>
              <cylinderGeometry args={[0.038, 0.038, 0.03, 12]} />
            </mesh>
            {/* Bottom Gold Nut */}
            <mesh position={[0, -0.09, 0]} material={materials.goldAccent}>
              <cylinderGeometry args={[0.038, 0.038, 0.03, 12]} />
            </mesh>
          </group>
        </group>

        {/* Right Hinge */}
        <group ref={rightHingeRef}>
          <group position={[1.46, 0.28, -0.11]}>
            {/* Interlocking Hinge Barrels */}
            <mesh material={materials.platinum} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.16, 16]} />
            </mesh>
            {/* Top Gold Pivot Screw */}
            <mesh position={[0, 0.09, 0]} material={materials.goldAccent}>
              <cylinderGeometry args={[0.038, 0.038, 0.03, 12]} />
            </mesh>
            {/* Bottom Gold Nut */}
            <mesh position={[0, -0.09, 0]} material={materials.goldAccent}>
              <cylinderGeometry args={[0.038, 0.038, 0.03, 12]} />
            </mesh>
          </group>
        </group>

        {/* ==================================================================
            5. TAPERED TEMPLES & HANDCRAFTED ACETATE EAR SOCKS (-Z Exploded)
            ================================================================== */}
        {/* Left Temple Arm */}
        <group ref={leftTempleRef}>
          {/* Titanium Shaft */}
          <mesh geometry={leftTempleArmGeo} material={materials.titanium} castShadow />
          {/* Midnight Acetate Ear Hook Sock */}
          <mesh geometry={leftEarSockGeo} material={materials.acetateTip} castShadow />
          {/* Gold Accent Ring at Acetate Joint */}
          <mesh position={[-1.50, 0.23, -2.0]} material={materials.goldAccent}>
            <cylinderGeometry args={[0.054, 0.054, 0.04, 16]} />
          </mesh>
        </group>

        {/* Right Temple Arm */}
        <group ref={rightTempleRef}>
          {/* Titanium Shaft */}
          <mesh geometry={rightTempleArmGeo} material={materials.titanium} castShadow />
          {/* Midnight Acetate Ear Hook Sock */}
          <mesh geometry={rightEarSockGeo} material={materials.acetateTip} castShadow />
          {/* Gold Accent Ring at Acetate Joint */}
          <mesh position={[1.50, 0.23, -2.0]} material={materials.goldAccent}>
            <cylinderGeometry args={[0.054, 0.054, 0.04, 16]} />
          </mesh>
        </group>

        {/* ==================================================================
            6. GOOSE-NECK PAD ARMS & HYPOALLERGENIC SILICONE PADS (-Y Exploded)
            ================================================================== */}
        <group ref={nosePadsRef}>
          {/* Left Goose-Neck Titanium Wire Arm */}
          <mesh geometry={leftPadArmGeo} material={materials.platinum} />

          {/* Left Oval Silicone Pad (Tilted naturally against nasal bone) */}
          <group position={[-0.28, -0.32, 0.25]} rotation={[0.25, -0.4, 0.2]}>
            <mesh material={materials.silicone}>
              <capsuleGeometry args={[0.055, 0.14, 8, 16]} />
            </mesh>
            {/* Gold Micro-Core Mount inside the Pad */}
            <mesh material={materials.goldAccent}>
              <cylinderGeometry args={[0.022, 0.022, 0.06, 8]} />
            </mesh>
          </group>

          {/* Right Goose-Neck Titanium Wire Arm */}
          <mesh geometry={rightPadArmGeo} material={materials.platinum} />

          {/* Right Oval Silicone Pad */}
          <group position={[0.28, -0.32, 0.25]} rotation={[0.25, 0.4, -0.2]}>
            <mesh material={materials.silicone}>
              <capsuleGeometry args={[0.055, 0.14, 8, 16]} />
            </mesh>
            {/* Gold Micro-Core Mount inside the Pad */}
            <mesh material={materials.goldAccent}>
              <cylinderGeometry args={[0.022, 0.022, 0.06, 8]} />
            </mesh>
          </group>
        </group>

      </group>
    </Float>
  );
}

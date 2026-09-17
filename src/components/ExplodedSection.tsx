"use client";

import React, { useRef, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import ExplodedGlasses3D from "./ExplodedGlasses3D";
import { ShieldCheck, Layers, Sparkles, Feather, Eye } from "lucide-react";
import { useInViewFast } from "@/hooks/useInViewFast";

const emptySubscribe = () => () => {};

export default function ExplodedSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const pctSpanRef = useRef<HTMLSpanElement>(null);
  const [mobileTier, setMobileTier] = useState(0);

  const isInView = useInViewFast(containerRef, "250px");

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Track scroll through the 300vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Zero-rerender progress updating
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    progressRef.current = latest;
    const pct = Math.round(latest * 100);
    if (pctSpanRef.current) {
      pctSpanRef.current.textContent = `${pct}%`;
    }

    // Only update mobile state when tier boundary changes (0 -> 1 -> 2)
    const tier = latest < 0.3 ? 0 : latest < 0.6 ? 1 : 2;
    if (tier !== mobileTier) {
      setMobileTier(tier);
    }
  });

  // Desktop tooltips transforms (Pure CSS transforms, zero React re-renders)
  const blueCutOpacity = useTransform(scrollYProgress, [0.15, 0.32, 0.88, 0.98], [0, 1, 1, 0]);
  const blueCutY = useTransform(scrollYProgress, [0.15, 0.32], [24, 0]);
  const blueCutScale = useTransform(scrollYProgress, [0.15, 0.32], [0.92, 1]);

  const antiGlareOpacity = useTransform(scrollYProgress, [0.28, 0.45, 0.88, 0.98], [0, 1, 1, 0]);
  const antiGlareY = useTransform(scrollYProgress, [0.28, 0.45], [24, 0]);
  const antiGlareScale = useTransform(scrollYProgress, [0.28, 0.45], [0.92, 1]);

  const lightweightOpacity = useTransform(scrollYProgress, [0.42, 0.58, 0.88, 0.98], [0, 1, 1, 0]);
  const lightweightY = useTransform(scrollYProgress, [0.42, 0.58], [24, 0]);
  const lightweightScale = useTransform(scrollYProgress, [0.42, 0.58], [0.92, 1]);

  const bridgeOpacity = useTransform(scrollYProgress, [0.55, 0.72, 0.88, 0.98], [0, 1, 1, 0]);
  const bridgeY = useTransform(scrollYProgress, [0.55, 0.72], [24, 0]);
  const bridgeScale = useTransform(scrollYProgress, [0.55, 0.72], [0.92, 1]);

  const headerOpacity = useTransform(scrollYProgress, [0.02, 0.12], [0.4, 1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div id="explode-section" ref={containerRef} className="relative h-[320vh] bg-[#0a0a0a] gpu-layer">
      {/* Sticky Screen Viewport pinned for 320vh of scroll travel */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Ambient Lighting Orbs */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] rounded-full bg-cyan-600/15 blur-[130px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-600/10 blur-[140px]" />
        </div>

        {/* Section Top Header */}
        <motion.div
          style={{ opacity: headerOpacity }}
          className="absolute top-6 sm:top-8 z-30 flex flex-col items-center text-center px-4 gpu-layer"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-mono text-cyan-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D SCROLL EXPLODE ARCHITECTURE</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-[0.1em] text-white uppercase">
            Engineering Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-lg">
            Scroll karke frame ke har layer ko 3D exploded view mein dekhein.
          </p>
        </motion.div>

        {/* CENTER 3D CANVAS (Exploded Eyeglasses with Viewport Pause) */}
        <div className="relative z-10 w-full h-full max-w-6xl mx-auto flex items-center justify-center">
          {mounted ? (
            <Canvas
              camera={{ position: [0, 0, 5.5], fov: 42 }}
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
              <ambientLight intensity={1.4} />
              <directionalLight position={[6, 8, 7]} intensity={2.6} castShadow />
              <directionalLight position={[-6, -4, -4]} intensity={1.4} color="#818cf8" />
              <pointLight position={[0, 4, 3]} intensity={1.8} color="#e0e7ff" />
              <pointLight position={[0, -3, 2]} intensity={1.0} color="#38bdf8" />

              <ExplodedGlasses3D progressRef={progressRef} />

              <Environment preset="city" />

              <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.4}
                scale={7}
                blur={2.5}
                far={5}
                color="#000000"
              />
            </Canvas>
          ) : (
            <div className="w-16 h-16 rounded-full border border-white/10 border-t-cyan-400 animate-spin" />
          )}
        </div>

        {/* DESKTOP FLOATING GLASSMORPHIC TOOLTIPS */}
        <motion.div
          style={{ opacity: blueCutOpacity, y: blueCutY, scale: blueCutScale }}
          className="hidden md:block absolute top-[20%] left-6 lg:left-14 z-20 max-w-xs sm:max-w-sm pointer-events-auto gpu-layer"
        >
          <div className="glass-card p-5 border-l-4 border-l-blue-400 shadow-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-blue-300 uppercase">
                Layer 01 &bull; Optics
              </span>
            </div>
            <h3 className="font-semibold text-white text-base">Blue-Cut Technology (Screens ke liye)</h3>
            <p className="text-xs text-neutral-300 font-light mt-1.5 leading-relaxed">
              Mobile, laptop aur monitors ki 420nm harmful blue-light ko absorb karke aankhon ki thakan aur dryness se protect karta hai.
            </p>
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10 text-[11px] font-mono text-neutral-400">
              <span className="text-cyan-400 font-semibold">Zero Eye Strain</span>
              <span>&bull;</span>
              <span>High-Index Sapphire</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: antiGlareOpacity, y: antiGlareY, scale: antiGlareScale }}
          className="hidden md:block absolute top-[20%] right-6 lg:right-14 z-20 max-w-xs sm:max-w-sm pointer-events-auto gpu-layer"
        >
          <div className="glass-card p-5 border-r-4 border-r-cyan-400 shadow-2xl text-right sm:text-left">
            <div className="flex items-center justify-end sm:justify-start gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Eye className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase">
                Layer 02 &bull; Nano-Coating
              </span>
            </div>
            <h3 className="font-semibold text-white text-base">Anti-Glare Coating</h3>
            <p className="text-xs text-neutral-300 font-light mt-1.5 leading-relaxed">
              9-layer hydrophobic reflection shield jo night driving ke waqt headlights aur bright ambient glare ko zero kar deta hai.
            </p>
            <div className="flex items-center justify-end sm:justify-start gap-2 mt-3 pt-2.5 border-t border-white/10 text-[11px] font-mono text-neutral-400">
              <span className="text-cyan-300 font-semibold">99.8% Transmittance</span>
              <span>&bull;</span>
              <span>Scratch Resistant</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: lightweightOpacity, y: lightweightY, scale: lightweightScale }}
          className="hidden md:block absolute bottom-[20%] left-6 lg:left-14 z-20 max-w-xs sm:max-w-sm pointer-events-auto gpu-layer"
        >
          <div className="glass-card p-5 border-l-4 border-l-emerald-400 shadow-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Feather className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase">
                Layer 03 &bull; Ergonomics
              </span>
            </div>
            <h3 className="font-semibold text-white text-base">Ultra-Lightweight Frames</h3>
            <p className="text-xs text-neutral-300 font-light mt-1.5 leading-relaxed">
              Sirf 14.2 grams aerospace titanium aur memory alloy, jisse poora din pehanne par bhi kaan ya naak par koi wazan mehsoos nahi hota.
            </p>
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10 text-[11px] font-mono text-neutral-400">
              <span className="text-emerald-400 font-semibold">14.2g Total Weight</span>
              <span>&bull;</span>
              <span>Flexible Memory</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: bridgeOpacity, y: bridgeY, scale: bridgeScale }}
          className="hidden md:block absolute bottom-[20%] right-6 lg:right-14 z-20 max-w-xs sm:max-w-sm pointer-events-auto gpu-layer"
        >
          <div className="glass-card p-5 border-r-4 border-r-amber-400 shadow-2xl text-right sm:text-left">
            <div className="flex items-center justify-end sm:justify-start gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                Layer 04 &bull; Comfort
              </span>
            </div>
            <h3 className="font-semibold text-white text-base">Marks-Free Silicone Suspension</h3>
            <p className="text-xs text-neutral-300 font-light mt-1.5 leading-relaxed">
              Dual-pivot medical silicone nose pads jo nose bridge par pressure marks chhodhe baghair perfect grip banaye rakhte hain.
            </p>
            <div className="flex items-center justify-end sm:justify-start gap-2 mt-3 pt-2.5 border-t border-white/10 text-[11px] font-mono text-neutral-400">
              <span className="text-amber-300 font-semibold">Hypoallergenic</span>
              <span>&bull;</span>
              <span>No Red Marks</span>
            </div>
          </div>
        </motion.div>

        {/* MOBILE RESPONSIVE SINGLE DYNAMIC DOCK */}
        <div className="block md:hidden absolute top-28 inset-x-4 z-20 pointer-events-auto">
          <div className="glass-card p-4 border border-white/15 shadow-2xl transition-all duration-300">
            {mobileTier === 0 ? (
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-400 font-mono mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>LAYER 01</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Blue-Cut Technology (Screens ke liye)</h4>
                <p className="text-xs text-neutral-300 mt-0.5">Mobiles &amp; laptops ki 420nm harmful blue-light ko block karta hai.</p>
              </div>
            ) : mobileTier === 1 ? (
              <div>
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>LAYER 02</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Anti-Glare Coating</h4>
                <p className="text-xs text-neutral-300 mt-0.5">Headlights aur bright light reflections ko zero karta hai.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
                  <Feather className="w-3.5 h-3.5" />
                  <span>LAYER 03</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Ultra-Lightweight Frames</h4>
                <p className="text-xs text-neutral-300 mt-0.5">14.2g featherweight titanium - zero temporal pressure.</p>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM STICKY SCRUB PROGRESS BAR */}
        <div className="absolute bottom-6 z-30 w-full max-w-md px-4 pointer-events-none">
          <div className="glass-panel px-5 py-3 rounded-2xl border border-white/15 shadow-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">EXPLODED ASSEMBLY SCRUB</span>
              <span ref={pctSpanRef} className="text-cyan-300 font-bold">0%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

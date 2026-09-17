// src/components/HeroSection.tsx
"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, ShieldCheck, Eye, Compass } from "lucide-react";

const GlassesHeroCanvas = dynamic(() => import("./GlassesHeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#FFFDF5]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-[#C6A463]/30 border-t-[#C6A463] animate-spin" />
        <span className="text-[11px] font-mono text-[#8B7355] uppercase tracking-[0.25em]">
          Calibrating Optical Studio...
        </span>
      </div>
    </div>
  ),
});

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollVal, setScrollVal] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollVal(latest);
  });

  // Layer 1: Opening Monumental Typography (0.0 -> 0.32)
  const heroTextOpacity = useTransform(scrollYProgress, [0.0, 0.22, 0.32], [1, 0.8, 0]);
  const heroTextY = useTransform(scrollYProgress, [0.0, 0.32], [0, -60]);
  const heroTextScale = useTransform(scrollYProgress, [0.0, 0.32], [1, 0.94]);

  // Layer 2: CTA Buttons (fade slightly earlier for clean inspection)
  const ctaOpacity = useTransform(scrollYProgress, [0.0, 0.16, 0.26], [1, 0.9, 0]);
  const ctaY = useTransform(scrollYProgress, [0.0, 0.26], [0, 25]);

  // Layer 3: Scroll Indicator (visible at start, fades quickly)
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0.0, 0.12], [1, 0]);

  // Layer 4: Architectural Technical Annotations (appear as glasses rotate & shift)
  const spec1Opacity = useTransform(scrollYProgress, [0.28, 0.42, 0.68, 0.82], [0, 1, 1, 0]);
  const spec1X = useTransform(scrollYProgress, [0.28, 0.42, 0.68, 0.82], [-30, 0, 0, -20]);

  const spec2Opacity = useTransform(scrollYProgress, [0.35, 0.48, 0.72, 0.85], [0, 1, 1, 0]);
  const spec2X = useTransform(scrollYProgress, [0.35, 0.48, 0.72, 0.85], [30, 0, 0, 20]);

  const spec3Opacity = useTransform(scrollYProgress, [0.42, 0.54, 0.76, 0.88], [0, 1, 1, 0]);
  const spec3Y = useTransform(scrollYProgress, [0.42, 0.54, 0.76, 0.88], [25, 0, 0, 20]);

  // Dynamic warm background ambient shifts
  const bgGlowLeft = useTransform(scrollYProgress, [0, 1], ["25%", "65%"]);
  const bgGlowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.12, 0.22, 0.15]);

  return (
    <section
      ref={containerRef}
      className="relative h-[260vh] sm:h-[280vh] w-full max-w-full bg-[#FFFDF5] selection:bg-[#C6A463]/30"
    >
      {/* Sticky Viewport Stage: Full-Screen 3D Studio Canvas */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
        
        {/* Shifting Warm Champagne Ambient Lighting Atmosphere */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Subtle warm cream & ivory base gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF5] via-[#FAF7F0]/90 to-[#F5EFE0]" />
          
          {/* Dynamic shifting golden sun glow */}
          <motion.div
            style={{ left: bgGlowLeft, opacity: bgGlowOpacity }}
            className="absolute top-1/4 -translate-x-1/2 w-[550px] sm:w-[850px] h-[550px] sm:h-[850px] rounded-full bg-gradient-to-br from-[#C6A463]/25 via-[#E2C485]/15 to-transparent blur-[140px] sm:blur-[180px]"
          />
          
          <div className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full bg-[#D4AF37]/10 blur-[130px]" />
          <div className="absolute top-1/2 -left-32 w-[350px] h-[350px] rounded-full bg-[#FAF7F0] blur-[100px]" />
          
          {/* Subtle architectural luxury vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(60,36,21,0.04)_100%)]" />
        </div>

        {/* 3D Photorealistic Eyewear Canvas (Full Screen, Scroll-Driven) */}
        <div className="absolute inset-0 z-10">
          <GlassesHeroCanvas
            materialId="gold"
            scrollProgress={scrollVal}
          />
        </div>

        {/* =========================================================================
            STAGE 1: EDITORIAL CAMPAIGN OPENING (Headline, Sub-line, Luxury CTAs)
           ========================================================================= */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-26 md:pt-30 flex flex-col items-center text-center pointer-events-none">
          
          <motion.div
            style={{
              opacity: heroTextOpacity,
              y: heroTextY,
              scale: heroTextScale,
            }}
            className="flex flex-col items-center will-change-transform"
          >
            {/* Small Brand Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 border border-[#C6A463]/25 text-[10px] sm:text-[11px] font-mono tracking-[0.24em] text-[#3C2415] uppercase mb-3 sm:mb-4 shadow-[0_2px_12px_rgba(60,36,21,0.04)] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A463] animate-pulse" />
              <span>ALIGSWARE &bull; FIROZABAD</span>
            </div>

            {/* Monumental Fashion Campaign Headline */}
            <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.06em] text-[#3C2415] leading-[1.04] mb-1.5 sm:mb-2 drop-shadow-sm">
              SCULPTED VISION.
            </h1>

            {/* Poetic Second Line */}
            <p className="font-cormorant italic text-xl sm:text-3xl md:text-4xl font-normal text-[#8B7355] tracking-wide mb-4 sm:mb-6">
              Made to be seen.
            </p>
          </motion.div>

          {/* Luxury CTA Action Buttons */}
          <motion.div
            style={{
              opacity: ctaOpacity,
              y: ctaY,
            }}
            className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4 will-change-transform"
          >
            <Link
              href="/shop"
              className="cursor-pointer px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#C6A463] hover:bg-[#A8884A] text-white font-semibold text-[11px] sm:text-xs tracking-[0.14em] uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(198,164,99,0.35)] hover:shadow-[0_6px_30px_rgba(198,164,99,0.45)] active:scale-[0.98] flex items-center gap-2 group"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/appointment"
              className="cursor-pointer px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white/90 hover:bg-white border border-[#C6A463]/30 hover:border-[#C6A463] text-[#3C2415] text-[11px] sm:text-xs font-medium tracking-[0.12em] uppercase transition-all duration-300 shadow-sm backdrop-blur-md"
            >
              <span>BOOK A TRY-ON</span>
            </Link>
          </motion.div>
        </div>

        {/* =========================================================================
            STAGE 2: ARCHITECTURAL TECHNICAL SPECIFICATIONS (Surrounding the 3D Model)
           ========================================================================= */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-between px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
          
          {/* Spec Card 1: Left Chassis Architecture */}
          <motion.div
            style={{ opacity: spec1Opacity, x: spec1X }}
            className="w-64 sm:w-80 glass-card p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#C6A463]/25 bg-white/95 backdrop-blur-xl shadow-[0_15px_45px_rgba(60,36,21,0.08)] will-change-transform pointer-events-auto"
          >
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#C6A463] uppercase tracking-widest mb-1.5 font-bold">
              <Compass className="w-3.5 h-3.5 text-[#C6A463]" />
              <span>01 &bull; CHASSIS ANATOMY</span>
            </div>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#3C2415] mb-1">
              Japanese Beta-Titanium
            </h3>
            <p className="text-[11px] sm:text-xs text-[#8B7355] leading-relaxed mb-2.5">
              0.8mm slender wireframe geometry engineered for weightless balance. Memory-flex temples that never pinch.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#C6A463]/20 text-[10px] font-mono text-[#3C2415]">
              <span className="font-bold text-[#C6A463]">18.4g</span>
              <span>Ultra-Lightweight</span>
            </div>
          </motion.div>

          {/* Right Column: Spec Cards 2 & 3 */}
          <div className="flex flex-col gap-4 sm:gap-6 items-end">
            
            {/* Spec Card 2: Top Right Lens Optics */}
            <motion.div
              style={{ opacity: spec2Opacity, x: spec2X }}
              className="w-64 sm:w-80 glass-card p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#C6A463]/25 bg-white/95 backdrop-blur-xl shadow-[0_15px_45px_rgba(60,36,21,0.08)] will-change-transform pointer-events-auto text-right"
            >
              <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-[#C6A463] uppercase tracking-widest mb-1.5 font-bold">
                <span>02 &bull; OPTICAL REFRACTION</span>
                <Eye className="w-3.5 h-3.5 text-[#C6A463]" />
              </div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#3C2415] mb-1">
                420nm Sapphire Crystal
              </h3>
              <p className="text-[11px] sm:text-xs text-[#8B7355] leading-relaxed mb-2.5">
                Multi-layer anti-reflective coating with high-transmission blue light filtration and scratch-resistant hydrophobic shield.
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#C6A463]/20 text-[10px] font-mono text-[#3C2415]">
                <span className="font-bold text-[#C6A463]">IOR 1.52</span>
                <span>Zero Visual Distortion</span>
              </div>
            </motion.div>

            {/* Spec Card 3: Bottom Right Clinical Heritage */}
            <motion.div
              style={{ opacity: spec3Opacity, y: spec3Y }}
              className="w-64 sm:w-80 glass-card p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#C6A463]/25 bg-white/95 backdrop-blur-xl shadow-[0_15px_45px_rgba(60,36,21,0.08)] will-change-transform pointer-events-auto text-right hidden sm:block"
            >
              <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-[#C6A463] uppercase tracking-widest mb-1.5 font-bold">
                <span>03 &bull; CLINICAL OPTOMETRY</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6A463]" />
              </div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#3C2415] mb-1">
                AMU Clinical Heritage
              </h3>
              <p className="text-[11px] sm:text-xs text-[#8B7355] leading-relaxed mb-2.5">
                Individually inspected and calibrated by Dr. Sheeraz Ahmad in Firozabad for ocular comfort and custom pupillary distance.
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#C6A463]/20 text-[10px] font-mono text-[#3C2415]">
                <span>Certified AMU Optometry</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* =========================================================================
            STAGE 3: BOTTOM SCROLL INSPECT INDICATOR & TELEMETRY
           ========================================================================= */}
        <div className="relative z-20 w-full pb-6 sm:pb-8 flex flex-col items-center pointer-events-none">
          <motion.div
            style={{ opacity: scrollIndicatorOpacity }}
            className="flex flex-col items-center gap-2 will-change-transform"
          >
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.24em] text-[#8B7355] uppercase">
              SCROLL TO INSPECT
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-[#C6A463]/40 flex items-start justify-center p-1 bg-white/60 backdrop-blur-sm"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
                className="w-1.5 h-2 rounded-full bg-[#C6A463]"
              />
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

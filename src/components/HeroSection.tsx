// src/components/HeroSection.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

import FrameSilhouette from "./FrameSilhouette";

const GlassesHeroCanvas = dynamic(() => import("./GlassesHeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center justify-center">
        <FrameSilhouette
          shape="round"
          color="#B88A32"
          className="w-72 sm:w-96 h-40 sm:h-52 drop-shadow-[0_20px_40px_rgba(184,138,50,0.25)] transition-opacity duration-300"
        />
        <div className="absolute inset-x-0 -bottom-4 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B88A32] animate-ping" />
          <span className="text-[10px] font-mono tracking-[0.24em] text-[#B88A32] dark:text-[#D4AF62] uppercase font-semibold">
            Atelier 3D Loading...
          </span>
        </div>
      </div>
    </div>
  ),
});

const HERO_FRAMES = [
  { id: "frame-01", tag: "FRAME 01", material: "gold", name: "24K Champagne Gold", hex: "#B88A32" },
  { id: "frame-02", tag: "FRAME 02", material: "onyx", name: "Matte Onyx Black", hex: "#1E1F24" },
  { id: "frame-03", tag: "FRAME 03", material: "rose", name: "Rose Gold Mirage", hex: "#C99494" },
  { id: "frame-04", tag: "FRAME 04", material: "silver", name: "Arctic Chrome", hex: "#DFE3EA" },
] as const;

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<string>("frame-01");
  const [is360Active, setIs360Active] = useState<boolean>(true);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const { enableBlurOrbs, tier } = useDeviceTier();

  useEffect(() => {
    let ticking = false;
    let lastProgress = -1;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const progress = Math.min(Math.max(-rect.top / (rect.height - windowHeight || 1), 0), 1);
          // Only re-render if progress moved noticeably (> 0.5%)
          if (Math.abs(progress - lastProgress) > 0.005) {
            lastProgress = progress;
            setScrollProgress(progress);
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeMaterial = HERO_FRAMES.find((f) => f.id === selectedFrameId)?.material || "gold";

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F4E9D5] via-[#E8D2A8]/50 to-[#F4E9D5] dark:from-[#0A0A0E] dark:via-[#14141C] dark:to-[#0A0A0E] overflow-hidden flex flex-col justify-between items-center selection:bg-[#B88A32]/30 transition-colors duration-300"
    >
      {/* Warm Ambient Shifting Atmosphere - Gated by tier */}
      {enableBlurOrbs && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-gradient-to-br from-[#D4AF62]/25 via-[#B88A32]/15 to-transparent dark:from-[#D4AF62]/20 dark:via-[#B88A32]/10 ${tier === "MEDIUM" ? "blur-[60px]" : "blur-[140px] sm:blur-[180px]"}`} />
          <div className={`absolute -bottom-20 right-10 w-[450px] h-[450px] rounded-full bg-[#D6B878]/25 dark:bg-[#D4AF62]/15 ${tier === "MEDIUM" ? "blur-[60px]" : "blur-[130px]"}`} />
          <div className={`absolute top-20 left-10 w-[400px] h-[400px] rounded-full bg-[#FFF9EF]/40 dark:bg-[#B88A32]/10 ${tier === "MEDIUM" ? "blur-[50px]" : "blur-[110px]"}`} />
        </div>
      )}

      {/* =========================================================================
          TOP: MONUMENTAL OPENING TYPOGRAPHY
         ========================================================================= */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Brand Name Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/25 dark:border-[#D4AF62]/30 shadow-sm mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
          <span className="text-[11px] font-mono tracking-[0.28em] text-[#4A3928] dark:text-[#D4AF62] uppercase font-bold">
            ALIG&apos;S WARE &bull; FIROZABAD
          </span>
        </motion.div>

        {/* Monumental Headline: SCULPTED VISION. */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.06em] text-[#2A2118] dark:text-[#F5EFE6] leading-[0.94] uppercase drop-shadow-sm"
        >
          SCULPTED<br />
          <span className="inline-block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#2A2118] via-[#B88A32] to-[#2A2118] dark:from-[#F5EFE6] dark:via-[#D4AF62] dark:to-[#F5EFE6]">
            VISION.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-cormorant italic text-lg sm:text-2xl md:text-3xl text-[#4A3928] dark:text-[#B8ADA0] tracking-wide mt-2 sm:mt-3"
        >
          Firozabad &bull; Precision Eyewear
        </motion.p>
      </div>

      {/* =========================================================================
          CENTER: [GIANT 3D FRAME] STAGE & 360° INSPECTION
         ========================================================================= */}
      <div className="relative z-10 w-full max-w-6xl mx-auto my-2 sm:my-4 flex-1 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] md:min-h-[520px]">
        {/* 3D Photorealistic Eyewear Canvas */}
        <div className="w-full h-full absolute inset-0">
          <GlassesHeroCanvas
            materialId={activeMaterial}
            scrollProgress={scrollProgress}
            viewAngle="orbit"
            interactive={true}
            dragOffset={dragOffset}
            onDragChange={setDragOffset}
          />
        </div>

        {/* PHYSICAL CALIPER ANNOTATIONS (Anchored to Eyewear Architecture) */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {/* 1. BETA TITANIUM (Left Arm) */}
          <div className="absolute top-[34%] left-[6%] lg:left-[10%] flex items-center gap-2.5">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-mono tracking-[0.24em] font-black text-[#B88A32] dark:text-[#D4AF62] uppercase">
                BETA TITANIUM
              </span>
              <span className="text-[11px] font-mono text-[#4A3928] dark:text-[#D1C7BA] font-medium">
                Japanese Memory Flex
              </span>
            </div>
            <div className="w-8 h-[1px] bg-[#B88A32]/60 dark:bg-[#D4AF62]/60" />
            <div className="w-2 h-2 rounded-full bg-[#B88A32] dark:bg-[#D4AF62] ring-4 ring-[#B88A32]/25 dark:ring-[#D4AF62]/25 shadow-sm" />
          </div>

          {/* 2. 18.4g ULTRA-LIGHT (Top Bridge) */}
          <div className="absolute top-[14%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
            <div className="px-3.5 py-1 rounded-full bg-[#FFF9EF]/95 dark:bg-[#161622]/95 border border-[#B88A32]/35 dark:border-[#D4AF62]/35 shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B88A32] dark:bg-[#D4AF62] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.22em] font-black text-[#2A2118] dark:text-[#F5EFE6] uppercase">
                18.4g ULTRA-LIGHT
              </span>
            </div>
            <div className="w-[1px] h-5 bg-[#B88A32]/50 dark:bg-[#D4AF62]/50" />
          </div>

          {/* 3. PRECISION FIT (Silicone Pads) */}
          <div className="absolute bottom-[24%] left-[12%] lg:left-[16%] flex items-center gap-2.5">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-mono tracking-[0.24em] font-black text-[#B88A32] dark:text-[#D4AF62] uppercase">
                PRECISION FIT
              </span>
              <span className="text-[11px] font-mono text-[#4A3928] dark:text-[#D1C7BA] font-medium">
                Contoured Silicone Pads
              </span>
            </div>
            <div className="w-7 h-[1px] bg-[#B88A32]/60 dark:bg-[#D4AF62]/60" />
            <div className="w-2 h-2 rounded-full bg-[#B88A32] dark:bg-[#D4AF62] ring-4 ring-[#B88A32]/25 dark:ring-[#D4AF62]/25 shadow-sm" />
          </div>

          {/* 4. OPTICAL CLARITY (Right Lens) */}
          <div className="absolute top-[38%] right-[6%] lg:right-[10%] flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#B88A32] dark:bg-[#D4AF62] ring-4 ring-[#B88A32]/25 dark:ring-[#D4AF62]/25 shadow-sm" />
            <div className="w-8 h-[1px] bg-[#B88A32]/60 dark:bg-[#D4AF62]/60" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono tracking-[0.24em] font-black text-[#B88A32] dark:text-[#D4AF62] uppercase">
                OPTICAL CLARITY
              </span>
              <span className="text-[11px] font-mono text-[#4A3928] dark:text-[#D1C7BA] font-medium">
                420nm Sapphire Crystal
              </span>
            </div>
          </div>
        </div>

        {/* 360° Drag Inspection Floating Control Pill */}
        <div className="absolute bottom-2 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF9EF]/95 dark:bg-[#161622]/95 backdrop-blur-md border border-[#B88A32]/35 dark:border-[#D4AF62]/35 shadow-sm text-xs font-mono text-[#4A3928] dark:text-[#D4AF62]">
            <Compass className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62] animate-spin" style={{ animationDuration: "12s" }} />
            <span className="font-semibold text-[11px] tracking-wider uppercase">
              360&deg; DRAG TO INSPECT
            </span>
            {(dragOffset.x !== 0 || dragOffset.y !== 0) && (
              <button
                type="button"
                onClick={() => setDragOffset({ x: 0, y: 0 })}
                className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-[#B88A32]/15 dark:bg-[#D4AF62]/20 hover:bg-[#B88A32]/25 dark:hover:bg-[#D4AF62]/30 text-[#B88A32] dark:text-[#D4AF62] font-semibold transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM: CTA ACTION BUTTONS & SCROLL PROMPT
         ========================================================================= */}
      <div className="relative z-20 w-full max-w-3xl mx-auto flex flex-col items-center text-center mt-3 sm:mt-5">
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 mb-4">
          <Link
            href="/shop"
            className="cursor-pointer px-8 sm:px-10 py-3.5 rounded-full bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] hover:brightness-105 text-white font-bold text-xs sm:text-sm tracking-[0.16em] uppercase transition-all duration-300 shadow-[0_6px_25px_rgba(184,138,50,0.35)] active:scale-[0.98] flex items-center gap-2"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/appointment"
            className="cursor-pointer px-8 sm:px-10 py-3.5 rounded-full bg-[#FFF9EF] dark:bg-[#161622] hover:bg-white dark:hover:bg-[#1E1E2C] border border-[#B88A32]/35 dark:border-[#D4AF62]/40 text-[#2A2118] dark:text-[#F5EFE6] font-bold text-xs sm:text-sm tracking-[0.16em] uppercase transition-all duration-300 shadow-sm active:scale-[0.98]"
          >
            BOOK TRY-ON
          </Link>
        </div>

        {/* Scroll Indicator Prompt */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono tracking-[0.24em] text-[#6B5740] dark:text-[#B8ADA0] uppercase font-bold">
          <span className="text-sm animate-bounce">&darr;</span>
          <span>SCROLL TO INSPECT</span>
        </div>
      </div>
    </section>
  );
}

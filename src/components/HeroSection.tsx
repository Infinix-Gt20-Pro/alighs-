"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import GlassButton from "./GlassButton";
import GlassCard from "./GlassCard";
import { Sparkles, Eye, ArrowRight } from "lucide-react";

// Dynamically import 3D Canvas with SSR disabled to prevent WebGL server mismatch
const GlassesHeroCanvas = dynamic(() => import("./GlassesHeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] sm:h-[420px] md:h-[460px] flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border border-white/10 border-t-indigo-400 animate-spin" />
    </div>
  ),
});

export default function HeroSection() {
  const scrollToExplode = () => {
    document.getElementById("explode-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMagicLens = () => {
    document.getElementById("magic-lens")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-start overflow-hidden px-4 sm:px-6 pt-16 pb-20">
      {/* ======================================================================
          AMBIENT BACKGROUND LIGHTING & GRADIENTS
          ====================================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Radial Center Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-gradient-to-r from-indigo-500/18 via-purple-500/14 to-cyan-500/18 rounded-full blur-[140px]" />
        {/* Deep Cyan Glow under 3D Model */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-cyan-500/10 rounded-full blur-[110px]" />
      </div>

      {/* ======================================================================
          1. TOP HERITAGE PILL BADGE
          ====================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-pill border border-white/15 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>FIROZABAD HERITAGE &bull; TIMELESS PRECISION</span>
      </motion.div>

      {/* ======================================================================
          2. 3D HERO STAGE: LARGE GLOWING TYPOGRAPHY HEADING "ALIGH'S WARE" BEHIND CANVAS
          ====================================================================== */}
      <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center my-2 sm:my-6 min-h-[420px] sm:min-h-[480px]">
        
        {/* Large Glowing Typography Heading 'ALIGH'S WARE' BEHIND the Canvas */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
          {/* Main Giant Glowing Typography Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-black tracking-tight sm:tracking-tighter uppercase text-center leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-white/10 drop-shadow-[0_0_60px_rgba(6,182,212,0.55)]"
          >
            ALIGH&apos;S WARE
          </motion.h1>

          {/* Subtitle: "SEE THE FUTURE." */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center justify-center gap-3 text-xs sm:text-sm md:text-base font-mono tracking-[0.42em] text-cyan-300 uppercase mt-3 sm:mt-5 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]"
          >
            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-400" />
            <span>See The Future.</span>
            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-400" />
          </motion.div>

          {/* Glowing Ambient Halo behind text */}
          <div className="absolute w-[600px] sm:w-[900px] h-[220px] sm:h-[350px] bg-gradient-to-r from-cyan-500/25 via-indigo-500/20 to-purple-500/25 rounded-full blur-[110px] -z-10" />
        </div>

        {/* 3D Eyeglasses Canvas (Interactive Centerpiece directly IN FRONT of heading) */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <GlassesHeroCanvas />
        </div>

      </div>

      {/* ======================================================================
          4. FOREGROUND INTERACTION PROMPT, COPY, CTAS & CARDS
          ====================================================================== */}
      <div className="relative z-20 max-w-4xl w-full mx-auto flex flex-col items-center text-center">
        {/* Interactive 3D Hint */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-neutral-400 mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Interactive 3D Viewport &bull; Cursor se rotate &amp; inspect karein</span>
        </motion.div>

        {/* Short Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.6 }}
          className="text-base sm:text-xl font-medium text-neutral-200 mb-8 max-w-2xl leading-relaxed"
        >
          Firozabad ki bharosemand offline quality,{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent font-bold">
            ab online
          </span>
          .
        </motion.p>

        {/* CTA Buttons: Find Your Frame & Experience Magic Lens */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 280, damping: 22 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <GlassButton
            variant="primary"
            size="lg"
            onClick={scrollToExplode}
            className="px-8 py-4 text-base font-semibold shadow-[0_0_30px_rgba(99,102,241,0.5)] border-indigo-400/40"
          >
            <Eye className="w-5 h-5 text-cyan-300" />
            <span>Find Your Frame</span>
            <ArrowRight className="w-4 h-4 text-neutral-300" />
          </GlassButton>

          <GlassButton
            variant="default"
            size="lg"
            onClick={scrollToMagicLens}
            className="px-7 py-4 text-base"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Experience Magic Lens</span>
          </GlassButton>
        </motion.div>

        {/* Quick Metric Badges */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, type: "spring", stiffness: 280, damping: 22 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 w-full max-w-2xl"
        >
          <GlassCard className="p-4 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Lens Matrix</span>
            <span className="text-sm font-semibold text-white mt-1 block">Anti-Glare Sapphire</span>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Weight Index</span>
            <span className="text-sm font-semibold text-white mt-1 block">14.2g Featherweight</span>
          </GlassCard>

          <GlassCard className="p-4 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Firozabad Legacy</span>
            <span className="text-sm font-semibold text-emerald-400 mt-1 block">100% Genuine Craft</span>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

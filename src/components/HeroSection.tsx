// src/components/HeroSection.tsx
"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import {
  Sparkles,
  Eye,
  ArrowRight,
  ShieldCheck,
  Feather,
  Award,
  ChevronDown,
  Calendar
} from "lucide-react";
import { FRAME_MATERIALS } from "./GlassesModel";

const GlassesHeroCanvas = dynamic(() => import("./GlassesHeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] sm:h-[440px] md:h-[500px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border border-amber-500/20 border-t-amber-400 animate-spin" />
        <span className="text-xs font-mono text-amber-300/80 uppercase tracking-widest">
          Calibrating 3D Optics...
        </span>
      </div>
    </div>
  ),
});

export default function HeroSection() {
  const [selectedMaterial, setSelectedMaterial] = useState("gold");
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollVal, setScrollVal] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollVal(latest);
  });

  // Motion Scroll Transforms for Next-Level Parallax
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.45, 0]);

  const canvasY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.15, 1.25]);

  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.7, 0]);

  const bgOrbY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const bgOrbY2 = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[96vh] flex flex-col items-center justify-start overflow-hidden px-4 sm:px-6 pt-10 sm:pt-14 pb-20"
    >
      {/* Dynamic Ambient Background Aura with Parallax Motion */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          style={{ y: bgOrbY1 }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-gradient-to-r from-amber-600/15 via-indigo-600/15 to-cyan-500/15 rounded-full blur-[160px]"
        />
        <motion.div
          style={{ y: bgOrbY2 }}
          className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-500/12 rounded-full blur-[130px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />
      </div>

      {/* Top Heritage Optical Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#0c0d12]/90 border border-amber-400/40 text-xs font-mono text-amber-300 uppercase tracking-[0.25em] mb-4 shadow-[0_0_25px_rgba(212,175,55,0.2)] backdrop-blur-xl"
      >
        <span className="text-amber-400">✦</span>
        <span>EST. 1988 &bull; FIROZABAD ATELIER &bull; ARCHITECTURAL EYEWEAR</span>
        <span className="text-amber-400">✦</span>
      </motion.div>

      {/* 3D Hero Stage with Sculpted Roman Imperial Cinzel Typography */}
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center my-2 sm:my-4 min-h-[440px] sm:min-h-[520px]">
        {/* Giant Next-Level Cinzel Typography Heading BEHIND the Canvas */}
        <motion.div
          style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0"
        >
          <h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl lg:text-[9.8rem] font-bold tracking-[0.14em] sm:tracking-[0.18em] uppercase text-center leading-[0.95] text-gold-gradient gold-glow drop-shadow-[0_0_90px_rgba(212,175,55,0.45)]">
            ALIGH&apos;S
            <br />
            WARE
          </h1>

          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm md:text-base font-mono tracking-[0.4em] text-amber-300 uppercase mt-4 sm:mt-6 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
            <span className="w-12 sm:w-24 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
            <span>SCULPTED OPTICS &bull; CLINICAL VISION</span>
            <span className="w-12 sm:w-24 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
          </div>
        </motion.div>

        {/* 3D Eyeglasses Canvas with Scroll Elevation */}
        <motion.div
          style={{ y: canvasY, scale: canvasScale }}
          className="relative z-10 w-full flex items-center justify-center pointer-events-auto"
        >
          <GlassesHeroCanvas materialId={selectedMaterial} scrollYProgress={scrollVal} />
        </motion.div>

        {/* Interactive Real-Time 3D Material Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-20 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-full bg-[#0c0d12]/95 border border-amber-400/30 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
        >
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300/80 pl-3 pr-1 hidden sm:inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Frame Finish:
          </span>
          {FRAME_MATERIALS.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setSelectedMaterial(mat.id)}
              className={`cursor-pointer group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                selectedMaterial === mat.id
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_25px_rgba(212,175,55,0.45)] scale-105"
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-white/40 shadow-inner flex-shrink-0"
                style={{ backgroundColor: mat.color }}
              />
              <span className="font-mono text-[11px]">{mat.name.split(" ")[1] || mat.name}</span>
              {selectedMaterial === mat.id && (
                <span className="text-[10px] font-mono text-black px-1.5 py-0.5 rounded bg-amber-200">
                  {mat.badge}
                </span>
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Foreground Copy & CTAs with Motion Parallax */}
      <motion.div
        style={{ y: subtitleY, opacity: subtitleOpacity }}
        className="relative z-20 max-w-4xl w-full mx-auto flex flex-col items-center text-center mt-6"
      >
        <p className="font-cormorant text-2xl sm:text-3xl md:text-4xl italic font-light text-neutral-200 mb-8 max-w-2xl leading-relaxed">
          Firozabad ki bharosemand offline optical legacy,{" "}
          <span className="not-italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-cyan-300">
            ab 3D digital luxury ke saath
          </span>
          .
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/shop"
            className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-bold text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(212,175,55,0.45)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/appointment"
            className="cursor-pointer inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm border border-white/15 hover:border-amber-400/50 backdrop-blur-xl transition-all duration-300 hover:scale-105"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Book Clinic Appointment</span>
          </Link>
        </div>

        {/* Trust Badges Bar with Glass Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
          <div className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-300 backdrop-blur-lg">
            <Feather className="w-4 h-4 text-amber-400 shrink-0" />
            <span>18g Featherweight Titanium</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-300 backdrop-blur-lg">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>420nm Blue-Cut Sapphire</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-300 backdrop-blur-lg">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AMU Clinical Optometry</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

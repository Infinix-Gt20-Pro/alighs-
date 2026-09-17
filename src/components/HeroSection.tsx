"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Eye, ArrowRight, ShieldCheck, Feather, Award } from "lucide-react";
import { FRAME_MATERIALS } from "./GlassesModel";

const GlassesHeroCanvas = dynamic(() => import("./GlassesHeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] sm:h-[420px] md:h-[480px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full border border-amber-500/20 border-t-amber-400 animate-spin" />
        <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Loading 3D Viewport...</span>
      </div>
    </div>
  ),
});

export default function HeroSection() {
  const [selectedMaterial, setSelectedMaterial] = useState("gold");

  const scrollToExplode = () => {
    document.getElementById("explode-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const currentMat = FRAME_MATERIALS.find((m) => m.id === selectedMaterial) || FRAME_MATERIALS[0];

  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-start overflow-hidden px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
      {/* Dynamic Ambient Background Aura */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[520px] bg-gradient-to-r from-amber-600/12 via-indigo-600/15 to-cyan-500/14 rounded-full blur-[150px]" />
        <div className="absolute top-[46%] left-1/2 -translate-x-1/2 w-[650px] h-[280px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Heritage Optical Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/30 text-xs font-mono text-amber-300 uppercase tracking-widest mb-4 shadow-[0_0_25px_rgba(212,175,55,0.15)]"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>FIROZABAD ATELIER &bull; ARCHITECTURAL EYEWEAR</span>
      </motion.div>

      {/* 3D Hero Stage with Glowing Typography in Background */}
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center my-2 sm:my-4 min-h-[420px] sm:min-h-[490px]">
        {/* Giant Glowing Typography Heading BEHIND the Canvas */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
          <motion.h1
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[10.8rem] font-black tracking-tight sm:tracking-tighter uppercase text-center leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-white/10 drop-shadow-[0_0_70px_rgba(212,175,55,0.35)]"
          >
            ALIGH&apos;S WARE
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center justify-center gap-3 text-xs sm:text-sm md:text-base font-mono tracking-[0.45em] text-amber-300 uppercase mt-2 sm:mt-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
          >
            <span className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
            <span>Sculpted Optics &bull; Clinical Vision</span>
            <span className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
          </motion.div>
        </div>

        {/* 3D Eyeglasses Canvas */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <GlassesHeroCanvas materialId={selectedMaterial} />
        </div>

        {/* Interactive Real-Time 3D Material Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="relative z-20 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-full bg-[#121318]/90 border border-white/15 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
        >
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 pl-3 pr-1 hidden sm:inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Finish:
          </span>
          {FRAME_MATERIALS.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setSelectedMaterial(mat.id)}
              className={`cursor-pointer group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                selectedMaterial === mat.id
                  ? "bg-gradient-to-r from-white/20 to-white/10 border border-amber-400/60 text-white shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-105"
                  : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-inner flex-shrink-0"
                style={{ backgroundColor: mat.color }}
              />
              <span>{mat.name.split(" ")[1] || mat.name}</span>
              {selectedMaterial === mat.id && (
                <span className="text-[10px] font-mono text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                  {mat.badge}
                </span>
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Foreground Copy & CTAs */}
      <div className="relative z-20 max-w-4xl w-full mx-auto flex flex-col items-center text-center mt-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg sm:text-2xl font-light text-neutral-200 mb-8 max-w-2xl leading-relaxed"
        >
          Firozabad ki bharosemand offline optical legacy,{" "}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-cyan-300">
            ab 3D digital luxury ke saath
          </span>
          .
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/shop"
            className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-semibold text-base shadow-[0_0_35px_rgba(212,175,55,0.45)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Eye className="w-5 h-5 text-black" />
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 text-black/80" />
          </Link>

          <Link
            href="/appointment"
            className="cursor-pointer inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-white font-medium text-base hover:border-amber-400/40 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Book Clinic Appointment</span>
          </Link>
        </motion.div>

        {/* Triple Luxury Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl"
        >
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-left flex items-start gap-3.5 hover:border-amber-400/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Lens Protection</span>
              <span className="text-sm font-semibold text-white mt-0.5 block">Anti-Glare Sapphire 420nm</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-left flex items-start gap-3.5 hover:border-cyan-400/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
              <Feather className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Weight Index</span>
              <span className="text-sm font-semibold text-white mt-0.5 block">12.4g Pure Featherweight</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-left flex items-start gap-3.5 hover:border-emerald-400/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Clinical Authority</span>
              <span className="text-sm font-semibold text-white mt-0.5 block">AMU-Certified Optometry</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

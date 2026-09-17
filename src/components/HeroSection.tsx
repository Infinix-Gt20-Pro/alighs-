// src/components/HeroSection.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Sparkles,
  Eye,
  ArrowRight,
  ShieldCheck,
  Feather,
  Award,
  Calendar,
  RotateCw,
  Sliders,
  ShoppingBag,
  CheckCircle2,
  Maximize2
} from "lucide-react";
import { FRAME_MATERIALS } from "./GlassesModel";
import { useCart } from "@/context/CartContext";

const GlassesHeroCanvas = dynamic(() => import("./GlassesHeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] sm:h-[540px] md:h-[580px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full border border-amber-500/20 border-t-amber-400 animate-spin" />
        <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">
          Calibrating Enterprise 3D Optics...
        </span>
      </div>
    </div>
  ),
});

export default function HeroSection() {
  const [selectedMaterial, setSelectedMaterial] = useState("gold");
  const [viewAngle, setViewAngle] = useState<"orbit" | "front" | "profile" | "macro">("orbit");
  const [lightingTheme, setLightingTheme] = useState<"obsidian" | "champagne" | "cyber">("obsidian");
  const { addToCart, openCart } = useCart();

  const activeMat = FRAME_MATERIALS.find((m) => m.id === selectedMaterial) || FRAME_MATERIALS[0];

  const handleQuickAdd = () => {
    addToCart(
      {
        productId: "imperial-classic-titanium",
        name: "Imperial Hexagon Beta-Titanium",
        slug: "nocturne-bold-clubmaster",
        price: 2499,
        originalPrice: 4299,
        color: activeMat.name,
        colorHex: activeMat.color,
        image: "/images/model-dark.jpg",
        weight: "18.4g"
      },
      1
    );
    openCart();
  };

  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-start overflow-hidden px-3 sm:px-6 pt-6 sm:pt-10 pb-16 bg-[#070709]">
      {/* Editorial Motion Video Ambient Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover object-center brightness-45 contrast-120 will-change-transform"
        >
          <source src="/videos/man-putting-on-glasses.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/70 to-[#070709]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />
      </div>

      {/* TOP ATELIER BADGE & ENTERPRISE STATUS */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0c0d12]/90 border border-amber-400/30 text-xs font-mono text-amber-300 uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.15)] backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ENTERPRISE 3D ATELIER &bull; FIROZABAD EST. 1988</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>AMU CLINICAL OPTOMETRY VERIFIED</span>
        </div>
      </div>

      {/* BRAND ARCHITECTURAL HEADLINE */}
      <div className="relative z-10 text-center max-w-5xl mx-auto mb-2 sm:mb-4">
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.14em] sm:tracking-[0.18em] uppercase leading-[0.98] text-gold-gradient gold-glow drop-shadow-[0_0_80px_rgba(212,175,55,0.35)]">
          ALIGH&apos;S WARE
        </h1>
        <p className="font-cormorant text-lg sm:text-2xl md:text-3xl italic font-light text-neutral-300 mt-2 max-w-3xl mx-auto">
          Sculpted Japanese Beta-Titanium with Sapphire 420nm Clarity &bull;{" "}
          <span className="not-italic font-medium text-amber-300">Interactive 360&deg; Studio Inspection</span>
        </p>
      </div>

      {/* ====================================================================
          ENTERPRISE DIGITAL SHOWROOM COCKPIT (Left HUD + 3D Stage + Right HUD)
          ==================================================================== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center my-2">
        
        {/* LEFT HUD: CLINICAL TELEMETRY & SPECIFICATIONS (3 Cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-3">
          <div className="glass-card p-5 rounded-3xl border border-white/10 bg-[#0c0d12]/80 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 border-b border-white/10 pb-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>CLINICAL SPECIFICATIONS</span>
            </div>

            <div className="flex flex-col gap-3 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px]">01 &bull; CALIBER &amp; GEOMETRY</span>
                <span className="text-white font-bold">52&square;19 &bull; 145mm Pantos</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">02 &bull; FRAME MASS</span>
                <span className="text-amber-300 font-bold">18.4g Ultra-Lightweight</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">03 &bull; LENS FILTRATION</span>
                <span className="text-cyan-300 font-bold">420nm Sapphire Blue-Cut</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">04 &bull; NOSE SUSPENSION</span>
                <span className="text-zinc-300">Dual-Pivot Medical Silicone</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">05 &bull; HINGE SYSTEM</span>
                <span className="text-zinc-300">5-Barrel Titanium Interlock</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>Firozabad Atelier</span>
              <span className="text-emerald-400 font-bold">&bull; 100% Titanium</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white/[0.02] to-transparent border border-amber-500/20 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>DR. SHEERAZ AHMAD</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              AMU-Certified optometrist prescription guarantee. Every frame custom adjusted for Indian facial bone symmetry.
            </p>
          </div>
        </div>

        {/* CENTER STAGE: 3D INTERACTIVE EYEWEAR CANVAS (6 Cols) */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
          {/* Main 3D Canvas */}
          <GlassesHeroCanvas
            materialId={selectedMaterial}
            viewAngle={viewAngle}
            lightingTheme={lightingTheme}
          />

          {/* Interactive Inspection Mode Pills */}
          <div className="relative -mt-10 sm:-mt-12 z-20 flex flex-wrap items-center justify-center gap-2 bg-[#0c0d12]/90 p-1.5 rounded-full border border-white/15 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setViewAngle("orbit")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                viewAngle === "orbit"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>360&deg; Orbit</span>
            </button>

            <button
              onClick={() => setViewAngle("front")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                viewAngle === "front"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Front Fit</span>
            </button>

            <button
              onClick={() => setViewAngle("profile")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                viewAngle === "profile"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>45&deg; Profile</span>
            </button>

            <button
              onClick={() => setViewAngle("macro")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                viewAngle === "macro"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Hinge Macro</span>
            </button>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase">
              ✦ Click &amp; Drag Anywhere to Rotate in Real-Time 3D ✦
            </span>
          </div>
        </div>

        {/* RIGHT HUD: ATELIER FINISHES & STUDIO LIGHTING (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {/* Material Finishes Card */}
          <div className="glass-card p-5 rounded-3xl border border-white/10 bg-[#0c0d12]/80 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-3 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ATELIER FINISH</span>
              </span>
              <span className="text-[10px] text-zinc-500">PBR PHYSICAL</span>
            </div>

            <div className="flex flex-col gap-2">
              {FRAME_MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterial(mat.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-2xl text-xs font-mono transition-all duration-300 cursor-pointer ${
                    selectedMaterial === mat.id
                      ? "bg-gradient-to-r from-white/10 to-amber-400/10 border border-amber-400/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                      : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner flex-shrink-0"
                      style={{ backgroundColor: mat.color }}
                    />
                    <span className="font-medium text-white">{mat.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase px-2 py-0.5 rounded bg-white/5">
                    {mat.badge.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Studio Lighting Environment Selector */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                Studio Atmosphere:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setLightingTheme("obsidian")}
                  className={`p-2 rounded-xl text-[10px] font-mono transition-all text-center cursor-pointer ${
                    lightingTheme === "obsidian"
                      ? "bg-white/15 text-white border border-white/30"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white border border-transparent"
                  }`}
                >
                  Obsidian
                </button>
                <button
                  onClick={() => setLightingTheme("champagne")}
                  className={`p-2 rounded-xl text-[10px] font-mono transition-all text-center cursor-pointer ${
                    lightingTheme === "champagne"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white border border-transparent"
                  }`}
                >
                  24K Gold
                </button>
                <button
                  onClick={() => setLightingTheme("cyber")}
                  className={`p-2 rounded-xl text-[10px] font-mono transition-all text-center cursor-pointer ${
                    lightingTheme === "cyber"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white border border-transparent"
                  }`}
                >
                  Cyber
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ====================================================================
          BOTTOM ENTERPRISE ACTION BAR (Live Pricing + CTAs)
          ==================================================================== */}
      <div className="relative z-20 w-full max-w-4xl mx-auto mt-6 sm:mt-8">
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-amber-400/30 bg-[#0c0d12]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-amber-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>IN ATELIER STOCK &bull; HAND-POLISHED READY FOR SHIPMENT</span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Imperial Geometric Beta-Titanium
            </h3>
            <div className="flex items-baseline justify-center sm:justify-start gap-3 mt-1.5">
              <span className="text-3xl font-bold font-mono text-amber-400">
                ₹2,499
              </span>
              <span className="text-base font-mono text-zinc-500 line-through">
                ₹4,299
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                Save 42% &bull; Free Delivery
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleQuickAdd}
              className="cursor-pointer w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:shadow-[0_0_45px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span>Add to Bag</span>
            </button>

            <Link
              href="/appointment"
              className="cursor-pointer w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-xs font-mono tracking-wider border border-white/15 hover:border-amber-400/50 backdrop-blur-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book Clinic Try-On</span>
            </Link>
          </div>
        </div>

        {/* Triple Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-mono text-neutral-400 text-center">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center gap-2">
            <Feather className="w-4 h-4 text-amber-400" />
            <span>18.4g Featherweight Titanium</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>420nm Blue-Cut Sapphire Optics</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>AMU Clinical Optometry Approved</span>
          </div>
        </div>
      </div>
    </section>
  );
}

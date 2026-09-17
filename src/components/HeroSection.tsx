// src/components/HeroSection.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  RotateCw,
  ArrowRight,
  Eye,
  CheckCircle2,
  Sliders,
  Maximize2,
  ShieldCheck
} from "lucide-react";
import { FRAME_MATERIALS } from "./GlassesModel";
import { useCart } from "@/context/CartContext";

const GlassesHeroCanvas = dynamic(() => import("./GlassesHeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] sm:h-[400px] md:h-[460px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-amber-500/20 border-t-amber-400 animate-spin" />
        <span className="text-[11px] font-mono text-amber-300 uppercase tracking-widest">
          Calibrating Optical Studio...
        </span>
      </div>
    </div>
  ),
});

const REAL_FRAME_PHOTOS: Record<string, { name: string; image: string; brand: string; subtitle: string; price: number; originalPrice: number }> = {
  gold: {
    name: "Vincent Chase Sleek Steel Titanium",
    image: "/images/products/gold-rimless-rectangle-vincent-chase-sleek-steel-vc-e17135-c1-218257.jpg",
    brand: "Vincent Chase Atelier",
    subtitle: "24K Champagne Gold • Ultra-Light Beta-Titanium",
    price: 2499,
    originalPrice: 4299,
  },
  onyx: {
    name: "Rich Matte Onyx Square Rim",
    image: "/images/products/black-silver-square-full-rim-200430.jpg",
    brand: "Signature Acetate",
    subtitle: "Matte Onyx Black • Italian Handcrafted Acetate",
    price: 2199,
    originalPrice: 3999,
  },
  silver: {
    name: "Gunmetal Classic Titanium Round",
    image: "/images/products/gunmetal-full-rim-round-150798.jpg",
    brand: "Lenskart Air Classics",
    subtitle: "Pure Arctic Chrome • Japanese Wireframe Silhouette",
    price: 1999,
    originalPrice: 3499,
  },
  rose: {
    name: "Rose Mirage Air-Pop Edition",
    image: "/images/products/gradient-transparent-dark-pink-to-clear-gunmental-full-rim-cat-eye-lenskart-air-air-pop-la-e17025-242248.jpg",
    brand: "Lenskart Air Pop",
    subtitle: "Rose Gold Mirage • Dual-Tone Gradient Titanium",
    price: 2299,
    originalPrice: 3899,
  },
  emerald: {
    name: "John Jacobs Celestia Heritage",
    image: "/images/products/brown-full-rim-clubmaster-john-jacobs-celestia-jj-e70250-239316.jpg",
    brand: "John Jacobs Heritage",
    subtitle: "Firozabad Heritage Edition • Hand-Polished Tortoise & Gold",
    price: 2899,
    originalPrice: 4999,
  },
};

export default function HeroSection() {
  const [displayMode, setDisplayMode] = useState<"real" | "3d">("real");
  const [selectedMaterial, setSelectedMaterial] = useState("gold");
  const [viewAngle, setViewAngle] = useState<"orbit" | "front" | "profile">("orbit");
  const { addToCart, openCart } = useCart();

  const activeReal = REAL_FRAME_PHOTOS[selectedMaterial] || REAL_FRAME_PHOTOS.gold;
  const activeMat = FRAME_MATERIALS.find((m) => m.id === selectedMaterial) || FRAME_MATERIALS[0];

  const handleQuickAdd = () => {
    addToCart(
      {
        productId: `hero-${selectedMaterial}`,
        name: activeReal.name,
        slug: "gold-rimless-rectangle-vincent-chase-sleek-steel-vc-e17135-c1-218257",
        price: activeReal.price,
        originalPrice: activeReal.originalPrice,
        color: activeMat.name,
        colorHex: activeMat.color,
        image: activeReal.image,
        weight: "18.4g",
      },
      1
    );
    openCart();
  };

  return (
    <section className="relative flex flex-col items-center justify-start overflow-hidden px-4 sm:px-6 pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 bg-[#070709] w-full max-w-full">
      {/* Subtle Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/10 via-indigo-500/5 to-transparent rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
      </div>

      {/* 1. Minimal Luxury Eyebrow */}
      <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono tracking-widest text-amber-300/90 uppercase mb-5 backdrop-blur-xl shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>ALIG&apos;S WARE &bull; FIROZABAD ATELIER</span>
      </div>

      {/* 2. Editorial Clean Typography */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mb-4 px-2">
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.03em] text-white leading-[1.08] mb-3">
          Sculpted Titanium. <span className="italic font-cormorant font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-white">Clinical Vision.</span>
        </h1>
        <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
          AMU-certified ophthalmic optics meets Japanese Beta-Titanium. Calibrated with 420nm Sapphire Blue-Cut clarity in Firozabad.
        </p>
      </div>

      {/* 3. Primary Focused CTA Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mb-8">
        <Link
          href="/shop"
          className="cursor-pointer px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-semibold text-xs sm:text-sm tracking-wide hover:brightness-110 active:scale-98 transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center gap-2"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/appointment"
          className="cursor-pointer px-6 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-neutral-300 hover:text-white text-xs sm:text-sm font-medium transition-all"
        >
          <span>Book Free Try-On</span>
        </Link>
      </div>

      {/* 4. Centerpiece Mode Switcher (Real 4K Photo vs 360° 3D) */}
      <div className="relative z-10 flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 mb-6 backdrop-blur-xl">
        <button
          onClick={() => setDisplayMode("real")}
          className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
            displayMode === "real"
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.35)]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real Studio Photo (4K)</span>
        </button>
        <button
          onClick={() => setDisplayMode("3d")}
          className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
            displayMode === "3d"
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.35)]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>360&deg; 3D Inspection</span>
        </button>
      </div>

      {/* 5. Central Hero Product Stage (Clean, Spacious, Minimalist) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {displayMode === "real" ? (
          /* REAL STUDIO PHOTOGRAPHY SHOWCASE */
          <div className="relative w-full max-w-2xl min-h-[300px] sm:min-h-[380px] md:min-h-[420px] rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 p-6 sm:p-10 flex flex-col items-center justify-center shadow-2xl backdrop-blur-xl group overflow-hidden">
            {/* Subtle soft backdrop radial glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 w-full flex items-center justify-center py-4">
              <img
                src={activeReal.image}
                alt={activeReal.name}
                className="max-h-[220px] sm:max-h-[280px] md:max-h-[320px] w-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Product Meta */}
            <div className="relative z-10 text-center mt-2">
              <span className="text-[10px] sm:text-xs font-mono text-amber-400 tracking-wider uppercase block mb-1">
                {activeReal.brand} &bull; {activeReal.subtitle}
              </span>
              <h2 className="text-lg sm:text-xl font-cinzel font-bold text-white mb-2">
                {activeReal.name}
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                  ₹{activeReal.price.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm font-mono text-neutral-500 line-through">
                  ₹{activeReal.originalPrice.toLocaleString()}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  In Stock &bull; Free Try-On
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* 3D INTERACTIVE EYEWEAR CANVAS (Slender, Physically Proportioned, No Cartoon Elements) */
          <div className="relative w-full max-w-3xl flex flex-col items-center justify-center">
            <GlassesHeroCanvas
              materialId={selectedMaterial}
              viewAngle={viewAngle}
            />

            {/* 3D Angle Pills */}
            <div className="relative -mt-6 sm:-mt-8 z-20 flex items-center gap-1.5 bg-[#0c0d12]/95 p-1 rounded-full border border-white/15 backdrop-blur-2xl shadow-xl">
              <button
                onClick={() => setViewAngle("orbit")}
                className={`cursor-pointer px-3 py-1 rounded-full text-[11px] font-mono transition-all flex items-center gap-1 ${
                  viewAngle === "orbit"
                    ? "bg-amber-400 text-black font-bold shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <RotateCw className="w-3 h-3" />
                <span>360&deg; Orbit</span>
              </button>
              <button
                onClick={() => setViewAngle("front")}
                className={`cursor-pointer px-3 py-1 rounded-full text-[11px] font-mono transition-all flex items-center gap-1 ${
                  viewAngle === "front"
                    ? "bg-amber-400 text-black font-bold shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Front</span>
              </button>
              <button
                onClick={() => setViewAngle("profile")}
                className={`cursor-pointer px-3 py-1 rounded-full text-[11px] font-mono transition-all flex items-center gap-1 ${
                  viewAngle === "profile"
                    ? "bg-amber-400 text-black font-bold shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>45&deg;</span>
              </button>
            </div>

            <p className="text-[10px] sm:text-[11px] font-mono text-zinc-500 uppercase tracking-widest mt-2">
              ✦ Drag to Rotate in Real-Time 3D ✦
            </p>
          </div>
        )}

        {/* 6. Minimalist Finish Selector Dots */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-6 mb-4">
          {FRAME_MATERIALS.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setSelectedMaterial(mat.id)}
              className={`cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                selectedMaterial === mat.id
                  ? "bg-white/15 text-white border border-amber-400/50 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                  : "bg-white/[0.03] text-neutral-400 hover:text-white border border-white/10 hover:bg-white/[0.07]"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-white/30 shrink-0 shadow-inner"
                style={{ backgroundColor: mat.color }}
              />
              <span>{mat.name.split(" ")[1] || mat.name}</span>
            </button>
          ))}
        </div>

        {/* Quick Add / Purchase Button */}
        <button
          onClick={handleQuickAdd}
          className="cursor-pointer mt-1 px-8 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-mono text-neutral-200 hover:text-white transition-all flex items-center gap-2 group"
        >
          <span className="text-amber-400 group-hover:scale-110 transition-transform">✦</span>
          <span>Add This Frame to Cart &bull; ₹{activeReal.price.toLocaleString()}</span>
        </button>
      </div>

      {/* 7. Quiet Minimal Specs Bar (Clean, no sci-fi box clutter) */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl mx-auto mt-12 pt-8 border-t border-white/10">
        <div className="text-center p-2">
          <span className="text-xs font-mono text-amber-300 font-bold block">18.4g Ultra-Light</span>
          <span className="text-[11px] text-neutral-500 font-sans">Japanese Beta-Titanium</span>
        </div>
        <div className="text-center p-2">
          <span className="text-xs font-mono text-cyan-300 font-bold block">420nm Sapphire</span>
          <span className="text-[11px] text-neutral-500 font-sans">Anti-Glare Blue-Cut</span>
        </div>
        <div className="text-center p-2">
          <span className="text-xs font-mono text-emerald-300 font-bold block">AMU Optometry</span>
          <span className="text-[11px] text-neutral-500 font-sans">Dr. Sheeraz Verified</span>
        </div>
        <div className="text-center p-2">
          <span className="text-xs font-mono text-white font-bold block">Firozabad Atelier</span>
          <span className="text-[11px] text-neutral-500 font-sans">Custom Fit &amp; Try-On</span>
        </div>
      </div>
    </section>
  );
}

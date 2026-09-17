// src/components/ModelScrollExperience.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Eye,
  ShoppingBag,
  CheckCircle2,
  Zap,
  Film,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const MODELS = [
  {
    id: "cinema",
    name: "Motion Reel",
    label: "Putting On Glasses",
    video: "/videos/man-putting-on-glasses.mp4",
    image: "/images/model-dark.jpg",
    frameName: "Imperial Classic Titanium",
    slug: "nocturne-bold-clubmaster",
    price: 2799,
    originalPrice: 4599,
    finishColor: "#C6A463",
    colorName: "24K Champagne Gold",
    tagline: "Live Motion Capture: High-definition 1080p study of eyewear resting naturally on the facial profile",
    spec: "Ergonomic Curve • 18g Weight • Lens 52mm • Bridge 19mm"
  },
  {
    id: "elena",
    name: "Elena Rostova",
    label: "Milan Runway Icon",
    image: "/images/model-gold.jpg",
    frameName: "Aurelia Gold Round",
    slug: "aurelia-titanium-round",
    price: 2499,
    originalPrice: 4299,
    finishColor: "#C6A463",
    colorName: "24K Champagne Gold",
    tagline: "Ultralight 18g Japanese Beta-Titanium with Sapphire 420nm Blue-Cut Glass",
    spec: "Round Wireframe • 18g Weight • Lens 51mm • Bridge 19mm"
  },
  {
    id: "marcus",
    name: "Marcus Vance",
    label: "Editorial Gentleman",
    image: "/images/model-dark.jpg",
    frameName: "Nocturne Matte Clubmaster",
    slug: "nocturne-bold-clubmaster",
    price: 2799,
    originalPrice: 4599,
    finishColor: "#3C2415",
    colorName: "Obsidian Onyx & Gold",
    tagline: "Handcrafted Italian Acetate Browline with Gold-Plated Precision Micro-Pins",
    spec: "Square Clubmaster • 22g Weight • Lens 53mm • Bridge 20mm"
  }
];

export default function ModelScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeModelIdx, setActiveModelIdx] = useState(0);
  const [blueCutActive, setBlueCutActive] = useState(true);
  const { addToCart, openCart } = useCart();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Ensure video plays smoothly without seek stutter
  useEffect(() => {
    const v = videoRef.current;
    if (v && MODELS[activeModelIdx].video) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [activeModelIdx]);

  // Subtle cinematic zooms & lighting depth during scroll
  const modelScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.04, 1.09]);
  const modelOpacity = useTransform(scrollYProgress, [0, 0.08, 0.88, 1], [0.95, 1, 1, 0.85]);
  const overlayDarkness = useTransform(scrollYProgress, [0, 0.45, 0.85], [0.05, 0.15, 0.3]);

  // Scrollytelling Phase 1: Atelier Silhouette
  const phase1Opacity = useTransform(scrollYProgress, [0.04, 0.18, 0.34], [0, 1, 0]);
  const phase1Y = useTransform(scrollYProgress, [0.04, 0.18, 0.34], [25, 0, -15]);

  // Scrollytelling Phase 2: Bespoke Craftsmanship & Optical Clarity
  const phase2Opacity = useTransform(scrollYProgress, [0.38, 0.52, 0.68], [0, 1, 0]);
  const phase2Y = useTransform(scrollYProgress, [0.38, 0.52, 0.68], [25, 0, -15]);

  // Scrollytelling Phase 3: Wear The Runway Look CTA
  const phase3Opacity = useTransform(scrollYProgress, [0.72, 0.86, 1.0], [0, 1, 1]);
  const phase3Y = useTransform(scrollYProgress, [0.72, 0.86, 1.0], [25, 0, 0]);

  const activeModel = MODELS[activeModelIdx];

  const handleQuickAdd = () => {
    addToCart(
      {
        productId: activeModel.slug,
        name: activeModel.frameName,
        slug: activeModel.slug,
        price: activeModel.price,
        originalPrice: activeModel.originalPrice,
        color: activeModel.colorName,
        colorHex: activeModel.finishColor,
        image: activeModel.image,
        weight: activeModel.spec.includes("18g") ? "18g" : "22g"
      },
      1
    );
    openCart();
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] sm:h-[220vh] bg-[#F4E9D5] w-full max-w-full overflow-hidden"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-1/3 left-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-[#B88A32]/12 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-[#D4AF62]/10 blur-[130px]" />
        </div>

        {/* Section Top Header & Model Switcher Bar */}
        <div className="absolute top-4 sm:top-8 z-40 w-full px-3 sm:px-4 max-w-5xl mx-auto flex flex-col items-center pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#B88A32]/30 bg-[#FFF9EF]/90 backdrop-blur-md mb-2 shadow-[0_2px_15px_rgba(184,138,50,0.15)]">
            <Sparkles className="w-3 h-3 text-[#B88A32]" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#2A2118] uppercase">
              Editorial Runway Showcase
            </span>
          </div>

          {/* Model Switcher Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#FFF9EF]/95 p-1 sm:p-1.5 rounded-full border border-[#B88A32]/25 backdrop-blur-xl shadow-lg max-w-full overflow-x-auto">
            {MODELS.map((m, idx) => {
              const isSelected = activeModelIdx === idx;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModelIdx(idx)}
                  className={`px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-[#B88A32] to-[#D4AF62] text-white font-bold shadow-[0_2px_12px_rgba(184,138,50,0.35)]"
                      : "text-[#6B5740] hover:text-[#2A2118] hover:bg-[#F4E9D5]"
                  }`}
                >
                  {m.video ? (
                    <Film className="w-3 h-3 text-[#B88A32]" />
                  ) : (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.finishColor }} />
                  )}
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* AUTHENTIC EDITORIAL PHOTOGRAPHY & 1080P MOTION REEL */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <motion.div
            style={{ scale: modelScale, opacity: modelOpacity }}
            className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center will-change-transform"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModel.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full max-h-[84vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(60,36,21,0.15)] border border-[#C6A463]/15 bg-[#F5EFE0]"
              >
                {activeModel.video ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover object-center brightness-98 contrast-102 will-change-transform"
                  >
                    <source src={activeModel.video} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={activeModel.image}
                    alt={activeModel.name}
                    fill
                    priority
                    className="object-contain object-center brightness-98 contrast-102"
                    sizes="(max-width: 1024px) 100vw, 1200px"
                  />
                )}

                {/* Soft Vignette & Subtle Warm Gradient Overlays */}
                <motion.div
                  style={{ opacity: overlayDarkness }}
                  className="absolute inset-0 bg-[#3C2415] pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0] via-transparent to-[#FAF7F0]/60 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F0]/80 via-transparent to-[#FAF7F0]/80 pointer-events-none" />

                {/* Blue-Cut Sapphire Optical Sheen Simulation */}
                {blueCutActive && (
                  <motion.div
                    animate={{ opacity: [0.2, 0.45, 0.2] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-radial-at-c from-[#C6A463]/15 via-transparent to-transparent pointer-events-none mix-blend-screen"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Phase 1: 01 ATELIER SILHOUETTE */}
        <motion.div
          style={{ opacity: phase1Opacity, y: phase1Y }}
          className="absolute left-4 right-4 sm:right-auto sm:left-12 lg:left-16 bottom-10 sm:bottom-16 z-30 max-w-sm sm:max-w-md mx-auto sm:mx-0 pointer-events-none"
        >
          <div className="p-6 sm:p-7 rounded-3xl border border-[#B88A32]/30 bg-[#FFF9EF]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(42,33,24,0.12)]">
            <span className="font-cinzel text-3xl sm:text-4xl font-black text-[#B88A32] block tracking-tight mb-1">
              01
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-black tracking-[0.14em] text-[#2A2118] uppercase mb-3 drop-shadow-sm">
              ATELIER SILHOUETTE
            </h3>
            <p className="font-cormorant italic text-xl sm:text-2xl text-[#4A3928] leading-tight mb-3">
              Precision designed<br />
              for everyday vision.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.18em] text-[#B88A32] uppercase font-bold border-t border-[#B88A32]/20 pt-2.5">
              <span>{activeModel.name} &bull; {activeModel.spec}</span>
            </div>
          </div>
        </motion.div>

        {/* Phase 2: Bespoke Craftsmanship & Optical Clarity */}
        <motion.div
          style={{ opacity: phase2Opacity, y: phase2Y }}
          className="absolute left-4 right-4 sm:left-auto sm:right-12 bottom-12 sm:top-28 z-30 max-w-sm sm:max-w-md mx-auto sm:mx-0 pointer-events-none"
        >
          <div className="p-5 sm:p-6 rounded-3xl border border-[#B88A32]/30 bg-[#FFF9EF]/95 backdrop-blur-2xl shadow-[0_15px_40px_rgba(42,33,24,0.1)]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-[#B88A32] mb-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>02 • SAPPHIRE OPTICAL CLARITY</span>
            </div>
            <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-[#2A2118] mb-1">
              {activeModel.frameName}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#4A3928] leading-relaxed mb-3">
              Precision hand-beveled optics with multi-layer sapphire anti-glare filtration and 420nm high-energy blue protection.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-[#F4E9D5] border border-[#B88A32]/20">
                <span className="text-[#6B5740] block text-[9px]">BLUE-CUT</span>
                <span className="text-[#2A2118] font-bold">420nm Sapphire</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F4E9D5] border border-[#B88A32]/20">
                <span className="text-[#6B5740] block text-[9px]">MASS</span>
                <span className="text-[#B88A32] font-bold">18g Feather</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phase 3: Wear The Runway Look CTA */}
        <motion.div
          style={{ opacity: phase3Opacity, y: phase3Y }}
          className="absolute bottom-6 sm:bottom-10 z-40 w-full px-3 sm:px-4 max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="w-full p-5 sm:p-6 rounded-3xl border border-[#B88A32]/35 bg-[#FFF9EF]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(184,138,50,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] sm:text-xs font-mono text-[#B88A32] mb-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>IN STOCK &bull; DISPATCH TODAY</span>
              </div>
              <h4 className="font-cinzel text-lg sm:text-2xl font-bold text-[#2A2118]">
                {activeModel.frameName}
              </h4>
              <div className="flex items-baseline justify-center sm:justify-start gap-2.5 mt-1">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#B88A32]">
                  ₹{activeModel.price}
                </span>
                <span className="text-xs sm:text-sm font-mono text-[#6B5740] line-through">
                  ₹{activeModel.originalPrice}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-emerald-800 bg-emerald-500/15 px-2 py-0.5 rounded-full font-semibold">
                  Save {Math.round(((activeModel.originalPrice - activeModel.price) / activeModel.originalPrice) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="flex-1 sm:flex-none bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] hover:brightness-105 text-white font-bold px-6 py-3 rounded-xl shadow-[0_4px_20px_rgba(184,138,50,0.35)] flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider cursor-pointer transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>

              <Link
                href={`/shop/${activeModel.slug}`}
                className="px-4 py-3 rounded-xl border border-[#B88A32]/30 hover:bg-[#F4E9D5] text-[#2A2118] text-xs font-mono tracking-wider text-center transition-colors font-semibold"
              >
                Specs
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Optical Filter Toggle */}
        <div className="absolute right-3 sm:right-6 bottom-4 sm:bottom-6 z-40 hidden sm:block">
          <button
            onClick={() => setBlueCutActive(!blueCutActive)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#C6A463]/20 text-[11px] font-mono text-[#3C2415] hover:border-[#C6A463] backdrop-blur-xl transition-all shadow-md cursor-pointer"
          >
            <Zap className={`w-3 h-3 ${blueCutActive ? "text-[#C6A463]" : "text-[#A69580]"}`} />
            <span>420nm: {blueCutActive ? "ON" : "OFF"}</span>
          </button>
        </div>

      </div>
    </section>
  );
}

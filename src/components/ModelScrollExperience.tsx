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
    finishColor: "#D4AF37",
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
    finishColor: "#D4AF37",
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
    finishColor: "#1A1A1A",
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

  // Subtle cinematic zooms & lighting depth during scroll (no GPU seek hitches)
  const modelScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.04, 1.09]);
  const modelOpacity = useTransform(scrollYProgress, [0, 0.08, 0.88, 1], [0.92, 1, 1, 0.8]);
  const overlayDarkness = useTransform(scrollYProgress, [0, 0.45, 0.85], [0.15, 0.3, 0.5]);

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
      className="relative h-[200vh] sm:h-[220vh] bg-[#070709] w-full max-w-full overflow-hidden"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-1/3 left-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-amber-500/10 blur-[110px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>

        {/* Section Top Header & Model Switcher Bar */}
        <div className="absolute top-4 sm:top-8 z-40 w-full px-3 sm:px-4 max-w-5xl mx-auto flex flex-col items-center pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-amber-500/30 bg-[#0c0d12]/90 backdrop-blur-md mb-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-300 uppercase">
              Editorial Runway Showcase
            </span>
          </div>

          {/* Model Switcher Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-black/85 p-1 sm:p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl max-w-full overflow-x-auto">
            {MODELS.map((m, idx) => {
              const isSelected = activeModelIdx === idx;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModelIdx(idx)}
                  className={`px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {m.video ? (
                    <Film className="w-3 h-3 text-amber-400" />
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
                className="relative w-full h-full max-h-[84vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)]"
              >
                {activeModel.video ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover object-center brightness-95 contrast-105 will-change-transform"
                  >
                    <source src={activeModel.video} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={activeModel.image}
                    alt={activeModel.name}
                    fill
                    priority
                    className="object-contain object-center brightness-95 contrast-105"
                    sizes="(max-width: 1024px) 100vw, 1200px"
                  />
                )}

                {/* Dark Vignette & Gradient Overlays for Cinematic Atmosphere */}
                <motion.div
                  style={{ opacity: overlayDarkness }}
                  className="absolute inset-0 bg-black pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709]/80 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-transparent to-[#070709] pointer-events-none" />

                {/* Blue-Cut Sapphire Optical Sheen Simulation */}
                {blueCutActive && (
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-radial-at-c from-cyan-400/10 via-transparent to-transparent pointer-events-none mix-blend-screen"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Phase 1: Atelier Silhouette & Anatomy */}
        <motion.div
          style={{ opacity: phase1Opacity, y: phase1Y }}
          className="absolute left-4 right-4 sm:right-auto sm:left-12 bottom-12 sm:bottom-20 z-30 max-w-sm sm:max-w-md mx-auto sm:mx-0 pointer-events-none"
        >
          <div className="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c0d12]/92 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-amber-400 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>01 • ATELIER SILHOUETTE</span>
            </div>
            <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-white mb-1">
              {activeModel.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed mb-3">
              {activeModel.tagline}. Calibrated to harmonize with Indian facial profiles without slipping or cheek contact.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 border-t border-white/5 pt-2">
              <Eye className="w-3 h-3 text-cyan-400" />
              <span>Scroll down to inspect lens craftsmanship</span>
            </div>
          </div>
        </motion.div>

        {/* Phase 2: Bespoke Craftsmanship & Optical Clarity */}
        <motion.div
          style={{ opacity: phase2Opacity, y: phase2Y }}
          className="absolute left-4 right-4 sm:left-auto sm:right-12 bottom-12 sm:top-28 z-30 max-w-sm sm:max-w-md mx-auto sm:mx-0 pointer-events-none"
        >
          <div className="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-cyan-500/30 bg-[#0c0d12]/92 backdrop-blur-2xl shadow-[0_0_40px_rgba(6,182,212,0.15)]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-cyan-400 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>02 • SAPPHIRE OPTICAL CLARITY</span>
            </div>
            <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-white mb-1">
              {activeModel.frameName}
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed mb-3">
              Precision hand-beveled optics with multi-layer sapphire anti-glare filtration and 420nm high-energy blue protection.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] font-mono text-zinc-400">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-500 block text-[9px]">BLUE-CUT</span>
                <span className="text-cyan-300 font-bold">420nm Sapphire</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-500 block text-[9px]">MASS</span>
                <span className="text-amber-300 font-bold">18g Feather</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phase 3: Wear The Runway Look CTA */}
        <motion.div
          style={{ opacity: phase3Opacity, y: phase3Y }}
          className="absolute bottom-6 sm:bottom-10 z-40 w-full px-3 sm:px-4 max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="w-full glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-amber-400/40 bg-[#0c0d12]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] sm:text-xs font-mono text-amber-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>IN STOCK &bull; DISPATCH TODAY</span>
              </div>
              <h4 className="font-cinzel text-lg sm:text-2xl font-bold text-white">
                {activeModel.frameName}
              </h4>
              <div className="flex items-baseline justify-center sm:justify-start gap-2.5 mt-1">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                  ₹{activeModel.price}
                </span>
                <span className="text-xs sm:text-sm font-mono text-zinc-500 line-through">
                  ₹{activeModel.originalPrice}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  Save {Math.round(((activeModel.originalPrice - activeModel.price) / activeModel.originalPrice) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleQuickAdd}
                className="flex-1 sm:flex-none bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-black font-bold px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider cursor-pointer hover:brightness-110 transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>

              <Link
                href={`/shop/${activeModel.slug}`}
                className="px-4 py-3 rounded-xl border border-white/15 hover:bg-white/10 text-white text-xs font-mono tracking-wider text-center transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-white backdrop-blur-xl transition-all shadow-lg hover:border-cyan-400 cursor-pointer"
          >
            <Zap className={`w-3 h-3 ${blueCutActive ? "text-cyan-400" : "text-zinc-500"}`} />
            <span>420nm: {blueCutActive ? "ON" : "OFF"}</span>
          </button>
        </div>

      </div>
    </section>
  );
}

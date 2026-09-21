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
import { useInViewFast } from "@/hooks/useInViewFast";
import { useDeviceTier } from "@/hooks/useDeviceTier";

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
  const isInView = useInViewFast(containerRef, "300px");
  const { tier } = useDeviceTier();
  const [activeModelIdx, setActiveModelIdx] = useState(0);
  const [blueCutActive, setBlueCutActive] = useState(true);
  const { addToCart, openCart } = useCart();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Ensure video only plays when in view and on capable devices
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isInView && MODELS[activeModelIdx].video && tier !== "LOW") {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [activeModelIdx, isInView, tier]);

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
      className="relative h-[200vh] sm:h-[220vh] bg-[#F4E9D5] dark:bg-[#0A0A0E] w-full max-w-full overflow-hidden transition-colors duration-300"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-1/3 left-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-[#B88A32]/12 dark:bg-[#B88A32]/8 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-[#D4AF62]/10 dark:bg-[#D4AF62]/5 blur-[130px]" />
        </div>

        {/* Section Top Header & Model Switcher Bar */}
        <div className="absolute top-4 sm:top-8 z-40 w-full px-3 sm:px-4 max-w-5xl mx-auto flex flex-col items-center pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#B88A32]/30 dark:border-[#B88A32]/40 bg-[#FFF9EF]/90 dark:bg-[#161622]/90 backdrop-blur-md mb-2 shadow-[0_2px_15px_rgba(184,138,50,0.15)]">
            <Sparkles className="w-3 h-3 text-[#B88A32] dark:text-[#D4AF62]" />
            <span className="text-xs font-mono tracking-widest text-[#2A2118] dark:text-[#F5EFE6] uppercase font-semibold">
              Editorial Runway Showcase
            </span>
          </div>

          {/* Model Switcher Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#FFF9EF]/95 dark:bg-[#12121A]/95 p-1 sm:p-1.5 rounded-full border border-[#B88A32]/25 dark:border-[#B88A32]/40 backdrop-blur-xl shadow-lg max-w-full overflow-x-auto">
            {MODELS.map((m, idx) => {
              const isSelected = activeModelIdx === idx;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModelIdx(idx)}
                  className={`px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-[#B88A32] to-[#D4AF62] text-white font-bold shadow-[0_2px_12px_rgba(184,138,50,0.35)]"
                      : "text-[#5C4935] dark:text-[#C4B59E] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] hover:bg-[#F4E9D5] dark:hover:bg-[#1C1C2A]"
                  }`}
                >
                  {m.video ? (
                    <Film className="w-3 h-3 text-[#B88A32] dark:text-[#D4AF62]" />
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
                className="relative w-full h-full max-h-[84vh] sm:max-h-[90vh] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(60,36,21,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#C6A463]/15 dark:border-[#B88A32]/30 bg-[#F5EFE0] dark:bg-[#14141E]"
              >
                {activeModel.video && tier !== "LOW" ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover object-center brightness-98 contrast-102 will-change-transform"
                  >
                    <source src={activeModel.video} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={activeModel.image}
                    alt={activeModel.name}
                    fill
                    priority={false}
                    className="object-contain object-center brightness-98 contrast-102"
                    sizes="(max-width: 1024px) 100vw, 1200px"
                  />
                )}

                {/* Soft Vignette & Subtle Warm Gradient Overlays */}
                <motion.div
                  style={{ opacity: overlayDarkness }}
                  className="absolute inset-0 bg-[#3C2415] dark:bg-black pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0] dark:from-[#0A0A0E] via-transparent to-[#FAF7F0]/60 dark:to-[#0A0A0E]/60 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F0]/80 dark:from-[#0A0A0E]/80 via-transparent to-[#FAF7F0]/80 dark:to-[#0A0A0E]/80 pointer-events-none" />

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

        {/* Phase 1: 01 Atelier Silhouette */}
        <motion.div
          style={{ opacity: phase1Opacity, y: phase1Y }}
          className="absolute left-4 right-4 sm:right-auto sm:left-12 lg:left-16 bottom-10 sm:bottom-16 z-30 max-w-sm sm:max-w-md mx-auto sm:mx-0 pointer-events-none"
        >
          <div className="p-6 sm:p-7 rounded-2xl border border-[#B88A32]/35 dark:border-[#B88A32]/50 bg-[#FFF9EF]/98 dark:bg-[#12121A]/98 backdrop-blur-2xl shadow-[0_20px_50px_rgba(42,33,24,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <span className="font-cinzel text-3xl sm:text-5xl font-black text-[#B88A32] dark:text-[#D4AF62] block tracking-tight mb-1">
              01
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-black tracking-[0.1em] text-[#2A2118] dark:text-[#F5EFE6] mb-3 drop-shadow-md">
              Atelier Silhouette
            </h3>
            <p className="font-cormorant italic text-xl sm:text-2xl text-[#5C4935] dark:text-[#C4B59E] leading-tight mb-3">
              Precision designed<br />
              for everyday vision.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.15em] text-[#B88A32] dark:text-[#D4AF62] uppercase font-bold border-t border-[#B88A32]/20 dark:border-[#B88A32]/30 pt-2.5">
              <span>{activeModel.name} &bull; {activeModel.spec}</span>
            </div>
          </div>
        </motion.div>

        {/* Phase 2: Bespoke Craftsmanship & Optical Clarity */}
        <motion.div
          style={{ opacity: phase2Opacity, y: phase2Y }}
          className="absolute left-4 right-4 sm:left-auto sm:right-12 bottom-12 sm:top-28 z-30 max-w-sm sm:max-w-md mx-auto sm:mx-0 pointer-events-none"
        >
          <div className="p-5 sm:p-6 rounded-2xl border border-[#B88A32]/35 dark:border-[#B88A32]/50 bg-[#FFF9EF]/98 dark:bg-[#12121A]/98 backdrop-blur-2xl shadow-[0_20px_50px_rgba(42,33,24,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] mb-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>02 • SAPPHIRE OPTICAL CLARITY</span>
            </div>
            <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-[#2A2118] dark:text-[#F5EFE6] mb-1 drop-shadow-sm">
              {activeModel.frameName}
            </h3>
            <p className="text-xs text-[#5C4935] dark:text-[#C4B59E] leading-relaxed mb-3">
              Precision hand-beveled optics with multi-layer sapphire anti-glare filtration and 420nm high-energy blue protection.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-[#F4E9D5] dark:bg-[#1A1A26] border border-[#B88A32]/20 dark:border-[#B88A32]/30">
                <span className="text-[#8B7355] dark:text-[#8E8272] block text-xs">BLUE-CUT</span>
                <span className="text-[#2A2118] dark:text-[#F5EFE6] font-bold">420nm Sapphire</span>
              </div>
              <div className="p-2 rounded-lg bg-[#F4E9D5] dark:bg-[#1A1A26] border border-[#B88A32]/20 dark:border-[#B88A32]/30">
                <span className="text-[#8B7355] dark:text-[#8E8272] block text-xs">MASS</span>
                <span className="text-[#B88A32] dark:text-[#D4AF62] font-bold">18g Feather</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phase 3: Wear The Runway Look CTA */}
        <motion.div
          style={{ opacity: phase3Opacity, y: phase3Y }}
          className="absolute bottom-6 sm:bottom-10 z-40 w-full px-3 sm:px-4 max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="w-full p-5 sm:p-6 rounded-2xl border border-[#B88A32]/35 dark:border-[#B88A32]/50 bg-[#FFF9EF]/98 dark:bg-[#12121A]/98 backdrop-blur-2xl shadow-[0_20px_50px_rgba(42,33,24,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] mb-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>IN STOCK &bull; DISPATCH TODAY</span>
              </div>
              <h4 className="font-cinzel text-lg sm:text-2xl font-bold text-[#2A2118] dark:text-[#F5EFE6] drop-shadow-md">
                {activeModel.frameName}
              </h4>
              <div className="flex items-baseline justify-center sm:justify-start gap-2.5 mt-1">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#B88A32] dark:text-[#D4AF62]">
                  ₹{activeModel.price}
                </span>
                <span className="text-xs sm:text-sm font-mono text-[#8B7355] dark:text-[#8E8272] line-through">
                  ₹{activeModel.originalPrice}
                </span>
                <span className="text-xs font-mono text-emerald-500 bg-emerald-500/15 px-2 py-0.5 rounded-full font-semibold">
                  Save {Math.round(((activeModel.originalPrice - activeModel.price) / activeModel.originalPrice) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="btn-primary rounded-full py-2.5 px-5 text-xs flex-1 sm:flex-none flex items-center justify-center gap-1.5 select-none"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Add to Bag</span>
              </button>

              <Link
                href={`/shop/${activeModel.slug}`}
                className="btn-secondary rounded-full py-2.5 px-5 text-xs font-mono tracking-wider text-center"
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 dark:bg-[#161622]/90 border border-[#C6A463]/30 dark:border-[#B88A32]/40 text-xs font-mono text-[#2A2118] dark:text-[#F5EFE6] hover:border-[#B88A32] dark:hover:border-[#D4AF62] backdrop-blur-xl transition-all shadow-md cursor-pointer"
          >
            <Zap className={`w-3.5 h-3.5 ${blueCutActive ? "text-[#B88A32] dark:text-[#D4AF62]" : "text-[#8B7355] dark:text-[#8E8272]"}`} />
            <span>420nm: {blueCutActive ? "ON" : "OFF"}</span>
          </button>
        </div>

      </div>
    </section>
  );
}

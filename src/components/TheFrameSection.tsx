// src/components/TheFrameSection.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingBag, Eye, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface FrameItem {
  id: string;
  tag: string;
  name: string;
  finish: string;
  material: string;
  weight: string;
  lens: string;
  price: number;
  originalPrice: number;
  colorHex: string;
  image: string;
  description: string;
  slug: string;
}

export const FRAMES: FrameItem[] = [
  {
    id: "frame-01",
    tag: "FRAME 01",
    name: "Imperial Beta-Titanium",
    finish: "24K Champagne Gold",
    material: "Japanese Beta-Titanium",
    weight: "18.4g",
    lens: "420nm Sapphire Crystal Glass",
    price: 2499,
    originalPrice: 4299,
    colorHex: "#B88A32",
    image: "/images/products/gold-rimless-rectangle-vincent-chase-sleek-steel-vc-e17135-c1-218257.jpg",
    description: "Architectural 0.8mm wireframe profile with Japanese keyhole bridge and zero-distortion sapphire optics.",
    slug: "imperial-beta-titanium-gold",
  },
  {
    id: "frame-02",
    tag: "FRAME 02",
    name: "Nocturne Matte Browline",
    finish: "Matte Onyx Black & Gold",
    material: "Italian Mazzucchelli Acetate",
    weight: "21.2g",
    lens: "Polarized Blue-Cut Shield",
    price: 2799,
    originalPrice: 4599,
    colorHex: "#1E1F24",
    image: "/images/products/black-full-rim-square-137974.jpg",
    description: "Bold hand-sculpted browline reinforced with aerospace titanium core wire and micro-pins.",
    slug: "nocturne-matte-browline-black",
  },
  {
    id: "frame-03",
    tag: "FRAME 03",
    name: "Aurelia Geometric Mirage",
    finish: "Rose Gold Mirage",
    material: "Aerospace Tensile Alloy",
    weight: "17.8g",
    lens: "Anti-Reflective Hydrophobic",
    price: 2599,
    originalPrice: 4399,
    colorHex: "#C99494",
    image: "/images/products/golden-cat-eye-full-rim-139363.jpg",
    description: "Faceted octagonal profile engineered for effortless poise and featherweight all-day comfort.",
    slug: "aurelia-geometric-mirage-rose",
  },
  {
    id: "frame-04",
    tag: "FRAME 04",
    name: "Arctic Monobloc Minimalist",
    finish: "Pure Platinum & Chrome",
    material: "Monobloc Pure Titanium",
    weight: "14.6g",
    lens: "Zero-Distortion Optical Shield",
    price: 2899,
    originalPrice: 4799,
    colorHex: "#DFE3EA",
    image: "/images/products/silver-rimless-rectangle-owndays-titanium-od-e50030-c3-220623.jpg",
    description: "Ultralight rimless engineering with friction-fit titanium bridge and screwless hinge architecture.",
    slug: "arctic-monobloc-minimalist-platinum",
  },
];

export default function TheFrameSection() {
  const [selectedId, setSelectedId] = useState<string>("frame-01");
  const [added, setAdded] = useState(false);
  const { addToCart, openCart } = useCart();

  const activeFrame = FRAMES.find((f) => f.id === selectedId) || FRAMES[0];
  const frame02 = FRAMES[1];
  const frame03 = FRAMES[2];
  const frame04 = FRAMES[3];

  const handleAdd = () => {
    addToCart(
      {
        productId: activeFrame.id,
        name: activeFrame.name,
        slug: activeFrame.slug,
        price: activeFrame.price,
        originalPrice: activeFrame.originalPrice,
        image: activeFrame.image,
        color: activeFrame.finish,
        colorHex: activeFrame.colorHex,
        weight: activeFrame.weight,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section id="the-frame" className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#D6B878]/30 via-[#F4E9D5] to-[#F4E9D5] dark:from-[#0A0A0E] dark:via-[#12121A] dark:to-[#0A0A0E] border-t border-[#B88A32]/20 dark:border-[#B88A32]/30 overflow-hidden transition-colors duration-300">
      {/* Ambient background warm glows */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#D4AF62]/25 via-[#B88A32]/10 to-transparent dark:from-[#D4AF62]/15 dark:via-transparent blur-[140px] -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 dark:border-[#D4AF62]/40 text-[10px] sm:text-xs font-mono tracking-[0.28em] text-[#B88A32] dark:text-[#D4AF62] uppercase font-bold mb-3 sm:mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
            <span>ATELIER BLUEPRINT</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.14em] text-[#2A2118] dark:text-[#F5EFE6] uppercase mb-4 drop-shadow-sm">
            THE FRAME
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono tracking-[0.2em] text-[#4A3928] dark:text-[#B8ADA0] uppercase font-bold">
            <span>18.4g ULTRA-LIGHT</span>
            <span className="text-[#B88A32] dark:text-[#D4AF62]">&bull;</span>
            <span>BETA TITANIUM</span>
            <span className="text-[#B88A32] dark:text-[#D4AF62]">&bull;</span>
            <span>PRECISION FIT</span>
            <span className="text-[#B88A32] dark:text-[#D4AF62]">&bull;</span>
            <span>OPTICAL CLARITY</span>
          </div>
        </div>

        {/* =====================================================================
            EXACT USER LAYOUT CONSTELLATION:
                   ┌──────────────┐
                   │   FRAME 01   │
                   │      👓      │
                   └──────────────┘

              FRAME 02                 FRAME 03

                         FRAME 04
           ===================================================================== */}
        <div className="w-full flex flex-col items-center gap-8 sm:gap-12">
          
          {/* 1. TOP SPOTLIGHT CARD: ┌──────────────┐ │ FRAME 01 👓 │ └──────────────┘ */}
          <motion.div
            layout
            key={activeFrame.id}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-2xl rounded-3xl sm:rounded-[36px] bg-[#FFF9EF] dark:bg-[#12121A] border-2 border-[#B88A32] dark:border-[#D4AF62] shadow-[0_20px_60px_rgba(184,138,50,0.22)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-9 relative overflow-hidden"
          >
            {/* Top Frame Tag Pill */}
            <div className="flex items-center justify-between border-b border-[#B88A32]/20 dark:border-[#B88A32]/30 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl">👓</span>
                <div>
                  <span className="font-cinzel text-base sm:text-xl font-bold tracking-[0.15em] text-[#2A2118] dark:text-[#F5EFE6] block">
                    {activeFrame.tag}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono tracking-[0.18em] text-[#B88A32] dark:text-[#D4AF62] uppercase font-semibold">
                    {activeFrame.finish}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#F4E9D5] dark:bg-[#1C1C28] border border-[#B88A32]/30 text-[10px] sm:text-xs font-mono font-bold text-[#2A2118] dark:text-[#F5EFE6]">
                {activeFrame.weight}
              </span>
            </div>

            {/* Frame Visual Preview */}
            <div className="relative w-full h-56 sm:h-72 rounded-2xl bg-gradient-to-b from-[#F4E9D5]/60 to-[#E8D2A8]/30 dark:from-[#181824] dark:to-[#101016] flex items-center justify-center overflow-hidden mb-6 p-4 border border-[#B88A32]/10 dark:border-[#B88A32]/20">
              <Image
                src={activeFrame.image}
                alt={activeFrame.name}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain p-6 hover:scale-105 transition-transform duration-500 drop-shadow-[0_12px_24px_rgba(42,33,24,0.18)] dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
              />
            </div>

            {/* Frame Information & CTA */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-black text-[#2A2118] dark:text-[#F5EFE6] tracking-wide mb-1">
                  {activeFrame.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A3928] dark:text-[#B8ADA0] max-w-md leading-relaxed mb-3">
                  {activeFrame.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#2A2118] dark:text-[#F5EFE6]">
                    ₹{activeFrame.price.toLocaleString("en-IN")}
                  </span>
                  <span className="font-mono text-sm text-[#6B5740] dark:text-[#8E8273] line-through">
                    ₹{activeFrame.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#B88A32]/15 dark:bg-[#D4AF62]/20 text-[10px] font-mono text-[#B88A32] dark:text-[#D4AF62] font-bold">
                    SAVE ₹{(activeFrame.originalPrice - activeFrame.price).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`px-6 sm:px-7 py-3 rounded-full font-bold text-xs tracking-[0.16em] uppercase transition-all duration-300 flex items-center gap-2 shadow-[0_4px_20px_rgba(184,138,50,0.35)] active:scale-95 ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] text-white hover:brightness-105"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/shop/${activeFrame.slug}`}
                  className="p-3 rounded-full bg-[#F4E9D5] dark:bg-[#1C1C28] hover:bg-white dark:hover:bg-[#252538] border border-[#B88A32]/40 text-[#2A2118] dark:text-[#F5EFE6] transition-all shadow-sm"
                  title="View Specs"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 2. MIDDLE ROW: FRAME 02 (Left) & FRAME 03 (Right) */}
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 px-2">
            
            {/* FRAME 02 */}
            <button
              type="button"
              onClick={() => setSelectedId(frame02.id)}
              className={`text-left p-5 sm:p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between group shadow-sm ${
                selectedId === frame02.id
                  ? "bg-[#FFF9EF] dark:bg-[#161622] border-2 border-[#B88A32] dark:border-[#D4AF62] shadow-[0_10px_30px_rgba(184,138,50,0.25)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] scale-[1.02]"
                  : "bg-[#FFF9EF]/80 dark:bg-[#12121A]/80 hover:bg-[#FFF9EF] dark:hover:bg-[#161622] border-[#B88A32]/25 dark:border-[#B88A32]/30 hover:border-[#B88A32]/60 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F4E9D5]/70 dark:bg-[#1C1C28] border border-[#B88A32]/20 flex items-center justify-center p-2 flex-shrink-0">
                  <Image
                    src={frame02.image}
                    alt={frame02.name}
                    fill
                    sizes="80px"
                    className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-cinzel text-sm sm:text-base font-bold tracking-[0.14em] text-[#2A2118] dark:text-[#F5EFE6]">
                      {frame02.tag}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: frame02.colorHex }} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#4A3928] dark:text-[#D1C7BA] line-clamp-1">
                    {frame02.name}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] tracking-wider mt-0.5">
                    {frame02.finish} &bull; ₹{frame02.price.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <span className={`text-xs font-mono uppercase px-3 py-1 rounded-full border transition-all ${
                selectedId === frame02.id
                  ? "bg-[#B88A32] dark:bg-[#D4AF62] text-white dark:text-[#0A0A0E] font-bold border-[#B88A32]"
                  : "bg-[#F4E9D5] dark:bg-[#1C1C28] text-[#6B5740] dark:text-[#B8ADA0] border-[#B88A32]/20 group-hover:text-[#2A2118] dark:group-hover:text-[#F5EFE6]"
              }`}>
                {selectedId === frame02.id ? "ACTIVE" : "SELECT"}
              </span>
            </button>

            {/* FRAME 03 */}
            <button
              type="button"
              onClick={() => setSelectedId(frame03.id)}
              className={`text-left p-5 sm:p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between group shadow-sm ${
                selectedId === frame03.id
                  ? "bg-[#FFF9EF] dark:bg-[#161622] border-2 border-[#B88A32] dark:border-[#D4AF62] shadow-[0_10px_30px_rgba(184,138,50,0.25)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] scale-[1.02]"
                  : "bg-[#FFF9EF]/80 dark:bg-[#12121A]/80 hover:bg-[#FFF9EF] dark:hover:bg-[#161622] border-[#B88A32]/25 dark:border-[#B88A32]/30 hover:border-[#B88A32]/60 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F4E9D5]/70 dark:bg-[#1C1C28] border border-[#B88A32]/20 flex items-center justify-center p-2 flex-shrink-0">
                  <Image
                    src={frame03.image}
                    alt={frame03.name}
                    fill
                    sizes="80px"
                    className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-cinzel text-sm sm:text-base font-bold tracking-[0.14em] text-[#2A2118] dark:text-[#F5EFE6]">
                      {frame03.tag}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: frame03.colorHex }} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#4A3928] dark:text-[#D1C7BA] line-clamp-1">
                    {frame03.name}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] tracking-wider mt-0.5">
                    {frame03.finish} &bull; ₹{frame03.price.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <span className={`text-xs font-mono uppercase px-3 py-1 rounded-full border transition-all ${
                selectedId === frame03.id
                  ? "bg-[#B88A32] dark:bg-[#D4AF62] text-white dark:text-[#0A0A0E] font-bold border-[#B88A32]"
                  : "bg-[#F4E9D5] dark:bg-[#1C1C28] text-[#6B5740] dark:text-[#B8ADA0] border-[#B88A32]/20 group-hover:text-[#2A2118] dark:group-hover:text-[#F5EFE6]"
              }`}>
                {selectedId === frame03.id ? "ACTIVE" : "SELECT"}
              </span>
            </button>

          </div>

          {/* 3. BOTTOM ROW: FRAME 04 (Centered) */}
          <div className="w-full max-w-md px-2">
            <button
              type="button"
              onClick={() => setSelectedId(frame04.id)}
              className={`w-full text-left p-5 sm:p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between group shadow-sm ${
                selectedId === frame04.id
                  ? "bg-[#FFF9EF] dark:bg-[#161622] border-2 border-[#B88A32] dark:border-[#D4AF62] shadow-[0_10px_30px_rgba(184,138,50,0.25)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] scale-[1.02]"
                  : "bg-[#FFF9EF]/80 dark:bg-[#12121A]/80 hover:bg-[#FFF9EF] dark:hover:bg-[#161622] border-[#B88A32]/25 dark:border-[#B88A32]/30 hover:border-[#B88A32]/60 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F4E9D5]/70 dark:bg-[#1C1C28] border border-[#B88A32]/20 flex items-center justify-center p-2 flex-shrink-0">
                  <Image
                    src={frame04.image}
                    alt={frame04.name}
                    fill
                    sizes="80px"
                    className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-cinzel text-sm sm:text-base font-bold tracking-[0.14em] text-[#2A2118] dark:text-[#F5EFE6]">
                      {frame04.tag}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: frame04.colorHex }} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#4A3928] dark:text-[#D1C7BA] line-clamp-1">
                    {frame04.name}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] tracking-wider mt-0.5">
                    {frame04.finish} &bull; ₹{frame04.price.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <span className={`text-xs font-mono uppercase px-3 py-1 rounded-full border transition-all ${
                selectedId === frame04.id
                  ? "bg-[#B88A32] dark:bg-[#D4AF62] text-white dark:text-[#0A0A0E] font-bold border-[#B88A32]"
                  : "bg-[#F4E9D5] dark:bg-[#1C1C28] text-[#6B5740] dark:text-[#B8ADA0] border-[#B88A32]/20 group-hover:text-[#2A2118] dark:group-hover:text-[#F5EFE6]"
              }`}>
                {selectedId === frame04.id ? "ACTIVE" : "SELECT"}
              </span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

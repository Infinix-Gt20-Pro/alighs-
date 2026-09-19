// src/components/FeaturedShowcase.tsx
"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DEFAULT_PRODUCTS, ProductType } from "@/lib/products-data";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowRight, Sparkles, Check, Star, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

export default function FeaturedShowcase() {
  const { addToCart } = useCart();
  const { tier } = useDeviceTier();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const mouseTicking = useRef(false);

  const filters = [
    { id: "all", label: "All Curations" },
    { id: "eyeglasses", label: "👓 Eyeglasses" },
    { id: "computer-glasses", label: "💻 Computer (BLU)" },
    { id: "sunglasses", label: "🕶️ Polarized Sun" },
    { id: "titanium", label: "Air Titanium" },
  ];

  const filteredProducts = DEFAULT_PRODUCTS.filter((product) => {
    if (selectedFilter === "eyeglasses") return product.category === "eyeglasses";
    if (selectedFilter === "computer-glasses") return product.category === "computer-glasses";
    if (selectedFilter === "sunglasses") return product.category === "sunglasses";
    if (selectedFilter === "titanium") return product.material.toLowerCase().includes("titanium");
    return true;
  }).slice(0, 8);

  const handleFilterChange = (id: string) => {
    setSelectedFilter(id);
    setActiveIndex(0);
  };

  const handleQuickAdd = (product: ProductType) => {
    addToCart(
      {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] || "/images/clarity-showcase.jpg",
        color: product.colors[0] || "Black",
        colorHex: "#111111",
        weight: product.weight || "18g",
      },
      1
    );
    setAddedSlug(product.slug);
    setTimeout(() => setAddedSlug(null), 1800);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tier === "LOW" || !stageRef.current || mouseTicking.current) return;
    mouseTicking.current = true;
    const clientX = e.clientX;
    const clientY = e.clientY;

    requestAnimationFrame(() => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
      }
      mouseTicking.current = false;
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % filteredProducts.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  return (
    <section
      id="collection"
      className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Soft warm ambient lighting atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-br from-[#E8D2A8]/30 via-[#D4AF62]/15 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 border-b border-[#B88A32]/20 dark:border-[#B88A32]/30 pb-5 sm:pb-7">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 dark:border-[#D4AF62]/40 text-[10px] sm:text-xs font-mono tracking-[0.26em] text-[#B88A32] dark:text-[#D4AF62] uppercase font-bold mb-2.5 sm:mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
            <span>3D ATELIER GALLERY</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.08em] text-[#2A2118] dark:text-[#F5EFE6]">
            Architectural Eyewear Collection
          </h2>
          <p className="text-[#4A3928] dark:text-[#B8ADA0] mt-1.5 sm:mt-2.5 max-w-xl text-xs sm:text-base font-cormorant italic leading-relaxed">
            Calibrated for facial ergonomics, optical clarity, and timeless Firozabad luxury.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`cursor-pointer px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all duration-300 shrink-0 ${
                selectedFilter === f.id
                  ? "bg-gradient-to-r from-[#B88A32] to-[#D4AF62] text-white font-semibold shadow-[0_4px_15px_rgba(184,138,50,0.35)]"
                  : "bg-[#FFF9EF] dark:bg-[#161622] text-[#4A3928] dark:text-[#B8ADA0] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] border border-[#B88A32]/25 dark:border-[#B88A32]/30 hover:bg-[#F4E9D5] dark:hover:bg-[#1E1E2A]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          3D EDITORIAL GALLERY STAGE
         ========================================================================= */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full min-h-[520px] sm:min-h-[580px] flex items-center justify-center py-6 sm:py-10"
        style={{ perspective: "1200px" }}
      >
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={prevCard}
          aria-label="Previous Frame"
          className="cursor-pointer absolute left-2 sm:left-4 z-40 p-3 rounded-full bg-[#FFF9EF]/90 dark:bg-[#161622]/90 hover:bg-white dark:hover:bg-[#1E1E2C] border border-[#B88A32]/30 dark:border-[#D4AF62]/40 text-[#2A2118] dark:text-[#F5EFE6] hover:text-[#B88A32] dark:hover:text-[#D4AF62] shadow-[0_8px_25px_rgba(42,33,24,0.08)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-all duration-200 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={nextCard}
          aria-label="Next Frame"
          className="cursor-pointer absolute right-2 sm:right-4 z-40 p-3 rounded-full bg-[#FFF9EF]/90 dark:bg-[#161622]/90 hover:bg-white dark:hover:bg-[#1E1E2C] border border-[#B88A32]/30 dark:border-[#D4AF62]/40 text-[#2A2118] dark:text-[#F5EFE6] hover:text-[#B88A32] dark:hover:text-[#D4AF62] shadow-[0_8px_25px_rgba(42,33,24,0.08)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-all duration-200 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Floating Perspective Cards Stack */}
        <div className="relative w-full max-w-4xl h-[480px] sm:h-[530px] flex items-center justify-center">
          {filteredProducts.map((product, idx) => {
            const offset = idx - activeIndex;
            const isCenter = offset === 0;
            const isPrev = offset === -1 || (activeIndex === 0 && idx === filteredProducts.length - 1);
            const isNext = offset === 1 || (activeIndex === filteredProducts.length - 1 && idx === 0);

            // Only render cards close to active for high performance
            if (Math.abs(offset) > 2 && !isPrev && !isNext) return null;

            // 3D positioning calculation
            let xOffset = 0;
            let zIndex = 10;
            let scale = 0.75;
            let rotateY = 0;
            let opacity = 0.25;

            if (isCenter) {
              xOffset = 0;
              zIndex = 30;
              scale = 1.0;
              rotateY = tier !== "LOW" ? mousePos.x * 8 : 0; // subtle interactive tilt
              opacity = 1.0;
            } else if (offset === -1 || isPrev) {
              xOffset = -300;
              zIndex = 20;
              scale = 0.85;
              rotateY = 16;
              opacity = 0.65;
            } else if (offset === 1 || isNext) {
              xOffset = 300;
              zIndex = 20;
              scale = 0.85;
              rotateY = -16;
              opacity = 0.65;
            } else if (offset === -2) {
              xOffset = -480;
              zIndex = 10;
              scale = 0.72;
              rotateY = 25;
              opacity = 0.35;
            } else if (offset === 2) {
              xOffset = 480;
              zIndex = 10;
              scale = 0.72;
              rotateY = -25;
              opacity = 0.35;
            }

            return (
              <motion.div
                key={product._id}
                onClick={() => !isCenter && setActiveIndex(idx)}
                initial={false}
                animate={{
                  x: xOffset,
                  scale,
                  rotateY,
                  rotateX: isCenter && tier !== "LOW" ? -mousePos.y * 6 : 0,
                  opacity,
                  zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 26,
                }}
                className={`absolute w-[300px] sm:w-[400px] md:w-[460px] rounded-3xl bg-[#FFF9EF] dark:bg-[#12121A] border transition-all duration-300 select-none ${
                  isCenter
                    ? "border-[#B88A32]/45 dark:border-[#B88A32]/60 shadow-[0_20px_60px_rgba(42,33,24,0.14)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] cursor-default p-5 sm:p-7"
                    : "border-[#B88A32]/20 dark:border-[#B88A32]/25 shadow-[0_10px_30px_rgba(42,33,24,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] cursor-pointer p-4 sm:p-5 hover:border-[#B88A32]/50 dark:hover:border-[#B88A32]/60 hover:opacity-85"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Header Badge Row */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#8B7355] dark:text-[#C4B59E] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4E9D5] dark:bg-[#1A1A26] border border-[#B88A32]/20 dark:border-[#B88A32]/30 truncate">
                    {product.material.toUpperCase()}
                  </span>

                  {product.bestSeller && (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-[#B88A32] dark:text-[#D4AF62] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B88A32]/15 dark:bg-[#B88A32]/25 border border-[#B88A32]/30 font-bold shrink-0">
                      <Star className="w-3 h-3 fill-[#B88A32] text-[#B88A32] dark:fill-[#D4AF62] dark:text-[#D4AF62]" />
                      <span>BESTSELLER</span>
                    </span>
                  )}
                </div>

                {/* Dominant Eyewear Photography Container */}
                <div className="relative w-full h-36 sm:h-52 my-3 rounded-2xl bg-gradient-to-br from-[#F4E9D5]/90 via-[#FFF9EF] to-[#E8D2A8]/40 dark:from-[#181824] dark:via-[#14141E] dark:to-[#0F0F16] border border-[#B88A32]/15 dark:border-[#B88A32]/30 flex items-center justify-center p-3 overflow-hidden group">
                  {/* Subtle pedestal glow */}
                  <div className="absolute inset-0 bg-radial from-[#D4AF62]/20 dark:from-[#D4AF62]/15 to-transparent opacity-50" />
                  
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={`max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(42,33,24,0.18)] dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-transform duration-500 relative z-10 ${
                        isCenter ? "group-hover:scale-108" : ""
                      }`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative flex flex-col items-center z-10">
                      <span className="text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] uppercase tracking-widest">
                        {product.frameShape} Frame
                      </span>
                    </div>
                  )}
                </div>

                {/* Eyewear Title & Details */}
                <div className="mt-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-cinzel text-sm sm:text-lg font-bold text-[#2A2118] dark:text-[#F5EFE6] line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-bold font-mono text-[#B88A32] dark:text-[#D4AF62]">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-[#8B7355] dark:text-[#A09383] line-through font-mono ml-1.5">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {isCenter && (
                    <p className="text-xs text-[#4A3928] dark:text-[#D5C7B5] mt-1.5 line-clamp-2 leading-relaxed font-cormorant italic">
                      {product.description}
                    </p>
                  )}

                  {/* Finish Swatches & Specs */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#B88A32]/15 dark:border-[#B88A32]/25">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#6B5740] dark:text-[#A09383] mr-1">Finishes:</span>
                      {product.colors.slice(0, 3).map((col) => (
                        <span
                          key={col}
                          className="w-3 h-3 rounded-full border border-[#B88A32]/30 dark:border-[#B88A32]/50 shrink-0 shadow-sm"
                          title={col}
                          style={{
                            backgroundColor:
                              col.toLowerCase().includes("gold") ? "#D4AF37" :
                              col.toLowerCase().includes("green") || col.toLowerCase().includes("emerald") ? "#0F4C3A" :
                              col.toLowerCase().includes("blue") || col.toLowerCase().includes("cobalt") ? "#1E3A8A" :
                              col.toLowerCase().includes("red") || col.toLowerCase().includes("crimson") ? "#991B1B" :
                              col.toLowerCase().includes("silver") ? "#E5E7EB" :
                              col.toLowerCase().includes("tortoise") ? "#78350F" : "#171717"
                          }}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] font-mono text-[#8B7355] dark:text-[#C4B59E] uppercase font-bold">
                      {product.weight || "14g"} &bull; {product.frameWidth || "Medium"}
                    </span>
                  </div>

                  {/* Actions (Prominent on Center Active Card) */}
                  {isCenter && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 pt-2">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="cursor-pointer py-2.5 px-3 rounded-xl bg-[#F4E9D5] dark:bg-[#1A1A26] hover:bg-white dark:hover:bg-[#242436] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-xs font-mono font-bold uppercase tracking-wider text-[#2A2118] dark:text-[#F5EFE6] text-center transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
                        <span>Specs</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="cursor-pointer py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#B88A32] to-[#D4AF62] hover:brightness-105 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(184,138,50,0.3)] active:scale-95"
                      >
                        {addedSlug === product.slug ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-white" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Carousel Pagination & Indicator */}
      <div className="flex flex-col items-center justify-center mt-4 gap-3">
        <div className="flex items-center gap-1.5">
          {filteredProducts.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to frame ${idx + 1}`}
              className={`cursor-pointer transition-all duration-300 rounded-full ${
                activeIndex === idx
                  ? "w-8 h-2 bg-[#B88A32]"
                  : "w-2 h-2 bg-[#B88A32]/30 hover:bg-[#B88A32]/60"
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-mono text-[#6B5740] dark:text-[#A09383] tracking-widest uppercase font-bold">
          {String(activeIndex + 1).padStart(2, "0")} / {String(filteredProducts.length).padStart(2, "0")} ATELIER FRAMES
        </span>
      </div>

      {/* Bottom CTA to Shop */}
      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="cursor-pointer inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#FFF9EF] dark:bg-[#14141C] hover:bg-white dark:hover:bg-[#1A1A26] border border-[#B88A32]/35 dark:border-[#B88A32]/45 text-[#2A2118] dark:text-[#F5EFE6] font-bold text-xs font-mono tracking-[0.18em] uppercase hover:shadow-[0_4px_25px_rgba(184,138,50,0.25)] hover:scale-105 transition-all duration-300"
        >
          <span>Explore Full 40+ Architectural Catalog</span>
          <ArrowRight className="w-4 h-4 text-[#B88A32] dark:text-[#D4AF62]" />
        </Link>
      </div>
    </section>
  );
}

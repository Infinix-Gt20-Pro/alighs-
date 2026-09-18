// src/app/shop/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CartDrawer from "@/components/CartDrawer";
import { DEFAULT_PRODUCTS } from "@/lib/products-data";
import { Search, Sparkles, SlidersHorizontal, RefreshCw, X, ShieldCheck, CheckCircle2 } from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

const CATEGORIES = [
  { id: "All", label: "All Categories" },
  { id: "eyeglasses", label: "👓 Eyeglasses" },
  { id: "computer-glasses", label: "💻 Computer Glasses (BLU)" },
  { id: "sunglasses", label: "🕶️ Polarized Sunglasses" },
  { id: "reading-glasses", label: "📖 Reading Glasses" },
  { id: "clip-on", label: "🧲 Magnetic Clip-On 2-in-1" }
];

const FRAME_TYPES = ["All Types", "Full Rim", "Half Rim", "Rimless"];

const FRAME_SHAPES = [
  "All Shapes",
  "Rectangle",
  "Round",
  "Aviator",
  "Wayfarer",
  "Cat-Eye",
  "Clubmaster",
  "Hexagonal"
];

const BRANDS = [
  "All Brands",
  "Vincent Chase",
  "John Jacobs",
  "Lenskart Air",
  "Lenskart BLU",
  "Alig's Clinic Grade"
];

const SORT_OPTIONS = [
  { label: "Featured & Bestsellers", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest Arrivals", value: "newest" },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All Types");
  const [activeShape, setActiveShape] = useState("All Shapes");
  const [activeBrand, setActiveBrand] = useState("All Brands");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("popular");

  const filteredProducts = useMemo(() => {
    let list = [...DEFAULT_PRODUCTS];

    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (activeType !== "All Types") {
      const ftKey = activeType.toLowerCase().replace(/\s+/g, "-");
      list = list.filter((p) => p.frameType === ftKey);
    }

    if (activeShape !== "All Shapes") {
      list = list.filter((p) => p.frameShape.toLowerCase() === activeShape.toLowerCase());
    }

    if (activeBrand !== "All Brands") {
      list = list.filter((p) => p.brandCollection.toLowerCase().includes(activeBrand.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brandCollection.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (sortOption === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === "popular") {
      list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    } else if (sortOption === "newest") {
      list.reverse();
    }

    return list;
  }, [activeCategory, activeType, activeShape, activeBrand, searchQuery, sortOption]);

  const resetFilters = () => {
    setActiveCategory("All");
    setActiveType("All Types");
    setActiveShape("All Shapes");
    setActiveBrand("All Brands");
    setSearchQuery("");
    setSortOption("popular");
  };

  return (
    <div className="relative min-h-screen bg-[#F4E9D5] dark:bg-[#0A0A0E] text-[#2A2118] dark:text-[#F5EFE6] flex flex-col selection:bg-[#B88A32]/30 selection:text-[#2A2118] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-24 w-full">
        {/* Header Title Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] uppercase tracking-widest mb-3 shadow-sm font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
            <span>CURATED ATELIER &bull; FIROZABAD PRECISION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#2A2118] dark:text-[#F5EFE6] font-cinzel">
            Eyewear &amp; Optical Collection
          </h1>

          <p className="text-[#4A3928] dark:text-[#D5C7B5] max-w-2xl text-xs sm:text-sm mt-3 font-cormorant italic leading-relaxed">
            Explore Vincent Chase, John Jacobs, Lenskart Air titanium, and Alig&apos;s AMU-certified medical optometry frames. Each pair is calibrated with 420nm Sapphire Blue-Cut clarity.
          </p>
        </div>

        {/* LENSKART CATEGORY TABS */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`cursor-pointer px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-mono whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-[#B88A32] to-[#D4AF62] text-white font-bold shadow-[0_4px_15px_rgba(184,138,50,0.35)]"
                  : "bg-[#FFF9EF] dark:bg-[#14141E] text-[#4A3928] dark:text-[#D5C7B5] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] border border-[#B88A32]/25 dark:border-[#B88A32]/35 hover:bg-[#F4E9D5] dark:hover:bg-[#1C1C2A]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter & Search Control Panel */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FFF9EF] dark:bg-[#12121A] border border-[#B88A32]/25 dark:border-[#B88A32]/35 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355] dark:text-[#A09383]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Vincent Chase, titanium, rimless..."
                className="w-full pl-10 pr-9 py-2.5 rounded-full bg-[#F4E9D5]/70 dark:bg-[#1A1A26] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#8B7355] dark:placeholder-[#8B7355] text-xs focus:outline-none focus:border-[#B88A32] focus:bg-white dark:focus:bg-[#222232] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#2A2118] dark:hover:text-[#F5EFE6]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-2 text-xs font-mono text-[#6B5740] dark:text-[#A09383]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
                <span className="hidden sm:inline">Sort:</span>
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-[#F4E9D5] dark:bg-[#1A1A26] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-[#2A2118] dark:text-[#F5EFE6] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#B88A32] cursor-pointer font-mono"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#FFF9EF] dark:bg-[#14141E] text-[#2A2118] dark:text-[#F5EFE6]">
                    {opt.label}
                  </option>
                ))}
              </select>

              {(activeCategory !== "All" || activeType !== "All Types" || activeShape !== "All Shapes" || activeBrand !== "All Brands" || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="cursor-pointer text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] flex items-center gap-1 bg-[#F4E9D5] dark:bg-[#1A1A26] px-3 py-2 rounded-xl border border-[#B88A32]/30 dark:border-[#B88A32]/40 transition-colors font-bold"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#B88A32]/15 dark:border-[#B88A32]/25">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#6B5740] dark:text-[#A09383] uppercase shrink-0">Type:</span>
              <select
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                className="w-full bg-[#F4E9D5] dark:bg-[#1A1A26] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-[#2A2118] dark:text-[#F5EFE6] text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#B88A32] font-mono"
              >
                {FRAME_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#FFF9EF] dark:bg-[#14141E] text-[#2A2118] dark:text-[#F5EFE6]">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#6B5740] dark:text-[#A09383] uppercase shrink-0">Shape:</span>
              <select
                value={activeShape}
                onChange={(e) => setActiveShape(e.target.value)}
                className="w-full bg-[#F4E9D5] dark:bg-[#1A1A26] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-[#2A2118] dark:text-[#F5EFE6] text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#B88A32] font-mono"
              >
                {FRAME_SHAPES.map((s) => (
                  <option key={s} value={s} className="bg-[#FFF9EF] dark:bg-[#14141E] text-[#2A2118] dark:text-[#F5EFE6]">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#6B5740] dark:text-[#A09383] uppercase shrink-0">Brand:</span>
              <select
                value={activeBrand}
                onChange={(e) => setActiveBrand(e.target.value)}
                className="w-full bg-[#F4E9D5] dark:bg-[#1A1A26] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-[#2A2118] dark:text-[#F5EFE6] text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#B88A32] font-mono"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b} className="bg-[#FFF9EF] dark:bg-[#14141E] text-[#2A2118] dark:text-[#F5EFE6]">
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Result Meta Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <span className="text-xs font-mono text-[#6B5740] dark:text-[#A09383]">
            Showing <span className="text-[#B88A32] dark:text-[#D4AF62] font-bold">{filteredProducts.length}</span> curated frames
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Power Testing Available In Firozabad Clinic</span>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-[#FFF9EF] dark:bg-[#12121A] border border-[#B88A32]/20 dark:border-[#B88A32]/30 shadow-sm">
            <h3 className="text-lg font-cinzel text-[#2A2118] dark:text-[#F5EFE6] font-bold">No frames match your filters</h3>
            <p className="text-[#6B5740] dark:text-[#A09383] text-xs mt-1 font-mono">
              Try selecting different frame shapes, brands, or resetting filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-[#B88A32] to-[#D4AF62] text-white font-bold text-xs font-mono shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
      <WhatsAppFloat />

      {/* Floating Theme Switcher */}
      <div className="fixed bottom-6 left-6 z-40">
        <ThemeToggle variant="floating" />
      </div>
    </div>
  );
}

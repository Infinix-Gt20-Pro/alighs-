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
    <div className="relative min-h-screen bg-[#070709] text-white flex flex-col selection:bg-amber-500/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-24 w-full">
        {/* Header Title Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-mono text-amber-300 uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>LENSKART-GRADE CURATED ATELIER &bull; FIROZABAD</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-cinzel">
            Eyewear &amp; Optical Collection
          </h1>

          <p className="text-neutral-400 max-w-2xl text-xs sm:text-sm mt-3 font-light leading-relaxed font-sans">
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
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  : "bg-white/[0.04] text-neutral-300 hover:text-white border border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter & Search Control Panel */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Vincent Chase, titanium, rimless..."
                className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white/[0.05] border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400/60 focus:bg-white/[0.08] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sort:</span>
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400/60 cursor-pointer font-mono"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>

              {(activeCategory !== "All" || activeType !== "All Types" || activeShape !== "All Shapes" || activeBrand !== "All Brands" || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="cursor-pointer text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-400/10 px-3 py-2 rounded-xl border border-amber-400/20 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-400 uppercase shrink-0">Type:</span>
              <select
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                className="w-full bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 font-mono"
              >
                {FRAME_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-neutral-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-400 uppercase shrink-0">Shape:</span>
              <select
                value={activeShape}
                onChange={(e) => setActiveShape(e.target.value)}
                className="w-full bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 font-mono"
              >
                {FRAME_SHAPES.map((s) => (
                  <option key={s} value={s} className="bg-neutral-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-400 uppercase shrink-0">Brand:</span>
              <select
                value={activeBrand}
                onChange={(e) => setActiveBrand(e.target.value)}
                className="w-full bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 font-mono"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b} className="bg-neutral-900 text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Result Meta Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <span className="text-xs font-mono text-neutral-400">
            Showing <span className="text-amber-300 font-bold">{filteredProducts.length}</span> curated Lenskart-grade frames
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Power Testing Available In Firozabad Clinic</span>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg font-cinzel text-white">No frames match your filters</h3>
            <p className="text-neutral-400 text-xs mt-1 font-mono">
              Try selecting different frame shapes, brands, or resetting filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-5 py-2 rounded-xl bg-amber-400 text-black font-semibold text-xs font-mono"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
    </div>
  );
}

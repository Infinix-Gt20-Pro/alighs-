"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { DEFAULT_PRODUCTS, ProductType } from "@/lib/products-data";
import { Filter, Search, Sparkles, SlidersHorizontal, RefreshCw, X } from "lucide-react";

const CATEGORIES = ["All", "Eyeglasses", "Sunglasses", "Computer Glasses"];
const FRAME_SHAPES = ["All Shapes", "Aviator", "Hexagonal", "Clubmaster", "Cat-Eye", "Round", "Wayfarer", "Rectangle"];
const SORT_OPTIONS = [
  { label: "Featured & Bestsellers", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest Arrivals", value: "newest" },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeShape, setActiveShape] = useState("All Shapes");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("popular");

  // Instant reactive client-side filtering over curated catalog
  const filteredProducts = useMemo(() => {
    let list = [...DEFAULT_PRODUCTS];

    if (activeCategory !== "All") {
      const catKey = activeCategory.toLowerCase().replace(/\s+/g, "-");
      list = list.filter((p) => p.category.toLowerCase().replace(/\s+/g, "-") === catKey);
    }

    if (activeShape !== "All Shapes") {
      list = list.filter((p) => p.frameShape.toLowerCase() === activeShape.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
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
    }

    return list;
  }, [activeCategory, activeShape, searchQuery, sortOption]);

  const resetFilters = () => {
    setActiveCategory("All");
    setActiveShape("All Shapes");
    setSearchQuery("");
    setSortOption("popular");
  };

  return (
    <main className="min-h-screen bg-[#070709] text-white pt-28 pb-24 relative overflow-hidden">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-12 left-1/3 w-[600px] h-[500px] bg-amber-500/8 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-mono text-amber-300 uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ARCHITECTURAL EYEWEAR ATELIER</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-sans">
            Handcrafted Optical Collection
          </h1>

          <p className="text-neutral-400 max-w-2xl text-sm sm:text-base mt-3 font-light leading-relaxed">
            Engineered from Japanese pure titanium and Italian hand-polished acetate. Tested and fitted under the clinical guidance of Dr. Sheeraz Ahmad.
          </p>
        </div>

        {/* Filter & Search Control Panel */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-10 space-y-5">
          {/* Top Row: Search Input & Sorting */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titanium, aviator, blue-cut..."
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

            {/* Sorting Dropdown & Reset */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sort:</span>
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="cursor-pointer px-3.5 py-2 rounded-full bg-[#101116] border border-white/15 text-neutral-200 text-xs focus:outline-none focus:border-amber-400"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {(activeCategory !== "All" || activeShape !== "All Shapes" || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-amber-300 border border-white/10"
                  title="Reset all filters"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mr-2">Category:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-amber-400 text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Frame Shape Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mr-2">Shape:</span>
            {FRAME_SHAPES.map((shape) => (
              <button
                key={shape}
                onClick={() => setActiveShape(shape)}
                className={`cursor-pointer px-3 py-1 rounded-full text-[11px] font-mono transition-all duration-200 ${
                  activeShape === shape
                    ? "bg-white/20 text-white border border-white/40 font-semibold"
                    : "bg-white/[0.03] text-neutral-400 hover:text-neutral-200 border border-white/5"
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between mb-6 px-1">
          <span className="text-xs font-mono text-neutral-400">
            Showing <strong className="text-white">{filteredProducts.length}</strong> mastercraft frames
          </span>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            100% In Stock &bull; Free Shipping Over ₹1999
          </span>
        </div>

        {/* Product Cards Responsive Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
            <div className="text-5xl">👓</div>
            <h3 className="text-lg font-semibold text-white">No Matching Eyewear Found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Try adjusting your filter selection or clear search terms to view our full collection.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-full bg-amber-400 text-black font-semibold text-xs hover:brightness-110 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  _id: product._id,
                  id: product._id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  colors: product.colors,
                  features: product.features,
                  bestSeller: product.bestSeller,
                  category: product.category,
                  weight: product.weight,
                  images: product.images,
                  frameMaterial: product.material,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}

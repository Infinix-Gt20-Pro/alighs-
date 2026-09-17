"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PRODUCTS, ProductType } from "@/lib/products-data";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowRight, Sparkles, Check, Star } from "lucide-react";

export default function FeaturedShowcase() {
  const { addToCart } = useCart();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

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
    if (selectedFilter === "titanium") return product.material === "titanium";
    return true;
  }).slice(0, 6);

  const handleQuickAdd = (product: ProductType) => {
    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || "/images/clarity-showcase.jpg",
      color: product.colors[0] || "Black",
      colorHex: "#111111",
      weight: product.weight || "18g",
    }, 1);
    setAddedSlug(product.slug);
    setTimeout(() => setAddedSlug(null), 1800);
  };

  return (
    <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-mono text-amber-300 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Atelier Collection</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-[0.06em] text-white">
            Signature Optical Frames
          </h2>
          <p className="text-neutral-400 mt-2 max-w-xl text-sm sm:text-base font-light">
            Each piece is calibrated for precision ergonomics, optical clarity, and timeless elegance.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`cursor-pointer px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                selectedFilter === f.id
                  ? "bg-amber-400 text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              key={product._id}
              className="group relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-amber-400/40 p-6 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
            >
              {/* Card Badges */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">
                  {product.material.toUpperCase()} &bull; {product.weight}
                </span>

                {product.bestSeller && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300 uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    Bestseller
                  </span>
                )}
              </div>

              {/* Visual Display Mock / Frame Silhouette */}
              <Link href={`/shop/${product.slug}`} className="block relative my-6 text-center group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex items-center justify-center relative overflow-hidden border border-white/5">
                  {/* Subtle ambient lighting inside card */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-cyan-500/10 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Stylized Optical Representation */}
                  <div className="relative flex flex-col items-center">
                    <div className="text-4xl filter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                      👓
                    </div>
                    <span className="text-[11px] font-mono text-amber-300/80 uppercase tracking-widest mt-2">
                      {product.frameShape} contour
                    </span>
                  </div>
                </div>
              </Link>

              {/* Info & Details */}
              <div>
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Features & Color Swatches */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    {product.colors.slice(0, 3).map((col) => (
                      <span
                        key={col}
                        className="w-3 h-3 rounded-full border border-white/30"
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
                    <span className="text-[10px] text-neutral-500 font-mono ml-1">
                      {product.colors.length} finishes
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="text-right">
                    <span className="text-xs text-neutral-500 line-through mr-2 font-mono">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-base font-bold text-amber-300 font-mono">
                      ₹{product.price}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2.5 mt-5">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="cursor-pointer text-center py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-xs font-medium text-white transition-all duration-200"
                  >
                    View Specs
                  </Link>

                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="cursor-pointer flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md"
                  >
                    {addedSlug === product.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-black" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-black" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom CTA to Shop */}
      <div className="text-center mt-10">
        <Link
          href="/shop"
          className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/20 text-white font-medium text-sm hover:border-amber-400/50 hover:scale-105 transition-all duration-300 backdrop-blur-xl"
        >
          <span>Explore All 12 Architectural Frames</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>
    </section>
  );
}

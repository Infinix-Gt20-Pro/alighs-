"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingBag, Check, Star, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface ProductProps {
  product: {
    _id?: string;
    id?: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    colors?: (string | { name: string; hex: string })[];
    features?: string[];
    bestSeller?: boolean;
    category: string;
    weight?: string;
    images?: string[];
    frameMaterial?: string;
  };
}

const COLOR_MAP: Record<string, string> = {
  black: "#141416",
  gold: "#D4AF37",
  silver: "#E0E5EC",
  gunmetal: "#374151",
  emerald: "#0F4C3A",
  "emerald green": "#0F4C3A",
  tortoise: "#78350F",
  "amber tortoise": "#78350F",
  crimson: "#991B1B",
  "crimson red": "#991B1B",
  "rose gold": "#B76E79",
  cobalt: "#1E3A8A",
  "cobalt blue": "#1E3A8A",
  clear: "#E2E8F0",
  "crystal clear": "#E2E8F0",
  graphite: "#475569",
  champagne: "#D4AF37",
};

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCart();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const colors = product.colors || ["Black"];
  const activeColorObj = colors[selectedColorIdx] || colors[0];
  const activeColorName = typeof activeColorObj === "string" ? activeColorObj : activeColorObj.name;
  const activeColorHex = typeof activeColorObj === "string"
    ? COLOR_MAP[activeColorObj.toLowerCase()] || "#374151"
    : activeColorObj.hex;

  const handleAddToCart = () => {
    addToCart({
      productId: product._id || product.id || product.slug,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0] || "/images/clarity-showcase.jpg",
      color: activeColorName,
      colorHex: activeColorHex,
      weight: product.weight || "14g",
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-amber-400/40 p-6 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)]"
    >
      {/* Badges Bar */}
      <div className="flex items-center justify-between z-10 mb-2">
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10">
          {product.frameMaterial || "OPTICAL GRADE"} &bull; {product.weight || "14g"}
        </span>

        {product.bestSeller && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300 uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            Bestseller
          </span>
        )}
      </div>

      {/* Visual Frame Presentation */}
      <Link href={`/shop/${product.slug}`} className="block relative my-6 text-center group-hover:scale-105 transition-transform duration-500">
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-neutral-900 via-[#0c0d12] to-black border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-indigo-500/10 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative text-5xl filter drop-shadow-[0_0_18px_rgba(212,175,55,0.4)]">
            👓
          </div>
          
          <span className="relative text-[10px] font-mono text-amber-300/80 uppercase tracking-widest mt-3">
            {activeColorName} finish
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/shop/${product.slug}`}>
              <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors font-sans line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <span className="text-[11px] font-mono text-neutral-400 capitalize">
              {product.category.replace("-", " ")}
            </span>
          </div>

          <div className="text-right">
            <div className="text-base font-bold font-mono text-amber-300">
              ₹{product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-neutral-500 line-through font-mono">
                ₹{product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Color Swatch Clickable Selector */}
        {colors.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Finish:</span>
            <div className="flex items-center gap-1.5">
              {colors.map((color, idx) => {
                const cName = typeof color === "string" ? color : color.name;
                const cHex = typeof color === "string" ? COLOR_MAP[color.toLowerCase()] || "#374151" : color.hex;
                const isSelected = selectedColorIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`cursor-pointer w-4 h-4 rounded-full border transition-all ${
                      isSelected
                        ? "border-amber-400 scale-125 shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                        : "border-white/30 hover:scale-110"
                    }`}
                    style={{ backgroundColor: cHex }}
                    title={cName}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 mt-1">
          <button
            onClick={handleAddToCart}
            className="cursor-pointer w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            {isAdded ? (
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

          <a
            href={`https://wa.me/917217371499?text=Hi%20ALIGH'S%20WARE!%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(activeColorName)})`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-neutral-300 hover:text-white text-xs font-medium border border-white/15 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

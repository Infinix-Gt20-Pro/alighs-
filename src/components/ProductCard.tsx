// src/components/ProductCard.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingBag, Check, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import FrameSilhouette from "./FrameSilhouette";

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
    frameType?: "full-rim" | "half-rim" | "rimless" | string;
    frameShape?: string;
    brandCollection?: string;
    caliber?: string;
    weight?: string;
    images?: string[];
    frameMaterial?: string;
  };
}

const COLOR_MAP: Record<string, string> = {
  black: "#141416",
  "matte black": "#18181b",
  "solid black": "#09090b",
  "midnight black": "#0c0d12",
  "deep onyx": "#09090b",
  "piano black": "#000000",
  gold: "#D4AF37",
  "24k champagne gold": "#D4AF37",
  "champagne gold": "#D4AF37",
  "matte gold": "#C5A059",
  silver: "#E0E5EC",
  "silver mist": "#CBD5E1",
  "silver frost": "#E2E8F0",
  "brushed silver": "#94A3B8",
  gunmetal: "#374151",
  "gunmetal silver": "#475569",
  emerald: "#0F4C3A",
  "emerald green": "#0F4C3A",
  tortoise: "#78350F",
  "amber tortoise": "#78350F",
  "havana tortoise": "#78350F",
  "tokyo tortoise": "#854D0E",
  "matte tortoise": "#713F12",
  crimson: "#991B1B",
  "crimson red": "#991B1B",
  "crimson wine": "#881337",
  "rose gold": "#B76E79",
  "rose gold/pink": "#B76E79",
  cobalt: "#1E3A8A",
  "cobalt blue": "#1E3A8A",
  "midnight navy": "#1E293B",
  "deep blue": "#1E3A8A",
  clear: "#E2E8F0",
  "clear ice": "#E2E8F0",
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

  const isSunglass = product.category === "sunglasses";

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

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-amber-400/40 p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)]"
    >
      {/* Badges Bar */}
      <div className="flex items-center justify-between z-10 mb-2 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10">
            {product.frameType?.replace("-", " ") || "Full Rim"}
          </span>
          {product.brandCollection && (
            <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 hidden sm:inline-block">
              {product.brandCollection}
            </span>
          )}
        </div>

        {product.bestSeller && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 shrink-0">
            <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
            Top Seller
          </span>
        )}
      </div>

      {/* Visual Presentation: Real Studio Photo with Silhouette Fallback */}
      <Link
        href={`/shop/${product.slug}`}
        className="block relative my-4 text-center group-hover:scale-105 transition-transform duration-500"
      >
        <div className="w-full h-48 sm:h-52 rounded-2xl bg-gradient-to-br from-neutral-950 via-[#0c0d12] to-black border border-white/5 flex flex-col items-center justify-center relative overflow-hidden p-3">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-indigo-500/10 opacity-20 group-hover:opacity-60 transition-opacity duration-500" />
          
          {product.images && product.images[0] ? (
            <div className="relative z-10 w-full h-32 sm:h-36 flex items-center justify-center p-2">
              <img
                src={product.images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  if (product.images && product.images[1] && e.currentTarget.src !== product.images[1]) {
                    e.currentTarget.src = product.images[1];
                  }
                }}
              />
            </div>
          ) : (
            <div className="relative z-10 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <FrameSilhouette
                shape={product.frameShape || "rectangle"}
                frameType={product.frameType || "full-rim"}
                color={activeColorHex}
                isSunglass={isSunglass}
                className="w-44 sm:w-52 h-20 sm:h-24"
              />
            </div>
          )}
          
          <div className="relative z-10 flex items-center gap-2 mt-2">
            <span className="text-[10px] font-mono text-amber-300/90 uppercase tracking-wider">
              {activeColorName} finish
            </span>
            {product.weight && (
              <span className="text-[10px] font-mono text-neutral-400">
                &bull; {product.weight}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/shop/${product.slug}`}>
              <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-amber-300 transition-colors font-sans line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-neutral-400">
              <span className="capitalize">{product.category.replace("-", " ")}</span>
              {product.caliber && <span>&bull; {product.caliber}</span>}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-base sm:text-lg font-bold font-mono text-amber-300">
              ₹{product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs text-neutral-500 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                  {discount}% OFF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Colors:</span>
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
        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/10 mt-1">
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
            href={`https://wa.me/917217371499?text=Hi%20ALIG'S%20WARE!%20I'm%20interested%20in%20ordering%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(activeColorName)}).%20Please%20guide%20me.`}
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

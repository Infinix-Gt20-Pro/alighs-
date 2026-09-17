"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Award,
  Sparkles,
  Plus,
  Minus,
  Eye,
  FileText,
  Calendar
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { DEFAULT_PRODUCTS, ProductType, getFallbackProductBySlug } from "@/lib/products-data";

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string) || "";
  const initialProduct = useMemo(() => getFallbackProductBySlug(slug), [slug]);

  const [product, setProduct] = useState<ProductType>(initialProduct);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [lensType, setLensType] = useState("zero-power");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
            setProduct(data);
          }
        }
      } catch (err) {
        console.warn("Using local catalog data for:", slug);
      }
    };
    fetchProduct();
  }, [slug]);

  const colors = product?.colors || ["Black"];
  const activeColor = colors[selectedColorIdx] || colors[0];
  const activeColorHex = COLOR_MAP[activeColor.toLowerCase()] || "#374151";

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product._id || product.slug,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || "/images/clarity-showcase.jpg",
        color: activeColor,
        colorHex: activeColorHex,
        weight: product.weight || "14g",
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWhatsAppBuy = () => {
    const msg = `Hi Dr. Sheeraz & ALIGH'S WARE Team! I am interested in ordering the ${product.name} (Finish: ${activeColor}, Lens: ${lensType}, Qty: ${quantity}). Please guide me with power verification.`;
    window.open(`https://wa.me/917217371499?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const relatedProducts = DEFAULT_PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#070709] text-white pt-28 pb-24 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-20 right-1/4 w-[600px] h-[500px] bg-amber-500/8 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-1/4 w-[600px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <Link
          href="/shop"
          className="cursor-pointer inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-amber-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Atelier Collection</span>
        </Link>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Visual Showcase Card */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 p-10 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] shadow-2xl overflow-hidden group">
              {/* Card Badges */}
              <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                  {product.material.toUpperCase()} &bull; {product.weight}
                </span>
                {product.bestSeller && (
                  <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Dynamic Aura */}
              <div
                className="absolute inset-0 opacity-40 blur-3xl transition-colors duration-700 pointer-events-none"
                style={{ backgroundColor: activeColorHex }}
              />

              {/* Central Optical Motif */}
              <div className="relative text-8xl sm:text-9xl filter drop-shadow-[0_0_35px_rgba(212,175,55,0.4)] my-8">
                👓
              </div>

              <div className="relative text-center">
                <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">
                  Selected Finish: {activeColor}
                </span>
                <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                  Optical Bench Tested &bull; Japanese Alloy Precision
                </p>
              </div>
            </div>

            {/* Quality Certifications Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Coating</span>
                <span className="text-xs font-semibold text-white block">Sapphire 420nm</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <Truck className="w-4 h-4 text-cyan-400 mx-auto mb-1.5" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Delivery</span>
                <span className="text-xs font-semibold text-white block">Free Express</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <Award className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Doctor Check</span>
                <span className="text-xs font-semibold text-white block">AMU Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer & Purchase */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono text-neutral-300 uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">{product.category.replace("-", " ")}</span>
                <span>&bull;</span>
                <span className="capitalize">{product.frameShape}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-sans">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-amber-300">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-neutral-500 line-through font-mono">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                      SAVE {discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-neutral-300 text-sm sm:text-base mt-4 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Frame Finish Selector */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Select Frame Finish:
                </span>
                <span className="text-xs font-semibold text-white font-mono">{activeColor}</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {colors.map((color, idx) => {
                  const isSelected = selectedColorIdx === idx;
                  const cHex = COLOR_MAP[color.toLowerCase()] || "#374151";
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all ${
                        isSelected
                          ? "bg-white/15 border border-amber-400 text-white shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                          : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: cHex }} />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lens Type Customizer */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                Select Lens Prescription Option:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: "zero-power", title: "Zero-Power Blue Cut", desc: "Digital screen shield" },
                  { id: "single-vision", title: "Single Vision Power", desc: "Distance or Reading" },
                  { id: "consult-doctor", title: "Free Doctor Power Check", desc: "Firozabad Clinic / Call" },
                ].map((lt) => (
                  <button
                    key={lt.id}
                    onClick={() => setLensType(lt.id)}
                    className={`cursor-pointer p-3.5 rounded-xl text-left border transition-all ${
                      lensType === lt.id
                        ? "bg-amber-400/10 border-amber-400 text-white shadow-sm"
                        : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-semibold block text-white">{lt.title}</span>
                    <span className="text-[11px] text-neutral-400 block mt-1">{lt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Counter & Primary Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Quantity:</span>
                <div className="inline-flex items-center rounded-xl bg-white/[0.06] border border-white/15 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="cursor-pointer p-1.5 text-neutral-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-mono font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="cursor-pointer p-1.5 text-neutral-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="cursor-pointer w-full py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Added to Your Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-black" />
                      <span>Add to Bag (₹{(product.price * quantity).toLocaleString()})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsAppBuy}
                  className="cursor-pointer w-full py-4 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Buy Directly on WhatsApp</span>
                </button>
              </div>

              <Link
                href="/appointment"
                className="cursor-pointer w-full py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Want Dr. Sheeraz Ahmad to check your power in Firozabad? Book Appointment</span>
              </Link>
            </div>

            {/* Technical Specifications Table */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
              <h3 className="text-sm font-mono text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Optical Architecture &amp; Dimensions
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-neutral-500 block font-mono">Frame Material</span>
                  <span className="font-semibold text-white capitalize mt-0.5 block">{product.material}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono">Total Weight</span>
                  <span className="font-semibold text-white mt-0.5 block">{product.weight}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono">Contour Silhouette</span>
                  <span className="font-semibold text-white capitalize mt-0.5 block">{product.frameShape}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono">Lens Coating</span>
                  <span className="font-semibold text-white mt-0.5 block">Anti-Glare Sapphire</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Handcrafted Frames */}
        <div className="mt-28 border-t border-white/10 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono text-amber-300 uppercase tracking-widest block">Complete Your Style</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Similar Handcrafted Frames</h2>
            </div>
            <Link href="/shop" className="cursor-pointer text-xs font-mono text-amber-400 hover:underline">
              View All 12 Frames &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/shop/${rel.slug}`}
                className="group p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between"
              >
                <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-white/5 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
                  👓
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {rel.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-xs font-mono">
                    <span className="text-neutral-400 capitalize">{rel.material}</span>
                    <span className="font-bold text-amber-300">₹{rel.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

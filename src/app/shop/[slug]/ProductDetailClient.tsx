"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
  FileText,
  Calendar
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import FrameSilhouette from "@/components/FrameSilhouette";
import { ProductType, getFallbackProductBySlug, getFallbackProducts } from "@/lib/products-data";
import ThemeToggle from "@/components/ThemeToggle";

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

export default function ProductDetailClient() {
  const params = useParams();
  const { addToCart } = useCart();

  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string) || "";
  const initialProduct = useMemo(() => getFallbackProductBySlug(slug, true), [slug]);

  const [product, setProduct] = useState<ProductType | null>(initialProduct);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [lensType, setLensType] = useState("zero-power");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          if (data && data.name && (!data.status || data.status.toLowerCase() === "active")) {
            setProduct(data);
            setIsUnavailable(false);
          } else {
            setProduct(null);
            setIsUnavailable(true);
          }
        } else {
          setProduct(null);
          setIsUnavailable(true);
        }
      } catch {
        if (isMounted) {
          const fb = getFallbackProductBySlug(slug, true);
          if (fb) {
            setProduct(fb);
            setIsUnavailable(false);
          } else {
            setProduct(null);
            setIsUnavailable(true);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const colors = product?.colors || ["Black"];
  const activeColor = colors[selectedColorIdx] || colors[0];
  const activeColorHex = COLOR_MAP[activeColor.toLowerCase()] || "#374151";

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product) return;
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
    if (!product) return;
    const msg = `Hi Dr. Sheeraz & ALIGSWARE Team! I am interested in ordering the ${product.name} (Finish: ${activeColor}, Lens: ${lensType}, Qty: ${quantity}). Please guide me with power verification.`;
    window.open(`https://wa.me/917217371499?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const relatedProducts = useMemo(() => {
    return getFallbackProducts({ onlyActive: true })
      .filter((p) => p.slug !== product?.slug)
      .slice(0, 3);
  }, [product?.slug]);

  if (!isLoading && (!product || isUnavailable)) {
    return (
      <main className="min-h-screen bg-[#F4E9D5] dark:bg-[#0A0A0E] text-[#2A2118] dark:text-[#F5EFE6] pt-32 pb-24 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center pt-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 dark:border-[#B88A32]/40 flex items-center justify-center shadow-lg mb-6">
            <Sparkles className="w-8 h-8 text-[#B88A32] dark:text-[#D4AF62]" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B88A32] dark:text-[#D4AF62] font-bold block mb-2">
            Atelier Catalog Notice
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-[#2A2118] dark:text-[#F5EFE6] mb-3">
            Frame Currently Unavailable
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#6B5740] dark:text-[#A09383] mb-8 leading-relaxed">
            This optical frame has been marked inactive by our atelier or is temporarily out of catalog. Please explore our active curated collection.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#B88A32] to-[#D4AF62] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Active Frames</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 text-xs font-mono font-bold text-[#2A2118] dark:text-[#F5EFE6] hover:bg-white dark:hover:bg-[#202030] transition-all"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading && !product) {
    return (
      <main className="min-h-screen bg-[#F4E9D5] dark:bg-[#0A0A0E] pt-32 pb-24 flex items-center justify-center">
        <div className="text-center font-mono text-xs text-[#B88A32] animate-pulse">
          Loading frame details...
        </div>
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="min-h-screen bg-[#F4E9D5] dark:bg-[#0A0A0E] text-[#2A2118] dark:text-[#F5EFE6] pt-28 pb-24 relative overflow-hidden selection:bg-[#B88A32]/30 selection:text-[#2A2118] dark:selection:text-[#F5EFE6] transition-colors duration-300">
      {/* Ambient Lighting */}
      <div className="absolute top-20 right-1/4 w-[600px] h-[500px] bg-gradient-to-br from-[#D4AF62]/20 via-[#B88A32]/10 to-transparent dark:from-[#D4AF62]/10 dark:via-[#B88A32]/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-1/4 w-[600px] h-[500px] bg-gradient-to-tr from-[#E8D2A8]/30 via-[#D6B878]/15 to-transparent dark:from-[#B88A32]/10 dark:via-transparent rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/shop"
            className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF9EF] dark:bg-[#161622] hover:bg-white dark:hover:bg-[#202030] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-xs font-mono text-[#2A2118] dark:text-[#F5EFE6] hover:text-[#B88A32] dark:hover:text-[#D4AF62] transition-all group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#B88A32] dark:text-[#D4AF62]" />
            <span>&larr; Back to Collection</span>
          </Link>
          <Link
            href="/"
            className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-mono text-[#6B5740] dark:text-[#A09383] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] transition-colors"
          >
            <span>Home</span>
          </Link>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Visual Showcase Card */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="relative rounded-3xl bg-[#FFF9EF] dark:bg-[#12121A] border border-[#B88A32]/25 dark:border-[#B88A32]/35 p-10 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] shadow-[0_15px_45px_rgba(42,33,24,0.08)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.6)] overflow-hidden group">
              {/* Card Badges */}
              <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <span className="text-[10px] font-mono text-[#B88A32] dark:text-[#D4AF62] uppercase tracking-widest px-3 py-1 rounded-full bg-[#F4E9D5] dark:bg-[#1C1C2A] border border-[#B88A32]/30 dark:border-[#B88A32]/40 font-bold shadow-sm">
                  {product.material.toUpperCase()} &bull; {product.weight}
                </span>
                {product.bestSeller && (
                  <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 font-bold shadow-sm">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Dynamic Aura */}
              <div
                className="absolute inset-0 opacity-20 blur-3xl transition-colors duration-700 pointer-events-none"
                style={{ backgroundColor: activeColorHex }}
              />

              {/* Central Real Studio Photo Showcase */}
              <div className="relative my-6 flex flex-col items-center justify-center w-full min-h-[240px]">
                {product.images && product.images[0] ? (
                  <div className="relative z-10 w-full h-56 sm:h-72 flex items-center justify-center p-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(42,33,24,0.18)] transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        if (product.images && product.images[1] && e.currentTarget.src !== product.images[1]) {
                          e.currentTarget.src = product.images[1];
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative filter drop-shadow-[0_0_20px_rgba(184,138,50,0.3)] my-8 flex items-center justify-center">
                    <FrameSilhouette
                      shape={product.frameShape || "rectangle"}
                      frameType={(product as unknown as Record<string, unknown>).frameType as "full-rim" | "half-rim" | "rimless" || "full-rim"}
                      color={activeColorHex}
                      isSunglass={product.category === "sunglasses"}
                      className="w-64 sm:w-80 h-32 sm:h-40"
                    />
                  </div>
                )}
              </div>

              <div className="relative text-center">
                <span className="text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] uppercase tracking-widest font-bold">
                  Selected Finish: {activeColor}
                </span>
                <p className="text-[11px] text-[#6B5740] dark:text-[#A09383] mt-1 font-mono">
                  Optical Bench Tested &bull; Japanese Alloy Precision
                </p>
              </div>
            </div>

            {/* Quality Certifications Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FFF9EF] dark:bg-[#14141E] border border-[#B88A32]/25 dark:border-[#B88A32]/35 text-center shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#B88A32] dark:text-[#D4AF62] mx-auto mb-1.5" />
                <span className="text-[10px] font-mono text-[#6B5740] dark:text-[#A09383] uppercase tracking-wider block">Coating</span>
                <span className="text-xs font-bold text-[#2A2118] dark:text-[#F5EFE6] block">Sapphire 420nm</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9EF] dark:bg-[#14141E] border border-[#B88A32]/25 dark:border-[#B88A32]/35 text-center shadow-sm">
                <Truck className="w-4 h-4 text-[#B88A32] dark:text-[#D4AF62] mx-auto mb-1.5" />
                <span className="text-[10px] font-mono text-[#6B5740] dark:text-[#A09383] uppercase tracking-wider block">Delivery</span>
                <span className="text-xs font-bold text-[#2A2118] dark:text-[#F5EFE6] block">Free Express</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9EF] dark:bg-[#14141E] border border-[#B88A32]/25 dark:border-[#B88A32]/35 text-center shadow-sm">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
                <span className="text-[10px] font-mono text-[#6B5740] dark:text-[#A09383] uppercase tracking-wider block">Doctor Check</span>
                <span className="text-xs font-bold text-[#2A2118] dark:text-[#F5EFE6] block">AMU Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer & Purchase */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-[11px] font-mono text-[#4A3928] dark:text-[#D5C7B5] uppercase tracking-widest mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
                <span className="capitalize">{product.category.replace("-", " ")}</span>
                <span>&bull;</span>
                <span className="capitalize">{product.frameShape}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#2A2118] dark:text-[#F5EFE6] tracking-tight font-cinzel">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-[#B88A32] dark:text-[#D4AF62]">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-[#8B7355] dark:text-[#A09383] line-through font-mono">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700">
                      SAVE {discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-[#4A3928] dark:text-[#D5C7B5] text-sm sm:text-base mt-4 font-cormorant italic leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Frame Finish Selector */}
            <div className="p-5 rounded-2xl bg-[#FFF9EF] dark:bg-[#12121A] border border-[#B88A32]/25 dark:border-[#B88A32]/35 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#6B5740] dark:text-[#A09383]">
                  Select Frame Finish:
                </span>
                <span className="text-xs font-bold text-[#2A2118] dark:text-[#F5EFE6] font-mono">{activeColor}</span>
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
                          ? "bg-[#B88A32]/15 dark:bg-[#B88A32]/25 border-2 border-[#B88A32] text-[#2A2118] dark:text-[#F5EFE6] font-bold shadow-sm"
                          : "bg-[#F4E9D5] dark:bg-[#1A1A26] text-[#6B5740] dark:text-[#A09383] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] border border-[#B88A32]/20 dark:border-[#B88A32]/30"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: cHex }} />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lens Type Customizer */}
            <div className="p-5 rounded-2xl bg-[#FFF9EF] dark:bg-[#12121A] border border-[#B88A32]/25 dark:border-[#B88A32]/35 space-y-3 shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6B5740] dark:text-[#A09383] block">
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
                        ? "bg-[#B88A32]/15 dark:bg-[#B88A32]/25 border-2 border-[#B88A32] text-[#2A2118] dark:text-[#F5EFE6] shadow-sm font-semibold"
                        : "bg-[#F4E9D5] dark:bg-[#1A1A26] border-[#B88A32]/20 dark:border-[#B88A32]/30 text-[#6B5740] dark:text-[#A09383] hover:text-[#2A2118] dark:hover:text-[#F5EFE6]"
                    }`}
                  >
                    <span className="text-xs font-bold block text-[#2A2118] dark:text-[#F5EFE6]">{lt.title}</span>
                    <span className="text-[11px] text-[#6B5740] dark:text-[#A09383] block mt-1">{lt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Counter & Primary Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-[#6B5740] dark:text-[#A09383] uppercase tracking-wider">Quantity:</span>
                <div className="inline-flex items-center rounded-xl bg-[#F4E9D5] dark:bg-[#1A1A26] border border-[#B88A32]/25 dark:border-[#B88A32]/35 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="cursor-pointer p-1.5 text-[#6B5740] dark:text-[#A09383] hover:text-[#2A2118] dark:hover:text-[#F5EFE6]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-mono font-bold text-[#2A2118] dark:text-[#F5EFE6]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="cursor-pointer p-1.5 text-[#6B5740] dark:text-[#A09383] hover:text-[#2A2118] dark:hover:text-[#F5EFE6]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="cursor-pointer w-full py-4 rounded-full bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(184,138,50,0.35)] hover:brightness-105 active:scale-95 transition-all"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Your Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>Add to Bag (₹{(product.price * quantity).toLocaleString()})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsAppBuy}
                  className="cursor-pointer w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Buy Directly on WhatsApp</span>
                </button>
              </div>

              <Link
                href="/appointment"
                className="cursor-pointer w-full py-3 rounded-2xl bg-[#FFF9EF] dark:bg-[#14141E] hover:bg-white dark:hover:bg-[#1C1C2A] border border-[#B88A32]/25 dark:border-[#B88A32]/35 text-[#4A3928] dark:text-[#D5C7B5] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
                <span>Want Dr. Sheeraz Ahmad to check your power in Firozabad? Book Appointment</span>
              </Link>
            </div>

            {/* Technical Specifications Table */}
            <div className="p-6 rounded-3xl bg-[#FFF9EF] dark:bg-[#12121A] border border-[#B88A32]/25 dark:border-[#B88A32]/35 space-y-4 shadow-sm">
              <h3 className="text-sm font-mono text-[#2A2118] dark:text-[#F5EFE6] font-bold uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#B88A32] dark:text-[#D4AF62]" />
                Optical Architecture &amp; Dimensions
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-[#6B5740] dark:text-[#A09383] block font-mono">Frame Material</span>
                  <span className="font-bold text-[#2A2118] dark:text-[#F5EFE6] capitalize mt-0.5 block">{product.material}</span>
                </div>
                <div>
                  <span className="text-[#6B5740] dark:text-[#A09383] block font-mono">Total Weight</span>
                  <span className="font-bold text-[#2A2118] dark:text-[#F5EFE6] mt-0.5 block">{product.weight}</span>
                </div>
                <div>
                  <span className="text-[#6B5740] dark:text-[#A09383] block font-mono">Contour Silhouette</span>
                  <span className="font-bold text-[#2A2118] dark:text-[#F5EFE6] capitalize mt-0.5 block">{product.frameShape}</span>
                </div>
                <div>
                  <span className="text-[#6B5740] dark:text-[#A09383] block font-mono">Lens Coating</span>
                  <span className="font-bold text-[#2A2118] dark:text-[#F5EFE6] mt-0.5 block">Anti-Glare Sapphire</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Handcrafted Frames */}
        <div className="mt-28 border-t border-[#B88A32]/20 dark:border-[#B88A32]/30 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] uppercase tracking-widest block font-bold">Complete Your Style</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2A2118] dark:text-[#F5EFE6] font-cinzel mt-1">Similar Handcrafted Frames</h2>
            </div>
            <Link href="/shop" className="cursor-pointer text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] hover:underline font-bold">
              View All 40+ Frames &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/shop/${rel.slug}`}
                className="group p-5 rounded-3xl bg-[#FFF9EF] dark:bg-[#12121A] border border-[#B88A32]/20 dark:border-[#B88A32]/30 hover:border-[#B88A32]/50 dark:hover:border-[#B88A32]/60 transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-[#F4E9D5] to-[#E8D2A8] dark:from-[#181824] dark:to-[#12121D] border border-[#B88A32]/15 dark:border-[#B88A32]/25 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  👓
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-[#2A2118] dark:text-[#F5EFE6] font-cinzel group-hover:text-[#B88A32] dark:group-hover:text-[#D4AF62] transition-colors">
                    {rel.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-xs font-mono">
                    <span className="text-[#6B5740] dark:text-[#A09383] capitalize">{rel.material}</span>
                    <span className="font-bold text-[#B88A32] dark:text-[#D4AF62]">₹{rel.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Theme Switcher */}
      <div className="fixed bottom-6 left-6 z-40">
        <ThemeToggle variant="floating" />
      </div>
    </main>
  );
}

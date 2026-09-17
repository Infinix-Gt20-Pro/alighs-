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

export default function ProductDetailClient() {
  const params = useParams();
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
      } catch {
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
    const msg = `Hi Dr. Sheeraz & ALIGSWARE Team! I am interested in ordering the ${product.name} (Finish: ${activeColor}, Lens: ${lensType}, Qty: ${quantity}). Please guide me with power verification.`;
    window.open(`https://wa.me/917217371499?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const relatedProducts = DEFAULT_PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F4E9D5] text-[#2A2118] pt-28 pb-24 relative overflow-hidden selection:bg-[#B88A32]/30 selection:text-[#2A2118]">
      {/* Ambient Lighting */}
      <div className="absolute top-20 right-1/4 w-[600px] h-[500px] bg-gradient-to-br from-[#D4AF62]/20 via-[#B88A32]/10 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-1/4 w-[600px] h-[500px] bg-gradient-to-tr from-[#E8D2A8]/30 via-[#D6B878]/15 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/shop"
            className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF9EF] hover:bg-white border border-[#B88A32]/30 text-xs font-mono text-[#2A2118] hover:text-[#B88A32] transition-all group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#B88A32]" />
            <span>&larr; Back to Collection</span>
          </Link>
          <Link
            href="/"
            className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-mono text-[#6B5740] hover:text-[#2A2118] transition-colors"
          >
            <span>Home</span>
          </Link>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Visual Showcase Card */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="relative rounded-3xl bg-[#FFF9EF] border border-[#B88A32]/25 p-10 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] shadow-[0_15px_45px_rgba(42,33,24,0.08)] overflow-hidden group">
              {/* Card Badges */}
              <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <span className="text-[10px] font-mono text-[#B88A32] uppercase tracking-widest px-3 py-1 rounded-full bg-[#F4E9D5] border border-[#B88A32]/30 font-bold shadow-sm">
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
                <span className="text-xs font-mono text-[#B88A32] uppercase tracking-widest font-bold">
                  Selected Finish: {activeColor}
                </span>
                <p className="text-[11px] text-[#6B5740] mt-1 font-mono">
                  Optical Bench Tested &bull; Japanese Alloy Precision
                </p>
              </div>
            </div>

            {/* Quality Certifications Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FFF9EF] border border-[#B88A32]/25 text-center shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#B88A32] mx-auto mb-1.5" />
                <span className="text-[10px] font-mono text-[#6B5740] uppercase tracking-wider block">Coating</span>
                <span className="text-xs font-bold text-[#2A2118] block">Sapphire 420nm</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9EF] border border-[#B88A32]/25 text-center shadow-sm">
                <Truck className="w-4 h-4 text-[#B88A32] mx-auto mb-1.5" />
                <span className="text-[10px] font-mono text-[#6B5740] uppercase tracking-wider block">Delivery</span>
                <span className="text-xs font-bold text-[#2A2118] block">Free Express</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9EF] border border-[#B88A32]/25 text-center shadow-sm">
                <Award className="w-4 h-4 text-emerald-600 mx-auto mb-1.5" />
                <span className="text-[10px] font-mono text-[#6B5740] uppercase tracking-wider block">Doctor Check</span>
                <span className="text-xs font-bold text-[#2A2118] block">AMU Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer & Purchase */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9EF] border border-[#B88A32]/30 text-[11px] font-mono text-[#4A3928] uppercase tracking-widest mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#B88A32]" />
                <span className="capitalize">{product.category.replace("-", " ")}</span>
                <span>&bull;</span>
                <span className="capitalize">{product.frameShape}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#2A2118] tracking-tight font-cinzel">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-[#B88A32]">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-[#8B7355] line-through font-mono">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300">
                      SAVE {discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-[#4A3928] text-sm sm:text-base mt-4 font-cormorant italic leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Frame Finish Selector */}
            <div className="p-5 rounded-2xl bg-[#FFF9EF] border border-[#B88A32]/25 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#6B5740]">
                  Select Frame Finish:
                </span>
                <span className="text-xs font-bold text-[#2A2118] font-mono">{activeColor}</span>
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
                          ? "bg-[#B88A32]/15 border-2 border-[#B88A32] text-[#2A2118] font-bold shadow-sm"
                          : "bg-[#F4E9D5] text-[#6B5740] hover:text-[#2A2118] border border-[#B88A32]/20"
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
            <div className="p-5 rounded-2xl bg-[#FFF9EF] border border-[#B88A32]/25 space-y-3 shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6B5740] block">
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
                        ? "bg-[#B88A32]/15 border-2 border-[#B88A32] text-[#2A2118] shadow-sm font-semibold"
                        : "bg-[#F4E9D5] border-[#B88A32]/20 text-[#6B5740] hover:text-[#2A2118]"
                    }`}
                  >
                    <span className="text-xs font-bold block text-[#2A2118]">{lt.title}</span>
                    <span className="text-[11px] text-[#6B5740] block mt-1">{lt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Counter & Primary Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-[#6B5740] uppercase tracking-wider">Quantity:</span>
                <div className="inline-flex items-center rounded-xl bg-[#F4E9D5] border border-[#B88A32]/25 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="cursor-pointer p-1.5 text-[#6B5740] hover:text-[#2A2118]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-mono font-bold text-[#2A2118]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="cursor-pointer p-1.5 text-[#6B5740] hover:text-[#2A2118]"
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
                className="cursor-pointer w-full py-3 rounded-2xl bg-[#FFF9EF] hover:bg-white border border-[#B88A32]/25 text-[#4A3928] hover:text-[#2A2118] text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-[#B88A32]" />
                <span>Want Dr. Sheeraz Ahmad to check your power in Firozabad? Book Appointment</span>
              </Link>
            </div>

            {/* Technical Specifications Table */}
            <div className="p-6 rounded-3xl bg-[#FFF9EF] border border-[#B88A32]/25 space-y-4 shadow-sm">
              <h3 className="text-sm font-mono text-[#2A2118] font-bold uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#B88A32]" />
                Optical Architecture &amp; Dimensions
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-[#6B5740] block font-mono">Frame Material</span>
                  <span className="font-bold text-[#2A2118] capitalize mt-0.5 block">{product.material}</span>
                </div>
                <div>
                  <span className="text-[#6B5740] block font-mono">Total Weight</span>
                  <span className="font-bold text-[#2A2118] mt-0.5 block">{product.weight}</span>
                </div>
                <div>
                  <span className="text-[#6B5740] block font-mono">Contour Silhouette</span>
                  <span className="font-bold text-[#2A2118] capitalize mt-0.5 block">{product.frameShape}</span>
                </div>
                <div>
                  <span className="text-[#6B5740] block font-mono">Lens Coating</span>
                  <span className="font-bold text-[#2A2118] mt-0.5 block">Anti-Glare Sapphire</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Handcrafted Frames */}
        <div className="mt-28 border-t border-[#B88A32]/20 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono text-[#B88A32] uppercase tracking-widest block font-bold">Complete Your Style</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2A2118] font-cinzel mt-1">Similar Handcrafted Frames</h2>
            </div>
            <Link href="/shop" className="cursor-pointer text-xs font-mono text-[#B88A32] hover:underline font-bold">
              View All 40+ Frames &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/shop/${rel.slug}`}
                className="group p-5 rounded-3xl bg-[#FFF9EF] border border-[#B88A32]/20 hover:border-[#B88A32]/50 transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-[#F4E9D5] to-[#E8D2A8] border border-[#B88A32]/15 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  👓
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-[#2A2118] font-cinzel group-hover:text-[#B88A32] transition-colors">
                    {rel.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-xs font-mono">
                    <span className="text-[#6B5740] capitalize">{rel.material}</span>
                    <span className="font-bold text-[#B88A32]">₹{rel.price}</span>
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

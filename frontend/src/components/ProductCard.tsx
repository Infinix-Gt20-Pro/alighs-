"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingBag } from "lucide-react";
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

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCart();
  
  const getGradient = (category: string) => {
    if (category.toLowerCase().includes('sun')) return 'from-amber-500/20 to-orange-500/20';
    return 'from-indigo-500/20 to-purple-500/20 via-cyan-400/10';
  };

  const handleAddToCart = () => {
    const defaultColor = product.colors?.[0] || "Default";
    addToCart({
      productId: product.id || product.slug,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0] || "",
      color: typeof defaultColor === "string" ? defaultColor : (defaultColor as { name: string }).name || "Default",
      colorHex: typeof defaultColor === "string" ? "#a1a1aa" : (defaultColor as { hex: string }).hex || "#a1a1aa",
      weight: product.weight || "",
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card relative flex flex-col rounded-2xl border border-white/10 bg-[#121212]/50 overflow-hidden hover:border-cyan-400/50 transition-colors duration-300"
    >
      {product.bestSeller && (
        <div className="absolute top-4 left-4 z-10">
          <div className="glass-pill px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
            BESTSELLER
          </div>
        </div>
      )}
      
      <Link href={`/shop/${product.slug}`} className="block relative w-full pt-[100%] overflow-hidden group">
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(product.category)} flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-500`}>
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain drop-shadow-2xl" />
          ) : (
            <div className="text-white/20 font-mono text-sm uppercase tracking-widest text-center">Image Placeholder</div>
          )}
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex justify-between items-start gap-2">
          <div>
            <Link href={`/shop/${product.slug}`} className="hover:text-cyan-400 transition-colors">
              <h3 className="text-lg font-bold text-white font-sans line-clamp-1">{product.name}</h3>
            </Link>
            <span className="inline-block mt-1 text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {product.frameMaterial}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-cyan-400">₹{product.price.toLocaleString()}</div>
            {product.originalPrice && (
              <div className="text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</div>
            )}
          </div>
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-2 items-center mt-auto">
            {product.colors.slice(0, 4).map((color, idx) => {
              const hex = typeof color === "string" ? color : color.hex;
              const name = typeof color === "string" ? color : color.name;
              return (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: hex }}
                  title={name}
                />
              );
            })}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-400 font-mono">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2 border-t border-white/10 mt-2">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-medium transition-colors border border-cyan-500/20"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
          
          <a
            href={`https://wa.me/919876543210?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-colors border border-white/10"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            WhatsApp Enquiry
          </a>
        </div>
      </div>
    </motion.div>
  );
}

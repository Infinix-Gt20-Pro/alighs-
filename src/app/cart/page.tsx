"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  
  const subtotal = cartTotal;
  const delivery = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + delivery;

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `Hi ALIGH'S WARE, I would like to enquire about my cart:\n${items.map(i => `• ${i.name} (${i.color}) - ${i.quantity} x ₹${i.price}`).join("\n")}\nTotal: ₹${total}`
    );
    window.open(`https://wa.me/917217371499?text=${text}`, "_blank");
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10"
          >
            <ShoppingBag className="w-12 h-12 text-zinc-400" />
          </motion.div>
          <h1 className="text-3xl font-sans font-bold mb-4">Your cart is empty</h1>
          <p className="text-zinc-400 mb-8 font-sans">Explore our premium collection and find your perfect pair.</p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-cyan-400 text-black font-sans font-semibold rounded-full hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Browse Collection
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-sans font-bold flex items-center gap-4">
            Shopping Cart
            <span className="text-sm font-mono font-normal px-3 py-1 bg-white/10 rounded-full text-cyan-300">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-6 flex flex-col sm:flex-row gap-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group"
                >
                  <div className="w-full sm:w-32 h-32 bg-zinc-900/60 rounded-xl relative overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/5">
                    <ShoppingBag className="w-8 h-8 text-zinc-600" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-sans font-semibold mb-1">{item.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div 
                            className="w-3 h-3 rounded-full border border-white/20" 
                            style={{ backgroundColor: item.colorHex || "#a1a1aa" }}
                          />
                          <span className="text-sm text-zinc-400 font-mono">{item.color}</span>
                          {item.weight && (
                            <span className="text-xs text-zinc-500 font-mono ml-2">• {item.weight}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-lg font-mono font-medium">₹{item.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-4 bg-white/5 rounded-full p-1 border border-white/10 w-fit">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="font-mono w-4 text-center">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-6">
                        <p className="font-mono font-bold text-lg text-cyan-400">₹{(item.price * item.quantity).toLocaleString()}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 glass-card p-8 bg-white/[0.02] border border-white/10 rounded-3xl">
              <h2 className="text-2xl font-sans font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8 text-zinc-400 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-mono text-white">
                    {delivery === 0 ? <span className="text-cyan-400">FREE</span> : `₹${delivery}`}
                  </span>
                </div>
                {delivery > 0 && (
                  <div className="text-xs text-zinc-500 italic mt-1">
                    Add ₹{(1999 - subtotal).toLocaleString()} more for free delivery
                  </div>
                )}
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between text-white text-lg font-bold">
                  <span>Total</span>
                  <span className="font-mono text-2xl text-cyan-400">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout" className="block mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-cyan-400 text-black font-sans font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href="/shop" className="block mb-6">
                <button className="w-full py-4 text-zinc-400 hover:text-white font-sans font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-white/10">
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </button>
              </Link>

              <div className="text-center">
                <button 
                  onClick={handleWhatsAppEnquiry}
                  className="text-sm text-zinc-400 hover:text-cyan-400 underline decoration-zinc-700 hover:decoration-cyan-400 transition-colors"
                >
                  Enquire via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

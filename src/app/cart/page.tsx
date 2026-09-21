"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { user, openAuthModal } = useAuth();
  
  const subtotal = cartTotal;
  const delivery = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + delivery;

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `*ALIGSWARE — Cart Enquiry* 👓✨\n\n` +
      `I would like to enquire about my selected frames:\n` +
      items.map(i => `• ${i.name} (${i.color}) - ${i.quantity} x ₹${i.price}`).join("\n") +
      `\n\n*Total:* ₹${total}\n\nPlease share delivery estimate and lens customisation options.`
    );
    window.open(`https://wa.me/917217371499?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F4E9D5] text-[#2A2118] flex flex-col selection:bg-[#B88A32]/30 selection:text-[#2A2118]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full">
        {cartCount === 0 ? (
          <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[55vh] text-center px-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-24 h-24 rounded-3xl bg-[#FFF9EF] flex items-center justify-center mb-8 border border-[#B88A32]/25 shadow-xl shadow-[#2A2118]/5"
            >
              <ShoppingBag className="w-10 h-10 text-[#B88A32]" />
            </motion.div>
            
            <p className="text-[11px] font-mono tracking-[0.28em] text-[#B88A32] uppercase mb-2">
              Atelier Bag
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A2118] mb-4">
              Your bag is empty
            </h1>
            <p className="text-[#6B5740] mb-8 font-sans max-w-md text-sm sm:text-base leading-relaxed">
              Explore our curated Japanese Beta-Titanium silhouettes and Firozabad optical heritage.
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-[#B88A32] text-[#FFF9EF] font-sans font-medium text-sm rounded-xl hover:bg-[#A07828] transition-all shadow-lg shadow-[#B88A32]/20 flex items-center gap-2"
              >
                <span>Browse Atelier Collection</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        ) : (
          <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-10 border-b border-[#B88A32]/20 pb-6 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/shop"
                  className="p-2.5 rounded-xl bg-[#FFF9EF] hover:bg-[#E8D2A8]/50 border border-[#B88A32]/25 text-[#4A3928] hover:text-[#2A2118] transition-all shadow-sm"
                  title="Back to Frames"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <p className="text-[11px] font-mono tracking-[0.25em] text-[#B88A32] uppercase">
                    Curated Selection
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A2118] flex items-center gap-3">
                    Shopping Bag
                    <span className="text-xs font-mono font-medium px-2.5 py-0.5 bg-[#B88A32]/15 border border-[#B88A32]/25 rounded-full text-[#B88A32]">
                      {cartCount} {cartCount === 1 ? "Piece" : "Pieces"}
                    </span>
                  </h1>
                </div>
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#6B5740] hover:text-[#B88A32] transition-colors"
              >
                <span>Continue Exploring</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 bg-[#FFF9EF] border border-[#B88A32]/20 rounded-2xl shadow-sm hover:shadow-md transition-all relative group"
                    >
                      {/* Product Thumbnail Placeholder or Icon */}
                      <div className="w-full sm:w-28 h-28 bg-[#F4E9D5]/60 rounded-xl relative overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#B88A32]/15">
                        <ShoppingBag className="w-8 h-8 text-[#B88A32]/60" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-[10px] font-mono tracking-widest text-[#B88A32] uppercase mb-1">
                              Precision Eyewear
                            </p>
                            <h3 className="text-lg font-serif font-bold text-[#2A2118] mb-1">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-[#6B5740] font-mono">
                              <span 
                                className="w-2.5 h-2.5 rounded-full border border-[#B88A32]/30" 
                                style={{ backgroundColor: item.colorHex || "#B88A32" }}
                              />
                              <span>{item.color}</span>
                              {item.weight && (
                                <span className="text-[#8B7355] ml-1">• {item.weight}</span>
                              )}
                            </div>
                          </div>
                          <p className="text-base font-serif font-bold text-[#2A2118]">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#B88A32]/10">
                          {/* Quantity pill */}
                          <div className="flex items-center gap-3 bg-[#F4E9D5]/70 rounded-full p-1 border border-[#B88A32]/20 w-fit">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#FFF9EF] text-[#4A3928] hover:text-[#2A2118] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </motion.button>
                            <span className="font-mono text-xs font-semibold w-4 text-center text-[#2A2118]">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#FFF9EF] text-[#4A3928] hover:text-[#2A2118] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>

                          <div className="flex items-center gap-5">
                            <p className="font-serif font-bold text-base text-[#B88A32]">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-[#8B7355] hover:text-red-600 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Free delivery badge */}
                <div className="p-4 rounded-xl bg-[#FFF9EF]/80 border border-[#B88A32]/15 flex items-center gap-3 text-xs text-[#4A3928]">
                  <ShieldCheck className="w-4 h-4 text-[#B88A32] shrink-0" />
                  <span>Complimentary hard case, micro-fiber lens cloth & 1-year atelier warranty included.</span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="sticky top-28 p-7 bg-[#FFF9EF] border border-[#B88A32]/25 rounded-3xl shadow-lg shadow-[#2A2118]/5">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-4 h-4 text-[#B88A32]" />
                    <h2 className="text-xl font-serif font-bold text-[#2A2118]">Order Summary</h2>
                  </div>
                  
                  <div className="space-y-3.5 mb-6 text-sm text-[#6B5740]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-[#2A2118] font-medium">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insured Delivery</span>
                      <span className="font-mono text-[#2A2118] font-medium">
                        {delivery === 0 ? (
                          <span className="text-[#B88A32] font-semibold">FREE</span>
                        ) : (
                          `₹${delivery}`
                        )}
                      </span>
                    </div>
                    {delivery > 0 && (
                      <p className="text-[11px] text-[#8B7355] italic">
                        Add ₹{(1999 - subtotal).toLocaleString()} more for free luxury delivery
                      </p>
                    )}
                    <div className="h-px bg-[#B88A32]/15 my-4" />
                    <div className="flex justify-between text-[#2A2118] text-base font-serif font-bold">
                      <span>Total Due</span>
                      <span className="text-xl text-[#B88A32] font-mono">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {!user && (
                    <div className="mb-3 p-2.5 rounded-xl bg-[#B88A32]/10 border border-[#B88A32]/25 text-center text-xs font-mono text-[#B88A32] flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Login compulsory before placing frame order</span>
                    </div>
                  )}

                  <Link
                    href="/checkout"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        openAuthModal(
                          "signin",
                          "Login is compulsory to order any frame. Please sign in or continue with your phone's Google account to proceed.",
                          "/checkout"
                        );
                      }
                    }}
                    className="block mb-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3.5 bg-[#B88A32] text-[#FFF9EF] font-sans font-medium text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-[#A07828] transition-all shadow-md shadow-[#B88A32]/20"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>

                  <button 
                    onClick={handleWhatsAppEnquiry}
                    className="w-full py-3 text-xs font-mono text-[#6B5740] hover:text-[#B88A32] transition-colors border border-[#B88A32]/20 hover:border-[#B88A32]/40 rounded-xl bg-[#F4E9D5]/40"
                  >
                    Enquire via WhatsApp Concierge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

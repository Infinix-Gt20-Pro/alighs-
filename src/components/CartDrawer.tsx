"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, cartTotal, updateQuantity, removeFromCart } = useCart();

  const freeShippingThreshold = 1999;
  const isFreeShipping = cartTotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));

  const generateWhatsAppOrderLink = () => {
    let msg = "Hi ALIGSWARE! I want to order the following items:\n";
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} (${item.color}) - Qty: ${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    msg += `\nTotal: ₹${cartTotal}\nPlease confirm my order!`;
    return `https://wa.me/917217371499?text=${encodeURIComponent(msg)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0b0c10] border-l border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-sans">Your Shopping Bag</h2>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {items.length} {items.length === 1 ? "design selected" : "designs selected"}
                  </span>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="cursor-pointer p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {items.length > 0 && (
              <div className="px-6 py-3 bg-white/[0.02] border-b border-white/10">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    {isFreeShipping ? "Free Express Delivery Unlocked! 🎉" : `Add ₹${freeShippingThreshold - cartTotal} for FREE Delivery`}
                  </span>
                  <span className="font-mono text-amber-300 font-semibold">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-neutral-400 py-12">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">Your bag is empty</p>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                      Explore our handcrafted titanium and acetate collections from Firozabad.
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="cursor-pointer mt-2 px-6 py-2.5 rounded-full bg-amber-400 text-black font-semibold text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  >
                    Browse Collections
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-4 items-center justify-between hover:border-white/20 transition-all"
                  >
                    {/* Visual Placeholder */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neutral-900 to-black border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                      👓
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-neutral-400">{item.color}</span>
                        <span className="text-[10px] text-neutral-600">&bull;</span>
                        <span className="text-xs font-mono font-semibold text-amber-300">₹{item.price}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="inline-flex items-center rounded-lg bg-white/[0.06] border border-white/15 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="cursor-pointer p-1 text-neutral-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="cursor-pointer p-1 text-neutral-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cursor-pointer p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Line Item Total */}
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-white">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary & Actions */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#07080b]/90 backdrop-blur-xl space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-mono font-medium text-white">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Estimated Shipping</span>
                    <span className="font-mono text-emerald-400">
                      {isFreeShipping ? "FREE" : "₹99"}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                    <span>Total Amount</span>
                    <span className="font-mono text-amber-300">
                      ₹{cartTotal + (isFreeShipping ? 0 : 99)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pt-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="cursor-pointer w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </Link>

                  <a
                    href={generateWhatsAppOrderLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer w-full py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Order via WhatsApp Instead</span>
                  </a>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>100% Genuine Optical Precision &bull; 7-Day Easy Exchange</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

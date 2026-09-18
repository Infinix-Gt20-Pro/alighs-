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
            className="fixed inset-0 z-50 bg-[#2A2118]/55 backdrop-blur-sm"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FFF9EF] dark:bg-[#0E0E14] border-l border-[#B88A32]/25 dark:border-[#B88A32]/35 shadow-[0_0_50px_rgba(42,33,24,0.18)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-colors duration-300"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#B88A32]/20 dark:border-[#B88A32]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F4E9D5] dark:bg-[#1A1A26] border border-[#B88A32]/30 dark:border-[#B88A32]/40 flex items-center justify-center shadow-sm">
                  <ShoppingBag className="w-4 h-4 text-[#B88A32] dark:text-[#D4AF62]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#2A2118] dark:text-[#F5EFE6] font-cinzel">Your Shopping Bag</h2>
                  <span className="text-[11px] font-mono text-[#6B5740] dark:text-[#A09383]">
                    {items.length} {items.length === 1 ? "design selected" : "designs selected"}
                  </span>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="cursor-pointer p-2 rounded-full text-[#6B5740] dark:text-[#A09383] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] hover:bg-[#F4E9D5] dark:hover:bg-[#1A1A26] transition-colors"
                aria-label="Close Bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {items.length > 0 && (
              <div className="px-6 py-3 bg-[#F4E9D5]/60 dark:bg-[#14141E] border-b border-[#B88A32]/15 dark:border-[#B88A32]/25">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#4A3928] dark:text-[#D5C7B5] font-medium flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
                    {isFreeShipping ? "Free Express Delivery Unlocked! 🎉" : `Add ₹${freeShippingThreshold - cartTotal} for FREE Delivery`}
                  </span>
                  <span className="font-mono text-[#B88A32] dark:text-[#D4AF62] font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#B88A32]/20 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#B88A32] to-[#D4AF62] rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-[#6B5740] dark:text-[#A09383] py-12">
                  <div className="w-16 h-16 rounded-2xl bg-[#F4E9D5] dark:bg-[#161622] border border-[#B88A32]/25 dark:border-[#B88A32]/35 flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-8 h-8 text-[#B88A32]/60 dark:text-[#D4AF62]/60" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#2A2118] dark:text-[#F5EFE6] font-cinzel">Your bag is empty</p>
                    <p className="text-xs text-[#6B5740] dark:text-[#A09383] mt-1 max-w-xs font-cormorant italic">
                      Explore our handcrafted titanium and acetate collections from Firozabad.
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="cursor-pointer mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B88A32] to-[#D4AF62] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(184,138,50,0.3)] hover:brightness-105 active:scale-95"
                  >
                    Browse Collections
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#14141E] border border-[#B88A32]/20 dark:border-[#B88A32]/30 flex gap-4 items-center justify-between hover:border-[#B88A32]/50 transition-all shadow-sm"
                  >
                    {/* Visual Placeholder */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#F4E9D5] to-[#E8D2A8] dark:from-[#1E1E2C] dark:to-[#161622] border border-[#B88A32]/20 dark:border-[#B88A32]/30 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                      👓
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#2A2118] dark:text-[#F5EFE6] font-cinzel truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-[#6B5740] dark:text-[#A09383]">{item.color}</span>
                        <span className="text-[10px] text-[#B88A32]">&bull;</span>
                        <span className="text-xs font-mono font-bold text-[#B88A32] dark:text-[#D4AF62]">₹{item.price}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="inline-flex items-center rounded-lg bg-[#F4E9D5] dark:bg-[#1C1C2A] border border-[#B88A32]/25 dark:border-[#B88A32]/35 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="cursor-pointer p-1 text-[#6B5740] dark:text-[#A09383] hover:text-[#2A2118] dark:hover:text-[#F5EFE6]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-bold text-[#2A2118] dark:text-[#F5EFE6]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="cursor-pointer p-1 text-[#6B5740] dark:text-[#A09383] hover:text-[#2A2118] dark:hover:text-[#F5EFE6]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cursor-pointer p-1.5 text-[#8B7355] dark:text-[#C4B59E] hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Line Item Total */}
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-[#2A2118] dark:text-[#F5EFE6]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary & Actions */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#B88A32]/20 dark:border-[#B88A32]/30 bg-[#FAF7F0] dark:bg-[#101016] space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6B5740] dark:text-[#A09383]">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-[#2A2118] dark:text-[#F5EFE6]">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-[#6B5740] dark:text-[#A09383]">
                    <span>Estimated Shipping</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {isFreeShipping ? "FREE" : "₹99"}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#2A2118] dark:text-[#F5EFE6] pt-2 border-t border-[#B88A32]/15 dark:border-[#B88A32]/25">
                    <span>Total Amount</span>
                    <span className="font-mono text-[#B88A32] dark:text-[#D4AF62]">
                      ₹{cartTotal + (isFreeShipping ? 0 : 99)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pt-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="cursor-pointer w-full py-3.5 rounded-full bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] text-white font-bold text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(184,138,50,0.35)] hover:brightness-105 active:scale-95 transition-all"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>

                  <a
                    href={generateWhatsAppOrderLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Order via WhatsApp Instead</span>
                  </a>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#8B7355] dark:text-[#A09383] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
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

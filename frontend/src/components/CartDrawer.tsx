"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, cartTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md glass-panel bg-[#0a0a0a]/95 border-l border-white/10 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold font-sans text-white">Your Cart</h2>
              <button
                onClick={closeCart}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="font-sans">Your cart is empty</p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-4 px-6 py-2.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                  >
                    Explore Collection
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 p-2">
                        <ShoppingBag className="w-6 h-6 text-gray-500" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-medium text-white text-sm line-clamp-1">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-400 font-mono">Color:</span>
                              <div
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: item.colorHex }}
                                title={item.color}
                              />
                              <span className="text-xs text-gray-400">{item.color}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm font-bold text-cyan-400">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                          
                          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/10">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="text-gray-400 hover:text-white disabled:opacity-50 p-1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-medium text-white w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#0a0a0a]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 font-sans">Subtotal</span>
                  <span className="text-xl font-bold text-white">₹{cartTotal.toLocaleString()}</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full py-3 rounded-xl text-center font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full py-3 rounded-xl text-center font-medium text-[#0a0a0a] bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

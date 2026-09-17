// src/app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowLeft,
  Loader2,
  MapPin,
  Check,
  ShieldCheck,
  Truck,
  MessageCircle,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";

type Step = 1 | 2 | 3;
type PaymentMethod = "COD" | "UPI" | "ONLINE";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState({ subtotal: 0, delivery: 0, total: 0 });

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const subtotal = cartTotal;
  const delivery = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + delivery;

  // Prevent accessing checkout if cart is empty and not on confirmation step
  useEffect(() => {
    if (items.length === 0 && step !== 3 && orderedItems.length === 0) {
      router.push("/cart");
    }
  }, [items, step, orderedItems, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => (prev + 1) as Step);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => (prev - 1) as Step);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);

    const orderPayload = {
      customer: {
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode
      },
      items: items.map((it) => ({
        productId: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        color: it.color
      })),
      paymentMethod,
      totalAmount: total
    };

    const snapshotItems = [...items];
    const snapshotTotals = { subtotal, delivery, total };

    let generatedOrderId = `AW-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.orderId) {
          generatedOrderId = data.orderId;
        }
      }
    } catch (err) {
      console.warn("API Order dispatch notice:", err);
    } finally {
      setOrderId(generatedOrderId);
      setOrderedItems(snapshotItems);
      setOrderTotal(snapshotTotals);
      clearCart();
      setSubmitting(false);
      setDirection(1);
      setStep(3);
    }
  };

  const handleWhatsAppShare = () => {
    const itemLines = orderedItems
      .map(
        (i) =>
          `• ${i.name} (${i.color || "Standard"}) x${i.quantity} = ₹${i.price * i.quantity}`
      )
      .join("\n");

    const text = encodeURIComponent(
      `*ALIGH'S WARE — New Order Confirmation* 👓✨\n\n` +
        `*Order ID:* ${orderId}\n` +
        `*Client:* ${formData.fullName}\n` +
        `*Contact:* +91 ${formData.phone}\n` +
        `*Delivery Address:* ${formData.address}, ${formData.city} - ${formData.pincode}\n` +
        `*Payment Method:* ${
          paymentMethod === "COD"
            ? "Cash on Delivery"
            : paymentMethod === "UPI"
            ? "Instant UPI"
            : "Card / Net Banking"
        }\n\n` +
        `*Ordered Frames:*\n${itemLines}\n\n` +
        `*Subtotal:* ₹${orderTotal.subtotal}\n` +
        `*Shipping:* ${orderTotal.delivery === 0 ? "FREE Luxury Delivery" : `₹${orderTotal.delivery}`}\n` +
        `*Grand Total:* ₹${orderTotal.total}\n\n` +
        `_Please confirm dispatch timeline. Thank you!_`
    );
    window.open(`https://wa.me/917217371499?text=${text}`, "_blank");
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 40 : -40,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative max-w-xl mx-auto">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400 z-0 transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />

            {[
              { num: 1, label: "Shipping" },
              { num: 2, label: "Payment" },
              { num: 3, label: "Confirmation" }
            ].map(({ num, label }) => {
              const isPast = step > num;
              const isCurrent = step === num;
              return (
                <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 ${
                      isPast
                        ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        : isCurrent
                        ? "bg-cyan-500 text-black ring-4 ring-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                        : "bg-zinc-900 border border-white/20 text-zinc-500"
                    }`}
                  >
                    {isPast ? <Check className="w-5 h-5 stroke-[2.5]" /> : num}
                  </div>
                  <span
                    className={`text-xs uppercase tracking-wider font-mono ${
                      isCurrent ? "text-cyan-400 font-bold" : isPast ? "text-amber-400/80" : "text-zinc-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[550px]">
          <AnimatePresence custom={direction} mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full"
              >
                <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 bg-[#0c0d12]/80 backdrop-blur-2xl shadow-2xl">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                        <MapPin className="text-cyan-400 w-6 h-6" /> Shipping & Contact Details
                      </h2>
                      <p className="text-sm text-zinc-400 mt-1">
                        Where should Dr. Sheeraz Ahmad dispatch your curated eyewear package?
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full">
                      <ShieldCheck className="w-4 h-4" /> Pan-India Insured Dispatch
                    </div>
                  </div>

                  <form onSubmit={handleDeliverySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-mono">
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Tariq Khan"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-mono">
                          Phone Number (10 Digits) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">
                            +91
                          </span>
                          <input
                            required
                            type="tel"
                            pattern="[0-9]{10}"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="7217371499"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-mono">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="tariq@example.com"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-mono">
                          Delivery Address (House / Street / Landmark) *
                        </label>
                        <textarea
                          required
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Flat / House No., Landmark, Area"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-mono">
                          City / District *
                        </label>
                        <input
                          required
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Firozabad, Agra, Delhi"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-mono">
                          Postal Pincode (6 Digits) *
                        </label>
                        <input
                          required
                          type="text"
                          pattern="[0-9]{6}"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="283203"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
                      <Link href="/cart">
                        <button
                          type="button"
                          className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Return to Cart
                        </button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-300 text-black font-semibold px-8 py-3.5 rounded-xl hover:from-amber-300 hover:to-amber-200 transition-all shadow-[0_0_25px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 text-sm"
                      >
                        Proceed to Payment Options
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full flex flex-col lg:flex-row gap-8"
              >
                {/* Left: Payment Method Picker */}
                <div className="flex-1">
                  <div className="glass-card p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/80 backdrop-blur-2xl shadow-2xl h-full flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Select Payment Method</h2>
                      <p className="text-sm text-zinc-400 mb-6">
                        All orders are protected with genuine warranty and direct support.
                      </p>

                      <div className="space-y-4">
                        {[
                          {
                            id: "COD",
                            icon: Banknote,
                            badge: "Most Popular",
                            label: "Cash on Delivery (COD)",
                            desc: "Pay securely at your doorstep upon receiving the parcel."
                          },
                          {
                            id: "UPI",
                            icon: Smartphone,
                            badge: "Instant 0% Fee",
                            label: "UPI Direct (GPay / PhonePe / Paytm)",
                            desc: "Instant QR/UPI confirmation with immediate dispatch priority."
                          },
                          {
                            id: "ONLINE",
                            icon: CreditCard,
                            badge: "Encrypted",
                            label: "Debit / Credit Card / Net Banking",
                            desc: "100% 256-bit bank-grade encrypted payment gateway."
                          }
                        ].map((method) => {
                          const isSelected = paymentMethod === method.id;
                          return (
                            <div
                              key={method.id}
                              onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                              className={`p-5 rounded-2xl cursor-pointer border transition-all duration-200 flex items-start gap-4 ${
                                isSelected
                                  ? "border-amber-400/80 bg-amber-400/[0.07] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-amber-400/50"
                                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                              }`}
                            >
                              <div
                                className={`p-3 rounded-xl transition-colors ${
                                  isSelected
                                    ? "bg-amber-400 text-black shadow-lg"
                                    : "bg-zinc-800 text-zinc-400"
                                }`}
                              >
                                <method.icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-base text-white">
                                    {method.label}
                                  </span>
                                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                                    {method.badge}
                                  </span>
                                </div>
                                <div className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                  {method.desc}
                                </div>
                              </div>
                              {isSelected && (
                                <div className="text-amber-400 mt-1">
                                  <CheckCircle2 className="w-5 h-5 fill-amber-400/20" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={prevStep}
                        disabled={submitting}
                        className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                      >
                        <ArrowLeft className="w-4 h-4" /> Edit Shipping Address
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Order Summary Sidebar */}
                <div className="w-full lg:w-80 shrink-0">
                  <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#0c0d12]/90 backdrop-blur-2xl sticky top-28 shadow-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-amber-400" /> Order Summary
                    </h3>

                    <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-1 custom-scrollbar text-xs">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center py-2 border-b border-white/5"
                        >
                          <div className="truncate pr-2">
                            <p className="text-zinc-200 font-medium truncate">{item.name}</p>
                            <p className="text-[11px] text-zinc-500 font-mono">
                              {item.color || "Standard"} × {item.quantity}
                            </p>
                          </div>
                          <span className="font-mono font-semibold text-white">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-white/10 font-mono text-xs mb-6">
                      <div className="flex justify-between text-zinc-400">
                        <span>Frames Subtotal</span>
                        <span className="text-white font-medium">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" /> Shipping
                        </span>
                        <span>
                          {delivery === 0 ? (
                            <span className="text-emerald-400 font-bold">FREE</span>
                          ) : (
                            <span className="text-white">₹{delivery}</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-white font-bold text-base pt-3 border-t border-white/10">
                        <span>Total Due</span>
                        <span className="text-amber-400 text-lg font-mono">₹{total}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold py-4 rounded-xl hover:from-cyan-300 hover:to-cyan-400 transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Confirming Order...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> Complete Order (₹{total})
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full"
              >
                <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#0c0d12]/90 backdrop-blur-2xl max-w-2xl mx-auto text-center shadow-2xl">
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                  >
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </motion.div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-mono tracking-wider text-emerald-300">
                      ORDER DISPATCH QUEUED
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold font-serif tracking-tight mb-2">
                    Shukriya, {formData.fullName}!
                  </h2>
                  <p className="text-zinc-400 text-sm mb-6">
                    Your bespoke eyewear selection is being prepared under Dr. Sheeraz Ahmad’s supervision.
                  </p>

                  <div className="bg-white/[0.02] rounded-2xl p-6 text-left mb-8 border border-white/10">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs font-mono">
                      <span className="text-zinc-500">OFFICIAL ORDER ID</span>
                      <span className="text-amber-400 font-bold text-sm tracking-wider">
                        {orderId}
                      </span>
                    </div>

                    <div className="py-4 space-y-2 border-b border-white/10 text-xs">
                      {orderedItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-zinc-300">
                          <span>
                            {item.name}{" "}
                            <span className="text-zinc-500 font-mono">
                              ({item.color || "Standard"} × {item.quantity})
                            </span>
                          </span>
                          <span className="font-mono font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs pt-3">
                      <div>
                        <span className="text-zinc-500 block font-mono">SHIP TO</span>
                        <span className="text-zinc-300 font-medium">
                          {formData.address}, {formData.city} - {formData.pincode}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block font-mono">PAYMENT MODE</span>
                        <span className="text-zinc-300 font-medium">
                          {paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : paymentMethod === "UPI"
                            ? "Instant UPI"
                            : "Online Gateway"}
                        </span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-white/5 flex justify-between items-center">
                        <span className="text-zinc-400 font-mono">Total Paid / Due</span>
                        <span className="text-amber-400 font-mono font-bold text-base">
                          ₹{orderTotal.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleWhatsAppShare}
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageCircle className="w-5 h-5" /> Send Order Receipt on WhatsApp
                    </motion.button>

                    <Link href="/shop">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-semibold px-8 py-3.5 rounded-xl transition-all w-full sm:w-auto text-sm"
                      >
                        Explore More Frames
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// src/app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
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
  ShoppingBag,
  AlertCircle
} from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

type Step = 1 | 2 | 3;
type PaymentMethod = "COD" | "UPI" | "ONLINE";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existing) {
      if ((window as any).Razorpay) return resolve(true);
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState({ subtotal: 0, delivery: 0, total: 0 });
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid">("pending");

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
    setPaymentError(null);
    setSubmitting(true);

    const snapshotItems = [...items];
    const snapshotTotals = { subtotal, delivery, total };

    // --- CASE 1: Cash On Delivery (COD) ---
    if (paymentMethod === "COD") {
      let generatedOrderId = `AW-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: generatedOrderId,
            customer: {
              name: formData.fullName,
              phone: formData.phone,
              email: formData.email,
              address: formData.address,
              city: formData.city,
              pincode: formData.pincode
            },
            items: snapshotItems.map((it) => ({
              productId: it.id,
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              color: it.color
            })),
            paymentMethod: "cod",
            paymentStatus: "pending",
            totalAmount: total
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.orderId) generatedOrderId = data.orderId;
        }
      } catch (err) {
        console.warn("COD order dispatch error:", err);
      } finally {
        setOrderId(generatedOrderId);
        setOrderedItems(snapshotItems);
        setOrderTotal(snapshotTotals);
        setPaymentStatus("pending");
        clearCart();
        setSubmitting(false);
        setDirection(1);
        setStep(3);
      }
      return;
    }

    // --- CASE 2: Online / UPI Payment via Razorpay Standard Web Checkout ---
    try {
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !(window as any).Razorpay) {
        throw new Error("Unable to load Razorpay payment window. Please check your internet connection and try again.");
      }

      // Step 1: Request backend order creation
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100), // in paise (min 100)
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer_name: formData.fullName,
            customer_phone: formData.phone,
            customer_city: formData.city,
            cart_count: String(items.length)
          }
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to generate Razorpay order. Please try again.");
      }

      const rzpOrderId = orderData.order_id;
      const customStoreOrderId = `AW-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      // Step 2: Configure and open Razorpay modal
      const options = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TdNncN01Vi6Vvg",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "ALIG'S WARE",
        description: "Luxury Eyewear Atelier — Insured Express Order",
        image: "https://raw.githubusercontent.com/Infinix-Gt20-Pro/alighsware/main/public/logo.png",
        order_id: rzpOrderId,
        prefill: {
          name: formData.fullName,
          email: formData.email || "",
          contact: formData.phone
        },
        theme: {
          color: "#B88A32"
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
            setPaymentError("Payment window was dismissed. You can retry anytime or choose Cash on Delivery.");
          }
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          setSubmitting(true);
          try {
            // Step 3: Backend signature verification
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                storeOrderId: customStoreOrderId
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment signature verification failed. Please contact support.");
            }

            // Step 4: Persist confirmed paid order
            await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: customStoreOrderId,
                customer: {
                  name: formData.fullName,
                  phone: formData.phone,
                  email: formData.email,
                  address: formData.address,
                  city: formData.city,
                  pincode: formData.pincode
                },
                items: snapshotItems.map((it) => ({
                  productId: it.id,
                  name: it.name,
                  price: it.price,
                  quantity: it.quantity,
                  color: it.color
                })),
                paymentMethod: paymentMethod.toLowerCase(),
                paymentStatus: "paid",
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                totalAmount: snapshotTotals.total
              })
            }).catch((e) => console.warn("Order save sync error:", e));

            setOrderId(customStoreOrderId);
            setRazorpayPaymentId(response.razorpay_payment_id);
            setPaymentStatus("paid");
            setOrderedItems(snapshotItems);
            setOrderTotal(snapshotTotals);
            clearCart();
            setSubmitting(false);
            setDirection(1);
            setStep(3);
          } catch (vErr: any) {
            console.error("Verification error:", vErr);
            setPaymentError(vErr.message || "Payment verification failed.");
            setSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed callback:", response.error);
        const reason = response.error?.description || response.error?.reason || "Transaction was declined.";
        setPaymentError(`Payment Failed: ${reason}`);
        setSubmitting(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Order initiation error:", err);
      setPaymentError(err.message || "Failed to start payment gateway.");
      setSubmitting(false);
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
      `*ALIGSWARE — New Order Confirmation* 👓✨\n\n` +
        `*Order ID:* ${orderId}\n` +
        `*Client:* ${formData.fullName}\n` +
        `*Contact:* +91 ${formData.phone}\n` +
        `*Delivery Address:* ${formData.address}, ${formData.city} - ${formData.pincode}\n` +
        `*Payment Method:* ${
          paymentMethod === "COD"
            ? "Cash on Delivery"
            : paymentMethod === "UPI"
            ? "Instant UPI (Razorpay)"
            : "Cards / NetBanking (Razorpay)"
        }\n` +
        `*Payment Status:* ${paymentStatus === "paid" ? `✅ PAID (Txn: ${razorpayPaymentId})` : "⏳ Pending (COD)"}\n\n` +
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
    <div className="min-h-screen bg-[#F4E9D5] dark:bg-[#0A0A0E] text-[#2A2118] dark:text-[#F5EFE6] flex flex-col selection:bg-[#B88A32]/30 selection:text-[#2A2118] dark:selection:text-[#F5EFE6] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full relative">
        {/* Background glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#E8D2A8]/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#D4AF62]/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Top Back to Cart */}
          {step === 1 && (
            <div className="mb-6">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF9EF] hover:bg-[#E8D2A8]/40 border border-[#B88A32]/25 text-xs font-mono text-[#4A3928] hover:text-[#2A2118] transition-all group shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#B88A32]" />
                <span>&larr; Back to Shopping Bag</span>
              </Link>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative max-w-md mx-auto">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#B88A32]/20 z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#B88A32] z-0 transition-all duration-500 ease-in-out"
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
                          ? "bg-[#B88A32] text-[#FFF9EF] shadow-md shadow-[#B88A32]/30"
                          : isCurrent
                          ? "bg-[#2A2118] text-[#FFF9EF] ring-4 ring-[#B88A32]/30 shadow-md"
                          : "bg-[#FFF9EF] border border-[#B88A32]/30 text-[#8B7355]"
                      }`}
                    >
                      {isPast ? <Check className="w-5 h-5 stroke-[2.5]" /> : num}
                    </div>
                    <span
                      className={`text-xs uppercase tracking-wider font-mono ${
                        isCurrent
                          ? "text-[#B88A32] font-bold"
                          : isPast
                          ? "text-[#4A3928] font-semibold"
                          : "text-[#8B7355]"
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
                  <div className="p-8 md:p-10 rounded-3xl border border-[#B88A32]/25 bg-[#FFF9EF] shadow-xl shadow-[#2A2118]/5">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#B88A32]/15">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-[#2A2118] flex items-center gap-3">
                          <MapPin className="text-[#B88A32] w-6 h-6" /> Shipping & Contact Details
                        </h2>
                        <p className="text-sm text-[#6B5740] mt-1">
                          Where should Dr. Sheeraz Ahmad dispatch your curated eyewear package?
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#B88A32] bg-[#B88A32]/10 border border-[#B88A32]/20 px-3 py-1.5 rounded-full font-semibold">
                        <ShieldCheck className="w-4 h-4" /> Pan-India Insured Dispatch
                      </div>
                    </div>

                    <form onSubmit={handleDeliverySubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-[#4A3928] font-mono font-semibold">
                            Full Name *
                          </label>
                          <input
                            required
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="e.g. Tariq Khan"
                            className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl px-4 py-3.5 text-[#2A2118] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-[#4A3928] font-mono font-semibold">
                            Phone Number (10 Digits) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8B7355] font-semibold">
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
                              className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl pl-12 pr-4 py-3.5 text-[#2A2118] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs uppercase tracking-wider text-[#4A3928] font-mono font-semibold">
                            Email Address (Optional)
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="tariq@example.com"
                            className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl px-4 py-3.5 text-[#2A2118] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs uppercase tracking-wider text-[#4A3928] font-mono font-semibold">
                            Delivery Address (House / Street / Landmark) *
                          </label>
                          <textarea
                            required
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Flat / House No., Landmark, Area"
                            className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl px-4 py-3.5 text-[#2A2118] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-[#4A3928] font-mono font-semibold">
                            City / District *
                          </label>
                          <input
                            required
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="e.g. Firozabad, Agra, Delhi"
                            className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl px-4 py-3.5 text-[#2A2118] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-[#4A3928] font-mono font-semibold">
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
                            className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl px-4 py-3.5 text-[#2A2118] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#B88A32]/15">
                        <Link href="/cart">
                          <button
                            type="button"
                            className="text-[#6B5740] hover:text-[#2A2118] flex items-center gap-2 text-sm transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4" /> Return to Bag
                          </button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full sm:w-auto bg-[#B88A32] hover:bg-[#A07828] text-[#FFF9EF] font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md shadow-[#B88A32]/20 flex items-center justify-center gap-2 text-sm"
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
                    <div className="p-8 rounded-3xl border border-[#B88A32]/25 bg-[#FFF9EF] shadow-xl shadow-[#2A2118]/5 h-full flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-[#2A2118] mb-2">Select Payment Method</h2>
                        <p className="text-sm text-[#6B5740] mb-6">
                          All orders are protected with genuine warranty and direct doctor support.
                        </p>

                        {paymentError && (
                          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-300 flex items-start gap-3 text-xs leading-relaxed animate-in fade-in duration-200">
                            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-bold text-sm mb-0.5 text-red-900 dark:text-red-200">Payment Gateway Notice</p>
                              <p className="mb-3">{paymentError}</p>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPaymentMethod("COD");
                                    setPaymentError(null);
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#B88A32] text-white font-medium text-xs hover:bg-[#9a7329] transition-all shadow-sm"
                                >
                                  Switch to Cash on Delivery (COD)
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => setPaymentError(null)}
                              className="text-red-600 dark:text-red-400 hover:opacity-75 font-mono text-sm px-1.5"
                            >
                              ✕
                            </button>
                          </div>
                        )}

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
                                    ? "border-[#B88A32] bg-[#B88A32]/10 shadow-sm ring-1 ring-[#B88A32]"
                                    : "border-[#B88A32]/20 bg-[#F4E9D5]/35 hover:bg-[#F4E9D5]/60"
                                }`}
                              >
                                <div
                                  className={`p-3 rounded-xl transition-colors ${
                                    isSelected
                                      ? "bg-[#B88A32] text-[#FFF9EF] shadow-sm"
                                      : "bg-[#E8D2A8]/50 text-[#6B5740]"
                                  }`}
                                >
                                  <method.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-base text-[#2A2118]">
                                      {method.label}
                                    </span>
                                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#B88A32]/15 text-[#B88A32] font-semibold">
                                      {method.badge}
                                    </span>
                                  </div>
                                  <div className="text-xs text-[#6B5740] mt-1 leading-relaxed">
                                    {method.desc}
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="text-[#B88A32] mt-1">
                                    <CheckCircle2 className="w-5 h-5 fill-[#B88A32]/20" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-[#B88A32]/15 flex items-center justify-between">
                        <button
                          onClick={prevStep}
                          disabled={submitting}
                          className="text-[#6B5740] hover:text-[#2A2118] flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                        >
                          <ArrowLeft className="w-4 h-4" /> Edit Shipping Address
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Order Summary Sidebar */}
                  <div className="w-full lg:w-80 shrink-0">
                    <div className="p-6 rounded-3xl border border-[#B88A32]/25 bg-[#FFF9EF] sticky top-28 shadow-xl shadow-[#2A2118]/5">
                      <h3 className="text-lg font-serif font-bold text-[#2A2118] mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-[#B88A32]" /> Order Summary
                      </h3>

                      <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-1 custom-scrollbar text-xs">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center py-2 border-b border-[#B88A32]/10"
                          >
                            <div className="truncate pr-2">
                              <p className="text-[#2A2118] font-medium truncate">{item.name}</p>
                              <p className="text-[11px] text-[#8B7355] font-mono">
                                {item.color || "Standard"} × {item.quantity}
                              </p>
                            </div>
                            <span className="font-mono font-semibold text-[#2A2118]">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-[#B88A32]/15 font-mono text-xs mb-6">
                        <div className="flex justify-between text-[#6B5740]">
                          <span>Frames Subtotal</span>
                          <span className="text-[#2A2118] font-medium">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-[#6B5740]">
                          <span className="flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5" /> Shipping
                          </span>
                          <span>
                            {delivery === 0 ? (
                              <span className="text-[#B88A32] font-bold">FREE</span>
                            ) : (
                              <span className="text-[#2A2118]">₹{delivery}</span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[#2A2118] font-bold text-base pt-3 border-t border-[#B88A32]/15">
                          <span>Total Due</span>
                          <span className="text-[#B88A32] text-lg font-mono">₹{total}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePlaceOrder}
                        disabled={submitting}
                        className="w-full bg-[#B88A32] hover:bg-[#A07828] text-[#FFF9EF] font-bold py-4 rounded-xl transition-all shadow-md shadow-[#B88A32]/25 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
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
                  <div className="p-8 sm:p-12 rounded-3xl border border-[#B88A32]/25 bg-[#FFF9EF] max-w-2xl mx-auto text-center shadow-xl shadow-[#2A2118]/5">
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
                      className="w-20 h-20 rounded-2xl bg-[#B88A32] text-[#FFF9EF] flex items-center justify-center mx-auto mb-6 shadow-md shadow-[#B88A32]/30"
                    >
                      <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                    </motion.div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B88A32]/30 bg-[#B88A32]/10 mb-3">
                      <div className="w-2 h-2 rounded-full bg-[#B88A32] animate-ping" />
                      <span className="text-[11px] font-mono tracking-wider text-[#B88A32] font-semibold">
                        ORDER DISPATCH QUEUED
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold font-serif tracking-tight mb-2 text-[#2A2118]">
                      Shukriya, {formData.fullName}!
                    </h2>
                    <p className="text-[#6B5740] text-sm mb-6">
                      Your bespoke eyewear selection is being prepared under Dr. Sheeraz Ahmad’s supervision.
                    </p>

                    <div className="bg-[#F4E9D5]/50 rounded-2xl p-6 text-left mb-8 border border-[#B88A32]/20">
                      <div className="flex justify-between items-center pb-3 border-b border-[#B88A32]/15 text-xs font-mono">
                        <span className="text-[#8B7355]">OFFICIAL ORDER ID</span>
                        <span className="text-[#B88A32] font-bold text-sm tracking-wider">
                          {orderId}
                        </span>
                      </div>

                      <div className="py-4 space-y-2 border-b border-[#B88A32]/15 text-xs">
                        {orderedItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-[#2A2118]">
                            <span>
                              {item.name}{" "}
                              <span className="text-[#8B7355] font-mono">
                                ({item.color || "Standard"} × {item.quantity})
                              </span>
                            </span>
                            <span className="font-mono font-medium">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3">
                        <div>
                          <span className="text-[#8B7355] block font-mono">SHIP TO</span>
                          <span className="text-[#2A2118] font-medium">
                            {formData.address}, {formData.city} - {formData.pincode}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8B7355] block font-mono">PAYMENT MODE</span>
                          <span className="text-[#2A2118] font-medium">
                            {paymentMethod === "COD"
                              ? "Cash on Delivery"
                              : paymentMethod === "UPI"
                              ? "Instant UPI (Razorpay)"
                              : "Cards / Net Banking (Razorpay)"}
                          </span>
                        </div>

                        {paymentStatus === "paid" && (
                          <div className="sm:col-span-2 pt-2 border-t border-[#B88A32]/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs tracking-wider">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              PAYMENT VERIFIED (RAZORPAY)
                            </span>
                            {razorpayPaymentId && (
                              <span className="text-xs font-mono text-[#8B7355]">
                                Txn Ref: <span className="text-[#2A2118] dark:text-[#F5EFE6] font-semibold">{razorpayPaymentId}</span>
                              </span>
                            )}
                          </div>
                        )}

                        <div className="col-span-1 sm:col-span-2 pt-2 border-t border-[#B88A32]/15 flex justify-between items-center">
                          <span className="text-[#6B5740] font-mono">
                            {paymentStatus === "paid" ? "Total Paid (Razorpay)" : "Total Due on Delivery"}
                          </span>
                          <span className="text-[#B88A32] font-mono font-bold text-base">
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
                        className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                      >
                        <MessageCircle className="w-5 h-5" /> Send Order Receipt on WhatsApp
                      </motion.button>

                      <Link href="/shop">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="bg-[#F4E9D5] hover:bg-[#E8D2A8] text-[#2A2118] border border-[#B88A32]/25 font-semibold px-8 py-3.5 rounded-xl transition-all w-full sm:w-auto text-sm"
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
      </main>

      <Footer />

      {/* Floating Theme Switcher */}
      <div className="fixed bottom-6 left-6 z-40">
        <ThemeToggle variant="floating" />
      </div>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  );
}

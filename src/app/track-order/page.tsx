"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CreditCard,
  Phone,
  LogIn,
  FileText,
  Eye,
  Paperclip
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

interface TrackedOrder {
  order_number: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  shipping_charge: number;
  total_amount: number;
  prescription_url?: string;
  prescription_name?: string;
  customer: {
    full_name: string;
    address?: string;
    masked_address?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  history: Array<{
    status: string;
    changed_at: string;
    note: string;
  }>;
}

const MILESTONES = [
  { key: "Confirmed", label: "Order Confirmed", desc: "Order details verified & logged" },
  { key: "Processing", label: "Atelier Processing", desc: "Lenses crafted & frame assembled" },
  { key: "Packed", label: "Packed in Luxury Vault", desc: "Hard case, microfiber cloth & certificate" },
  { key: "Shipped", label: "Dispatched with Courier", desc: "Handed over to insured express courier" },
  { key: "Out for Delivery", label: "Out for Delivery", desc: "Courier partner en route to your doorstep" },
  { key: "Delivered", label: "Delivered Safely", desc: "Package handed to customer" },
];

function getMilestoneIndex(status: string): number {
  const norm = (status || "").toLowerCase();
  if (norm === "pending") return 0;
  if (norm === "confirmed") return 0;
  if (norm === "processing") return 1;
  if (norm === "packed") return 2;
  if (norm === "shipped") return 3;
  if (norm === "out for delivery") return 4;
  if (norm === "delivered") return 5;
  return 0;
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { user, openAuthModal } = useAuth();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);

  // Fetch logged in user's personal orders
  useEffect(() => {
    if (user?.id) {
      setLoadingUserOrders(true);
      fetch(`/api/orders?userId=${encodeURIComponent(user.id)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) {
            setUserOrders(data.orders);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingUserOrders(false));
    } else {
      setUserOrders([]);
    }
  }, [user]);

  const handleTrack = async (e?: React.FormEvent, overrideOrder?: string, overridePhone?: string) => {
    if (e) e.preventDefault();
    const targetOrder = (overrideOrder !== undefined ? overrideOrder : orderNumber).trim();
    const targetPhone = (overridePhone !== undefined ? overridePhone : phone).trim();

    if (!targetOrder || !targetPhone) {
      setError("Please enter both your Order Number and registered Phone Number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: targetOrder,
          phone: targetPhone
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No matching order found. Please check your credentials.");
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Failed to locate order.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlOrder = searchParams.get("orderNumber");
    const urlPhone = searchParams.get("phone");
    if (urlOrder && urlPhone) {
      setOrderNumber(urlOrder);
      setPhone(urlPhone);
      handleTrack(undefined, urlOrder, urlPhone);
    }
  }, [searchParams]);

  const currentIndex = order ? getMilestoneIndex(order.order_status) : 0;
  const isCancelled = order?.order_status.toLowerCase() === "cancelled";
  const isReturned = order?.order_status.toLowerCase() === "returned";

  const handleWhatsAppInquiry = () => {
    if (!order) return;
    const text = encodeURIComponent(
      `Hello ALIG'S WARE Concierge, I am inquiring regarding my Order ${order.order_number} for ${order.customer.full_name}. Please share the current dispatch update.`
    );
    window.open(`https://wa.me/917217371499?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F4E9D5] dark:bg-[#0A0A0E] text-[#2A2118] dark:text-[#F5EFE6] flex flex-col selection:bg-[#B88A32]/30 selection:text-[#2A2118] dark:selection:text-[#F5EFE6] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full relative">
        {/* Ambient background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#E8D2A8]/30 dark:bg-[#B88A32]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#D4AF62]/20 dark:bg-[#B88A32]/5 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF9EF] dark:bg-white/[0.04] hover:bg-[#E8D2A8]/40 dark:hover:bg-white/[0.08] border border-[#B88A32]/25 text-xs font-mono text-[#4A3928] dark:text-[#E8D2A8] hover:text-[#2A2118] transition-all group shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#B88A32]" />
            <span>&larr; Back to Atelier Eyewear Collection</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B88A32]/30 bg-[#B88A32]/10 mb-4">
            <Truck className="w-3.5 h-3.5 text-[#B88A32]" />
            <span className="text-[11px] font-mono tracking-wider text-[#B88A32] font-semibold uppercase">
              Live Dispatch Registry
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight text-[#2A2118] dark:text-[#F5EFE6]">
            Track Your Eyewear Order
          </h1>
          <p className="text-[#6B5740] dark:text-[#B8A898] text-sm sm:text-base mt-2">
            Enter your official Order Number and phone number to access real-time atelier crafting and courier milestones.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#2A2118]/5 max-w-2xl mx-auto mb-10">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#4A3928] dark:text-[#E8D2A8]">
                  Order Number *
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="ALG-2026-000001"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full bg-[#F4E9D5]/50 dark:bg-white/[0.04] border border-[#B88A32]/25 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#4A3928] dark:text-[#E8D2A8]">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8B7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F4E9D5]/50 dark:bg-white/[0.04] border border-[#B88A32]/25 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B88A32] hover:bg-[#A07828] text-[#FFF9EF] font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-[#B88A32]/20 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Order Ledger...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Locate Order Dispatch
                </>
              )}
            </button>
          </form>

          {/* Logged in User Quick Select */}
          {user ? (
            <div className="mt-6 pt-6 border-t border-[#B88A32]/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold uppercase text-[#B88A32]">
                  Your Account Orders ({userOrders.length})
                </span>
                <span className="text-[11px] text-[#8B7355]">Signed in as {user.name || user.email}</span>
              </div>
              {loadingUserOrders ? (
                <div className="flex items-center gap-2 text-xs text-[#8B7355] py-2 font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B88A32]" />
                  <span>Loading your atelier order history...</span>
                </div>
              ) : userOrders.length > 0 ? (
                <div className="space-y-2">
                  {userOrders.map((uo) => (
                    <button
                      key={uo.id}
                      type="button"
                      onClick={() => {
                        setOrderNumber(uo.order_number);
                        setPhone(uo.customer?.phone || "");
                        handleTrack(undefined, uo.order_number, uo.customer?.phone || "");
                      }}
                      className="w-full text-left p-3 rounded-xl bg-[#F4E9D5]/60 dark:bg-white/[0.03] hover:bg-[#E8D2A8]/50 dark:hover:bg-white/[0.07] border border-[#B88A32]/20 transition-all flex items-center justify-between text-xs group"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-[#B88A32]" />
                        <div>
                          <p className="font-mono font-bold text-[#2A2118] dark:text-[#F5EFE6]">
                            {uo.order_number}
                          </p>
                          <p className="text-[10px] text-[#8B7355] flex items-center gap-2">
                            <span>
                              {new Date(uo.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })} • ₹{uo.total_amount}
                            </span>
                            {uo.prescription_url && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-[#B88A32] bg-[#B88A32]/15 px-1.5 py-0.5 rounded">
                                <Paperclip className="w-2.5 h-2.5" /> Rx
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-[#B88A32]/10 text-[#B88A32] font-semibold">
                        {uo.order_status}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8B7355] italic">
                  No orders found under your account. Place an order while signed in to see it listed here!
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 pt-5 border-t border-[#B88A32]/15 flex items-center justify-between text-xs text-[#6B5740]">
              <span>Have an atelier account?</span>
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="px-3 py-1.5 rounded-lg bg-[#B88A32]/15 hover:bg-[#B88A32]/25 text-[#B88A32] font-mono text-xs font-bold uppercase transition-colors"
              >
                Sign In to View All Orders
              </button>
            </div>
          )}
        </div>

        {/* Order Details Display */}
        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-8"
            >
              {/* Order Header Summary Banner */}
              <div className="bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#2A2118]/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-[#8B7355] uppercase tracking-wider">OFFICIAL ORDER</span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-[#B88A32]">
                      {order.order_number}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#6B5740] dark:text-[#B8A898] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#B88A32]" />
                    Placed on {new Date(order.created_at).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-[#F4E9D5]/60 dark:bg-white/[0.05] border border-[#B88A32]/20 text-xs font-mono">
                    <span className="text-[#8B7355] block text-[10px] uppercase">Payment</span>
                    <span className="font-bold text-[#2A2118] dark:text-[#F5EFE6]">
                      {order.payment_method.toUpperCase()} &bull; {order.payment_status}
                    </span>
                  </div>

                  <div className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border ${
                    isCancelled
                      ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                      : isReturned
                      ? "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400"
                      : order.order_status.toLowerCase() === "delivered"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-[#B88A32]/15 border-[#B88A32]/40 text-[#B88A32]"
                  }`}>
                    <span className="block text-[10px] text-[#8B7355]">Status</span>
                    {order.order_status}
                  </div>
                </div>
              </div>

              {/* Progress Milestones Tracker */}
              {!isCancelled && !isReturned && (
                <div className="bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#2A2118]/5">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-[#8B7355] mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B88A32]" />
                    Order Fulfillment Progression
                  </h3>

                  {/* Horizontal Bar for Desktop */}
                  <div className="hidden lg:grid grid-cols-6 gap-2 relative">
                    {MILESTONES.map((m, idx) => {
                      const isPast = idx < currentIndex;
                      const isCurrent = idx === currentIndex;

                      return (
                        <div key={m.key} className="flex flex-col items-center text-center relative z-10">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all mb-3 ${
                              isPast
                                ? "bg-[#B88A32] text-white shadow-md shadow-[#B88A32]/30"
                                : isCurrent
                                ? "bg-[#B88A32] text-white ring-4 ring-[#B88A32]/20 animate-pulse"
                                : "bg-[#F4E9D5] dark:bg-white/[0.05] border border-[#B88A32]/20 text-[#8B7355]"
                            }`}
                          >
                            {isPast ? (
                              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                            ) : isCurrent ? (
                              <Truck className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>
                          <span className={`text-xs font-semibold ${
                            isCurrent
                              ? "text-[#B88A32] font-bold"
                              : isPast
                              ? "text-[#2A2118] dark:text-[#F5EFE6]"
                              : "text-[#8B7355]"
                          }`}>
                            {m.label}
                          </span>
                          <span className="text-[11px] text-[#8B7355] mt-1 leading-tight line-clamp-2">
                            {m.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Vertical Timeline for Mobile */}
                  <div className="lg:hidden space-y-6 relative pl-6 border-l-2 border-[#B88A32]/30 ml-2">
                    {MILESTONES.map((m, idx) => {
                      const isPast = idx < currentIndex;
                      const isCurrent = idx === currentIndex;

                      return (
                        <div key={m.key} className="relative">
                          <div
                            className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                              isPast
                                ? "bg-[#B88A32] text-white"
                                : isCurrent
                                ? "bg-[#B88A32] text-white ring-4 ring-[#B88A32]/20 animate-pulse"
                                : "bg-[#F4E9D5] dark:bg-neutral-800 border border-[#B88A32]/30 text-[#8B7355]"
                            }`}
                          >
                            {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                          </div>
                          <div>
                            <span className={`text-xs font-bold ${
                              isCurrent ? "text-[#B88A32]" : isPast ? "text-[#2A2118] dark:text-[#F5EFE6]" : "text-[#8B7355]"
                            }`}>
                              {m.label}
                            </span>
                            <p className="text-xs text-[#8B7355] mt-0.5">{m.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Grid of Details: Items Snapshot & Shipping Address */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left 2 Cols: Order Items */}
                <div className="md:col-span-2 bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#2A2118]/5">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-[#8B7355] mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#B88A32]" />
                    Insured Eyewear Order Items
                  </h3>

                  <div className="divide-y divide-[#B88A32]/15">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-4 flex justify-between items-center text-sm">
                        <div>
                          <p className="font-semibold text-[#2A2118] dark:text-[#F5EFE6]">{item.name}</p>
                          <p className="text-xs font-mono text-[#8B7355]">
                            Qty: {item.quantity} &bull; Unit: ₹{item.unit_price}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-[#B88A32]">
                          ₹{item.total_price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#B88A32]/15 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-[#6B5740] dark:text-[#B8A898]">
                      <span>Subtotal</span>
                      <span>₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#6B5740] dark:text-[#B8A898]">
                      <span>Luxury Insured Shipping</span>
                      <span>{order.shipping_charge === 0 ? "Complimentary" : `₹${order.shipping_charge}`}</span>
                    </div>
                    <div className="flex justify-between text-[#2A2118] dark:text-[#F5EFE6] font-bold text-sm pt-2 border-t border-[#B88A32]/15">
                      <span>Total Amount</span>
                      <span className="text-[#B88A32]">₹{order.total_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Right Col: Delivery Destination & Support */}
                <div className="space-y-6">
                  <div className="bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 rounded-3xl p-6 shadow-xl shadow-[#2A2118]/5">
                    <h3 className="text-sm font-mono uppercase tracking-wider text-[#8B7355] mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#B88A32]" />
                      Shipping Address
                    </h3>
                    <p className="text-sm font-semibold text-[#2A2118] dark:text-[#F5EFE6]">
                      {order.customer.full_name}
                    </p>
                    <p className="text-xs text-[#6B5740] dark:text-[#B8A898] mt-1 leading-relaxed">
                      {order.customer.masked_address || (
                        <>
                          {order.customer.address ? `${order.customer.address}, ` : ""}
                          {order.customer.city}
                          <br />
                          {order.customer.state} - {order.customer.pincode}
                        </>
                      )}
                    </p>
                  </div>

                  {order.prescription_url && (
                    <div className="bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 rounded-3xl p-6 shadow-xl shadow-[#2A2118]/5">
                      <h3 className="text-sm font-mono uppercase tracking-wider text-[#8B7355] mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#B88A32]" />
                        Optical Prescription
                      </h3>
                      <div className="p-3.5 rounded-xl bg-[#F4E9D5]/50 dark:bg-white/[0.04] border border-[#B88A32]/20 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#2A2118] dark:text-[#F5EFE6] truncate">
                            {order.prescription_name || "Prescription Document"}
                          </p>
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                            <ShieldCheck className="w-3 h-3" /> Attached via InsForge Storage
                          </p>
                        </div>
                        <a
                          href={order.prescription_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B88A32] hover:bg-[#A07828] text-white text-xs font-mono font-medium transition-colors shadow-sm flex-shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 rounded-3xl p-6 shadow-xl shadow-[#2A2118]/5">
                    <h3 className="text-sm font-mono uppercase tracking-wider text-[#8B7355] mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      Direct Atelier Support
                    </h3>
                    <p className="text-xs text-[#6B5740] dark:text-[#B8A898] mb-4">
                      Need prescription modification or special delivery instructions? Reach Dr. Sheeraz Ahmad directly.
                    </p>
                    <button
                      onClick={handleWhatsAppInquiry}
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp Concierge
                    </button>
                  </div>
                </div>
              </div>

              {/* Status History Audit Trail */}
              {order.history && order.history.length > 0 && (
                <div className="bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#2A2118]/5">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-[#8B7355] mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B88A32]" />
                    Atelier Activity Log
                  </h3>
                  <div className="space-y-3">
                    {order.history.map((h, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row justify-between sm:items-center p-3 rounded-xl bg-[#F4E9D5]/50 dark:bg-white/[0.04] border border-[#B88A32]/15 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#B88A32] uppercase font-mono">{h.status}</span>
                          <span className="text-[#4A3928] dark:text-[#F5EFE6]">&mdash; {h.note}</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#8B7355] mt-1 sm:mt-0">
                          {new Date(h.changed_at).toLocaleString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Floating Theme Switcher */}
      <div className="fixed bottom-6 left-6 z-40">
        <ThemeToggle variant="floating" />
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4E9D5] dark:bg-[#0A0A0E] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#B88A32]" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}

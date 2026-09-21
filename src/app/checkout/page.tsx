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
  AlertCircle,
  Copy,
  ExternalLink,
  PackageCheck,
  Upload,
  FileText,
  Paperclip,
  X,
  Eye
} from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import insforge from "@/lib/insforge";

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

const getCleanProductId = (it: { productId?: string; id?: string; color?: string }) => {
  if (it.productId && typeof it.productId === 'string' && it.productId.trim()) {
    return it.productId.trim();
  }
  const idStr = String(it.id || '').trim();
  if (it.color && idStr.endsWith(`-${it.color}`)) {
    return idStr.slice(0, -(it.color.length + 1));
  }
  return idStr;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const { user, isLoading: authLoading, openAuthModal, signInWithGoogle } = useAuth();
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState({ subtotal: 0, delivery: 0, total: 0 });
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid">("pending");
  const [copied, setCopied] = useState(false);

  const handleGoogleLogin = async () => {
    setPaymentError(null);
    setGoogleAuthLoading(true);
    const res = await signInWithGoogle("/checkout");
    if (!res.success) {
      setPaymentError(res.error || "Google Sign-In was interrupted. Please try again.");
      setGoogleAuthLoading(false);
    }
  };

  useEffect(() => {
    const handleReFocus = () => {
      setGoogleAuthLoading(false);
    };
    window.addEventListener("focus", handleReFocus);
    return () => window.removeEventListener("focus", handleReFocus);
  }, []);

  const handleCopyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Prescription file upload state
  const [selectedPrescription, setSelectedPrescription] = useState<File | null>(null);
  const [prescriptionPreviewUrl, setPrescriptionPreviewUrl] = useState<string | null>(null);
  const [uploadingPrescription, setUploadingPrescription] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState<string | null>(null);
  const [uploadedPrescription, setUploadedPrescription] = useState<{
    url: string;
    key: string;
    name: string;
  } | null>(null);

  const handlePrescriptionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setPrescriptionError("Prescription file size exceeds 10MB limit.");
      return;
    }

    setPrescriptionError(null);
    setSelectedPrescription(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPrescriptionPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPrescriptionPreviewUrl(null);
    }
  };

  const handleRemovePrescription = () => {
    setSelectedPrescription(null);
    setPrescriptionPreviewUrl(null);
    setUploadedPrescription(null);
    setPrescriptionError(null);
  };

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Uttar Pradesh",
    pincode: "",
    customerNotes: ""
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const subtotal = cartTotal;
  const delivery = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + delivery;

  // Prevent accessing checkout if cart is empty and not on confirmation step
  useEffect(() => {
    // Check localStorage as well to prevent premature redirect before React context hydration
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("alighs-ware-cart");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return;
          }
        }
      } catch {
        // ignore
      }
    }
    if (items.length === 0 && step !== 3 && orderedItems.length === 0) {
      router.push("/cart");
    }
  }, [items, step, orderedItems, router]);

  // Autofill form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: user.email || prev.email || "",
        phone: prev.phone || user.phone || "",
      }));

      // Query database for previously stored customer address
      const loadProfile = async () => {
        try {
          const { data } = await insforge.database
            .from("customers")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

          if (data && data.length > 0) {
            const cust = data[0];
            setFormData((prev) => ({
              ...prev,
              fullName: prev.fullName || cust.full_name || user.name || "",
              phone: prev.phone || cust.phone || "",
              address: prev.address || cust.address || "",
              city: prev.city || cust.city || "",
              state: prev.state || cust.state || "Uttar Pradesh",
              pincode: prev.pincode || cust.pincode || "",
            }));
          }
        } catch {
          // non-blocking
        }
      };
      loadProfile();
    }
  }, [user]);

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
    if (!user) {
      openAuthModal("signin", "Login is compulsory to complete your frame order. Please sign in or continue with Google.", "/checkout");
      return;
    }
    nextStep();
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setPaymentError("User authentication required. Please sign in or continue with Google to place your order.");
      openAuthModal("signin", "Login is compulsory to complete your frame order.", "/checkout");
      return;
    }
    setPaymentError(null);
    setSubmitting(true);

    const snapshotItems = [...items];
    const snapshotTotals = { subtotal, delivery, total };

    // Upload prescription to InsForge Storage if selected and not yet uploaded
    let presData = uploadedPrescription;
    if (selectedPrescription && !presData) {
      setUploadingPrescription(true);
      try {
        const { data: uploadRes, error: uploadErr } = await insforge.storage
          .from("prescriptions")
          .uploadAuto(selectedPrescription);

        if (uploadErr || !uploadRes) {
          console.error("Prescription upload error:", uploadErr);
          throw new Error(uploadErr?.message || "Failed to upload optical prescription to storage.");
        }

        presData = {
          url: uploadRes.url,
          key: uploadRes.key,
          name: selectedPrescription.name,
        };
        setUploadedPrescription(presData);
      } catch (pErr: any) {
        setPrescriptionError(pErr.message || "Failed to upload prescription. You can retry or proceed without attaching.");
        setSubmitting(false);
        setUploadingPrescription(false);
        return;
      } finally {
        setUploadingPrescription(false);
      }
    }

    // --- CASE 1: Cash On Delivery (COD) ---
    if (paymentMethod === "COD") {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: {
              fullName: formData.fullName,
              phone: formData.phone,
              email: (formData.email || user.email || "").trim(),
              address: formData.address,
              city: formData.city,
              state: formData.state || "Uttar Pradesh",
              pincode: formData.pincode
            },
            items: snapshotItems.map((it) => ({
              productId: getCleanProductId(it),
              quantity: it.quantity,
              color: it.color
            })),
            paymentMethod: "COD",
            paymentStatus: "Pending",
            customerNotes: formData.customerNotes,
            shippingCharge: delivery,
            userId: user.id,
            userEmail: user.email,
            prescriptionUrl: presData?.url || null,
            prescriptionKey: presData?.key || null,
            prescriptionName: presData?.name || null,
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to confirm order. Please try again.");
        }

        const generatedOrderId = data.order?.order_number || data.order?.orderId;
        setOrderId(generatedOrderId);
        setOrderedItems(snapshotItems);
        setOrderTotal(snapshotTotals);
        setPaymentStatus("pending");
        clearCart();
        setSubmitting(false);
        setDirection(1);
        setStep(3);
      } catch (err: any) {
        console.error("COD order error:", err);
        setPaymentError(err.message || "Failed to place COD order. Please try again.");
        setSubmitting(false);
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
          userId: user.id,
          userEmail: user.email,
          items: items.map(it => ({
            productId: getCleanProductId(it),
            quantity: it.quantity
          })),
          notes: {
            customer_name: formData.fullName,
            customer_phone: formData.phone,
            customer_city: formData.city,
            customer_email: user.email || formData.email,
            user_id: user.id,
            cart_count: String(items.length)
          }
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to generate Razorpay order. Please try again.");
      }

      const rzpOrderId = orderData.order_id;

      // Step 2: Configure and open Razorpay modal
      const activeKey = orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const options = {
        key: activeKey,
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
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment signature verification failed. Please contact support.");
            }

            // Step 4: Persist confirmed paid order in Relational Database
            const orderRes = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customer: {
                  fullName: formData.fullName,
                  phone: formData.phone,
                  email: (formData.email || user.email || "").trim(),
                  address: formData.address,
                  city: formData.city,
                  state: formData.state || "Uttar Pradesh",
                  pincode: formData.pincode
                },
                items: snapshotItems.map((it) => ({
                  productId: getCleanProductId(it),
                  quantity: it.quantity,
                  color: it.color
                })),
                paymentMethod: paymentMethod === "UPI" ? "UPI" : "ONLINE",
                paymentStatus: "Paid",
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                customerNotes: formData.customerNotes,
                shippingCharge: delivery,
                userId: user.id,
                userEmail: user.email,
                prescriptionUrl: presData?.url || null,
                prescriptionKey: presData?.key || null,
                prescriptionName: presData?.name || null,
              })
            });

            const confirmedData = await orderRes.json();
            const officialOrderNumber = confirmedData.order?.order_number || `ALG-2026-${Math.floor(100000 + Math.random() * 900000)}`;

            setOrderId(officialOrderNumber);
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
                  {authLoading ? (
                    <div className="p-12 text-center rounded-3xl border border-[#B88A32]/25 bg-[#FFF9EF] dark:bg-[#121218] shadow-xl shadow-[#2A2118]/5">
                      <Loader2 className="w-8 h-8 animate-spin text-[#B88A32] mx-auto mb-3" />
                      <p className="font-mono text-xs text-[#8B7355] dark:text-[#A09383] uppercase tracking-wider">
                        Verifying atelier authentication status...
                      </p>
                    </div>
                  ) : !user ? (
                    <div className="p-8 md:p-12 rounded-3xl border border-[#B88A32]/35 bg-[#FFF9EF] dark:bg-[#121218] shadow-2xl shadow-[#2A2118]/10 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B88A32]/10 rounded-full blur-3xl pointer-events-none" />

                      <div className="w-16 h-16 rounded-3xl bg-[#B88A32]/15 dark:bg-[#B88A32]/20 border border-[#B88A32]/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                        <ShieldCheck className="w-8 h-8 text-[#B88A32] dark:text-[#D4AF62]" />
                      </div>

                      <span className="text-xs font-mono tracking-[0.25em] text-[#B88A32] uppercase font-bold">
                        ALIG&apos;S WARE ATELIER
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-cinzel font-black tracking-wide text-[#2A2118] dark:text-[#F5EFE6] mt-2 mb-3">
                        Client Login Compulsory
                      </h2>
                      <p className="text-sm text-[#5C4935] dark:text-[#C4B59E] max-w-lg mx-auto mb-8 font-sans leading-relaxed">
                        In accordance with our bespoke optical craftsmanship standards, login is mandatory to order any frame. This links your frame purchase to your personal account for warranty verification, optical prescription records, and real-time courier tracking.
                      </p>

                      {paymentError && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-300 flex items-start gap-3 text-xs leading-relaxed max-w-md mx-auto text-left animate-in fade-in duration-200">
                          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-bold text-sm mb-0.5 text-red-900 dark:text-red-200">
                              Authentication Notice
                            </p>
                            <p>{paymentError}</p>
                          </div>
                          <button
                            onClick={() => setPaymentError(null)}
                            className="text-red-600 dark:text-red-400 hover:opacity-75 font-mono text-sm px-1.5"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Primary 1-Click Action: Google */}
                      <div className="max-w-md mx-auto space-y-3.5 mb-8">
                        <button
                          type="button"
                          disabled={googleAuthLoading}
                          onClick={handleGoogleLogin}
                          className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-[#1A1A24] border-2 border-[#B88A32]/40 hover:border-[#B88A32] text-[#2A2118] dark:text-[#F5EFE6] shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-[0.99] disabled:opacity-60"
                        >
                          {googleAuthLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#B88A32]" />
                          ) : (
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                              <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                              />
                            </svg>
                          )}
                          <div className="text-left">
                            <span className="font-bold text-sm tracking-wide block">
                              {googleAuthLoading ? "Connecting with Google..." : "Continue with Google"}
                            </span>
                            <span className="text-[11px] font-mono text-[#8B7355] dark:text-[#8E8272] block">
                              Link with existing account on your phone
                            </span>
                          </div>
                        </button>

                        <div className="relative flex py-2 items-center">
                          <div className="flex-grow border-t border-[#B88A32]/25"></div>
                          <span className="flex-shrink mx-3 text-[11px] font-mono uppercase tracking-widest text-[#8B7355] dark:text-[#8E8272]">
                            Or Use Email Credentials
                          </span>
                          <div className="flex-grow border-t border-[#B88A32]/25"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => openAuthModal("signin", "Login is compulsory to complete your frame order.")}
                            className="py-3 px-4 rounded-xl bg-[#B88A32] hover:bg-[#A07828] text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md shadow-[#B88A32]/20"
                          >
                            Sign In with Email
                          </button>
                          <button
                            type="button"
                            onClick={() => openAuthModal("signup", "Create an account to complete your frame order.")}
                            className="py-3 px-4 rounded-xl bg-[#F4E9D5] dark:bg-[#1C1C2A] hover:bg-[#E8D2A8] text-[#2A2118] dark:text-[#F5EFE6] border border-[#B88A32]/30 text-xs font-mono font-bold tracking-wider uppercase transition-all"
                          >
                            Register New Account
                          </button>
                        </div>
                      </div>

                      {/* Cart preservation badge */}
                      <div className="p-4 rounded-2xl bg-[#F4E9D5]/60 dark:bg-[#1A1A24]/70 border border-[#B88A32]/20 max-w-md mx-auto text-xs text-[#6B5740] dark:text-[#C4B59E] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-left">
                          <ShoppingBag className="w-4 h-4 text-[#B88A32] shrink-0" />
                          <span>Your bag ({items.length} {items.length === 1 ? "design" : "designs"}) is preserved</span>
                        </div>
                        <span className="font-mono font-bold text-[#B88A32] dark:text-[#D4AF62]">
                          Total: ₹{total}
                        </span>
                      </div>
                    </div>
                  ) : (
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

                      <div className="mb-6 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Signed in as <strong>{user.name || user.email}</strong> ({user.email}). Frame order will be officially registered to your account.</span>
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
                            State / Province *
                          </label>
                          <input
                            required
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="e.g. Uttar Pradesh, Delhi"
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

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs uppercase tracking-wider text-[#4A3928] font-mono font-semibold">
                            Delivery Instructions / Notes (Optional)
                          </label>
                          <input
                            type="text"
                            name="customerNotes"
                            value={formData.customerNotes}
                            onChange={handleInputChange}
                            placeholder="e.g. Call before delivery, delicate frame packaging requested"
                            className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl px-4 py-3.5 text-[#2A2118] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm"
                          />
                        </div>

                        {/* Optical Prescription / Lens Power Card Upload (Optional) */}
                        <div className="space-y-2 md:col-span-2 pt-2">
                          <label className="text-xs uppercase tracking-wider text-[#4A3928] font-mono font-semibold flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Paperclip className="w-3.5 h-3.5 text-[#B88A32]" />
                              Attach Optical Prescription / Eye Test Card (Optional)
                            </span>
                            <span className="text-[10px] text-[#8B7355] font-normal">PNG, JPG, PDF up to 10MB</span>
                          </label>

                          {!selectedPrescription ? (
                            <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-[#B88A32]/35 bg-[#F4E9D5]/30 hover:bg-[#F4E9D5]/60 cursor-pointer transition-all group">
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handlePrescriptionSelect}
                                className="hidden"
                              />
                              <div className="w-10 h-10 rounded-xl bg-[#B88A32]/10 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                                <Upload className="w-5 h-5 text-[#B88A32]" />
                              </div>
                              <p className="text-xs font-medium text-[#2A2118]">
                                Click to browse or drop your doctor&apos;s eye prescription
                              </p>
                              <p className="text-[11px] text-[#8B7355] mt-0.5 font-mono">
                                Dr. Sheeraz Ahmad will custom-craft your lenses to these exact power specs
                              </p>
                            </label>
                          ) : (
                            <div className="p-3.5 rounded-2xl bg-[#F4E9D5]/60 border border-[#B88A32]/30 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 overflow-hidden">
                                {prescriptionPreviewUrl ? (
                                  <img
                                    src={prescriptionPreviewUrl}
                                    alt="Prescription preview"
                                    className="w-12 h-12 object-cover rounded-xl border border-[#B88A32]/30 shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-[#B88A32]/15 flex items-center justify-center shrink-0">
                                    <FileText className="w-6 h-6 text-[#B88A32]" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-xs font-mono font-bold text-[#2A2118] truncate">
                                    {selectedPrescription.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-[#8B7355]">
                                    {(selectedPrescription.size / 1024).toFixed(1)} KB • Ready to attach to order
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemovePrescription}
                                className="p-1.5 rounded-lg text-[#8B7355] hover:text-red-600 hover:bg-red-500/10 transition-colors shrink-0"
                                title="Remove prescription"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {prescriptionError && (
                            <p className="text-xs text-red-600 font-mono mt-1">{prescriptionError}</p>
                          )}
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
                  )}
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
                              <p className="font-bold text-sm mb-0.5 text-red-900 dark:text-red-200">
                                {paymentMethod === "COD" ? "Order Notice" : "Payment Gateway Notice"}
                              </p>
                              <p className={paymentMethod !== "COD" ? "mb-3" : ""}>{paymentError}</p>
                              {paymentMethod !== "COD" && (
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
                              )}
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

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-4">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[11px] font-mono tracking-wider text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                        Order Confirmed
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight mb-2 text-[#2A2118]">
                      Thank you for shopping with ALIG'S WARE
                    </h2>
                    <p className="text-[#6B5740] text-sm sm:text-base max-w-lg mx-auto mb-6">
                      Shukriya, <span className="font-semibold text-[#2A2118]">{formData.fullName}</span>! Your bespoke eyewear order has been secured and logged in our persistent order registry.
                    </p>

                    <div className="bg-[#F4E9D5]/50 rounded-2xl p-6 text-left mb-8 border border-[#B88A32]/20">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#B88A32]/15 gap-2">
                        <div>
                          <span className="text-[#8B7355] block text-[11px] font-mono uppercase tracking-wider">OFFICIAL ORDER NUMBER</span>
                          <span className="text-[#B88A32] font-bold text-lg sm:text-xl font-mono tracking-wider">
                            {orderId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyOrderId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF9EF] hover:bg-[#E8D2A8]/40 border border-[#B88A32]/30 text-xs font-mono text-[#4A3928] transition-all shadow-sm active:scale-95"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#B88A32]" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
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
                            {formData.address}, {formData.city}, {formData.state} - {formData.pincode}
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

                        {uploadedPrescription && (
                          <div className="col-span-1 sm:col-span-2 pt-3 border-t border-[#B88A32]/15">
                            <span className="text-[#8B7355] block font-mono text-[11px] mb-1.5 uppercase tracking-wider">
                              OPTICAL PRESCRIPTION ATTACHMENT
                            </span>
                            <div className="p-3 rounded-xl bg-[#FFF9EF] border border-[#B88A32]/25 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-[#B88A32]/10 border border-[#B88A32]/25 flex items-center justify-center flex-shrink-0 text-[#B88A32]">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#2A2118] truncate">
                                    {uploadedPrescription.name}
                                  </p>
                                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                                    Attached to Order (InsForge Storage)
                                  </p>
                                </div>
                              </div>
                              <a
                                href={uploadedPrescription.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#B88A32] hover:bg-[#A07828] text-white text-xs font-mono font-medium transition-colors flex-shrink-0 shadow-sm"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <Link
                        href={`/track-order?orderNumber=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(formData.phone)}`}
                        className="w-full sm:w-auto"
                      >
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full bg-[#B88A32] hover:bg-[#A07828] text-[#FFF9EF] font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-[#B88A32]/25 flex items-center justify-center gap-2 text-sm"
                        >
                          <PackageCheck className="w-4 h-4" /> Track Order Status
                        </motion.button>
                      </Link>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleWhatsAppShare}
                        className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                      >
                        <MessageCircle className="w-4 h-4" /> Send Receipt on WhatsApp
                      </motion.button>

                      <Link href="/shop" className="w-full sm:w-auto">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full bg-[#F4E9D5] hover:bg-[#E8D2A8] text-[#2A2118] border border-[#B88A32]/25 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm"
                        >
                          Continue Shopping
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

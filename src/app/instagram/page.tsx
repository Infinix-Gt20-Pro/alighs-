// src/app/instagram/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Heart,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Phone,
  ArrowRight,
  ShoppingBag,
  Share2,
  Eye,
  Film,
  Award
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CartDrawer from "@/components/CartDrawer";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const POSTS = [
  {
    id: "post-1",
    category: "reels",
    title: "Aurelia 24K Gold • Milan Runway Collection",
    caption: "Japanese Beta-Titanium wireframe worn by Elena Rostova. Ultralight 18 grams, hand-polished gold plating, and sapphire blue-cut optical clarity.",
    image: "/images/model-gold.jpg",
    isVideo: false,
    likes: "2,420",
    comments: "148",
    productSlug: "aurelia-titanium-round",
    productName: "Aurelia Gold Round",
    price: "₹2,499",
    tags: ["#AligsWare", "#MilanRunway", "#BetaTitanium", "#Firozabad"]
  },
  {
    id: "post-2",
    category: "reels",
    title: "1080p Motion Study: The Ergonomic Fit",
    caption: "Live video capture: testing how our pantos bridge contour rests comfortably without slippage or cheekbone contact on Indian facial profiles.",
    video: "/videos/man-putting-on-glasses.mp4",
    image: "/images/model-dark.jpg",
    isVideo: true,
    likes: "3,890",
    comments: "214",
    productSlug: "nocturne-bold-clubmaster",
    productName: "Imperial Classic Titanium",
    price: "₹2,799",
    tags: ["#MotionReel", "#EyewearDesign", "#OpticalFit", "#AMU"]
  },
  {
    id: "post-3",
    category: "doctor",
    title: "Dr. Sheeraz Ahmad: Blue-Cut 420nm vs Standard Tint",
    caption: "Clinical demonstration by Dr. Sheeraz Ahmad (AMU). Why 420nm high-energy blue-light filtration protects the retina during long screen hours.",
    image: "/images/clarity-showcase.jpg",
    isVideo: false,
    likes: "4,120",
    comments: "320",
    productSlug: "aurelia-titanium-round",
    productName: "Clinical Eye Checkup & Sapphire Lenses",
    price: "Free Consult",
    tags: ["#DrSheerazAhmad", "#AMUOptometrist", "#EyeHealth", "#BlueCut"]
  },
  {
    id: "post-4",
    category: "drops",
    title: "Nocturne Matte Clubmaster • Obsidian Onyx",
    caption: "Italian hand-beveled acetate browline with 24K gold-plated micro-pins. Precision craftsmanship engineered in our Firozabad atelier.",
    image: "/images/luxury-craft.jpg",
    isVideo: false,
    likes: "1,980",
    comments: "92",
    productSlug: "nocturne-bold-clubmaster",
    productName: "Nocturne Bold Clubmaster",
    price: "₹2,799",
    tags: ["#ItalianAcetate", "#Clubmaster", "#Obsidian", "#Luxury"]
  },
  {
    id: "post-5",
    category: "drops",
    title: "Atelier Packaging & Velvet Hard-Case Reveal",
    caption: "Every ALIG'S WARE frame arrives in our custom weighted gold-embossed box, microfiber lens towel, and AMU clinical certificate card.",
    image: "/images/hero-luxury-eyewear.jpg",
    isVideo: false,
    likes: "2,740",
    comments: "165",
    productSlug: "aurelia-titanium-round",
    productName: "Collector Atelier Unboxing",
    price: "Included",
    tags: ["#Unboxing", "#VelvetCase", "#FirozabadHeritage", "#Packaging"]
  },
  {
    id: "post-6",
    category: "doctor",
    title: "Free In-Clinic Try-On & Digital Power Testing",
    caption: "Visit our Firozabad clinic or request our doorstep frame try-on kit. Accurate cylindrical and spherical power verification.",
    image: "/images/model-dark.jpg",
    isVideo: false,
    likes: "3,110",
    comments: "188",
    productSlug: "nocturne-bold-clubmaster",
    productName: "In-Person Clinic Visit",
    price: "Book Free",
    tags: ["#FirozabadClinic", "#EyeTest", "#DoctorConsultation"]
  }
];

export default function InstagramPage() {
  const [activeTab, setActiveTab] = useState<"all" | "reels" | "doctor" | "drops">("all");

  const filteredPosts = POSTS.filter((p) => {
    if (activeTab === "all") return true;
    return p.category === activeTab;
  });

  return (
    <div className="relative min-h-screen bg-[#070709] text-white flex flex-col selection:bg-amber-500/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full">
        {/* INSTAGRAM PROFILE HEADER HERO CARD */}
        <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-6 sm:p-10 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-[#f09433]/20 via-[#dc2743]/20 to-[#bc1888]/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-10 text-center md:text-left">
            {/* Profile Avatar / Official Logo */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-[0_0_40px_rgba(220,39,67,0.4)] shrink-0 group">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                <Image
                  src="/images/aligsware-logo.png"
                  alt="ALIG'S WARE Official Logo"
                  fill
                  sizes="144px"
                  className="object-contain p-2"
                  priority
                />
              </div>
            </div>

            {/* Profile Bio & Handle Info */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 justify-center md:justify-start">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-cinzel tracking-wider text-white">
                  ALIGSWARE
                </h1>
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
                    @aligsware
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Atelier
                  </span>
                </div>
              </div>

              {/* Bio Highlights */}
              <div className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans mb-5 space-y-1">
                <p className="font-medium text-white">
                  👓 Firozabad&apos;s trusted heritage craftsmanship, now online.
                </p>
                <p>
                  🔬 AMU-Certified Optometry &amp; Eye Health by Dr. Sheeraz Ahmad.
                </p>
                <p>
                  ✨ Japanese Beta-Titanium frames &bull; 420nm Sapphire Blue-Cut Lenses.
                </p>
                <p className="text-amber-300/90 font-mono text-[11px]">
                  📍 Firozabad, Uttar Pradesh &bull; 📞 +91 72173 71499 &bull; Pan-India Dispatch
                </p>
              </div>

              {/* Quick Action CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href="https://www.instagram.com/aligsware/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(220,39,67,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Follow on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href="https://wa.me/917217371499?text=Hi%20ALIGSWARE!%20I'm%20visiting%20your%20Instagram%20page%20and%20interested%20in%20your%20eyewear."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs font-mono transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: 7217371499</span>
                </a>

                <Link
                  href="/appointment"
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium text-xs transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Book Clinic Visit</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FEED FILTER TABS */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
            {[
              { id: "all", label: "All Curations" },
              { id: "reels", label: "Runway & Video Reels" },
              { id: "doctor", label: "Dr. Sheeraz Clinic Advice" },
              { id: "drops", label: "New Eyewear Drops" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`cursor-pointer px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 shrink-0 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <a
            href="https://www.instagram.com/aligsware/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-pink-400 hover:text-pink-300 transition-colors"
          >
            <span>instagram.com/aligsware</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* INSTAGRAM POSTS & REELS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.div
                layout
                key={post.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="group rounded-3xl overflow-hidden bg-gradient-to-b from-[#0e0f14] to-[#070709] border border-white/10 hover:border-pink-500/40 transition-all duration-500 flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_45px_rgba(220,39,67,0.2)]"
              >
                {/* Media Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-black">
                  {post.isVideo && post.video ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    >
                      <source src={post.video} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                  {/* Badges on Media */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-amber-300 uppercase tracking-widest">
                      {post.category.toUpperCase()}
                    </span>
                    {post.isVideo && (
                      <span className="w-7 h-7 rounded-full bg-black/75 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400">
                        <Film className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Instagram Logo Badge */}
                  <a
                    href="https://www.instagram.com/aligsware/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover:text-pink-400 group-hover:border-pink-500/40 transition-colors shadow-lg"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>

                  {/* Likes & Comments Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/90 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-white/80" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <span className="text-amber-300 font-bold">{post.price}</span>
                  </div>
                </div>

                {/* Caption & Product Meta */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-white group-hover:text-pink-300 transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 mb-4 font-sans">
                      {post.caption}
                    </p>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono text-pink-400/80 bg-pink-500/10 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-white/10 flex items-center gap-2.5">
                    <Link
                      href={`/shop/${post.productSlug}`}
                      className="cursor-pointer flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Shop Frame</span>
                    </Link>

                    <a
                      href="https://www.instagram.com/aligsware/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer p-2.5 rounded-xl border border-white/20 hover:border-pink-400 hover:text-pink-400 text-white transition-colors"
                      title="View on Instagram"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* BOTTOM CTA: DIRECT WHATSAPP & APPOINTMENT */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-pink-500/10 border border-white/15 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center mb-4 shadow-xl">
            <InstagramIcon className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-cinzel text-white mb-2">
            Stay Connected with ALIG&apos;S WARE
          </h2>
          <p className="text-neutral-300 text-sm max-w-xl mb-6 font-light">
            Follow our daily drops, live spectacles craftsmanship reels, and eye health tips by Dr. Sheeraz Ahmad on Instagram.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.instagram.com/aligsware/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(220,39,67,0.5)] hover:scale-105 transition-transform"
            >
              Follow @aligsware Now
            </a>
            <a
              href="https://wa.me/917217371499?text=Hi%20ALIGSWARE!%20I'm%20interested%20in%20your%20eyewear."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-sm transition-colors"
            >
              WhatsApp 7217371499
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
    </div>
  );
}

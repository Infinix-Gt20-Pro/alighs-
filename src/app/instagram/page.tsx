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
    title: "Behind The Scenes: Japanese Beta-Titanium Cold Milling",
    caption: "Watch how 0.6mm titanium sheets are laser-contoured and vacuum-sintered to create featherlight 18.4g resilience that never deforms under pressure.",
    image: "/images/glasses-render.jpg",
    video: "/videos/glasses-spin.mp4",
    isVideo: true,
    likes: "4,890",
    comments: "312",
    productSlug: "zenith-geometric-octa",
    productName: "Zenith Geometric Octa",
    price: "₹2,699",
    tags: ["#EyewearCraft", "#TitaniumEyewear", "#Optics", "#LuxuryStyle"]
  },
  {
    id: "post-3",
    category: "doctor",
    title: "Dr. Sheeraz on 420nm Blue-Cut Lenses vs Screen Fatigue",
    caption: "Dr. Sheeraz Ahmad (AMU) explains how true 420nm blue-violet cutoff prevents digital retinal strain compared to ordinary coated lenses.",
    image: "/images/dr-sheeraz-consultation.jpg",
    isVideo: false,
    likes: "1,870",
    comments: "94",
    productSlug: "chronos-matte-black-aviator",
    productName: "Chronos Matte Aviator",
    price: "Free Consult",
    tags: ["#EyeCareTips", "#DrSheerazAhmad", "#Optometry", "#DigitalStrain"]
  },
  {
    id: "post-4",
    category: "drops",
    title: "Eclipse Matte Black • Limited Batch of 50 Pieces",
    caption: "Deep obsidian sandblasted finish with hand-beveled acetate tips. Engineered for boardroom gravitas and night city driving.",
    image: "/images/glasses-front.jpg",
    isVideo: false,
    likes: "3,250",
    comments: "205",
    productSlug: "aurelia-titanium-round",
    productName: "Eclipse Obsidian Matte",
    price: "₹2,899",
    tags: ["#NewDrop", "#MinimalistDesign", "#MatteBlack", "#LuxuryFrames"]
  },
  {
    id: "post-5",
    category: "reels",
    title: "Man Putting On Glasses • Movement In Cinema Reel",
    caption: "Natural weight distribution test. Ergonomic silicone nose pads that leave zero bridge marks even after 14 continuous hours.",
    image: "/images/model-gold.jpg",
    video: "/videos/man-putting-on-glasses.mp4",
    isVideo: true,
    likes: "5,640",
    comments: "420",
    productSlug: "zenith-geometric-octa",
    productName: "Zenith Featherweight",
    price: "₹2,699",
    tags: ["#CinematicReels", "#EyewearFashion", "#MensStyle", "#DailyCarry"]
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
    <div className="relative min-h-screen bg-[#F4E9D5] dark:bg-[#0A0A0E] text-[#2A2118] dark:text-[#F5EFE6] flex flex-col selection:bg-[#B88A32]/30 selection:text-[#2A2118] dark:selection:text-[#F5EFE6] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full relative">
        {/* Ambient Warmth Glows */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#E8D2A8]/30 dark:bg-[#B88A32]/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-[#D4AF62]/20 dark:bg-[#B88A32]/10 rounded-full blur-[160px] -z-10 pointer-events-none" />

        {/* INSTAGRAM PROFILE HEADER HERO CARD */}
        <div className="relative rounded-3xl bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 dark:border-[#B88A32]/35 p-6 sm:p-10 mb-12 shadow-xl shadow-[#2A2118]/5 dark:shadow-black/50 overflow-hidden">
          {/* Subtle Ambient Accent */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-[#f09433]/15 via-[#dc2743]/15 to-[#bc1888]/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#B88A32]/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-10 text-center md:text-left">
            {/* Profile Avatar / Official Logo */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-md shrink-0 group">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#2A2118] flex items-center justify-center">
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-wider text-[#2A2118] dark:text-[#F5EFE6]">
                  ALIGSWARE
                </h1>
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-xs font-mono font-bold text-[#B88A32] dark:text-[#E5C178] bg-[#B88A32]/15 dark:bg-[#B88A32]/25 border border-[#B88A32]/30 dark:border-[#B88A32]/40 px-3 py-1 rounded-full">
                    @aligsware
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#4A7C59] dark:text-emerald-400 bg-[#4A7C59]/15 dark:bg-emerald-500/20 border border-[#4A7C59]/30 dark:border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Atelier
                  </span>
                </div>
              </div>

              {/* Bio Highlights */}
              <div className="text-[#6B5740] dark:text-[#C4B59E] text-xs sm:text-sm leading-relaxed max-w-2xl font-sans mb-5 space-y-1">
                <p className="font-semibold text-[#2A2118] dark:text-[#F5EFE6]">
                  👓 Firozabad&apos;s trusted heritage craftsmanship, now online.
                </p>
                <p>
                  🔬 AMU-Certified Optometry &amp; Eye Health by Dr. Sheeraz Ahmad.
                </p>
                <p>
                  ✨ Japanese Beta-Titanium frames &bull; 420nm Sapphire Blue-Cut Lenses.
                </p>
                <p className="text-[#B88A32] dark:text-[#E5C178] font-mono text-[11px] font-medium">
                  📍 Firozabad, Uttar Pradesh &bull; 📞 +91 72173 71499 &bull; Pan-India Insured Dispatch
                </p>
              </div>

              {/* Quick Action CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href="https://www.instagram.com/aligsware/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Follow on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href="https://wa.me/917217371499?text=Hi%20ALIGSWARE!%20I'm%20visiting%20your%20Instagram%20page%20and%20interested%20in%20your%20eyewear."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#1b8743] font-semibold text-xs font-mono transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp: 7217371499</span>
                </a>

                <Link
                  href="/appointment"
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4E9D5] hover:bg-[#E8D2A8] border border-[#B88A32]/25 text-[#2A2118] font-medium text-xs transition-colors"
                >
                  <Award className="w-4 h-4 text-[#B88A32]" />
                  <span>Book Clinic Visit</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FEED FILTER TABS */}
        <div className="flex items-center justify-between border-b border-[#B88A32]/20 pb-4 mb-8">
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
                    ? "bg-[#B88A32] text-[#FFF9EF] font-bold shadow-sm"
                    : "bg-[#FFF9EF] dark:bg-[#121218] text-[#6B5740] dark:text-[#C4B59E] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] border border-[#B88A32]/20 dark:border-[#B88A32]/35 hover:bg-[#E8D2A8]/40 dark:hover:bg-[#1A1A24]"
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
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-[#B88A32] hover:text-[#A07828] dark:text-[#D4AF62] dark:hover:text-[#E5C178] transition-colors"
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
                className="group rounded-3xl overflow-hidden bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 dark:border-[#B88A32]/35 hover:border-[#B88A32]/60 dark:hover:border-[#B88A32]/70 transition-all duration-500 flex flex-col justify-between shadow-md hover:shadow-xl shadow-[#2A2118]/5 dark:shadow-black/50"
              >
                {/* Media Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#2A2118]">
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
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

                  {/* Badges on Media */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#2A2118]/80 backdrop-blur-md border border-[#B88A32]/30 text-[10px] font-mono text-[#D4AF62] uppercase tracking-widest font-semibold">
                      {post.category.toUpperCase()}
                    </span>
                    {post.isVideo && (
                      <span className="w-7 h-7 rounded-full bg-[#2A2118]/80 backdrop-blur-md border border-[#B88A32]/30 flex items-center justify-center text-[#D4AF62]">
                        <Film className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Instagram Logo Badge */}
                  <a
                    href="https://www.instagram.com/aligsware/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#2A2118]/80 backdrop-blur-md border border-[#B88A32]/30 flex items-center justify-center text-white group-hover:text-pink-400 transition-colors shadow-md"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>

                  {/* Likes & Comments Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white bg-[#2A2118]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
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
                    <span className="text-[#D4AF62] font-bold">{post.price}</span>
                  </div>
                </div>

                {/* Caption & Product Meta */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#2A2118] dark:text-[#F5EFE6] group-hover:text-[#B88A32] dark:group-hover:text-[#D4AF62] transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#6B5740] dark:text-[#A89885] leading-relaxed line-clamp-3 mb-4 font-sans">
                      {post.caption}
                    </p>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono text-[#B88A32] dark:text-[#E5C178] bg-[#B88A32]/10 dark:bg-[#B88A32]/20 px-2 py-0.5 rounded-md font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-[#B88A32]/15 dark:border-[#B88A32]/25 flex items-center gap-2.5">
                    <Link
                      href={`/shop/${post.productSlug}`}
                      className="cursor-pointer flex-1 py-2.5 rounded-xl bg-[#B88A32] hover:bg-[#A07828] text-[#FFF9EF] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Shop Frame</span>
                    </Link>

                    <a
                      href="https://www.instagram.com/aligsware/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer p-2.5 rounded-xl border border-[#B88A32]/25 dark:border-[#B88A32]/35 hover:border-[#B88A32] hover:text-[#B88A32] text-[#4A3928] dark:text-[#C4B59E] transition-colors bg-[#F4E9D5]/40 dark:bg-[#161622]"
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
        <div className="mt-16 rounded-3xl bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/25 dark:border-[#B88A32]/35 p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-xl shadow-[#2A2118]/5 dark:shadow-black/50">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center mb-4 shadow-md">
            <InstagramIcon className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2A2118] dark:text-[#F5EFE6] mb-2">
            Stay Connected with ALIG&apos;S WARE
          </h2>
          <p className="text-[#6B5740] dark:text-[#A89885] text-sm max-w-xl mb-6 font-normal">
            Follow our daily drops, live spectacles craftsmanship reels, and eye health tips by Dr. Sheeraz Ahmad on Instagram.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.instagram.com/aligsware/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-sm uppercase tracking-wider shadow-md hover:scale-105 transition-transform"
            >
              Follow @aligsware Now
            </a>
            <a
              href="https://wa.me/917217371499?text=Hi%20ALIGSWARE!%20I'm%20interested%20in%20your%20eyewear."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[#F4E9D5] dark:bg-[#1A1A26] hover:bg-[#E8D2A8] dark:hover:bg-[#222234] border border-[#B88A32]/25 dark:border-[#B88A32]/35 text-[#2A2118] dark:text-[#F5EFE6] font-mono text-sm transition-colors"
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

// src/components/InstagramSection.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Heart, MessageCircle, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

const INSTAGRAM_POSTS = [
  {
    id: "reel-1",
    type: "reel",
    title: "Aurelia 24K Gold • Milan Runway",
    subtitle: "Ultralight Japanese Beta-Titanium on Elena Rostova",
    image: "/images/model-gold.jpg",
    likes: "1,420",
    comments: "84",
    tag: "RUNWAY ATELIER"
  },
  {
    id: "reel-2",
    type: "photo",
    title: "Imperial Classic • 1080p Motion",
    subtitle: "Ergonomic bridge contouring study on Indian bone structures",
    image: "/images/model-dark.jpg",
    likes: "2,190",
    comments: "138",
    tag: "CLINICAL OPTICS"
  },
  {
    id: "reel-3",
    type: "photo",
    title: "Dr. Sheeraz Ahmad AMU Eye Care",
    subtitle: "Why 420nm Sapphire Blue-Cut is critical for digital screen strain",
    image: "/images/clarity-showcase.jpg",
    likes: "3,840",
    comments: "215",
    tag: "DOCTOR ADVICE"
  },
  {
    id: "reel-4",
    type: "reel",
    title: "Precision Packaging & Unboxing",
    subtitle: "Hand-assembled in Firozabad with velvet case & microfiber cloth",
    image: "/images/luxury-craft.jpg",
    likes: "1,880",
    comments: "96",
    tag: "HANDCRAFTED"
  }
];

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

export default function InstagramSection() {
  const { enableBlurOrbs, tier } = useDeviceTier();

  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Soft Glow - Gated by device tier */}
      {enableBlurOrbs && (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-amber-500/5 rounded-full pointer-events-none -z-10 ${tier === "MEDIUM" ? "blur-[50px]" : "blur-[130px]"}`} />
      )}

      {/* Header Profile Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-[#C6A463]/15 dark:border-[#B88A32]/30">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-[0_0_25px_rgba(220,39,67,0.35)] shrink-0">
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#3C2415] flex items-center justify-center">
              <Image
                src="/images/aligsware-logo.png"
                alt="ALIG'S WARE Official Logo"
                fill
                sizes="80px"
                className="object-contain p-1"
                priority
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold tracking-wider text-[#2A2118] dark:text-[#F5EFE6]">
                ALIGSWARE
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Official
              </span>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#5C4935] dark:text-[#C4B59E]">
              <a
                href="https://www.instagram.com/aligsware/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B88A32] hover:text-[#2A2118] dark:text-[#D4AF62] dark:hover:text-[#F5EFE6] transition-colors font-semibold"
              >
                @aligsware
              </a>{" "}
              &bull; Firozabad Heritage Eyewear &bull; AMU Optometry
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/aligsware/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2.5 px-6 py-3 text-xs sm:text-sm"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @aligsware</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Curated Instagram Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {INSTAGRAM_POSTS.map((post) => (
          <a
            key={post.id}
            href="https://www.instagram.com/aligsware/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl overflow-hidden border border-[#B88A32]/20 dark:border-[#B88A32]/25 bg-white dark:bg-[#12121A] hover:border-[#B88A32]/60 dark:hover:border-[#D4AF62]/60 transition-all duration-300 hover:shadow-[0_15px_35px_rgba(184,138,50,0.15)] flex flex-col cursor-pointer"
          >
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Tag pill */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#2A2118]/85 dark:bg-[#1A1A26]/90 backdrop-blur-md border border-[#B88A32]/30 text-xs font-mono text-[#D4AF62]">
                {post.tag}
              </div>

              {/* Instagram icon badge */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 dark:bg-[#161622]/90 backdrop-blur-md border border-[#B88A32]/20 flex items-center justify-center text-[#2A2118]/80 dark:text-[#F5EFE6]/80 group-hover:text-[#B88A32] dark:group-hover:text-[#D4AF62] transition-colors">
                <InstagramIcon className="w-3.5 h-3.5" />
              </div>

              {/* Hover likes & comments overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#D4AF62] fill-[#D4AF62]" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>

            {/* Post Meta */}
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="font-cinzel text-sm font-bold text-[#2A2118] dark:text-[#F5EFE6] group-hover:text-[#B88A32] dark:group-hover:text-[#D4AF62] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-[#5C4935] dark:text-[#C4B59E] mt-1 line-clamp-2 leading-relaxed">
                  {post.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#B88A32]/15 dark:border-[#B88A32]/20 flex items-center justify-between text-xs font-mono text-[#5C4935] dark:text-[#C4B59E]">
                <span className="text-[#B88A32] dark:text-[#D4AF62] font-semibold">View on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Bottom Sub-Banner */}
      <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-[#FFF9EF] dark:bg-[#14141E] border border-[#B88A32]/20 dark:border-[#B88A32]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#B88A32]/10 border border-[#B88A32]/25 flex items-center justify-center text-[#B88A32] dark:text-[#D4AF62] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-semibold text-[#2A2118] dark:text-[#F5EFE6] font-cinzel block">
              Tag @aligsware to be featured on our official page
            </span>
            <span className="text-xs text-[#5C4935] dark:text-[#C4B59E] font-mono">
              Share your look with #AligsWare #FirozabadEyewear #TitaniumOptics
            </span>
          </div>
        </div>

        <a
          href="https://www.instagram.com/aligsware/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary px-4 py-2 rounded-full text-xs font-mono transition-colors flex items-center gap-2"
        >
          <InstagramIcon className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
          <span>instagram.com/aligsware</span>
        </a>
      </div>
    </section>
  );
}

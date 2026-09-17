// src/components/InstagramSection.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Heart, MessageCircle, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

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
  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Header Profile Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-[0_0_25px_rgba(220,39,67,0.35)] shrink-0">
            <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-black flex items-center justify-center">
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
              <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold tracking-wider text-white">
                ALIG&apos;S WARE
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Official
              </span>
            </div>
            <p className="text-xs sm:text-sm font-mono text-neutral-400">
              <a
                href="https://www.instagram.com/aligsware/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 transition-colors font-semibold"
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
            className="cursor-pointer inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(220,39,67,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
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
            className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c0d12]/90 hover:border-pink-500/40 transition-all duration-300 hover:shadow-[0_15px_35px_rgba(220,39,67,0.25)] flex flex-col cursor-pointer"
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
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-amber-300">
                {post.tag}
              </div>

              {/* Instagram icon badge */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 group-hover:text-pink-400 transition-colors">
                <InstagramIcon className="w-3.5 h-3.5" />
              </div>

              {/* Hover likes & comments overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
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
                <h3 className="font-cinzel text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-[11px] text-zinc-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                  {post.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span className="text-pink-400">View on Instagram</span>
                <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-pink-400 transition-colors" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Bottom Sub-Banner */}
      <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-semibold text-white font-cinzel block">
              Tag @aligsware to be featured on our official page
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              Share your look with #AligsWare #FirozabadEyewear #TitaniumOptics
            </span>
          </div>
        </div>

        <a
          href="https://www.instagram.com/aligsware/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl border border-white/20 hover:border-pink-400 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
        >
          <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
          <span>instagram.com/aligsware</span>
        </a>
      </div>
    </section>
  );
}

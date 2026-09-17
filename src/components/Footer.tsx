// src/components/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

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

export default function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-white/10 bg-[#070709] pt-16 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Column with Official Logo */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3.5 group mb-4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-500/40 bg-black shadow-[0_0_20px_rgba(212,175,55,0.3)] shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/images/aligsware-logo.png"
                  alt="ALIG'S WARE"
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-cinzel tracking-wider text-white group-hover:text-amber-300 transition-colors">
                  ALIG&apos;S WARE
                </span>
                <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
                  @aligsware &bull; Firozabad
                </span>
              </div>
            </Link>
            <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-sm">
              Firozabad ki bharosemand quality, ab online. Handcrafted luxury eyewear, 420nm sapphire blue-cut lenses, and AMU clinical optometry care.
            </p>

            {/* Social Follow Pill */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.instagram.com/aligsware/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#f09433]/15 via-[#dc2743]/15 to-[#bc1888]/15 border border-[#dc2743]/30 hover:border-[#dc2743] text-pink-300 text-xs font-mono transition-all"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>@aligsware</span>
              </a>

              <a
                href="https://wa.me/917217371499?text=Hi%20ALIG'S%20WARE!%20I'm%20interested%20in%20your%20eyewear%20collection."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366] text-[#25D366] text-xs font-mono transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-start md:items-center">
            <div>
              <h3 className="text-sm font-semibold text-white mb-5 font-cinzel uppercase tracking-widest text-amber-300">
                Atelier Directory
              </h3>
              <ul className="flex flex-col gap-3.5">
                <li>
                  <Link href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Eyewear Collection
                  </Link>
                </li>
                <li>
                  <Link href="/appointment" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Book Doctor Appointment
                  </Link>
                </li>
                <li>
                  <Link href="/#doctor-section" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Dr. Sheeraz Ahmad (AMU)
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/aligsware/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-300 transition-colors text-sm flex items-center gap-1.5"
                  >
                    <span>Instagram Page</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact & Clinic Details */}
          <div className="flex flex-col items-start">
            <h3 className="text-sm font-semibold text-white mb-5 font-cinzel uppercase tracking-widest text-amber-300">
              Direct Contact
            </h3>
            <ul className="flex flex-col gap-3.5">
              <li>
                <a
                  href="tel:+917217371499"
                  className="flex items-center gap-3 text-gray-300 hover:text-amber-300 transition-colors text-sm font-mono"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>+91 72173 71499</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/917217371499?text=Hi%20ALIG'S%20WARE!%20I'm%20interested%20in%20your%20premium%20eyewear%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#25D366] transition-colors text-sm font-mono"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>+91 72173 71499 (WhatsApp)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/aligsware/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-pink-400 transition-colors text-sm font-mono"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>@aligsware (Direct Message)</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Firozabad, Uttar Pradesh, India &bull; PIN 283203</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Instagram Community Banner Bar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/30 via-pink-950/20 to-amber-950/20 border border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg shrink-0">
              <InstagramIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white font-cinzel">
                Join the ALIG&apos;S WARE Community on Instagram
              </h4>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Daily drops, runway reels, and clinical optometry updates &bull; <span className="text-amber-300">@aligsware</span>
              </p>
            </div>
          </div>
          <a
            href="https://www.instagram.com/aligsware/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0 shadow-[0_0_20px_rgba(220,39,67,0.4)]"
          >
            Follow @aligsware
          </a>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-gray-500 text-xs font-mono">
            &copy; 2026 ALIG&apos;S WARE &bull; Firozabad, Uttar Pradesh &bull; All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
            <a href="https://www.instagram.com/aligsware/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
              Instagram: @aligsware
            </a>
            <span>&bull;</span>
            <a href="tel:+917217371499" className="hover:text-amber-400 transition-colors">
              7217371499
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

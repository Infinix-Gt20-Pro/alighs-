// src/components/Navbar.tsx
"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Calendar } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cartCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4 Core Navigation Links requested by LO
  const navLinks = [
    { name: "Collection", href: "/shop" },
    { name: "Atelier", href: "/#the-frame" },
    { name: "Clinical", href: "/#doctor-section" },
    { name: "About", href: "/#doctor-section" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-2.5 sm:py-3 bg-[#FFF9EF]/90 backdrop-blur-xl border-b border-[#B88A32]/20 shadow-[0_4px_25px_rgba(42,33,24,0.06)]"
            : "py-3.5 sm:py-4 bg-[#FFF9EF]/75 backdrop-blur-lg border-b border-[#B88A32]/15"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* ===================================================================
              BRAND LOGO & TITLE: ALIG'S WARE
             =================================================================== */}
          <Link href="/" className="cursor-pointer flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-[#B88A32]/40 bg-[#2A2118] shadow-[0_0_15px_rgba(184,138,50,0.25)] group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Image
                src="/images/aligsware-logo.png"
                alt="ALIG'S WARE"
                fill
                sizes="40px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-base sm:text-lg font-black tracking-[0.16em] uppercase text-[#2A2118] group-hover:text-[#B88A32] transition-colors leading-tight">
                ALIG&apos;S WARE
              </span>
              <span className="hidden sm:inline text-[9px] font-mono text-[#4A3928] tracking-[0.2em] uppercase">
                Firozabad &bull; Precision Eyewear
              </span>
            </div>
          </Link>

          {/* ===================================================================
              CENTER NAV PILL: Collection   Atelier   Clinical   About
             =================================================================== */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 px-5 py-2 rounded-full bg-[#FFF9EF]/90 border border-[#B88A32]/25 backdrop-blur-xl shadow-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-[0.14em] uppercase transition-all duration-200 ${
                    isActive
                      ? "bg-[#B88A32]/15 text-[#2A2118] shadow-sm"
                      : "text-[#4A3928] hover:text-[#B88A32] hover:bg-[#F4E9D5]/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ===================================================================
              RIGHT ACTION: Desktop (BOOK TRY-ON + Bag) vs Mobile (ONLY ☰)
             =================================================================== */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Desktop Only: BOOK TRY-ON */}
            <Link
              href="/appointment"
              className="cursor-pointer hidden md:inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 rounded-full bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] hover:brightness-105 text-white font-bold text-xs font-mono tracking-[0.16em] uppercase shadow-[0_4px_20px_rgba(184,138,50,0.35)] transition-all duration-300 active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>BOOK TRY-ON</span>
            </Link>

            {/* Desktop Only: Shopping Bag Icon Button */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="cursor-pointer relative hidden md:inline-flex p-2.5 rounded-full bg-[#FFF9EF] hover:bg-[#F4E9D5] border border-[#B88A32]/25 text-[#2A2118] hover:text-[#B88A32] transition-all duration-200 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A2118]" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#B88A32] to-[#D4AF62] rounded-full text-[10px] font-black font-mono flex items-center justify-center text-white shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Only: ☰ Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="cursor-pointer p-2 rounded-xl text-[#2A2118] hover:text-[#B88A32] transition-colors md:hidden relative"
            >
              <Menu className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B88A32] animate-pulse" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* =======================================================================
          MOBILE SLIDE-OUT DRAWER
         ======================================================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-[#2A2118]/40 backdrop-blur-md md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-[#FFF9EF] border-l border-[#B88A32]/25 p-6 flex flex-col justify-between md:hidden shadow-2xl"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-5 border-b border-[#B88A32]/20">
                  <div className="flex flex-col">
                    <span className="font-cinzel text-base font-black tracking-[0.14em] text-[#2A2118]">
                      ALIG&apos;S WARE
                    </span>
                    <span className="text-[9px] font-mono text-[#4A3928] tracking-[0.18em] uppercase">
                      Precision Eyewear
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#4A3928] hover:text-[#2A2118] rounded-full hover:bg-[#F4E9D5]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col gap-2 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-2xl text-base font-cinzel font-bold tracking-[0.12em] uppercase text-[#2A2118] hover:text-[#B88A32] hover:bg-[#F4E9D5]/70 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="flex flex-col gap-3 pt-6 border-t border-[#B88A32]/20">
                {/* Shopping Bag row in mobile drawer */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openCart();
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F4E9D5]/80 border border-[#B88A32]/25 text-xs font-mono font-bold tracking-[0.12em] text-[#2A2118] uppercase transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#B88A32]" />
                    <span>SHOPPING BAG</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B88A32] text-white text-[10px] font-bold">
                    {cartCount}
                  </span>
                </button>

                <Link
                  href="/appointment"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-full bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] text-white font-bold text-xs font-mono tracking-[0.16em] uppercase shadow-[0_4px_20px_rgba(184,138,50,0.35)]"
                >
                  BOOK TRY-ON
                </Link>

                <div className="text-center text-[10px] text-[#6B5740] font-mono uppercase tracking-widest pt-2">
                  Firozabad, UP &bull; +91 72173 71499
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

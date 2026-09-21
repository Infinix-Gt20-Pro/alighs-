// src/components/Navbar.tsx
"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Calendar, User, LogOut, PackageCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const { cartCount, openCart } = useCart();
  const { user, openAuthModal, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let prev = false;
    const handleScroll = () => {
      const isOver = window.scrollY > 20;
      if (isOver !== prev) {
        prev = isOver;
        setScrolled(isOver);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close account dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Core Navigation Links
  const navLinks = [
    { name: "Collection", href: "/shop" },
    { name: "Atelier", href: "/#the-frame" },
    { name: "Clinical", href: "/#doctor-section" },
    { name: "About", href: "/#doctor-section" },
  ];

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "CL";
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-2.5 sm:py-3 bg-[#FFF9EF]/90 dark:bg-[#0A0A0E]/90 backdrop-blur-xl border-b border-[#B88A32]/20 dark:border-[#B88A32]/30 shadow-[0_4px_25px_rgba(42,33,24,0.06)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
            : "py-3.5 sm:py-4 bg-[#FFF9EF]/75 dark:bg-[#0A0A0E]/75 backdrop-blur-lg border-b border-[#B88A32]/15 dark:border-[#B88A32]/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* BRAND LOGO & TITLE: ALIG'S WARE */}
          <Link href="/" className="cursor-pointer flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-[#B88A32]/40 bg-[#2A2118] dark:bg-[#121218] shadow-[0_0_15px_rgba(184,138,50,0.25)] group-hover:scale-105 transition-transform duration-300 shrink-0">
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
              <span className="font-cinzel text-base sm:text-lg font-black tracking-[0.16em] uppercase text-[#2A2118] dark:text-[#F5EFE6] group-hover:text-[#B88A32] dark:group-hover:text-[#D4AF62] transition-colors leading-tight">
                ALIG&apos;S WARE
              </span>
              <span className="hidden sm:inline text-xs font-mono text-[#4A3928] dark:text-[#B8ADA0] tracking-[0.15em] uppercase">
                Firozabad &bull; Precision Eyewear
              </span>
            </div>
          </Link>

          {/* CENTER NAV PILL: Collection Atelier Clinical About */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 px-5 py-2 rounded-full bg-[#FFF9EF]/90 dark:bg-[#14141C]/90 border border-[#B88A32]/25 dark:border-[#B88A32]/30 backdrop-blur-xl shadow-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-[0.14em] uppercase transition-all duration-200 ${
                    isActive
                      ? "bg-[#B88A32]/15 dark:bg-[#D4AF62]/20 text-[#2A2118] dark:text-[#F5EFE6] shadow-sm"
                      : "text-[#4A3928] dark:text-[#B8ADA0] hover:text-[#B88A32] dark:hover:text-[#D4AF62] hover:bg-[#F4E9D5]/60 dark:hover:bg-[#1E1E28]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTION: Desktop (Theme + Account + Book Try-On + Bag) vs Mobile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop Only: Theme Toggle Switcher */}
            <ThemeToggle variant="navbar" className="hidden md:inline-flex" />

            {/* Desktop Only: Account Trigger & Dropdown */}
            <div className="relative hidden md:inline-flex" ref={accountRef}>
              {user ? (
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  aria-label="User Account Menu"
                  className="cursor-pointer w-9 h-9 rounded-full bg-gradient-to-br from-[#B88A32] to-[#7A5A1A] p-0.5 shadow-sm hover:scale-105 transition-transform"
                >
                  <div className="w-full h-full rounded-full bg-[#2A2118] dark:bg-[#121218] flex items-center justify-center text-xs font-mono font-bold text-[#D4AF62]">
                    {getInitials(user.name, user.email)}
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("signin")}
                  aria-label="Client Sign In"
                  className="cursor-pointer p-2 rounded-full bg-[#FFF9EF] dark:bg-[#161622] hover:bg-[#F4E9D5] dark:hover:bg-[#1E1E2C] border border-[#B88A32]/25 dark:border-[#D4AF62]/35 text-[#2A2118] dark:text-[#F5EFE6] hover:text-[#B88A32] dark:hover:text-[#D4AF62] transition-all duration-200 shadow-sm flex items-center gap-1.5 px-3"
                >
                  <User className="w-4 h-4 text-[#B88A32] dark:text-[#D4AF62]" />
                  <span className="text-xs font-mono tracking-wider font-bold uppercase">SIGN IN</span>
                </button>
              )}

              {/* Account Dropdown */}
              <AnimatePresence>
                {isAccountMenuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/30 rounded-2xl p-2 shadow-xl z-50 font-sans"
                  >
                    <div className="px-3 py-2 border-b border-[#B88A32]/15 dark:border-[#B88A32]/20 mb-1">
                      <div className="text-xs font-bold font-cinzel text-[#2A2118] dark:text-[#F5EFE6] truncate">
                        {user.name || "Valued Client"}
                      </div>
                      <div className="text-xs font-mono text-[#6B5740] dark:text-[#A89F91] truncate">
                        {user.email}
                      </div>
                    </div>

                    <Link
                      href="/track-order"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#2A2118] dark:text-[#F5EFE6] hover:bg-[#F4E9D5]/70 dark:hover:bg-[#1A1A24] transition-colors"
                    >
                      <PackageCheck className="w-3.5 h-3.5 text-[#B88A32]" />
                      <span>Track My Orders</span>
                    </Link>

                    <Link
                      href="/appointment"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#2A2118] dark:text-[#F5EFE6] hover:bg-[#F4E9D5]/70 dark:hover:bg-[#1A1A24] transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#B88A32]" />
                      <span>Booked Consultations</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left mt-1 border-t border-[#B88A32]/10"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Only: Book Try-On */}
            <Link
              href="/appointment"
              className="btn-primary py-2 px-5 text-xs hidden md:inline-flex"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Try-On</span>
            </Link>

            {/* Desktop Only: Shopping Bag Icon Button */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="cursor-pointer relative hidden md:inline-flex p-2 rounded-full bg-[#FFF9EF] dark:bg-[#161622] hover:bg-[#F4E9D5] dark:hover:bg-[#1E1E2C] border border-[#B88A32]/25 dark:border-[#D4AF62]/35 text-[#2A2118] dark:text-[#F5EFE6] hover:text-[#B88A32] dark:hover:text-[#D4AF62] transition-all duration-200 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A2118] dark:text-[#F5EFE6]" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#B88A32] to-[#D4AF62] rounded-full text-xs font-black font-mono flex items-center justify-center text-white shadow-sm"
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
              className="cursor-pointer p-2 rounded-xl text-[#2A2118] dark:text-[#F5EFE6] hover:text-[#B88A32] dark:hover:text-[#D4AF62] transition-colors md:hidden relative"
            >
              <Menu className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B88A32] animate-pulse" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE SLIDE-OUT DRAWER */}
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
              className="fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-[#FFF9EF] dark:bg-[#0E0E14] border-l border-[#B88A32]/25 dark:border-[#B88A32]/35 p-6 flex flex-col justify-between md:hidden shadow-2xl"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-5 border-b border-[#B88A32]/20 dark:border-[#B88A32]/30">
                  <div className="flex flex-col">
                    <span className="font-cinzel text-base font-black tracking-[0.14em] text-[#2A2118] dark:text-[#F5EFE6]">
                      ALIG&apos;S WARE
                    </span>
                    <span className="text-xs font-mono text-[#4A3928] dark:text-[#B8ADA0] tracking-[0.15em] uppercase">
                      Precision Eyewear
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#4A3928] dark:text-[#B8ADA0] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] rounded-full hover:bg-[#F4E9D5] dark:hover:bg-[#1A1A24] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Account Section in Mobile Drawer */}
                <div className="mt-4 p-3 rounded-2xl bg-[#F4E9D5]/70 dark:bg-[#1A1A24]/90 border border-[#B88A32]/20">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#B88A32] text-white flex items-center justify-center font-bold text-xs font-mono">
                          {getInitials(user.name, user.email)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold font-cinzel text-[#2A2118] dark:text-[#F5EFE6] truncate max-w-[120px]">
                            {user.name}
                          </span>
                          <span className="text-xs font-mono text-[#6B5740] dark:text-[#A89F91]">
                            Client Account
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-1.5 text-xs text-red-500 font-mono"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal("signin");
                      }}
                      className="btn-primary w-full py-2.5 px-3 text-xs"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In / Register</span>
                    </button>
                  )}
                </div>

                {/* Nav Links */}
                <div className="flex flex-col gap-2 mt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2.5 rounded-2xl text-sm font-cinzel font-bold tracking-[0.12em] uppercase text-[#2A2118] dark:text-[#F5EFE6] hover:text-[#B88A32] dark:hover:text-[#D4AF62] hover:bg-[#F4E9D5]/70 dark:hover:bg-[#1A1A24] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}

                  <Link
                    href="/track-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-2xl text-sm font-cinzel font-bold tracking-[0.12em] uppercase text-[#2A2118] dark:text-[#F5EFE6] hover:text-[#B88A32] dark:hover:text-[#D4AF62] hover:bg-[#F4E9D5]/70 dark:hover:bg-[#1A1A24] transition-colors flex items-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4 text-[#B88A32]" />
                    <span>Track Order</span>
                  </Link>
                </div>

                {/* Mobile Drawer Theme Switcher Row */}
                <div className="mt-4">
                  <ThemeToggle variant="drawer" />
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#B88A32]/20 dark:border-[#B88A32]/30">
                {/* Shopping Bag row in mobile drawer */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openCart();
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F4E9D5]/80 dark:bg-[#1A1A24]/90 border border-[#B88A32]/25 dark:border-[#B88A32]/35 text-xs font-mono font-bold tracking-[0.12em] text-[#2A2118] dark:text-[#F5EFE6] uppercase transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#B88A32] dark:text-[#D4AF62]" />
                    <span>SHOPPING BAG</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B88A32] text-white text-xs font-bold">
                    {cartCount}
                  </span>
                </button>

                <Link
                  href="/appointment"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full py-3.5 text-xs text-center justify-center shadow-[0_4px_20px_rgba(184,138,50,0.35)]"
                >
                  Book Try-On
                </Link>

                <div className="text-center text-xs text-[#6B5740] dark:text-[#A89F91] font-mono uppercase tracking-widest pt-1">
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

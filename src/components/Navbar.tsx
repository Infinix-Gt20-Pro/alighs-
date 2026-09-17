"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ShoppingBag, Menu, X, Sparkles, Phone, Calendar, ArrowRight, MessageCircle } from "lucide-react";
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

  const navLinks = [
    { name: "Atelier Home", href: "/" },
    { name: "Eyewear Collection", href: "/shop" },
    { name: "Dr. Sheeraz Ahmad", href: "/#doctor-section" },
    { name: "Book Consultation", href: "/appointment" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-[#070709]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="cursor-pointer flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center p-[1px] shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0c0d12] rounded-[15px] flex items-center justify-center">
                <Eye className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-base sm:text-lg font-bold tracking-[0.14em] uppercase text-white group-hover:text-amber-300 transition-colors">
                ALIGH&apos;S WARE
              </span>
              <span className="text-[9px] font-mono text-neutral-400 tracking-[0.25em] uppercase -mt-1">
                Firozabad &bull; 1988
              </span>
            </div>
          </Link>

          {/* Center Nav Pill Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 text-white font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Heritage Status Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CLINIC OPEN &bull; ONLINE</span>
            </div>

            {/* Book Appointment CTA */}
            <Link
              href="/appointment"
              className="cursor-pointer hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-amber-500/10 hover:from-amber-500/30 hover:to-amber-500/20 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all duration-300"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Book Try-On</span>
            </Link>

            {/* Slide-in Cart Trigger Button */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="cursor-pointer relative p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 text-neutral-200 hover:text-white transition-all duration-200 shadow-sm"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-200" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-[10px] font-black font-mono flex items-center justify-center text-black shadow-[0_0_10px_rgba(212,175,55,0.7)]"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="cursor-pointer p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 text-neutral-200 hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-[#0a0a0d] border-l border-white/15 p-6 flex flex-col justify-between md:hidden shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <span className="text-base font-bold tracking-wider text-white">ALIGH&apos;S WARE</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-2xl text-base font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                <Link
                  href="/appointment"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  Book Doctor Appointment
                </Link>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <a
                    href="tel:+917217371499"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" /> Call Doctor
                  </a>
                  <a
                    href="https://wa.me/917217371499?text=Hi%20ALIGH'S%20WARE!%20I'm%20interested%20in%20your%20premium%20eyewear."
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-xs font-mono text-[#25D366] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
                <div className="text-center text-xs text-neutral-500 font-mono">
                  Firozabad, Uttar Pradesh &bull; +91 72173 71499
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

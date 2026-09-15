"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Dr. Sheeraz", href: "#doctor-section" },
    { name: "Book Appointment", href: "/appointment" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center"
          >
            <Eye className="text-white w-6 h-6" />
          </motion.div>
          <span className="text-xl font-bold font-sans tracking-wider text-white group-hover:text-cyan-400 transition-colors">
            ALIGH&apos;S WARE
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="glass-pill px-3 py-1 rounded-full text-xs font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20">
              FIROZABAD • ONLINE
            </div>
            
            <Link href="/appointment" className="glass-pill px-4 py-2 rounded-full text-sm font-medium text-white bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 transition-colors">
              Book Free Try-On
            </Link>

            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-300 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col"
          >
            <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
              <span className="text-xl font-bold font-sans tracking-wider text-white">
                MENU
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-white/10 flex flex-col gap-4">
              <div className="glass-pill self-start px-3 py-1 rounded-full text-xs font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20">
                FIROZABAD • ONLINE
              </div>
              <Link
                href="/appointment"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl text-center font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Book Free Try-On
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

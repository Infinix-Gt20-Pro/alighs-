"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  variant?: "navbar" | "drawer" | "floating";
  className?: string;
}

export default function ThemeToggle({
  variant = "navbar",
  className = "",
}: ThemeToggleProps) {
  const { theme, toggleTheme, isMounted } = useTheme();

  if (!isMounted) {
    // Return placeholder with identical dimensions to prevent layout shifts
    if (variant === "drawer") {
      return (
        <div className={`w-full h-12 rounded-2xl bg-[#F4E9D5]/60 dark:bg-[#1A1A24] animate-pulse ${className}`} />
      );
    }
    return (
      <div className={`w-10 h-10 rounded-full bg-[#FFF9EF]/80 dark:bg-[#1A1A24] border border-[#B88A32]/25 animate-pulse ${className}`} />
    );
  }

  const isDark = theme === "dark";

  // ===========================================================================
  // 1. MOBILE DRAWER VARIANT: Interactive row with toggle switch & badges
  // ===========================================================================
  if (variant === "drawer") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "Light" : "Dark"} theme`}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F4E9D5]/80 dark:bg-[#1A1A24]/90 border border-[#B88A32]/25 text-xs font-mono font-bold tracking-[0.14em] text-[#2A2118] dark:text-[#F5EFE6] uppercase transition-all duration-300 active:scale-[0.98] ${className}`}
      >
        <div className="flex items-center gap-2.5">
          {isDark ? (
            <Moon className="w-4 h-4 text-[#D4AF62] animate-pulse" />
          ) : (
            <Sun className="w-4 h-4 text-[#B88A32]" />
          )}
          <span>THEME: {isDark ? "OBSIDIAN GOLD" : "WARM IVORY"}</span>
        </div>

        {/* Mini Pill Switch */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/30 text-xs tracking-wider text-[#B88A32] dark:text-[#D4AF62]">
          <span className={!isDark ? "font-black underline decoration-[#B88A32]" : "opacity-60"}>
            LIGHT
          </span>
          <span className="opacity-40">/</span>
          <span className={isDark ? "font-black underline decoration-[#D4AF62]" : "opacity-60"}>
            DARK
          </span>
        </div>
      </button>
    );
  }

  // ===========================================================================
  // 2. FLOATING VARIANT: Bottom-left floating quick-access button
  // ===========================================================================
  if (variant === "floating") {
    return (
      <motion.button
        type="button"
        onClick={toggleTheme}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={`Toggle theme (currently ${theme})`}
        className={`cursor-pointer group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#FFF9EF]/95 dark:bg-[#161622]/95 backdrop-blur-xl border border-[#B88A32]/35 dark:border-[#D4AF62]/40 text-[#2A2118] dark:text-[#F5EFE6] shadow-[0_8px_25px_rgba(42,33,24,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300 ${className}`}
      >
        {/* Glowing Aura Ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#B88A32]/20 to-[#D4AF62]/20 blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />

        <div className="relative flex items-center gap-2">
          {isDark ? (
            <Moon className="w-4 h-4 text-[#D4AF62] transition-transform duration-300 group-hover:-rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-[#B88A32] transition-transform duration-300 group-hover:rotate-45" />
          )}
          <span className="text-xs font-mono tracking-[0.18em] uppercase font-bold text-[#5C4935] dark:text-[#D4AF62]">
            {isDark ? "OBSIDIAN" : "IVORY"}
          </span>
        </div>
      </motion.button>
    );
  }

  // ===========================================================================
  // 3. NAVBAR VARIANT (DEFAULT): Compact icon button in header
  // ===========================================================================
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "Warm Ivory" : "Obsidian Dark"} theme`}
      className={`btn-secondary !p-2.5 rounded-full relative ${className}`}
      title={`Current: ${isDark ? "Obsidian Dark" : "Warm Ivory"} (Click to switch)`}
    >
      {/* Animated icon morph */}
      <motion.div
        key={theme}
        initial={{ rotate: -40, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 40, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF62] group-hover:drop-shadow-[0_0_8px_rgba(212,175,98,0.5)]" />
        ) : (
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#B88A32] group-hover:drop-shadow-[0_0_8px_rgba(184,138,50,0.4)]" />
        )}
      </motion.div>
    </button>
  );
}

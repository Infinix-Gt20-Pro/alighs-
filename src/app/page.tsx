"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ThemeToggle from "@/components/ThemeToggle";
import { useDeviceTier } from "@/hooks/useDeviceTier";

const TheFrameSection = dynamic(() => import("@/components/TheFrameSection"));
const FeaturedShowcase = dynamic(() => import("@/components/FeaturedShowcase"));
const ModelScrollExperience = dynamic(() => import("@/components/ModelScrollExperience"));
const InstagramSection = dynamic(() => import("@/components/InstagramSection"));
const DoctorSection = dynamic(() => import("@/components/DoctorSection"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);
  const { enableBlurOrbs, tier } = useDeviceTier();

  return (
    <>
      {/* Sleek Preloader */}
      <Preloader
        isLoading={showPreloader}
        onComplete={() => setShowPreloader(false)}
      />

      <main className="relative min-h-screen max-w-full overflow-x-hidden bg-[#F4E9D5] dark:bg-[#0A0A0E] text-[#2A2118] dark:text-[#F5EFE6] selection:bg-[#B88A32]/30 selection:text-[#2A2118] dark:selection:text-[#F5EFE6] transition-colors duration-300">
        {/* Warm Ambient Golden Atmosphere - Gated by device tier to avoid heavy GPU compositing on low-end */}
        {enableBlurOrbs && (
          <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
            <div className={`animate-float-1 absolute -top-24 -left-20 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-gradient-to-br from-[#E8D2A8]/35 via-[#D6B878]/20 to-transparent dark:from-[#B88A32]/10 dark:via-[#14141E]/30 ${tier === "MEDIUM" ? "blur-[60px]" : "blur-[120px]"}`} />
            <div className={`animate-float-2 absolute top-1/3 -right-32 w-[400px] sm:w-[650px] h-[400px] sm:h-[650px] rounded-full bg-gradient-to-bl from-[#D4AF62]/20 via-[#B88A32]/10 to-transparent dark:from-[#D4AF62]/10 dark:via-[#0E0E16]/30 ${tier === "MEDIUM" ? "blur-[60px]" : "blur-[130px]"}`} />
            <div className={`animate-float-1 absolute -bottom-32 left-1/4 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-gradient-to-tr from-[#E8D2A8]/30 via-[#B88A32]/10 to-transparent dark:from-[#B88A32]/5 ${tier === "MEDIUM" ? "blur-[60px]" : "blur-[120px]"}`} />
          </div>
        )}

        {/* Navigation Bar */}
        <Navbar />

        {/* 1. IMMERSIVE 3D HERO — Sculpted Vision Fashion Campaign */}
        <HeroSection />

        {/* 1.5 THE FRAME: 18.4g Ultra-Light • Beta Titanium • Precision Fit */}
        <TheFrameSection />

        {/* 2. FEATURED ATELIER SHOWCASE: Signature Eyewear Curation */}
        <FeaturedShowcase />

        {/* 3. EDITORIAL MODEL SCROLL EXPERIENCE */}
        <ModelScrollExperience />

        {/* 4. INSTAGRAM COMMUNITY & REELS SHOWCASE: @aligsware */}
        <InstagramSection />

        {/* 5. DOCTOR SECTION: Dr. Sheeraz Ahmad — AMU-Certified Optometrist */}
        <DoctorSection />

        {/* 6. Luxury Atelier Footer */}
        <Footer />
      </main>

      {/* Global Overlays */}
      <CartDrawer />
      <WhatsAppFloat />

      {/* Floating Theme Switcher Quick Toggle */}
      <div className="fixed bottom-6 left-6 z-40">
        <ThemeToggle variant="floating" />
      </div>
    </>
  );
}

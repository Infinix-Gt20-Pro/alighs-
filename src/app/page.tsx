"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TheFrameSection from "@/components/TheFrameSection";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import ModelScrollExperience from "@/components/ModelScrollExperience";
import InstagramSection from "@/components/InstagramSection";
import DoctorSection from "@/components/DoctorSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      {/* Sleek Preloader */}
      <Preloader
        isLoading={showPreloader}
        onComplete={() => setShowPreloader(false)}
      />

      <main className="relative min-h-screen max-w-full overflow-x-hidden bg-[#F4E9D5] text-[#2A2118] selection:bg-[#B88A32]/30 selection:text-[#2A2118]">
        {/* Warm Ambient Golden Atmosphere */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="animate-float-1 absolute -top-24 -left-20 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-gradient-to-br from-[#E8D2A8]/35 via-[#D6B878]/20 to-transparent blur-[120px]" />
          <div className="animate-float-2 absolute top-1/3 -right-32 w-[400px] sm:w-[650px] h-[400px] sm:h-[650px] rounded-full bg-gradient-to-bl from-[#D4AF62]/20 via-[#B88A32]/10 to-transparent blur-[130px]" />
          <div className="animate-float-1 absolute -bottom-32 left-1/4 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-gradient-to-tr from-[#E8D2A8]/30 via-[#B88A32]/10 to-transparent blur-[120px]" />
        </div>

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
    </>
  );
}

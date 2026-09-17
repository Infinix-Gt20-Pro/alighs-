"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
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

      <main className="relative min-h-screen max-w-full overflow-x-hidden bg-[#FFFDF5] text-[#2A1F14] selection:bg-[#C6A463]/30 selection:text-[#3C2415]">
        {/* Warm Ambient Golden Orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="animate-float-1 absolute -top-24 -left-20 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-gradient-to-br from-[#C6A463]/10 via-[#E8D5B0]/8 to-transparent blur-[100px] sm:blur-[130px]" />
          <div className="animate-float-2 absolute top-1/3 -right-32 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-gradient-to-bl from-[#D4C4A0]/10 via-[#C6A463]/6 to-transparent blur-[100px] sm:blur-[140px]" />
          <div className="animate-float-1 absolute -bottom-32 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#E2C485]/8 via-[#C6A463]/5 to-transparent blur-[100px] sm:blur-[130px]" />
        </div>

        {/* Navigation Bar */}
        <Navbar />

        {/* 1. IMMERSIVE 3D HERO — Scroll-Driven Fashion Campaign */}
        <HeroSection />

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

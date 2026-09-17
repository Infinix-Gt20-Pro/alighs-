"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import ModelScrollExperience from "@/components/ModelScrollExperience";
import LensRevealSection from "@/components/LensRevealSection";
import DoctorSection from "@/components/DoctorSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      {/* Sleek Dark Preloader */}
      <Preloader
        isLoading={showPreloader}
        onComplete={() => setShowPreloader(false)}
      />

      <main className="relative min-h-screen max-w-full overflow-x-hidden bg-[#070709] text-white selection:bg-amber-500/30 selection:text-white">
        {/* Dynamic Ambient Color Orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="animate-float-1 absolute -top-24 -left-20 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-gradient-to-br from-amber-600/15 via-indigo-600/15 to-transparent blur-[100px] sm:blur-[130px]" />
          <div className="animate-float-2 absolute top-1/3 -right-32 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-gradient-to-bl from-purple-600/15 via-amber-600/10 to-transparent blur-[100px] sm:blur-[140px]" />
          <div className="animate-float-1 absolute -bottom-32 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gradient-to-tr from-cyan-600/12 via-emerald-600/10 to-transparent blur-[100px] sm:blur-[130px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        </div>

        {/* Liquid Glass Navigation Bar */}
        <Navbar />

        {/* 1. ENTERPRISE HERO SHOWROOM: 360 Studio, Pantos Beta-Titanium & Cockpit HUD */}
        <HeroSection />

        {/* 2. FEATURED ATELIER SHOWCASE: Signature 3D Eyewear Curation */}
        <FeaturedShowcase />

        {/* 3. 3D EDITORIAL MODEL SCROLL EXPERIENCE: Real Fashion Icons & Motion Capture Reel */}
        <ModelScrollExperience />

        {/* 4. MAGIC LENS: Interactive Optical Clarity Simulation */}
        <LensRevealSection />

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

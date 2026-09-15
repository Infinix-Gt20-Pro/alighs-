"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExplodedSection from "@/components/ExplodedSection";
import LensRevealSection from "@/components/LensRevealSection";
import LeadGenSection from "@/components/LeadGenSection";
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

      <main className="relative min-h-screen bg-[#0a0a0a] text-white selection:bg-cyan-500/30 selection:text-white">
        {/* ======================================================================
            Dynamic Ambient Color Orbs (Reveals the Frosted Glass Blur Effect)
            ====================================================================== */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          {/* Indigo Orb */}
          <div className="animate-float-1 absolute -top-24 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-indigo-600/25 via-blue-600/20 to-transparent blur-[120px]" />
          {/* Purple/Violet Orb */}
          <div className="animate-float-2 absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-600/20 via-pink-600/15 to-transparent blur-[130px]" />
          {/* Emerald/Cyan Orb */}
          <div className="animate-float-1 absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-600/15 via-emerald-600/10 to-transparent blur-[120px]" />
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
        </div>

        {/* ======================================================================
            Frosted Glass Navigation Bar
            ====================================================================== */}
        <Navbar />

        {/* ======================================================================
            1. HERO SECTION: Title, Subtitle, Description & "Find Your Frame"
            ====================================================================== */}
        <HeroSection />

        {/* ======================================================================
            2. 3D SCROLL EXPLODE: Blue-Cut, Ultra-Lightweight, Anti-Glare
            ====================================================================== */}
        <ExplodedSection />

        {/* ======================================================================
            3. MAGIC LENS: Experience Crystal Clarity
            ====================================================================== */}
        <LensRevealSection />

        {/* ======================================================================
            4. LEAD FORM & APP WAITLIST: Perfect Match, Steps, Free Consultation
            ====================================================================== */}
        <LeadGenSection />

        {/* ======================================================================
            5. DOCTOR SECTION: Dr. Sheeraz Ahmad — AMU-Certified Optometrist
            ====================================================================== */}
        <DoctorSection />

        {/* ======================================================================
            Footer
            ====================================================================== */}
        <Footer />
      </main>

      {/* Global Overlays */}
      <CartDrawer />
      <WhatsAppFloat />
    </>
  );
}

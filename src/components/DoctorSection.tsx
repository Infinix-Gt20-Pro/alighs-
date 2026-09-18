// src/components/DoctorSection.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Stethoscope, Eye, Activity, MapPin, MessageCircle, Phone, Sparkles, ShieldCheck } from "lucide-react";

export default function DoctorSection() {
  const services = [
    {
      icon: <Eye className="w-6 h-6 text-[#B88A32]" />,
      title: "Comprehensive Eye Checkup",
      desc: "Advanced refraction assessment and visual acuity profiling.",
    },
    {
      icon: <Activity className="w-6 h-6 text-[#D4AF62]" />,
      title: "Computerized Power Testing",
      desc: "Precise digital refractive measurement and astigmatism correction.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#B88A32]" />,
      title: "Facial Ergonomics & Fitting",
      desc: "Custom pupillary distance (PD) calibration for zero slippage.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#4A3928]" />,
      title: "Lens Coating Consultation",
      desc: "Specialized advice for 420nm blue-cut, progressive & polarized optics.",
    },
  ];

  return (
    <section id="doctor-section" className="w-full pt-16 pb-20 sm:pt-24 sm:pb-28 bg-[#F4E9D5] dark:bg-[#0A0A0E] relative overflow-hidden border-t border-[#B88A32]/20 dark:border-[#B88A32]/30 transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#D4AF62]/20 via-[#B88A32]/10 to-transparent dark:from-[#D4AF62]/10 dark:via-[#B88A32]/5 rounded-full blur-[130px] -translate-y-1/2" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-gradient-to-tl from-[#E8D2A8]/30 via-[#D6B878]/15 to-transparent dark:from-[#B88A32]/10 dark:via-transparent rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header: THE CLINICAL SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-[10px] sm:text-xs font-mono tracking-[0.28em] text-[#B88A32] dark:text-[#D4AF62] uppercase font-bold mb-3 sm:mb-4 shadow-sm">
            <Stethoscope className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
            <span>OPTOMETRIC HERITAGE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#2A2118] dark:text-[#F5EFE6] font-cinzel tracking-[0.14em] uppercase mb-3 sm:mb-4 drop-shadow-sm">
            THE CLINICAL SIDE
          </h2>

          <p className="text-sm sm:text-lg text-[#4A3928] dark:text-[#D5C7B5] font-cormorant italic max-w-2xl mx-auto leading-relaxed">
            Where Japanese Beta-Titanium design meets clinical optometry certified by Aligarh Muslim University.
          </p>
        </motion.div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Doctor Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 sm:p-9 rounded-3xl sm:rounded-[36px] border-2 border-[#B88A32]/35 dark:border-[#B88A32]/50 bg-[#FFF9EF] dark:bg-[#12121A] flex flex-col h-full shadow-[0_15px_45px_rgba(42,33,24,0.08)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.6)] relative overflow-hidden transition-colors duration-300"
          >
            {/* Top Identity Block: Dr. Sheeraz Ahmad */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 mb-6 pb-6 border-b border-[#B88A32]/20 dark:border-[#B88A32]/30">
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-gradient-to-br from-[#F4E9D5] to-[#E8D2A8] dark:from-[#1A1A28] dark:to-[#12121D] border border-[#B88A32]/30 dark:border-[#B88A32]/40 flex items-center justify-center relative overflow-hidden shadow-sm">
                <Stethoscope className="w-9 h-9 sm:w-11 sm:h-11 text-[#B88A32] dark:text-[#D4AF62] relative z-10 drop-shadow-sm" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#2A2118] dark:text-[#F5EFE6] font-cinzel mb-1 tracking-tight">
                  Dr. Sheeraz Ahmad
                </h3>

                <p className="text-sm sm:text-base font-cormorant italic font-bold text-[#B88A32] dark:text-[#D4AF62] leading-snug mb-3">
                  AMU-Certified Optometrist<br />
                  &amp; Eye Care Specialist
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold text-[#2A2118] dark:text-[#EAE0D5] bg-[#F4E9D5] dark:bg-[#1C1C2A] border border-[#B88A32]/30 dark:border-[#B88A32]/40">
                    AMU Optometry
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold text-[#2A2118] dark:text-[#EAE0D5] bg-[#F4E9D5] dark:bg-[#1C1C2A] border border-[#B88A32]/30 dark:border-[#B88A32]/40">
                    MBBS
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold text-[#2A2118] dark:text-[#EAE0D5] bg-[#F4E9D5] dark:bg-[#1C1C2A] border border-[#B88A32]/30 dark:border-[#B88A32]/40">
                    DOMS
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#4A3928] dark:text-[#D5C7B5] leading-relaxed mb-6 flex-1">
              With extensive clinical experience at Aligarh Muslim University (AMU), Dr. Sheeraz Ahmad personally inspects and calibrates every ALIG&apos;S WARE frame. We bridge Firozabad&apos;s celebrated artisanal glassmaking heritage with strict optical diagnostic standards.
            </p>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#4A3928] dark:text-[#D5C7B5] mb-6 p-4 rounded-2xl bg-[#F4E9D5]/80 dark:bg-[#161622] border border-[#B88A32]/25 dark:border-[#B88A32]/35">
              <MapPin className="w-5 h-5 text-[#B88A32] dark:text-[#D4AF62] shrink-0" />
              <span className="font-mono text-xs text-[#2A2118] dark:text-[#F5EFE6]">
                ALIG&apos;S WARE Flagship Clinic, Firozabad, Uttar Pradesh
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-auto">
              <a
                href="tel:+917217371499"
                className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#F4E9D5] dark:bg-[#1A1A26] hover:bg-white dark:hover:bg-[#252538] text-[#2A2118] dark:text-[#F5EFE6] font-bold text-xs font-mono uppercase tracking-wider transition-all border border-[#B88A32]/30 dark:border-[#B88A32]/40 shadow-sm active:scale-95"
              >
                <Phone className="w-4 h-4 text-[#B88A32] dark:text-[#D4AF62]" />
                Call Clinic
              </a>
              <a
                href="https://wa.me/917217371499?text=I'd%20like%20to%20book%20a%20consultation%20with%20Dr.%20Sheeraz%20Ahmad"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Direct
              </a>
            </div>
          </motion.div>

          {/* Right Column: Clinical Capabilities & Book Try-on */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col h-full gap-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl border border-[#B88A32]/25 dark:border-[#B88A32]/30 bg-[#FFF9EF]/90 dark:bg-[#12121A] hover:bg-[#FFF9EF] dark:hover:bg-[#161622] hover:border-[#B88A32]/60 dark:hover:border-[#B88A32]/60 transition-all shadow-[0_8px_30px_rgba(42,33,24,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_35px_rgba(184,138,50,0.12)] group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F4E9D5] dark:bg-[#1C1C2A] border border-[#B88A32]/30 dark:border-[#B88A32]/40 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#2A2118] dark:text-[#F5EFE6] mb-1.5">
                    {service.title}
                  </h4>
                  <p className="text-xs text-[#4A3928] dark:text-[#D5C7B5] leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/appointment"
              className="w-full py-4 rounded-full text-center font-bold text-xs sm:text-sm font-mono tracking-[0.16em] uppercase text-white bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] hover:brightness-105 transition-all shadow-[0_6px_25px_rgba(184,138,50,0.35)] active:scale-98"
            >
              BOOK CLINICAL TRY-ON &amp; CONSULTATION
            </Link>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

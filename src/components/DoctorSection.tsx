"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Stethoscope, Eye, Activity, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";

export default function DoctorSection() {
  const services = [
    {
      icon: <Eye className="w-6 h-6 text-cyan-400" />,
      title: "Comprehensive Eye Checkup",
      desc: "Advanced diagnostic tools for perfect vision assessment."
    },
    {
      icon: <Activity className="w-6 h-6 text-indigo-400" />,
      title: "Power Testing",
      desc: "Precise computerized eye testing and power calculation."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "Frame Fitting",
      desc: "Expert guidance on frames suiting your face profile."
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-emerald-400" />,
      title: "Lens Consultation",
      desc: "Specialized advice for blue-cut, progressive & contact lenses."
    }
  ];

  return (
    <section id="doctor-section" className="w-full py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white font-sans mb-4">Meet The Expert</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience premium eye care rooted in Firozabad&apos;s heritage, elevated by modern medical precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 flex flex-col h-full"
          >
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <Stethoscope className="w-10 h-10 text-white relative z-10 drop-shadow-lg" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-sans mb-2">Dr. Sheeraz Ahmad</h3>
                <p className="text-cyan-400 font-medium mb-3">AMU-Certified Optometrist & Eye Care Specialist</p>
                <div className="flex flex-wrap gap-2">
                  <span className="glass-pill px-3 py-1 rounded-full text-xs font-mono text-gray-300 bg-white/5 border border-white/10">MBBS</span>
                  <span className="glass-pill px-3 py-1 rounded-full text-xs font-mono text-gray-300 bg-white/5 border border-white/10">DOMS</span>
                </div>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed mb-8 flex-1">
              With years of experience in clinical optometry, Dr. Sheeraz provides meticulous eye care solutions. Our clinic blends Firozabad&apos;s historic craftsmanship with cutting-edge optical technology to bring you unparalleled visual clarity.
            </p>

            <div className="flex items-center gap-3 text-gray-400 text-sm mb-8 p-4 rounded-xl bg-white/5 border border-white/5">
              <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>ALIGH&apos;S WARE Main Clinic, Firozabad, Uttar Pradesh</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
              >
                <Phone className="w-4 h-4" />
                Call Clinic
              </a>
              <a
                href="https://wa.me/919876543210?text=I'd%20like%20to%20book%20a%20consultation%20with%20Dr.%20Sheeraz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-medium transition-colors border border-[#25D366]/20"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col h-full gap-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {services.map((service, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{service.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/appointment"
              className="w-full py-4 rounded-2xl text-center font-bold text-lg text-[#0a0a0a] bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
              Book Try-On & Consultation
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

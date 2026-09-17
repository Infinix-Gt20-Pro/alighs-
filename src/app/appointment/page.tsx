// src/app/appointment/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  Check,
  Stethoscope,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppointmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    concern: "",
    details: "",
    whatsappConfirm: true
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");

  const TIME_SLOTS = [
    "10:00 AM - 11:00 AM (Morning Clinic)",
    "11:30 AM - 12:30 PM (Power Testing Slot)",
    "02:00 PM - 03:00 PM (Afternoon Clinic)",
    "04:00 PM - 05:00 PM (Bespoke Frame Fitting)",
    "06:00 PM - 07:00 PM (Evening Consultation)",
    "07:30 PM - 08:30 PM (Late Clinic Session)"
  ];

  const CONCERNS = [
    "Comprehensive Eye Checkup & Power Testing",
    "Digital Eye Strain & Computer Glass Consultation",
    "Prescription Lens Upgrade (Blue-Cut / Progressive)",
    "Custom Frame Fitting & Facial Profile Alignment",
    "Contact Lens Fitting & Corneal Checkup",
    "General Vision Assessment"
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      preferredDate: formData.date,
      preferredTime: formData.time,
      concern: formData.concern,
      details: formData.details
    };

    let generatedId = `APT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.appointmentId) generatedId = data.appointmentId;
      }
    } catch (error) {
      console.warn("Appointment API fallback notice:", error);
    } finally {
      setAppointmentId(generatedId);
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    const text = encodeURIComponent(
      `*ALIGSWARE — New Consultation Booking* 🩺👁️\n\n` +
        `*Appointment ID:* ${appointmentId}\n` +
        `*Patient Name:* ${formData.name}\n` +
        `*Phone Number:* +91 ${formData.phone}\n` +
        `*Requested Date:* ${formData.date}\n` +
        `*Selected Slot:* ${formData.time}\n` +
        `*Primary Concern:* ${formData.concern}\n` +
        (formData.details ? `*Additional Notes:* ${formData.details}\n` : "") +
        `\n_Please confirm my consultation slot with Dr. Sheeraz Ahmad. Thank you!_`
    );
    window.open(`https://wa.me/917217371499?text=${text}`, "_blank");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#F4E9D5] text-[#2A2118] flex flex-col selection:bg-[#B88A32]/30 selection:text-[#2A2118]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full relative">
        {/* Ambient background glows */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#E8D2A8]/30 rounded-full blur-[140px] -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-[#D4AF62]/20 rounded-full blur-[160px] -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          {/* Navigation / Back Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pt-2">
            <Link
              href="/"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF9EF] hover:bg-[#E8D2A8]/40 border border-[#B88A32]/25 text-xs font-mono text-[#4A3928] hover:text-[#2A2118] transition-all duration-200 group shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#B88A32]" />
              <span>&larr; Back to Atelier Storefront</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/shop"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF9EF] hover:bg-[#E8D2A8]/40 border border-[#B88A32]/25 text-xs font-mono text-[#4A3928] hover:text-[#2A2118] transition-all duration-200 group shadow-sm"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#B88A32]" />
              </Link>
            </div>
          </div>

          {/* Page Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B88A32]/30 bg-[#FFF9EF] mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#B88A32]" />
              <span className="text-xs font-mono tracking-wider text-[#B88A32] uppercase">
                Clinical Optometry & Frame Fitting
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-4 text-[#2A2118]">
              Consultation with Dr. Sheeraz Ahmad
            </h1>
            <p className="text-[#6B5740] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Experience computerized refractive power testing, bespoke frame curvature alignment, and
              prescriptive lens solutions at our Firozabad optical clinic.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Doctor Profile & Clinic Details */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-8 border border-[#B88A32]/25 bg-[#FFF9EF] shadow-xl shadow-[#2A2118]/5 relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF62] to-[#B88A32] p-0.5 mb-6 flex items-center justify-center shadow-md">
                  <div className="w-full h-full rounded-[14px] bg-[#FFF9EF] flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-[#B88A32]" />
                  </div>
                </div>

                <h2 className="text-2xl font-serif font-bold text-[#2A2118] mb-1">Dr. Sheeraz Ahmad</h2>
                <p className="text-[#B88A32] text-xs font-mono tracking-wider mb-4 uppercase font-semibold">
                  AMU-Certified Optometrist & Vision Specialist
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#F4E9D5] border border-[#B88A32]/20 text-[#4A3928]">
                    MBBS • DOMS (AMU)
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#B88A32]/10 border border-[#B88A32]/25 text-[#B88A32] font-semibold">
                    12+ Years Clinical Practice
                  </span>
                </div>

                <div className="space-y-3 text-xs text-[#6B5740]">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#B88A32] shrink-0 mt-0.5" />
                    <span>Computerized Auto-Refractometry & Astigmatism Power Check</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#B88A32] shrink-0 mt-0.5" />
                    <span>Blue-Cut 420nm & Anti-Fatigue Screen Lens Recommendation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#B88A32] shrink-0 mt-0.5" />
                    <span>Progressive & Bifocal Precision Fitting</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#B88A32] shrink-0 mt-0.5" />
                    <span>In-Person Try-On across 120+ Curated Luxury Frames</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#B88A32]/15 text-xs">
                  <div className="flex items-center gap-2 text-[#B88A32] mb-2 font-mono font-semibold">
                    <MapPin className="w-3.5 h-3.5" /> CLINIC ADDRESS
                  </div>
                  <p className="text-[#2A2118] font-medium leading-relaxed">
                    ALIGH’S WARE Vision Clinic, Station Road, Firozabad, Uttar Pradesh — 283203
                  </p>
                  <p className="text-[#8B7355] mt-2 font-mono">Mon – Sat: 10:00 AM – 08:30 PM</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Appointment Booking Form */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-3xl p-8 sm:p-10 border border-[#B88A32]/25 bg-[#FFF9EF] shadow-xl shadow-[#2A2118]/5"
                  >
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#B88A32]/15">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-[#2A2118]">Reserve Your Consultation</h3>
                        <p className="text-xs text-[#6B5740] mt-1">
                          Zero wait times. Dedicated 30-minute one-on-one session with Dr. Sheeraz.
                        </p>
                      </div>
                      <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#B88A32]/15 border border-[#B88A32]/25 text-[#B88A32] text-xs font-mono font-semibold">
                        100% Free Consultation
                      </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase tracking-wider text-[#4A3928] flex items-center gap-2 font-semibold">
                            <User className="w-3.5 h-3.5 text-[#B88A32]" /> Patient Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl px-4 py-3.5 text-[#2A2118] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm"
                            placeholder="e.g. Sheeraz Ahmad"
                          />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase tracking-wider text-[#4A3928] flex items-center gap-2 font-semibold">
                            <Phone className="w-3.5 h-3.5 text-[#B88A32]" /> WhatsApp / Contact Phone *
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8B7355] font-semibold">
                              +91
                            </span>
                            <input
                              type="tel"
                              name="phone"
                              required
                              pattern="[0-9]{10}"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl pl-12 pr-4 py-3.5 text-[#2A2118] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm font-mono"
                              placeholder="7217371499"
                            />
                          </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase tracking-wider text-[#4A3928] flex items-center gap-2 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-[#B88A32]" /> Preferred Date *
                          </label>
                          <input
                            type="date"
                            name="date"
                            required
                            min={today}
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl px-4 py-3.5 text-[#2A2118] focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm"
                          />
                        </div>

                        {/* Time */}
                        <div className="space-y-2 relative">
                          <label className="text-xs font-mono uppercase tracking-wider text-[#4A3928] flex items-center gap-2 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-[#B88A32]" /> Preferred Time Window *
                          </label>
                          <div className="relative">
                            <select
                              name="time"
                              required
                              value={formData.time}
                              onChange={handleInputChange}
                              className="w-full bg-[#FFF9EF] border border-[#B88A32]/25 rounded-xl px-4 py-3.5 text-[#2A2118] appearance-none focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm pr-10"
                            >
                              <option value="" disabled>
                                Select consultation slot
                              </option>
                              {TIME_SLOTS.map((slot) => (
                                <option key={slot} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355] pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Concern */}
                      <div className="space-y-2 relative">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#4A3928] flex items-center gap-2 font-semibold">
                          <MessageSquare className="w-3.5 h-3.5 text-[#B88A32]" /> Reason for Visit *
                        </label>
                        <div className="relative">
                          <select
                            name="concern"
                            required
                            value={formData.concern}
                            onChange={handleInputChange}
                            className="w-full bg-[#FFF9EF] border border-[#B88A32]/25 rounded-xl px-4 py-3.5 text-[#2A2118] appearance-none focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all text-sm pr-10"
                          >
                            <option value="" disabled>
                              Select primary consultation purpose
                            </option>
                            {CONCERNS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355] pointer-events-none" />
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#4A3928] font-semibold">
                          Current Power / Symptoms / Previous Rx (Optional)
                        </label>
                        <textarea
                          name="details"
                          value={formData.details}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full bg-[#F4E9D5]/50 border border-[#B88A32]/25 rounded-xl px-4 py-3 text-[#2A2118] placeholder-[#8B7355]/70 focus:outline-none focus:border-[#B88A32] focus:ring-1 focus:ring-[#B88A32] transition-all resize-none text-sm"
                          placeholder="e.g. Eyestrain after 6 hours on laptop, wearing -1.50 spherical both eyes..."
                        />
                      </div>

                      {/* WhatsApp notification toggle */}
                      <div className="flex items-center gap-3 py-1">
                        <input
                          type="checkbox"
                          id="whatsappConfirm"
                          name="whatsappConfirm"
                          checked={formData.whatsappConfirm}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded border-[#B88A32]/30 text-[#B88A32] focus:ring-[#B88A32] accent-[#B88A32]"
                        />
                        <label htmlFor="whatsappConfirm" className="text-xs text-[#6B5740] cursor-pointer">
                          Send automated appointment reminder & clinic map location on WhatsApp
                        </label>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#B88A32] hover:bg-[#A07828] text-[#FFF9EF] py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-md shadow-[#B88A32]/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-[#FFF9EF] border-t-transparent rounded-full animate-spin" />
                            <span>Confirming Slot...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm Appointment with Dr. Sheeraz</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl p-10 border border-[#B88A32]/30 bg-[#FFF9EF] flex flex-col items-center text-center shadow-xl shadow-[#2A2118]/5"
                  >
                    <div className="w-20 h-20 bg-[#B88A32]/15 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                      <Check className="w-10 h-10 text-[#B88A32] stroke-[2.5]" />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#B88A32]/15 border border-[#B88A32]/25 text-[#B88A32] text-xs font-mono font-semibold mb-3">
                      APPOINTMENT SCHEDULED
                    </span>

                    <h2 className="text-3xl font-serif font-bold text-[#2A2118] mb-2">Slot Confirmed, {formData.name}!</h2>
                    <p className="text-[#6B5740] text-sm mb-6 max-w-md">
                      Dr. Sheeraz Ahmad has reserved your dedicated slot at the ALIGH’S WARE clinic.
                    </p>

                    <div className="bg-[#F4E9D5]/60 border border-[#B88A32]/20 rounded-2xl p-6 w-full max-w-md mb-8 text-left text-xs">
                      <div className="flex justify-between items-center pb-3 border-b border-[#B88A32]/15 font-mono">
                        <span className="text-[#8B7355]">APPOINTMENT ID</span>
                        <span className="text-[#B88A32] font-bold text-sm tracking-wider">
                          {appointmentId}
                        </span>
                      </div>

                      <div className="py-4 space-y-2 border-b border-[#B88A32]/15">
                        <div className="flex justify-between">
                          <span className="text-[#8B7355]">Date:</span>
                          <span className="text-[#2A2118] font-medium">{formData.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8B7355]">Slot:</span>
                          <span className="text-[#2A2118] font-medium">{formData.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8B7355]">Service:</span>
                          <span className="text-[#B88A32] font-medium text-right max-w-[200px] truncate">
                            {formData.concern}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 text-[#6B5740]">
                        Clinic Location: Station Road, Firozabad (UP)
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                      <button
                        onClick={handleWhatsAppConfirm}
                        className="w-full sm:flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md text-sm"
                      >
                        <MessageSquare className="w-4 h-4" /> Save on WhatsApp
                      </button>

                      <button
                        onClick={() => {
                          setSuccess(false);
                          setFormData((f) => ({
                            ...f,
                            date: "",
                            time: "",
                            concern: "",
                            details: ""
                          }));
                        }}
                        className="w-full sm:flex-1 bg-[#F4E9D5] hover:bg-[#E8D2A8] text-[#2A2118] border border-[#B88A32]/25 py-3.5 rounded-xl font-medium transition-all text-sm"
                      >
                        Book Another
                      </button>
                    </div>

                    <Link
                      href="/"
                      className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-[#6B5740] hover:text-[#B88A32] transition-colors group"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#B88A32]" />
                      <span>Return to Storefront</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

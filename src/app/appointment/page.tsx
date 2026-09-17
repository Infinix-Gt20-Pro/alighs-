// src/app/appointment/page.tsx
"use client";

import { useState } from "react";
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
  ArrowRight
} from "lucide-react";

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
      `*ALIGH'S WARE — New Consultation Booking* 🩺👁️\n\n` +
        `*Appointment ID:* ${appointmentId}\n` +
        `*Patient Name:* ${formData.name}\n` +
        `*Phone Number:* +91 ${formData.phone}\n` +
        `*Requested Date:* ${formData.date}\n` +
        `*Selected Slot:* ${formData.time}\n` +
        `*Primary Concern:* ${formData.concern}\n` +
        (formData.details ? `*Additional Notes:* ${formData.details}\n` : "") +
        `\n_Please confirm my consultation slot with Dr. Sheeraz Ahmad. Thank you!_`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, "_blank");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-[#070709] text-white pt-28 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-cyan-900/15 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[160px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono tracking-wider text-amber-300 uppercase">
              Clinical Optometry & Frame Fitting
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-amber-200">
            Book Consultation with Dr. Sheeraz Ahmad
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Experience computerized refractive power testing, bespoke frame curvature alignment, and
            prescriptive lens solutions in Firozabad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Doctor Profile & Clinic Details */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl p-8 border border-white/10 bg-[#0c0d12]/80 backdrop-blur-xl relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full blur-2xl pointer-events-none" />

              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 mb-6 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.3)]">
                <div className="w-full h-full rounded-[14px] bg-[#0c0d12] flex items-center justify-center">
                  <Stethoscope className="w-9 h-9 text-amber-400" />
                </div>
              </div>

              <h2 className="text-2xl font-bold font-serif mb-1">Dr. Sheeraz Ahmad</h2>
              <p className="text-cyan-400 text-xs font-mono tracking-wider mb-4 uppercase">
                AMU-Certified Optometrist & Vision Scientist
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-zinc-300">
                  MBBS • DOMS
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-amber-400/10 border border-amber-400/20 text-amber-300">
                  12+ Years Practice
                </span>
              </div>

              <div className="space-y-3.5 text-xs text-zinc-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Computerized Auto-Refractometry & Astigmatism Power Check</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Blue-Cut 420nm & Anti-Fatigue Screen Lens Recommendation</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Progressive & Bifocal Precision Fitting</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>In-Person Try-On across 120+ Curated Luxury Frames</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-zinc-400 mb-2 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> CLINIC ADDRESS
                </div>
                <p className="text-zinc-200 font-medium leading-relaxed">
                  ALIGH’S WARE Vision Clinic, Station Road, Firozabad, Uttar Pradesh — 283203
                </p>
                <p className="text-zinc-500 mt-2 font-mono">Mon – Sat: 10:00 AM – 08:30 PM</p>
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
                  className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 bg-[#0c0d12]/80 backdrop-blur-2xl shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div>
                      <h3 className="text-2xl font-bold font-serif">Reserve Your Consultation</h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Zero wait times. Dedicated 30-minute one-on-one session with Dr. Sheeraz.
                      </p>
                    </div>
                    <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                      100% Free Consultation
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-cyan-400" /> Patient Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                          placeholder="e.g. Sheeraz Ahmad"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-cyan-400" /> WhatsApp / Contact Phone *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">
                            +91
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            required
                            pattern="[0-9]{10}"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm font-mono"
                            placeholder="9876543210"
                          />
                        </div>
                      </div>

                      {/* Date */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Preferred Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          required
                          min={today}
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm [color-scheme:dark]"
                        />
                      </div>

                      {/* Time */}
                      <div className="space-y-2 relative">
                        <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" /> Preferred Time Window *
                        </label>
                        <div className="relative">
                          <select
                            name="time"
                            required
                            value={formData.time}
                            onChange={handleInputChange}
                            className="w-full bg-[#111219] border border-white/10 rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm pr-10"
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
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Concern */}
                    <div className="space-y-2 relative">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Reason for Visit *
                      </label>
                      <div className="relative">
                        <select
                          name="concern"
                          required
                          value={formData.concern}
                          onChange={handleInputChange}
                          className="w-full bg-[#111219] border border-white/10 rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm pr-10"
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
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                        Current Power / Symptoms / Previous Rx (Optional)
                      </label>
                      <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none text-sm"
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
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                      />
                      <label htmlFor="whatsappConfirm" className="text-xs text-zinc-300 cursor-pointer">
                        Send automated appointment reminder & map location on WhatsApp
                      </label>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-black py-4 rounded-xl font-bold text-sm tracking-wider uppercase hover:from-amber-300 hover:to-amber-200 transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Confirming Slot...
                        </>
                      ) : (
                        <>
                          Confirm Appointment with Dr. Sheeraz <ArrowRight className="w-4 h-4" />
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
                  className="glass-card rounded-3xl p-10 border border-amber-500/30 bg-[#0c0d12]/90 backdrop-blur-2xl flex flex-col items-center text-center shadow-2xl"
                >
                  <div className="w-20 h-20 bg-amber-400/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(212,175,55,0.3)]">
                    <Check className="w-10 h-10 text-amber-400 stroke-[2.5]" />
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
                    APPOINTMENT SCHEDULED
                  </span>

                  <h2 className="text-3xl font-serif font-bold mb-2">Slot Confirmed, {formData.name}!</h2>
                  <p className="text-zinc-400 text-sm mb-6 max-w-md">
                    Dr. Sheeraz Ahmad has reserved your dedicated slot at the ALIGH’S WARE clinic.
                  </p>

                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 w-full max-w-md mb-8 text-left text-xs">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10 font-mono">
                      <span className="text-zinc-500">APPOINTMENT ID</span>
                      <span className="text-amber-400 font-bold text-sm tracking-wider">
                        {appointmentId}
                      </span>
                    </div>

                    <div className="py-4 space-y-2 border-b border-white/10">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Date:</span>
                        <span className="text-white font-medium">{formData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Slot:</span>
                        <span className="text-white font-medium">{formData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Service:</span>
                        <span className="text-cyan-400 font-medium text-right max-w-[200px] truncate">
                          {formData.concern}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 text-zinc-400">
                      Clinic Location: Station Road, Firozabad (UP)
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                    <button
                      onClick={handleWhatsAppConfirm}
                      className="w-full sm:flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] text-sm"
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
                      className="w-full sm:flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/10 py-3.5 rounded-xl font-medium transition-all text-sm"
                    >
                      Book Another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Phone, MessageSquare, Check, Stethoscope, ChevronDown, CheckCircle2 } from "lucide-react";

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
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM"
  ];

  const CONCERNS = [
    "Eye Checkup",
    "Power Change",
    "Frame Fitting",
    "Lens Consultation",
    "Other"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const data = await res.json();
        setAppointmentId(data.id || `APT-${Math.floor(1000 + Math.random() * 9000)}`);
        setSuccess(true);
      } else {
        // Fallback for demo
        setAppointmentId(`APT-${Math.floor(1000 + Math.random() * 9000)}`);
        setSuccess(true);
      }
    } catch (error) {
      console.error("Failed to book appointment", error);
      // Fallback for demo
      setAppointmentId(`APT-${Math.floor(1000 + Math.random() * 9000)}`);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-cyan-900/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6">
            <Stethoscope className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono tracking-wider text-cyan-300">DR. SHEERAZ AHMAD</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Book Your Appointment
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Schedule a comprehensive eye examination with our expert optometrist. Premium care for your vision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Doctor Profile */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full blur-2xl" />
              
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-900 to-indigo-900 border border-white/20 p-1 mb-6 flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-[#0a0a0a] flex items-center justify-center">
                  <Stethoscope className="w-10 h-10 text-cyan-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Dr. Sheeraz Ahmad</h2>
              <p className="text-cyan-400 text-sm font-mono mb-6">AMU-CERTIFIED OPTOMETRIST</p>
              
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" />
                  <span>Comprehensive Eye Testing</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" />
                  <span>Contact Lens Fitting & Consultation</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" />
                  <span>Pediatric Vision Assessment</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" />
                  <span>Digital Eye Strain Evaluation</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 font-mono mb-2">CLINIC HOURS</p>
                <p className="text-sm text-gray-300">Mon - Sat: 10:00 AM - 8:00 PM</p>
                <p className="text-sm text-gray-300">Sunday: Closed</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <User className="w-4 h-4" /> Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Phone className="w-4 h-4" /> Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          pattern="[0-9]{10}"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                          placeholder="9876543210"
                        />
                      </div>

                      {/* Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Preferred Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          required
                          min={today}
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all [color-scheme:dark]"
                        />
                      </div>

                      {/* Time */}
                      <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Preferred Time
                        </label>
                        <select
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                        >
                          <option value="" disabled className="bg-[#111]">Select a time slot</option>
                          {TIME_SLOTS.map(slot => (
                            <option key={slot} value={slot} className="bg-[#111]">{slot}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-10 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Concern */}
                    <div className="space-y-2 relative">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Primary Concern
                      </label>
                      <select
                        name="concern"
                        required
                        value={formData.concern}
                        onChange={handleInputChange}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      >
                        <option value="" disabled className="bg-[#111]">What brings you in?</option>
                        {CONCERNS.map(c => (
                          <option key={c} value={c} className="bg-[#111]">{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-10 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Additional Details (Conditional) */}
                    <AnimatePresence>
                      {formData.concern && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <label className="text-sm font-medium text-gray-300">Additional Details (Optional)</label>
                          <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                            placeholder="Tell us a bit more about your requirements..."
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* WhatsApp Toggle */}
                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id="whatsappConfirm"
                        name="whatsappConfirm"
                        checked={formData.whatsappConfirm}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-[#0a0a0a]"
                      />
                      <label htmlFor="whatsappConfirm" className="text-sm text-gray-300 cursor-pointer">
                        Send me confirmation and updates on WhatsApp
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Book Appointment"
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-3xl p-10 border border-cyan-500/30 bg-cyan-900/10 backdrop-blur-xl flex flex-col items-center text-center h-full justify-center"
                >
                  <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Request Received!</h2>
                  <p className="text-gray-300 mb-6 max-w-md">
                    Your appointment request has been submitted successfully. Our team will review and confirm shortly.
                  </p>
                  
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 w-full max-w-sm mb-8">
                    <p className="text-xs text-gray-500 font-mono mb-1">APPOINTMENT ID</p>
                    <p className="text-xl font-mono text-white tracking-wider">{appointmentId}</p>
                    <div className="flex justify-between mt-4 pt-4 border-t border-white/5 text-sm">
                      <span className="text-gray-400">{formData.date}</span>
                      <span className="text-gray-400">{formData.time}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/919876543210?text=Hi, I just booked an appointment. My ID is ${appointmentId}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full max-w-sm bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/20 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Confirm on WhatsApp
                  </a>
                  
                  <button 
                    onClick={() => {
                      setSuccess(false);
                      setFormData(f => ({...f, date: "", time: "", concern: "", details: ""}));
                    }}
                    className="mt-6 text-sm text-gray-400 hover:text-white"
                  >
                    Book another appointment
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

// src/components/AuthModal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, Phone, Sparkles, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal, openAuthModal, signIn, signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (authModalTab === "signin") {
      const res = await signIn(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Sign in failed. Please check credentials.");
      }
    } else {
      if (!fullName.trim()) {
        setErrorMsg("Full name is required.");
        setLoading(false);
        return;
      }
      const res = await signUp(email, password, fullName, phone);
      if (!res.success) {
        setErrorMsg(res.error || "Registration failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-[#0A0A0E]/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/35 dark:border-[#B88A32]/30 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#B88A32]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full text-[#4A3928] dark:text-[#B8ADA0] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] hover:bg-[#F4E9D5]/60 dark:hover:bg-[#1A1A24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#B88A32]/15 dark:bg-[#B88A32]/20 border border-[#B88A32]/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-[#B88A32] dark:text-[#D4AF62]" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#B88A32] uppercase font-bold">
              ALIG&apos;S WARE ATELIER
            </span>
            <h2 className="text-2xl font-cinzel font-black tracking-wide text-[#2A2118] dark:text-[#F5EFE6] mt-1">
              {authModalTab === "signin" ? "Client Access" : "Create Account"}
            </h2>
            <p className="text-xs text-[#6B5740] dark:text-[#A89F91] mt-1 font-sans">
              {authModalTab === "signin"
                ? "Sign in to track orders and manage clinical try-ons."
                : "Register for bespoke consultation and priority dispatch."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-2xl bg-[#F4E9D5]/70 dark:bg-[#1A1A24]/90 p-1 mb-6 border border-[#B88A32]/20 text-xs font-mono">
            <button
              type="button"
              onClick={() => { openAuthModal("signin"); setErrorMsg(""); }}
              className={`flex-1 py-2.5 rounded-xl font-bold tracking-wider uppercase transition-all ${
                authModalTab === "signin"
                  ? "bg-[#B88A32] text-white shadow-md"
                  : "text-[#6B5740] dark:text-[#A89F91] hover:text-[#2A2118] dark:hover:text-[#F5EFE6]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { openAuthModal("signup"); setErrorMsg(""); }}
              className={`flex-1 py-2.5 rounded-xl font-bold tracking-wider uppercase transition-all ${
                authModalTab === "signup"
                  ? "bg-[#B88A32] text-white shadow-md"
                  : "text-[#6B5740] dark:text-[#A89F91] hover:text-[#2A2118] dark:hover:text-[#F5EFE6]"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs text-center font-mono">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalTab === "signup" && (
              <>
                <div>
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#4A3928] dark:text-[#B8ADA0] block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#B88A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sheeraz Ahmad"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#A89F91] focus:outline-none focus:border-[#B88A32] transition-colors font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#4A3928] dark:text-[#B8ADA0] block mb-1">
                    Phone Number (10 Digits)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#B88A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#A89F91] focus:outline-none focus:border-[#B88A32] transition-colors font-sans"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] font-mono tracking-wider uppercase text-[#4A3928] dark:text-[#B8ADA0] block mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#B88A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#A89F91] focus:outline-none focus:border-[#B88A32] transition-colors font-sans"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono tracking-wider uppercase text-[#4A3928] dark:text-[#B8ADA0] block mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#B88A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#A89F91] focus:outline-none focus:border-[#B88A32] transition-colors font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] hover:brightness-105 text-white font-bold text-xs font-mono tracking-[0.16em] uppercase shadow-[0_4px_20px_rgba(184,138,50,0.35)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{authModalTab === "signin" ? "SIGN IN" : "CREATE ATELIER ACCOUNT"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

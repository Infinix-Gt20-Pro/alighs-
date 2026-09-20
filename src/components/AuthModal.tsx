// src/components/AuthModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  RotateCw,
} from "lucide-react";
import { useAuth, AuthModalTab } from "@/context/AuthContext";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    openAuthModal,
    signIn,
    signUp,
    verifyEmail,
    resendVerificationEmail,
    sendResetPasswordEmail,
    resetPassword,
    signInWithGoogle,
  } = useAuth();

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Verification & Forgot Password States
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [requiresVerificationPrompt, setRequiresVerificationPrompt] = useState(false);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  const resetFeedback = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setRequiresVerificationPrompt(false);
  };

  const handleTabSwitch = (tab: AuthModalTab) => {
    resetFeedback();
    openAuthModal(tab);
    if (tab === "forgot") {
      setForgotStep(1);
    }
  };

  // Google OAuth
  const handleGoogleSignIn = async () => {
    resetFeedback();
    setGoogleLoading(true);
    const res = await signInWithGoogle();
    if (!res.success) {
      setErrorMsg(res.error || "Google sign in failed.");
      setGoogleLoading(false);
    }
  };

  // Sign In / Sign Up Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFeedback();
    setLoading(true);

    if (authModalTab === "signin") {
      const res = await signIn(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Sign in failed. Please check credentials.");
        if (res.requireVerification) {
          setRequiresVerificationPrompt(true);
        }
      }
    } else if (authModalTab === "signup") {
      if (!fullName.trim()) {
        setErrorMsg("Full name is required.");
        setLoading(false);
        return;
      }
      const res = await signUp(email, password, fullName, phone);
      if (!res.success) {
        setErrorMsg(res.error || "Registration failed. Please try again.");
      } else if (res.requireVerification) {
        setSuccessMsg("Account created! A 6-digit verification code has been sent to your email.");
        setResendCooldown(60);
        openAuthModal("verify");
      }
    }
    setLoading(false);
  };

  // Email Verification Submit
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFeedback();

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    const res = await verifyEmail(email, otpCode);
    if (!res.success) {
      setErrorMsg(res.error || "Invalid or expired verification code.");
    }
    setLoading(false);
  };

  // Resend Verification Code
  const handleResendVerification = async () => {
    if (resendCooldown > 0 || resendingCode || !email.trim()) return;
    resetFeedback();
    setResendingCode(true);

    const res = await resendVerificationEmail(email);
    if (res.success) {
      setSuccessMsg(res.message || "A new verification code has been sent to your email.");
      setResendCooldown(60);
    } else {
      setErrorMsg(res.error || "Could not resend verification code. Please try again later.");
    }
    setResendingCode(false);
  };

  // Forgot Password - Step 1: Send Reset Code
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFeedback();

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    const res = await sendResetPasswordEmail(email);
    if (res.success) {
      setSuccessMsg(res.message || "Reset code sent! Check your inbox.");
      setForgotStep(2);
      setResendCooldown(60);
    } else {
      setErrorMsg(res.error || "Failed to send reset code. Please check your email address.");
    }
    setLoading(false);
  };

  // Forgot Password - Step 2: Confirm Code & Set New Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFeedback();

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit code received in your email.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    const res = await resetPassword(email, otpCode, newPassword);
    if (res.success) {
      setSuccessMsg("Password reset successfully! You can now sign in with your new password.");
      setPassword(newPassword);
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        handleTabSwitch("signin");
      }, 1500);
    } else {
      setErrorMsg(res.error || "Failed to reset password. Please check your code.");
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
          className="fixed inset-0 bg-[#0A0A0E]/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-[#FFF9EF] dark:bg-[#121218] border border-[#B88A32]/35 dark:border-[#B88A32]/30 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#B88A32]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full text-[#4A3928] dark:text-[#B8ADA0] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] hover:bg-[#F4E9D5]/60 dark:hover:bg-[#1A1A24] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#B88A32]/15 dark:bg-[#B88A32]/20 border border-[#B88A32]/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
              {authModalTab === "forgot" ? (
                <KeyRound className="w-6 h-6 text-[#B88A32] dark:text-[#D4AF62]" />
              ) : authModalTab === "verify" ? (
                <Mail className="w-6 h-6 text-[#B88A32] dark:text-[#D4AF62]" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-[#B88A32] dark:text-[#D4AF62]" />
              )}
            </div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#B88A32] uppercase font-bold">
              ALIG&apos;S WARE ATELIER
            </span>
            <h2 className="text-2xl font-cinzel font-black tracking-wide text-[#2A2118] dark:text-[#F5EFE6] mt-1">
              {authModalTab === "signin" && "Client Access"}
              {authModalTab === "signup" && "Create Account"}
              {authModalTab === "forgot" && "Reset Password"}
              {authModalTab === "verify" && "Verify Email"}
            </h2>
            <p className="text-xs text-[#6B5740] dark:text-[#A89F91] mt-1 font-sans">
              {authModalTab === "signin" && "Sign in to track orders and manage clinical try-ons."}
              {authModalTab === "signup" && "Register for bespoke consultation and priority dispatch."}
              {authModalTab === "forgot" && "Recover your account credentials via secure email verification."}
              {authModalTab === "verify" && "Enter the 6-digit security code sent to your email address."}
            </p>
          </div>

          {/* Tabs for Sign In & Register */}
          {(authModalTab === "signin" || authModalTab === "signup") && (
            <div className="flex rounded-2xl bg-[#F4E9D5]/70 dark:bg-[#1A1A24]/90 p-1 mb-6 border border-[#B88A32]/20 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleTabSwitch("signin")}
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
                onClick={() => handleTabSwitch("signup")}
                className={`flex-1 py-2.5 rounded-xl font-bold tracking-wider uppercase transition-all ${
                  authModalTab === "signup"
                    ? "bg-[#B88A32] text-white shadow-md"
                    : "text-[#6B5740] dark:text-[#A89F91] hover:text-[#2A2118] dark:hover:text-[#F5EFE6]"
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Feedback: Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs text-center font-mono">
              <p>{errorMsg}</p>
              {requiresVerificationPrompt && (
                <div className="mt-2.5 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetFeedback();
                      openAuthModal("verify");
                    }}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Enter Code
                  </button>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || resendingCode}
                    onClick={handleResendVerification}
                    className="px-3 py-1 bg-[#B88A32]/20 hover:bg-[#B88A32]/30 text-[#B88A32] dark:text-[#D4AF62] rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {resendingCode ? "Sending..." : resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend Email"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Feedback: Success Banner */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs text-center font-mono flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW 1 & 2: SIGN IN & REGISTER FORMS */}
          {(authModalTab === "signin" || authModalTab === "signup") && (
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
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
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#4A3928] dark:text-[#B8ADA0]">
                    Password *
                  </label>
                  {authModalTab === "signin" && (
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("forgot")}
                      className="text-[11px] font-sans text-[#B88A32] dark:text-[#D4AF62] hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#B88A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#A89F91] focus:outline-none focus:border-[#B88A32] transition-colors font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A89F91] hover:text-[#B88A32] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] hover:brightness-105 text-white font-bold text-xs font-mono tracking-[0.16em] uppercase shadow-[0_4px_20px_rgba(184,138,50,0.35)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>{authModalTab === "signin" ? "SIGN IN WITH EMAIL" : "CREATE ATELIER ACCOUNT"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* OAuth Separator */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#B88A32]/20 dark:border-[#B88A32]/25"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-[#6B5740] dark:text-[#A89F91]">
                  OR CONTINUE WITH
                </span>
                <div className="flex-grow border-t border-[#B88A32]/20 dark:border-[#B88A32]/25"></div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                disabled={loading || googleLoading}
                onClick={handleGoogleSignIn}
                className="w-full py-3 rounded-2xl bg-white dark:bg-[#1A1A24] border border-[#B88A32]/30 hover:border-[#B88A32] text-[#2A2118] dark:text-[#F5EFE6] font-medium text-xs font-sans tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#B88A32]" />
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="font-mono text-xs tracking-wider uppercase font-semibold">
                      Continue with Google
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* VIEW 3: FORGOT PASSWORD FLOW */}
          {authModalTab === "forgot" && (
            <div className="space-y-4">
              {forgotStep === 1 ? (
                <form onSubmit={handleSendResetCode} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono tracking-wider uppercase text-[#4A3928] dark:text-[#B8ADA0] block mb-1">
                      Registered Email Address *
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
                    <p className="text-[11px] text-[#6B5740] dark:text-[#A89F91] mt-1.5 font-sans">
                      We will dispatch a 6-digit verification code to reset your password.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] hover:brightness-105 text-white font-bold text-xs font-mono tracking-[0.16em] uppercase shadow-[0_4px_20px_rgba(184,138,50,0.35)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>SEND RESET CODE</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("signin")}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] hover:underline"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                  <div className="bg-[#F4E9D5]/40 dark:bg-[#1A1A24]/60 border border-[#B88A32]/25 rounded-2xl p-3 text-xs text-[#4A3928] dark:text-[#B8ADA0] flex items-center justify-between font-sans">
                    <div className="truncate">
                      <span className="text-[10px] uppercase font-mono block text-[#B88A32]">Reset code sent to:</span>
                      <strong className="text-[#2A2118] dark:text-[#F5EFE6] font-mono text-[11px]">{email}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1);
                        resetFeedback();
                      }}
                      className="text-[10px] font-mono text-[#B88A32] hover:underline uppercase shrink-0 ml-2"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono tracking-wider uppercase text-[#4A3928] dark:text-[#B8ADA0] block mb-1">
                      6-Digit Security Code *
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-[#B88A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 rounded-xl pl-10 pr-4 py-2.5 text-base tracking-[0.3em] font-mono font-bold text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#A89F91] focus:outline-none focus:border-[#B88A32] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono tracking-wider uppercase text-[#4A3928] dark:text-[#B8ADA0] block mb-1">
                      New Password (Min 6 Characters) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#B88A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#A89F91] focus:outline-none focus:border-[#B88A32] transition-colors font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A89F91] hover:text-[#B88A32] transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono tracking-wider uppercase text-[#4A3928] dark:text-[#B8ADA0] block mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#B88A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#A89F91] focus:outline-none focus:border-[#B88A32] transition-colors font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6 || newPassword.length < 6}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] hover:brightness-105 text-white font-bold text-xs font-mono tracking-[0.16em] uppercase shadow-[0_4px_20px_rgba(184,138,50,0.35)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>UPDATE PASSWORD</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("signin")}
                      className="inline-flex items-center gap-1 text-[#B88A32] dark:text-[#D4AF62] hover:underline text-[11px]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || resendingCode}
                      onClick={handleSendResetCode}
                      className="inline-flex items-center gap-1 text-[#6B5740] dark:text-[#A89F91] hover:text-[#B88A32] text-[11px] disabled:opacity-40"
                    >
                      <RotateCw className={`w-3 h-3 ${resendingCode ? "animate-spin" : ""}`} />
                      <span>
                        {resendingCode ? "Sending..." : resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend Code"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* VIEW 4: EMAIL VERIFICATION FLOW */}
          {authModalTab === "verify" && (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="bg-[#F4E9D5]/40 dark:bg-[#1A1A24]/60 border border-[#B88A32]/25 rounded-2xl p-3.5 text-center font-sans">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#B88A32] block mb-0.5">
                  Verification Code Dispatched
                </span>
                <p className="text-xs text-[#4A3928] dark:text-[#B8ADA0]">
                  Please enter the 6-digit code sent to:
                </p>
                <strong className="text-sm text-[#2A2118] dark:text-[#F5EFE6] font-mono block mt-1">
                  {email}
                </strong>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-wider uppercase text-[#4A3928] dark:text-[#B8ADA0] block mb-1">
                  Enter 6-Digit Code *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#B88A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 rounded-xl pl-10 pr-4 py-3 text-lg text-center tracking-[0.35em] font-mono font-bold text-[#2A2118] dark:text-[#F5EFE6] placeholder-[#A89F91] focus:outline-none focus:border-[#B88A32] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#B88A32] via-[#D4AF62] to-[#B88A32] hover:brightness-105 text-white font-bold text-xs font-mono tracking-[0.16em] uppercase shadow-[0_4px_20px_rgba(184,138,50,0.35)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>VERIFY & SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handleTabSwitch("signin")}
                  className="inline-flex items-center gap-1 text-[#B88A32] dark:text-[#D4AF62] hover:underline text-[11px]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || resendingCode}
                  onClick={handleResendVerification}
                  className="inline-flex items-center gap-1 text-[#6B5740] dark:text-[#A89F91] hover:text-[#B88A32] text-[11px] disabled:opacity-40"
                >
                  <RotateCw className={`w-3 h-3 ${resendingCode ? "animate-spin" : ""}`} />
                  <span>
                    {resendingCode ? "Sending..." : resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend Code"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

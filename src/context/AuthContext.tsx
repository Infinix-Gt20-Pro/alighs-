// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import insforge from "@/lib/insforge";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  phone?: string;
}

export type AuthModalTab = "signin" | "signup" | "forgot" | "verify";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  authModalReason: string | null;
  authModalRedirect: string | null;
  openAuthModal: (tab?: AuthModalTab, reason?: string, redirectPath?: string) => void;
  closeAuthModal: () => void;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string; requireVerification?: boolean }>;
  signUp: (email: string, pass: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string; requireVerification?: boolean }>;
  verifyEmail: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  sendResetPasswordEmail: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  resetPassword: (email: string, code: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: (redirectPath?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>("signin");
  const [authModalReason, setAuthModalReason] = useState<string | null>(null);
  const [authModalRedirect, setAuthModalRedirect] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (!error && data?.user) {
        const u = data.user;
        const meta = (u as any).user_metadata || (u as any).metadata || {};
        const prof = (u as any).profile || {};
        setUser({
          id: u.id,
          email: u.email || "",
          name: prof.name || (u as any).name || meta.full_name || meta.name || u.email?.split("@")[0] || "Client",
          role: (u as any).role || "customer",
          phone: prof.phone || (u as any).phone || meta.phone || "",
        });

        // Clean up mobile PKCE verifier backup after successful authentication
        // Also persist email for future Google login_hint (so user doesn't type it again)
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("insforge_pkce_verifier");
            if (u.email) {
              localStorage.setItem("aligsware_last_google_email", u.email);
            }
            const postLoginRedirect = localStorage.getItem("aligsware_post_login_redirect");
            if (postLoginRedirect) {
              localStorage.removeItem("aligsware_post_login_redirect");
              if (window.location.pathname !== postLoginRedirect) {
                window.location.href = postLoginRedirect;
              }
            }
          } catch {
            // ignore
          }
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    const unsubscribe = insforge.auth.onAuthStateChange(() => {
      refreshUser();
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [refreshUser]);

  const openAuthModal = (tab: AuthModalTab = "signin", reason?: string, redirectPath?: string) => {
    setAuthModalTab(tab);
    setAuthModalReason(reason || null);
    setAuthModalRedirect(redirectPath || (reason ? "/checkout" : null));
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason(null);
    setAuthModalRedirect(null);
  };


  const signIn = async (email: string, pass: string) => {
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error || !data) {
        const errMsg = error?.message || "Invalid email or password.";
        const isVerificationRequired = errMsg.toLowerCase().includes("verification") || errMsg.toLowerCase().includes("verify");
        return {
          success: false,
          error: isVerificationRequired ? "Email verification required. Please verify your email." : errMsg,
          requireVerification: isVerificationRequired,
        };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          name: (data.user as any).profile?.name || (data.user as any).name || email.split("@")[0],
          role: (data.user as any).role || "customer",
        });
      }
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      const errMsg = err?.message || "Failed to sign in.";
      const isVerificationRequired = errMsg.toLowerCase().includes("verification") || errMsg.toLowerCase().includes("verify");
      return {
        success: false,
        error: isVerificationRequired ? "Email verification required. Please verify your email." : errMsg,
        requireVerification: isVerificationRequired,
      };
    }
  };

  const signUp = async (email: string, pass: string, name: string, phone?: string) => {
    try {
      const { data, error } = await insforge.auth.signUp({
        email: email.trim(),
        password: pass,
        name: name.trim(),
      });

      if (error || !data) {
        return { success: false, error: error?.message || "Registration failed." };
      }

      if (data.requireEmailVerification) {
        return { success: true, requireVerification: true };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          name: name.trim(),
          phone: phone?.trim(),
          role: "customer",
        });

        // Link customer in customers table if phone provided
        if (phone) {
          try {
            await insforge.database.from("customers").insert([
              {
                id: `cust_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
                user_id: data.user.id,
                full_name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                address: "Atelier Registered Client",
                city: "Firozabad",
                state: "Uttar Pradesh",
                pincode: "283203",
              },
            ]);
          } catch {
            // Profile insert is non-blocking
          }
        }
      }
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed." };
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    try {
      const { data, error } = await insforge.auth.verifyEmail({
        email: email.trim(),
        otp: otp.trim(),
      });

      if (error || !data) {
        return { success: false, error: error?.message || "Invalid or expired verification code." };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          name: (data.user as any).profile?.name || (data.user as any).name || email.split("@")[0],
          role: (data.user as any).role || "customer",
        });
      }
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Verification failed." };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const { data, error } = await insforge.auth.resendVerificationEmail({
        email: email.trim(),
      });

      if (error) {
        return { success: false, error: error.message || "Failed to resend verification code." };
      }

      return {
        success: true,
        message: data?.message || "Verification code sent to your email.",
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to resend verification email." };
    }
  };

  const sendResetPasswordEmail = async (email: string) => {
    try {
      const { data, error } = await insforge.auth.sendResetPasswordEmail({
        email: email.trim(),
      });

      if (error) {
        return { success: false, error: error.message || "Failed to send reset code. Please try again later." };
      }

      return {
        success: true,
        message: data?.message || "Password reset code sent to your email. Check your inbox and spam folder.",
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to send reset email." };
    }
  };

  const resetPassword = async (email: string, code: string, newPass: string) => {
    try {
      // Step 1: Exchange reset code for token
      const exchangeRes = await insforge.auth.exchangeResetPasswordToken({
        email: email.trim(),
        code: code.trim(),
      });

      if (exchangeRes.error || !exchangeRes.data?.token) {
        return {
          success: false,
          error: exchangeRes.error?.message || "Invalid or expired reset code. Please check and try again.",
        };
      }

      // Step 2: Reset password with token
      const resetRes = await insforge.auth.resetPassword({
        newPassword: newPass,
        otp: exchangeRes.data.token,
      });

      if (resetRes.error) {
        return { success: false, error: resetRes.error.message || "Failed to reset password." };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to reset password." };
    }
  };

  const signInWithGoogle = async (customRedirect?: string) => {
    try {
      let targetPath = customRedirect || authModalRedirect || (authModalReason ? "/checkout" : undefined);
      if (!targetPath && typeof window !== "undefined") {
        const p = window.location.pathname;
        targetPath = p === "/cart" || p === "/checkout" ? "/checkout" : p;
      }
      targetPath = targetPath || "/checkout";

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("aligsware_post_login_redirect", targetPath);
        } catch {
          // ignore
        }
      }

      const redirectUrl = typeof window !== "undefined"
        ? `${window.location.origin}${targetPath}`
        : "";

      // Build OAuth params — no forced prompt so Google uses device accounts natively on mobile
      // If user logged in before, pass login_hint so Google pre-fills their email
      const oauthParams: Record<string, string> = {};
      if (typeof window !== "undefined") {
        try {
          const lastEmail = localStorage.getItem("aligsware_last_google_email");
          if (lastEmail) {
            oauthParams.login_hint = lastEmail;
          }
        } catch {
          // ignore
        }
      }

      const { data, error } = await insforge.auth.signInWithOAuth("google", {
        redirectTo: redirectUrl || (typeof window !== "undefined" ? window.location.origin : ""),
        skipBrowserRedirect: true,
        ...(Object.keys(oauthParams).length > 0 ? { additionalParams: oauthParams } : {}),
      });

      if (error) {
        return { success: false, error: error.message || "Failed to initialize Google Sign In." };
      }

      // Persist PKCE verifier to localStorage as a safety net for mobile browsers
      if (typeof window !== "undefined") {
        try {
          const pkceKey = "insforge_pkce_verifier";
          const verifier = data?.codeVerifier || sessionStorage.getItem(pkceKey);
          if (verifier) {
            localStorage.setItem(pkceKey, verifier);
            sessionStorage.setItem(pkceKey, verifier);
          }
        } catch {
          // ignore
        }
      }

      if (data?.url && typeof window !== "undefined") {
        window.location.href = data.url;
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Google Sign In encountered an error." };
    }
  };

  const signOut = async () => {
    try {
      await insforge.auth.signOut();
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        authModalReason,
        authModalRedirect,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        verifyEmail,
        resendVerificationEmail,
        sendResetPasswordEmail,
        resetPassword,
        signInWithGoogle,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

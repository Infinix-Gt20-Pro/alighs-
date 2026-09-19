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

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "signup";
  openAuthModal: (tab?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");

  const refreshUser = useCallback(async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (!error && data?.user) {
        const u = data.user;
        setUser({
          id: u.id,
          email: u.email || "",
          name: (u as any).profile?.name || (u as any).name || u.email?.split("@")[0] || "Client",
          role: (u as any).role || "customer",
        });
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

  const openAuthModal = (tab: "signin" | "signup" = "signin") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signIn = async (email: string, pass: string) => {
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error || !data) {
        return { success: false, error: error?.message || "Invalid email or password." };
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
      return { success: false, error: err.message || "Failed to sign in." };
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
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
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

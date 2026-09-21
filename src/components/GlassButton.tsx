"use client";

import React, { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface GlassButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "default" | "primary" | "subtle";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function GlassButton({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-full gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-full gap-2",
    lg: "px-6 py-3.5 text-base rounded-full gap-2.5",
  };

  const variantClasses = {
    default: "bg-white/[0.07] hover:bg-white/[0.12] border-white/10 hover:border-white/25 text-white",
    primary: "bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border-blue-400/30 hover:border-blue-400/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]",
    subtle: "bg-transparent hover:bg-white/[0.05] border-transparent hover:border-white/10 text-[#C4B59E] hover:text-white",
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.04,
        y: -1.5,
        transition: { type: "spring", stiffness: 450, damping: 20 },
      }}
      whileTap={{
        scale: 0.96,
        y: 0,
        transition: { type: "spring", stiffness: 500, damping: 25 },
      }}
      className={`
        relative inline-flex items-center justify-center font-medium
        backdrop-blur-xl border shadow-[0_4px_16px_rgba(0,0,0,0.25)]
        cursor-pointer transition-colors duration-200 select-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {/* Specular sheen line */}
      <span className="pointer-events-none absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </motion.button>
  );
}

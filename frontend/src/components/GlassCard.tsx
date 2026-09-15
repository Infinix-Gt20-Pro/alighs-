"use client";

import React, { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  blurLevel?: "sm" | "md" | "lg" | "xl" | "2xl";
  glow?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  interactive = true,
  blurLevel = "xl",
  glow = true,
  ...motionProps
}: GlassCardProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 24,
      }}
      whileHover={
        interactive
          ? {
              y: -5,
              scale: 1.012,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
              },
            }
          : undefined
      }
      whileTap={
        interactive
          ? {
              scale: 0.985,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
              },
            }
          : undefined
      }
      className={`
        relative group overflow-hidden
        rounded-2xl
        ${blurClasses[blurLevel]}
        bg-white/[0.05]
        border border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        transition-colors duration-300
        hover:bg-white/[0.08]
        hover:border-white/20
        ${className}
      `}
      {...motionProps}
    >
      {/* Specular Edge Highlight Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.12] via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Subtle Radial Glow Spot on Hover */}
      {glow && (
        <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.08] via-transparent to-purple-500/10" />
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

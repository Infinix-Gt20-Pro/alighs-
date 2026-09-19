// src/components/Preloader.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete?: () => void;
  isLoading?: boolean;
}

export default function Preloader({ onComplete, isLoading = true }: PreloaderProps) {
  const [prevIsLoading, setPrevIsLoading] = useState(isLoading);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(!isLoading);

  if (isLoading !== prevIsLoading) {
    setPrevIsLoading(isLoading);
    if (isLoading) {
      setProgress(0);
      setIsDone(false);
    } else {
      setIsDone(true);
    }
  }

  useEffect(() => {
    if (!isLoading || isDone) {
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 14) + 8;
        return Math.min(prev + step, 100);
      });
    }, 60);

    return () => {
      clearInterval(interval);
    };
  }, [isLoading, isDone]);

  useEffect(() => {
    if (progress >= 100 && !isDone) {
      const timer = setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, isDone, onComplete]);

  const visible = isLoading && !isDone;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.35, ease: "easeOut" },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFDF5] text-[#3C2415] selection:bg-none"
        >
          {/* Warm Champagne Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#C6A463]/15 via-[#E2C485]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center mb-6 z-10 text-center px-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F0] border border-[#C6A463]/25 text-[11px] font-mono text-[#C6A463] uppercase tracking-[0.2em] mb-3 shadow-sm">
              <span>FIROZABAD &bull; EST. QUALITY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-cinzel font-bold tracking-[0.14em] text-[#3C2415] uppercase">
              ALIGS<span className="font-light text-[#C6A463]">WARE</span>
            </h2>
            <p className="text-xs font-mono tracking-[0.32em] text-[#8B7355] uppercase mt-2">
              Sculpted Vision &bull; 3D Studio
            </p>
          </motion.div>

          {/* Central Rotating Insignia */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* Outer Rotating Gold Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              className="w-28 h-28 rounded-full border border-[#C6A463]/25 border-t-[#C6A463] border-r-[#C6A463]/60 shadow-[0_0_25px_rgba(198,164,99,0.25)]"
            />
            {/* Centered Official Logo */}
            <div className="absolute w-16 h-16 rounded-full overflow-hidden border border-[#C6A463]/40 bg-[#3C2415] flex items-center justify-center shadow-lg">
              <Image
                src="/images/aligsware-logo.png"
                alt="ALIG'S WARE"
                fill
                sizes="64px"
                className="object-contain p-1.5"
                priority
              />
            </div>

            {/* Inner Counter-Rotating Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="absolute w-16 h-16 rounded-full border border-[#C6A463]/15 border-b-[#C6A463] border-l-[#E2C485]"
            />
          </div>

          {/* Status & Counter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col items-center gap-3 z-10"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A463] animate-pulse" />
              <span className="text-xs font-mono tracking-[0.24em] text-[#8B7355] uppercase">
                Calibrating Studio
              </span>
            </div>

            {/* Digital Percentage */}
            <div className="text-3xl font-light tracking-tight font-mono text-[#3C2415]">
              {progress}
              <span className="text-sm text-[#8B7355] ml-1">%</span>
            </div>

            {/* Warm Gold Progress Bar */}
            <div className="w-64 h-1.5 bg-[#FAF7F0] border border-[#C6A463]/20 rounded-full overflow-hidden p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C6A463] via-[#E2C485] to-[#A8884A] rounded-full shadow-[0_0_10px_rgba(198,164,99,0.5)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.2 }}
              />
            </div>

            <p className="text-[11px] text-[#8B7355] font-mono mt-1">
              {progress < 40 && "Loading optical refraction..."}
              {progress >= 40 && progress < 80 && "Aligning titanium reflections..."}
              {progress >= 80 && progress < 100 && "Readying luxury campaign..."}
              {progress === 100 && "Vision Sculpted"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

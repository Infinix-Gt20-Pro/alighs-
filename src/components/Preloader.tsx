"use client";

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
        const step = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + step, 100);
      });
    }, 70);

    return () => {
      clearInterval(interval);
    };
  }, [isLoading, isDone]);

  useEffect(() => {
    if (progress >= 100 && !isDone) {
      const timer = setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
      }, 450);
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
            scale: 1.03,
            filter: "blur(12px)",
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] text-white selection:bg-none"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header: ALIGH'S WARE at Starting Screen */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center mb-6 z-10 text-center px-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill border border-white/15 text-[11px] font-mono text-cyan-300 uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <span>FIROZABAD &bull; EST. QUALITY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-wider sm:tracking-[0.18em] text-white uppercase drop-shadow-[0_0_35px_rgba(6,182,212,0.7)]">
              ALIGH&apos;S <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-light">WARE</span>
            </h2>
            <p className="text-xs font-mono tracking-[0.35em] text-neutral-400 uppercase mt-2">
              Luxury Eyewear &bull; 3D Optics
            </p>
          </motion.div>

          {/* Central Animated Glass Orb */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* Outer Rotating Glowing Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-24 h-24 rounded-full border border-white/10 border-t-white/80 border-r-white/30 shadow-[0_0_25px_rgba(255,255,255,0.15)]"
            />

            {/* Inner Counter-Rotating Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="absolute w-16 h-16 rounded-full border border-white/10 border-b-cyan-400/80 border-l-purple-500/50"
            />

            {/* Frosted Center Core */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#fff]" />
            </motion.div>
          </div>

          {/* Text & Status Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col items-center gap-3 z-10"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase">
                Systems Initializing
              </span>
            </div>

            {/* Digital Percentage Counter */}
            <div className="text-3xl font-light tracking-tight font-mono text-white">
              {progress}
              <span className="text-sm text-neutral-500 ml-1">%</span>
            </div>

            {/* Progress Bar Container in Frosted Pill */}
            <div className="w-64 h-1.5 bg-white/5 border border-white/10 rounded-full overflow-hidden backdrop-blur-sm p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-400 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.2 }}
              />
            </div>

            <p className="text-[11px] text-neutral-500 font-mono mt-1">
              {progress < 30 && "Loading motion physics..."}
              {progress >= 30 && progress < 70 && "Compiling frosted glass shader..."}
              {progress >= 70 && progress < 100 && "Synchronizing telemetry..."}
              {progress === 100 && "Ready"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

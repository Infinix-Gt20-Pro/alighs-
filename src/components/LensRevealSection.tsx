"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Eye, Maximize2, ShieldCheck } from "lucide-react";

export default function LensRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"bluecut" | "polarized" | "pure">("bluecut");
  const [zoomLevel, setZoomLevel] = useState<1 | 1.25>(1);

  // Raw coordinates relative to container
  const rawX = useMotionValue(400);
  const rawY = useMotionValue(260);
  const rawRadius = useMotionValue(160);

  // High-performance spring interpolation
  const springConfig = { damping: 30, stiffness: 380, mass: 0.4 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);
  const smoothRadius = useSpring(rawRadius, { damping: 25, stiffness: 320 });

  // Synchronized clipPath motion value for hardware-accelerated clipping
  const clipPath = useTransform(
    [smoothX, smoothY, smoothRadius],
    ([x, y, r]) => `circle(${r}px at ${x}px ${y}px)`
  );

  // Position & size transforms for the circular lens element
  const lensLeft = useTransform([smoothX, smoothRadius], ([x, r]) => (x as number) - (r as number));
  const lensTop = useTransform([smoothY, smoothRadius], ([y, r]) => (y as number) - (r as number));
  const lensDimension = useTransform(smoothRadius, (r) => (r as number) * 2);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    rawX.set(touch.clientX - rect.left);
    rawY.set(touch.clientY - rect.top);
    setIsHovered(true);
  };

  // Center the lens on initial mount
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      rawX.set(rect.width / 2);
      rawY.set(rect.height / 2);
    }
  }, [rawX, rawY]);

  const setRadiusValue = (val: number) => {
    rawRadius.set(val);
  };

  // Filter tint overlay style inside the lens
  const filterStyles = {
    bluecut: "bg-blue-500/10 backdrop-contrast-[1.12] backdrop-brightness-[1.04]",
    polarized: "bg-amber-500/10 backdrop-contrast-[1.25] backdrop-brightness-[1.02]",
    pure: "bg-transparent backdrop-contrast-[1.08] backdrop-brightness-[1.06]",
  };

  return (
    <section id="magic-lens" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto z-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-mono text-cyan-300 mb-3">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>MAGIC LENS SIMULATION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
            Experience Crystal Clarity
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 font-normal mt-2 max-w-xl">
            Hover over the lens to experience the authentic optical difference.
          </p>
        </div>

        {/* Interactive Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Lens Filter Mode */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveFilter("bluecut")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === "bluecut"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Blue-Cut
            </button>
            <button
              onClick={() => setActiveFilter("polarized")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === "polarized"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Polarized
            </button>
            <button
              onClick={() => setActiveFilter("pure")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === "pure"
                  ? "bg-white/15 text-white border border-white/20 shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              8K Pure
            </button>
          </div>

          {/* Lens Aperture Size */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
            <button
              onClick={() => setRadiusValue(130)}
              className="px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              130px
            </button>
            <button
              onClick={() => setRadiusValue(170)}
              className="px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              170px
            </button>
            <button
              onClick={() => setRadiusValue(220)}
              className="px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              220px
            </button>
          </div>

          {/* Zoom Toggle */}
          <button
            onClick={() => setZoomLevel(zoomLevel === 1 ? 1.25 : 1)}
            className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              zoomLevel === 1.25
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-400/40"
                : "bg-white/[0.04] text-neutral-400 border-white/10 hover:text-white"
            }`}
            title="Toggle 1.25x Optical Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{zoomLevel}x</span>
          </button>
        </div>
      </div>

      {/* ======================================================================
          INTERACTIVE VIEWPORT CONTAINER
          ====================================================================== */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
        onTouchEnd={() => setIsHovered(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-[520px] sm:h-[620px] md:h-[680px] rounded-3xl overflow-hidden border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.8)] cursor-none select-none group touch-pan-y"
      >
        {/* ====================================================================
            LAYER 1: Heavily Blurred Background Image (Uncorrected Vision)
            ==================================================================== */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out filter blur-[20px] brightness-[0.70] saturate-[0.85]"
          style={{
            backgroundImage: "url('/images/clarity-showcase.jpg')",
            transform: zoomLevel === 1.25 ? "scale(1.25)" : "scale(1)",
          }}
        />

        {/* Ambient Dark Vignette Overlay on the Blurred Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />

        {/* Background Typography Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <span className="text-5xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase text-white/10 select-none text-center">
            UNCORRECTED
          </span>
        </div>

        {/* ====================================================================
            LAYER 2: Razor-Sharp 8K Photorealistic Image (Synchronized clip-path)
            ==================================================================== */}
        <motion.div
          style={{ clipPath }}
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-700 ease-out"
        >
          {/* Unblurred Razor-Sharp Background Image */}
          <div
            className="w-full h-full bg-cover bg-center filter contrast-[1.08] brightness-[1.05]"
            style={{
              backgroundImage: "url('/images/clarity-showcase.jpg')",
              transform: zoomLevel === 1.25 ? "scale(1.25)" : "scale(1)",
            }}
          />

          {/* Active Optical Filter Tint inside the Lens */}
          <div className={`absolute inset-0 pointer-events-none ${filterStyles[activeFilter]}`} />
        </motion.div>

        {/* ====================================================================
            LAYER 3: Custom Circular Eyeglass Lens Element (Tracks Mouse & Touch)
            ==================================================================== */}
        <motion.div
          style={{
            left: lensLeft,
            top: lensTop,
            width: lensDimension,
            height: lensDimension,
            opacity: isHovered ? 1 : 0.85,
          }}
          className="absolute pointer-events-none rounded-full z-30 flex items-center justify-center transition-opacity duration-300"
        >
          {/* Outer Polished Bevel & Specular Edge Highlight */}
          <div className="absolute inset-0 rounded-full border-[3px] border-white/70 shadow-[0_0_35px_rgba(255,255,255,0.25),inset_0_0_20px_rgba(255,255,255,0.2)]" />

          {/* Secondary Chamfer Rim */}
          <div className="absolute inset-[3px] rounded-full border border-cyan-300/30" />

          {/* Lens Specular Reflection Arc */}
          <div className="absolute inset-2 rounded-full border-t-2 border-l border-white/70 opacity-60" />

          {/* Optical Reticle Crosshair & Micro-Ticks */}
          <div className="relative w-full h-full flex items-center justify-center opacity-30">
            <div className="absolute w-8 h-[1px] bg-cyan-300" />
            <div className="absolute h-8 w-[1px] bg-cyan-300" />
            <div className="w-5 h-5 rounded-full border border-cyan-300/60" />
          </div>

          {/* Floating Optical Metadata Badge attached to the Lens */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full glass-panel text-[11px] font-mono text-cyan-300 border border-cyan-400/30 shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>ALIGH&apos;S CLARITY LENS</span>
            <span className="text-neutral-500">&bull;</span>
            <span className="text-white">{zoomLevel}x</span>
          </div>

          {/* Bottom Prescription Badge */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-neutral-300 border border-white/10 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">100% CRYSTAL SHARP</span>
            <span>&bull;</span>
            <span className="uppercase">{activeFilter}</span>
          </div>
        </motion.div>

        {/* ====================================================================
            LAYER 4: Viewport Guidance Overlay Badges
            ==================================================================== */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none flex flex-col gap-2">
          <div className="px-3.5 py-1.5 rounded-xl glass-panel text-xs font-mono text-white/90 border border-white/15 shadow-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ALIGH&apos;S WARE PRECISION OPTICS</span>
          </div>
        </div>

        {/* Hover Cue Banner */}
        <div className="absolute bottom-6 inset-x-6 z-20 pointer-events-none flex items-center justify-between">
          <div className="px-4 py-2 rounded-xl glass-panel text-xs font-mono text-neutral-300 border border-white/15 shadow-xl">
            <span className="text-cyan-400 font-semibold">MAGIC LENS:</span> Move cursor / touch to inspect clarity
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Firozabad Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
}

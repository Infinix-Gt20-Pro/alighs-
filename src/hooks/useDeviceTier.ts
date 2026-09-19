"use client";

import { useSyncExternalStore } from "react";

export type DeviceTier = "HIGH" | "MEDIUM" | "LOW";

export interface DeviceCapabilities {
  tier: DeviceTier;
  cores: number;
  memoryGB: number;
  dpr: number;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  gpuRenderer: string;
  hasWebGL: boolean;
  /** Recommended max DPR for 3D canvas rendering */
  maxDpr: number;
  /** Enable Float micro-animation wrapper on 3D models */
  enableFloat: boolean;
  /** Enable ContactShadows (renders to offscreen FBO every frame) */
  enableContactShadows: boolean;
  /** Shadow resolution (512 for high, 256 for medium) */
  shadowResolution: number;
  /** Enable large CSS blur orbs (120-140px blur) */
  enableBlurOrbs: boolean;
  /** Enable framer-motion entrance animations */
  enableEntranceAnimations: boolean;
  /** Number of lights in 3D scenes */
  lightCount: 3 | 5 | 7;
  /** Geometry tessellation level */
  geometryDetail: "low" | "mid" | "high";
  /** Lens material mode: standard (no refraction pass) vs physical (full transmission) */
  lensMaterialMode: "standard" | "physical";
  /** Max CSS blur radius (px) for ambient effects */
  blurBudget: number;
}

// ---------------------------------------------------------------------------
// Compute once, cache forever
// ---------------------------------------------------------------------------
let cached: DeviceCapabilities | null = null;

interface WebGLCapabilities {
  hasWebGL: boolean;
  renderer: string;
  isBudgetHardware: boolean;
  isMidHardware: boolean;
  maxTextureSize: number;
}

function probeWebGL(): WebGLCapabilities {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    if (!gl) {
      return {
        hasWebGL: false,
        renderer: "unsupported",
        isBudgetHardware: true,
        isMidHardware: false,
        maxTextureSize: 0,
      };
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ""
      : gl.getParameter(gl.RENDERER) || "";

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
    const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 0;
    const maxVarying = gl.getParameter(gl.MAX_VARYING_VECTORS) || 0;

    const rendererLower = renderer.toLowerCase();

    // 1. Hardware Capability Metrics (Independent of GPU naming strings)
    // Budget mobile GPUs typically cap texture size <= 4096 or renderbuffer <= 4096
    const isConstrainedBuffers = maxTextureSize <= 4096 || maxRenderBufferSize <= 4096 || maxVarying < 12;

    // 2. Software Rasterizer Detection
    const isSoftware =
      rendererLower.includes("swiftshader") ||
      rendererLower.includes("llvmpipe") ||
      rendererLower.includes("software") ||
      rendererLower.includes("basic render") ||
      rendererLower.includes("mesa");

    // 3. Known budget GPU patterns (as secondary signal)
    const isBudgetGpuString =
      rendererLower.includes("mali-4") ||
      rendererLower.includes("mali-t") ||
      rendererLower.includes("mali-g51") ||
      rendererLower.includes("mali-g52") ||
      rendererLower.includes("adreno 3") ||
      rendererLower.includes("adreno 4") ||
      rendererLower.includes("adreno 50") ||
      rendererLower.includes("adreno 610") ||
      rendererLower.includes("adreno 612") ||
      rendererLower.includes("powervr");

    const isMidGpuString =
      rendererLower.includes("mali-g57") ||
      rendererLower.includes("mali-g68") ||
      rendererLower.includes("mali-g71") ||
      rendererLower.includes("mali-g72") ||
      rendererLower.includes("mali-g76") ||
      rendererLower.includes("mali-g77") ||
      rendererLower.includes("adreno 618") ||
      rendererLower.includes("adreno 619") ||
      rendererLower.includes("adreno 620") ||
      rendererLower.includes("adreno 630") ||
      rendererLower.includes("adreno 640") ||
      rendererLower.includes("adreno 642") ||
      rendererLower.includes("apple a11") ||
      rendererLower.includes("apple a12") ||
      rendererLower.includes("apple a13");

    // Immediately release WebGL context to prevent context limits
    const loseContext = gl.getExtension("WEBGL_lose_context");
    if (loseContext) {
      loseContext.loseContext();
    }

    return {
      hasWebGL: true,
      renderer,
      isBudgetHardware: isSoftware || isConstrainedBuffers || isBudgetGpuString,
      isMidHardware: isMidGpuString || maxTextureSize <= 8192,
      maxTextureSize,
    };
  } catch {
    return {
      hasWebGL: false,
      renderer: "error",
      isBudgetHardware: true,
      isMidHardware: false,
      maxTextureSize: 0,
    };
  }
}

function detect(): DeviceCapabilities {
  if (cached) return cached;

  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memoryGB = typeof navigator !== "undefined" ? (navigator as any).deviceMemory ?? 4 : 4;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const isTouch = typeof navigator !== "undefined" && (navigator.maxTouchPoints > 0 || "ontouchstart" in window);
  const isMobile =
    typeof navigator !== "undefined" &&
    (isTouch ||
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (typeof window !== "undefined" && window.innerWidth < 768));

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDataSaver = typeof navigator !== "undefined" && Boolean((navigator as any).connection?.saveData);

  const { hasWebGL, renderer, isBudgetHardware, isMidHardware, maxTextureSize } = probeWebGL();

  let tier: DeviceTier = "HIGH";

  // Tier Classification with safe defaults for unknown devices:
  if (!hasWebGL || prefersReducedMotion || isDataSaver) {
    // Immediate conservative fallback
    tier = "LOW";
  } else if (isBudgetHardware) {
    tier = "LOW";
  } else if (isMobile) {
    // STRICT MOBILE GATE: Mobile devices NEVER receive HIGH unless they have
    // verified flagship capabilities (>=8 cores, >=6GB RAM, maxTextureSize >= 8192)
    if (cores <= 4 || memoryGB <= 3 || maxTextureSize <= 4096) {
      tier = "LOW";
    } else if (cores >= 8 && memoryGB >= 6 && !isMidHardware && maxTextureSize >= 8192) {
      tier = "HIGH";
    } else {
      // Safe default for all mid-range and unknown mobile devices
      tier = "MEDIUM";
    }
  } else {
    // Desktop / Laptop
    if (cores <= 2 || memoryGB <= 2) {
      tier = "LOW";
    } else if (cores <= 4 || memoryGB <= 4 || isMidHardware) {
      tier = "MEDIUM";
    } else {
      tier = "HIGH";
    }
  }

  // Synchronize with DOM for instant global CSS adaptations
  if (typeof document !== "undefined") {
    document.documentElement.dataset.tier = tier.toLowerCase();
    if (tier === "LOW") {
      document.documentElement.classList.add("reduce-blur");
    }
  }

  const result: DeviceCapabilities = {
    tier,
    cores,
    memoryGB,
    dpr,
    isMobile,
    prefersReducedMotion,
    gpuRenderer: renderer,
    hasWebGL,
    // Intelligent DPR capping: mobile devices with 3.0+ DPR are capped to avoid rendering 9x pixels
    maxDpr: tier === "LOW" ? 1.0 : tier === "MEDIUM" ? Math.min(dpr, 1.15) : Math.min(dpr, 1.5),
    enableFloat: tier === "HIGH",
    enableContactShadows: tier !== "LOW",
    shadowResolution: tier === "HIGH" ? 512 : 256,
    enableBlurOrbs: tier !== "LOW",
    enableEntranceAnimations: tier !== "LOW",
    lightCount: tier === "LOW" ? 3 : tier === "MEDIUM" ? 5 : 7,
    geometryDetail: tier === "LOW" ? "low" : tier === "MEDIUM" ? "mid" : "high",
    lensMaterialMode: tier === "LOW" ? "standard" : "physical",
    blurBudget: tier === "LOW" ? 0 : tier === "MEDIUM" ? 50 : 140,
  };

  cached = result;
  return result;
}

// ---------------------------------------------------------------------------
// SSR-safe defaults (assume HIGH until client hydrates)
// ---------------------------------------------------------------------------
const SSR_DEFAULTS: DeviceCapabilities = {
  tier: "HIGH",
  cores: 8,
  memoryGB: 8,
  dpr: 1,
  isMobile: false,
  prefersReducedMotion: false,
  gpuRenderer: "ssr",
  hasWebGL: true,
  maxDpr: 1.5,
  enableFloat: true,
  enableContactShadows: true,
  shadowResolution: 512,
  enableBlurOrbs: true,
  enableEntranceAnimations: true,
  lightCount: 7,
  geometryDetail: "high",
  lensMaterialMode: "physical",
  blurBudget: 140,
};

const noop = () => () => {};

/**
 * Detect device performance tier and return capability flags.
 * Runs once on mount, caches forever. SSR-safe.
 */
export function useDeviceTier(): DeviceCapabilities {
  return useSyncExternalStore(noop, detect, () => SSR_DEFAULTS);
}

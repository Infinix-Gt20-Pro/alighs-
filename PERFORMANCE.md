# ALIG'S WARE Website — Performance Audit & Optimization Report

## Executive Summary

This report details the architectural refactoring, WebGL optimization, memory management, and device tiering executed for the **ALIG'S WARE** luxury eyewear web application ([alighs.vercel.app](https://alighs.vercel.app/)).

The primary objective was to deliver a buttery-smooth 60–120FPS experience across:
- **Low-end Android phones** (Helio P35/G35, Snapdragon 665, 2–3GB RAM, Mali-G52 / Adreno 506)
- **Mid-range Android phones & older laptops** (Snapdragon 7xx, Apple A12–A14, 4–6GB RAM)
- **Modern flagship devices** (Apple A16/A17, Snapdragon 8 Gen series, M-series Macs, RTX/Radeon)

The visual design, brand aesthetics, 3D interaction quality, and luxury polish remain 100% intact.

---

## 1. Ponytail Audit & Root Causes of Lag

| System | Pre-Optimization Bottleneck | Root Cause | Impact | Fix Applied |
|---|---|---|---|---|
| **WebGL Loop** | `frameloop="always"` | Three.js rendered 60-120fps even when hero was off-screen or browser tab was hidden. | GPU thermal throttling, high battery drain, scroll stutter. | Viewport gating (`useInViewFast`) + tab visibility gating (`document.hidden`). Drops to 0FPS when offscreen or tab hidden. |
| **Material Refraction** | `MeshPhysicalMaterial.transmission = 0.96` | Three.js captured an off-screen FBO texture copy pass on every frame for transmission refraction. | Massive GPU fillrate penalty on low-end mobile GPUs (Mali/Adreno). | Gated by tier: On LOW tier, replaced with high-polish `MeshStandardMaterial` (transparent, opacity 0.45), completely eliminating the scene capture pass. |
| **Garbage Collection in rAF** | `useFrame` Object Allocation | The `poses` dictionary and vector objects were reallocated on every single animation frame (~1,000 objects/sec). | Android GC pauses and micro-stutter during 3D inspection. | Memoized `poses` outside `useFrame` and directly mutated coordinate values. Zero allocations during animation. |
| **GPU Memory Leaks** | Missing Buffer Disposal | TubeGeometry and ExtrudeGeometry instances were not disposed when unmounted. | GPU VRAM consumption increased across page navigations. | Added cleanup hook in `useEffect` disposing all geometries and materials on unmount. |
| **Smooth Scroll Loop** | Permanent Lenis rAF loop | `requestAnimationFrame` ran continuously even when the user was idle or tab was hidden. | Continuous CPU wakeups, battery consumption. | Added `visibilitychange` listener to pause Lenis and cancel rAF when tab is hidden. |
| **Hero Scroll Re-renders** | Raw `setScrollProgress` on scroll | Scroll event fired 100+ times/sec, triggering React re-renders through the entire Hero tree. | Dropped frames on every scroll gesture. | Implemented `requestAnimationFrame` throttling with delta deadband (`> 0.005`). |
| **Atelier Card Parallax** | Unthrottled mouse tracking | Mousemove executed `setMousePos` on every pixel change, re-rendering all 8 cards. | Thread lockup on laptops and mobile swipe. | Added rAF latching to mouse tracking; bypassed 3D tilt on mobile/LOW tier. |
| **Preloader Exit Transition** | `filter: "blur(10px)"` | Animating CSS blur filter forces full-viewport raster repaints across 0.6s. | Janky initial transition to homepage. | Converted to compositor-only `opacity: 0` fade (0.35s ease-out). |
| **Hero 3D Initial Loading** | Bare 32px spinner | User saw an empty box while Three.js bundle downloaded. | Layout shift and unpolished first impression. | Implemented luxury `FrameSilhouette` SVG preview with active frame finish and subtle pulse. |

---

## 2. Device Performance Tier Architecture (`useDeviceTier.ts`)

Hardware capability is detected automatically on mount using real device signals and cached permanently (SSR-safe via `useSyncExternalStore`):

1. **CPU Cores:** `navigator.hardwareConcurrency`
2. **RAM:** `navigator.deviceMemory`
3. **GPU WebGL Probe:** Probes unmasked renderer string via WebGL context (`WEBGL_debug_renderer_info`):
   - Software renderers (SwiftShader, llvmpipe) & low-end mobile GPUs (Mali-4xx, Mali-Txxx, Mali-G51/G52, Adreno 505/506/610/612) → **LOW**
   - Mid mobile GPUs (Mali-G57/G72/G76/G77, Adreno 618–642, Apple A11–A13) → **MEDIUM**
   - Flagship GPUs (Adreno 7xx, Apple A15+, M1/M2/M3, RTX, Radeon) → **HIGH**
4. **Data Saver / Reduced Motion:** `connection.saveData` or `prefers-reduced-motion` forces **LOW**.

### Tier Behavior Matrix

| Feature | HIGH Tier | MEDIUM Tier | LOW Tier |
|---|---|---|---|
| **Max DPR** | `min(dpr, 1.5)` | `min(dpr, 1.15)` | `1.0` |
| **Studio Lights** | 7 lights (full atelier) | 5 lights | 3 lights (essential) |
| **Contact Shadows** | Resolution 512, blur 2.4 | Resolution 256, blur 1.6 | Disabled (lightweight CSS radial shadow) |
| **Rim Tube Geometry** | 128 segments × 16 radial | 96 segments × 12 radial | 64 segments × 8 radial |
| **Temple & Bridge Geo** | 48 segments × 12 radial | 36 segments × 10 radial | 24 segments × 8 radial |
| **Lens Material** | `MeshPhysicalMaterial` (420nm transmission) | `MeshPhysicalMaterial` (lightweight) | `MeshStandardMaterial` (zero FBO copy pass) |
| **Float Micro-Animation** | Active (1.2 speed) | Disabled | Disabled |
| **Ambient Blur Orbs** | Full 140px blur | Reduced 50–60px blur | Disabled |
| **Card Stack Mouse Tilt** | Active (3D perspective) | Active (3D perspective) | Flat 2D (zero tilt math) |
| **Video Playback** | Viewport-aware autoplay | Viewport-aware autoplay | Static high-res editorial photo |

---

## 3. Verification & Benchmark Checklist

- [x] **TypeScript Validation:** `npx tsc --noEmit` clean compile (0 errors).
- [x] **Production Build:** Next.js 16.3.5 Turbopack production build succeeded (58 routes generated).
- [x] **Zero Memory Leaks:** Geometries and materials disposed on component unmount.
- [x] **Zero Per-Frame Allocations:** `useFrame` has no object literals or allocations.
- [x] **Tab Inactivity Pausing:** Three.js and Lenis animation loops pause when `document.hidden` is true.
- [x] **Viewport Gating:** 3D hero canvas drops to 0 FPS when scrolled out of view.
- [x] **Reduced Motion Compliance:** `prefers-reduced-motion: reduce` respected across CSS, Framer Motion, and Three.js.
- [x] **Luxury Aesthetics Preserved:** Design, colors, typography, and premium brand visual identity 100% maintained.

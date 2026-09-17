"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  User,
  Phone,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sun,
  Eye,
  Camera,
  Layers,
  Home,
  MessageSquare,
  MapPin,
  Clock,
  Scan,
} from "lucide-react";

// ============================================================================
// 1. Precise Face Shape SVG Visual Icons (5 Geometries)
// ============================================================================
function OvalFaceIcon() {
  return (
    <svg className="w-9 h-9 text-indigo-400" viewBox="0 0 40 48" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="20" cy="24" rx="13" ry="19" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 19 Q20 21 26 19" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="16" cy="23" r="1.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <circle cx="24" cy="23" r="1.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <path d="M17 32 Q20 34 23 32" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );
}

function RoundFaceIcon() {
  return (
    <svg className="w-9 h-9 text-cyan-400" viewBox="0 0 40 48" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="20" cy="24" r="16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 19 Q20 21 26 19" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="15.5" cy="23" r="1.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <circle cx="24.5" cy="23" r="1.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <path d="M17 32 Q20 34 23 32" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );
}

function SquareFaceIcon() {
  return (
    <svg className="w-9 h-9 text-purple-400" viewBox="0 0 40 48" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="7" y="7" width="26" height="34" rx="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 19 Q20 21 27 19" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="16" cy="23" r="1.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <circle cx="24" cy="23" r="1.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <path d="M16 33 Q20 34 24 33" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );
}

function HeartFaceIcon() {
  return (
    <svg className="w-9 h-9 text-pink-400" viewBox="0 0 40 48" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M8 12 Q20 6 32 12 Q34 26 20 41 Q6 26 8 12 Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 19 Q20 21 26 19" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="16" cy="23" r="1.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <circle cx="24" cy="23" r="1.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <path d="M17 31 Q20 33 23 31" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );
}

function DiamondFaceIcon() {
  return (
    <svg className="w-9 h-9 text-amber-400" viewBox="0 0 40 48" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M20 6 L33 23 L20 42 L7 23 Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 19 Q20 21 26 19" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="16" cy="23" r="1.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <circle cx="24" cy="23" r="1.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <path d="M17 32 Q20 34 23 32" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );
}

// ============================================================================
// 2. Dynamic Frame Silhouette SVG Renderer
// ============================================================================
interface FrameGraphicProps {
  type: string;
  finishColor: string;
  lensTint: string;
}

function DynamicFramePreview({ type, finishColor, lensTint }: FrameGraphicProps) {
  const getTintFill = () => {
    switch (lensTint) {
      case "bluecut":
        return "rgba(59, 130, 246, 0.25)";
      case "transitions":
        return "rgba(100, 116, 139, 0.38)";
      case "polarized":
        return "rgba(30, 41, 59, 0.5)";
      default:
        return "rgba(255, 255, 255, 0.12)";
    }
  };

  return (
    <div className="w-full h-24 flex items-center justify-center relative select-none">
      <svg className="w-48 sm:w-56 h-20" viewBox="0 0 200 80" fill="none">
        {type === "round" && (
          <>
            <circle cx="65" cy="40" r="26" fill={getTintFill()} stroke={finishColor} strokeWidth="2.5" />
            <circle cx="135" cy="40" r="26" fill={getTintFill()} stroke={finishColor} strokeWidth="2.5" />
            <path d="M91 38 Q100 33 109 38" stroke={finishColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M39 37 L15 34" stroke={finishColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M161 37 L185 34" stroke={finishColor} strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {type === "geometric" && (
          <>
            <polygon points="65,15 88,28 88,52 65,65 42,52 42,28" fill={getTintFill()} stroke={finishColor} strokeWidth="2.5" />
            <polygon points="135,15 158,28 158,52 135,65 112,52 112,28" fill={getTintFill()} stroke={finishColor} strokeWidth="2.5" />
            <path d="M88 38 L112 38" stroke={finishColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M42 34 L18 30" stroke={finishColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M158 34 L182 30" stroke={finishColor} strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {type === "clubmaster" && (
          <>
            <path d="M38 22 Q65 18 90 24" stroke={finishColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M110 24 Q135 18 162 22" stroke={finishColor} strokeWidth="6" strokeLinecap="round" />
            <rect x="42" y="24" width="46" height="34" rx="10" fill={getTintFill()} stroke={finishColor} strokeWidth="1.8" />
            <rect x="112" y="24" width="46" height="34" rx="10" fill={getTintFill()} stroke={finishColor} strokeWidth="1.8" />
            <path d="M88 30 Q100 24 112 30" stroke={finishColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M38 22 L16 28" stroke={finishColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M162 22 L184 28" stroke={finishColor} strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {type === "rimless" && (
          <>
            <rect x="40" y="22" width="48" height="36" rx="12" fill={getTintFill()} stroke={finishColor} strokeWidth="1" strokeDasharray="3 3" />
            <rect x="112" y="22" width="48" height="36" rx="12" fill={getTintFill()} stroke={finishColor} strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="85" cy="40" r="2.5" fill={finishColor} />
            <circle cx="115" cy="40" r="2.5" fill={finishColor} />
            <path d="M85 40 Q100 33 115 40" stroke={finishColor} strokeWidth="2" strokeLinecap="round" />
            <circle cx="43" cy="38" r="2" fill={finishColor} />
            <circle cx="157" cy="38" r="2" fill={finishColor} />
            <path d="M43 38 L18 36" stroke={finishColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M157 38 L182 36" stroke={finishColor} strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {type === "acetate" && (
          <>
            <rect x="38" y="20" width="50" height="38" rx="8" fill={getTintFill()} stroke={finishColor} strokeWidth="5.5" strokeLinejoin="round" />
            <rect x="112" y="20" width="50" height="38" rx="8" fill={getTintFill()} stroke={finishColor} strokeWidth="5.5" strokeLinejoin="round" />
            <path d="M88 28 Q100 22 112 28" stroke={finishColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M38 24 L16 20" stroke={finishColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M162 24 L184 20" stroke={finishColor} strokeWidth="5" strokeLinecap="round" />
          </>
        )}

        {/* Specular Glint */}
        <line x1="52" y1="28" x2="68" y2="46" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="122" y1="28" x2="138" y2="46" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
}

// Face Shapes Catalog (5 Geometries)
const faceShapes = [
  {
    id: "oval",
    label: "Oval Face",
    desc: "Balanced facial symmetry with soft jawline",
    recs: "Clubmaster & Wayfarer",
    icon: <OvalFaceIcon />,
  },
  {
    id: "round",
    label: "Round Face",
    desc: "Equal width & length with curved cheeks",
    recs: "Hexagon & Bold Acetate",
    icon: <RoundFaceIcon />,
  },
  {
    id: "square",
    label: "Square Face",
    desc: "Strong chiseled jawline & broad forehead",
    recs: "Classic Round & Rimless",
    icon: <SquareFaceIcon />,
  },
  {
    id: "heart",
    label: "Heart Face",
    desc: "Wide temple tapering to delicate chin",
    recs: "Air-Rimless & Oval",
    icon: <HeartFaceIcon />,
  },
  {
    id: "diamond",
    label: "Diamond Face",
    desc: "High cheekbones with slim forehead",
    recs: "Browline & Cat-Eye",
    icon: <DiamondFaceIcon />,
  },
];

// Frame Width Options (Lenskart Sizing)
const frameWidths = [
  { id: "narrow", label: "Narrow (Small)", range: "125 - 132 mm", desc: "Petite faces & slim temples" },
  { id: "medium", label: "Medium (Universal)", range: "133 - 139 mm", desc: "Standard 75% universal fit" },
  { id: "wide", label: "Wide (Broad)", range: "140 - 148 mm", desc: "Comfortable spacious bridge" },
];

// Silhouettes Catalog
const silhouettes = [
  {
    id: "clubmaster",
    title: "Clubmaster Browline",
    subtitle: "Executive intellectual prestige with hand-cut acetate upper frame.",
    weight: "14.6g",
    badge: "Bestseller",
  },
  {
    id: "rimless",
    title: "Air-Titanium Rimless",
    subtitle: "Zero-gravity drill mount. Barely-there minimalist titanium architecture.",
    weight: "9.8g",
    badge: "Ultralight",
  },
  {
    id: "geometric",
    title: "Hexagonal Facet",
    subtitle: "Contemporary 6-sided geometric frame for bold statement fashion.",
    weight: "13.2g",
    badge: "Modern Edge",
  },
  {
    id: "round",
    title: "Classic P3 Round Wire",
    subtitle: "Vintage heritage round wireframe inspired by timeless Firozabad optics.",
    weight: "11.5g",
    badge: "Heritage",
  },
  {
    id: "acetate",
    title: "Bold Italian Acetate",
    subtitle: "Substantial high-polish organic acetate with deep lustrous sheen.",
    weight: "18.4g",
    badge: "Handcrafted",
  },
];

// Finishes Catalog
const finishes = [
  { id: "titanium", label: "Brushed Titanium", color: "#a1a1aa", hex: "#a1a1aa" },
  { id: "obsidian", label: "Matte Obsidian", color: "#18181b", hex: "#27272a" },
  { id: "gold", label: "24K Champagne Gold", color: "#eab308", hex: "#eab308" },
  { id: "cobalt", label: "Electric Cobalt", color: "#38bdf8", hex: "#38bdf8" },
  { id: "tortoise", label: "Firozabad Havana", color: "#b45309", hex: "#b45309" },
];

// Lens Tech Catalog
const lensTechs = [
  {
    id: "bluecut",
    title: "Zero Power BLU Tech",
    spec: "420nm Screen Shield",
    desc: "Zero power blue-ray block with anti-fatigue coating for screens and digital work.",
    badge: "Popular for Work",
    icon: <Zap className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "single_vision",
    title: "Single Vision Custom Rx",
    spec: "Custom Power + Anti-Glare",
    desc: "Accurate spherical & cylindrical lens for Distance (-ve) or Reading (+ve) power.",
    badge: "Prescription",
    icon: <Eye className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "progressive",
    title: "Seamless Progressive Multifocal",
    spec: "Distance + Computer + Near",
    desc: "No visible bifocal lines. Smooth optical transition from car dashboard to phone screen.",
    badge: "Premium Optics",
    icon: <Layers className="w-5 h-5 text-purple-400" />,
  },
  {
    id: "transitions",
    title: "Photochromic Sun-Transitions",
    spec: "Auto Tint UV Reaction",
    desc: "Crystal clear indoors, seamlessly darkens to deep sunglasses tint under sunlight.",
    badge: "2-in-1 Dual Life",
    icon: <Sun className="w-5 h-5 text-amber-400" />,
  },
];

// Services Catalog
const services = [
  {
    id: "home_tryon",
    title: "Free Home Try-On Kit",
    subtitle: "3 frames delivered to your doorstep. Try for 48 hours completely free.",
    badge: "Lenskart Standard",
    icon: <Home className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: "whatsapp",
    title: "WhatsApp Optometrist Call",
    subtitle: "Direct video consultation & prescription review within 15 minutes.",
    badge: "Instant 1-on-1",
    icon: <MessageSquare className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "store_visit",
    title: "Firozabad Store VIP Lounge",
    subtitle: "Personalized fitting appointment at our flagship Firozabad optical workshop.",
    badge: "Store Fitting",
    icon: <Clock className="w-5 h-5 text-amber-400" />,
  },
];

// ============================================================================
// 3. Main Advanced Lead Generation & AI Optical Studio
// ============================================================================
export default function LeadGenSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    faceShape: "oval",
    frameWidth: "medium",
    silhouette: "clubmaster",
    finish: "titanium",
    lensTech: "bluecut",
    serviceType: "home_tryon",
    name: "",
    phone: "",
    city: "",
  });

  // Simulated AI Face Scan
  const handleTriggerAIScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setFormData((prev) => ({
        ...prev,
        faceShape: "oval",
        frameWidth: "medium",
        silhouette: "clubmaster",
      }));
    }, 2200);
  };

  const nextStep = () => {
    if (step < 4) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenId(`#ALIGH-${Math.floor(1000 + Math.random() * 9000)}`);
    setSubmitted(true);
  };

  // Calculate dynamic match score
  const matchScore = useMemo(() => {
    let score = 96.4;
    if (formData.faceShape === "oval") score += 2.8;
    if (formData.frameWidth === "medium") score += 0.6;
    return Math.min(score, 99.8).toFixed(1);
  }, [formData.faceShape, formData.frameWidth]);

  // Selected Finish Color object
  const activeFinishObj = useMemo(() => {
    return finishes.find((f) => f.id === formData.finish) || finishes[0];
  }, [formData.finish]);

  // Sliding animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 380, damping: 32 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring" as const, stiffness: 380, damping: 32 },
        opacity: { duration: 0.18 },
      },
    }),
  };

  return (
    <section id="lead-form" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto z-20">
      
      {/* ======================================================================
          HEADER & BRAND VALUE PILL
          ====================================================================== */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-pill text-xs font-mono text-cyan-300 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ALIGH&apos;S SMART OPTICAL STUDIO &bull; POWERED BY AI FIT</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-tight">
          Find Your Perfect Match
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 font-normal mt-2.5 max-w-xl mx-auto leading-relaxed">
          Discover your exact optical frame with advanced facial geometry analysis, custom frame dimensions, and Firozabad craftsmanship.
        </p>
      </div>

      {/* ======================================================================
          FROSTED GLASS CARD CONTAINER
          ====================================================================== */}
      <div
        ref={cardRef}
        className="relative rounded-3xl backdrop-blur-2xl bg-white/[0.04] border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.7)] p-5 sm:p-8 md:p-10 overflow-hidden"
      >
        {/* Specular Ambient Glow Spots */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/15 blur-[100px]" />

        {!submitted ? (
          <>
            {/* ==================================================================
                4-STEP PROGRESS STEPPER BAR
                ================================================================== */}
            <div className="relative z-10 mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { stepNum: 1, title: "Face & Size" },
                  { stepNum: 2, title: "Frame Style" },
                  { stepNum: 3, title: "Lens Tech" },
                  { stepNum: 4, title: "Try-On & Match" },
                ].map((s, idx) => {
                  const isActive = step === s.stepNum;
                  const isPassed = step > s.stepNum;

                  return (
                    <React.Fragment key={s.stepNum}>
                      <button
                        type="button"
                        onClick={() => {
                          if (step > s.stepNum) {
                            setDirection(-1);
                            setStep(s.stepNum);
                          }
                        }}
                        className={`flex items-center gap-2 text-left cursor-pointer transition-colors whitespace-nowrap ${
                          isActive ? "text-white" : isPassed ? "text-neutral-300" : "text-neutral-500"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                            isActive
                              ? "bg-cyan-600 text-white shadow-[0_0_14px_rgba(6,182,212,0.6)] border border-cyan-400"
                              : isPassed
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
                              : "bg-white/5 border border-white/10"
                          }`}
                        >
                          {isPassed ? <Check className="w-3.5 h-3.5" /> : s.stepNum}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold tracking-tight">{s.title}</span>
                      </button>

                      {idx < 3 && (
                        <div className="flex-1 min-w-[20px] max-w-[80px] h-[2px] bg-white/10 mx-1 sm:mx-2 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"
                            initial={{ width: "0%" }}
                            animate={{ width: step > s.stepNum ? "100%" : "0%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* ==================================================================
                FORM STEPS ANIMATION
                ================================================================== */}
            <form onSubmit={handleSubmit} className="relative z-10 min-h-[420px] flex flex-col justify-between">
              <AnimatePresence mode="wait" custom={direction}>
                
                {/* --------------------------------------------------------------
                    STEP 1: FACE SHAPE & FRAME WIDTH CALCULATOR
                    -------------------------------------------------------------- */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-6"
                  >
                    {/* Header + AI Scanner Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                          <span>Step 1: Face Shape &amp; Sizing Geometry</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-300 mt-0.5 font-light">
                          Select face shape and frame width to ensure your glasses sit snugly on temples.
                        </p>
                      </div>

                      {/* Simulated AI Scanner Button */}
                      <button
                        type="button"
                        onClick={handleTriggerAIScan}
                        disabled={isScanning}
                        className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
                      >
                        <Scan className={`w-4 h-4 ${isScanning ? "animate-spin text-cyan-400" : ""}`} />
                        <span>{isScanning ? "Scanning Geometry..." : scanComplete ? "✓ AI Match Active" : "⚡ Scan Face with AI"}</span>
                      </button>
                    </div>

                    {/* AI Scanner Animated Viewport overlay when scanning */}
                    {isScanning && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-between gap-4 overflow-hidden relative"
                      >
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
                            <Camera className="w-5 h-5 animate-bounce" />
                          </div>
                          <div>
                            <p className="text-xs font-mono font-semibold text-white">AI BIOMETRIC OPTICAL SCANNER</p>
                            <p className="text-[11px] font-mono text-cyan-300/80 mt-0.5">Analyzing cheekbone curvature, temple width (136mm), and IPD ratio...</p>
                          </div>
                        </div>
                        <div className="w-16 h-1.5 rounded-full bg-cyan-500/20 overflow-hidden">
                          <div className="w-full h-full bg-cyan-400 animate-[pulse_0.8s_ease-in-out_infinite]" />
                        </div>
                      </motion.div>
                    )}

                    {/* Face Shapes Grid (5 options) */}
                    <div>
                      <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-2.5">
                        Select Face Contour
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {faceShapes.map((shape) => {
                          const isSelected = formData.faceShape === shape.id;
                          return (
                            <div
                              key={shape.id}
                              onClick={() => setFormData({ ...formData, faceShape: shape.id })}
                              className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-2.5 border relative ${
                                isSelected
                                  ? "bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                                  : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/20"
                              }`}
                            >
                              {isSelected && (
                                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px]">
                                  <Check className="w-2.5 h-2.5" />
                                </span>
                              )}
                              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                                {shape.icon}
                              </div>
                              <div>
                                <span className="font-semibold text-xs sm:text-sm text-white block">{shape.label}</span>
                                <span className="text-[10px] text-neutral-400 mt-1 block leading-tight">{shape.desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Frame Width / Size Gauge (Lenskart Sizing) */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                          Frame Width Sizing (Hinges Distance)
                        </span>
                        <span className="text-xs font-mono text-cyan-400">
                          {frameWidths.find((w) => w.id === formData.frameWidth)?.range}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {frameWidths.map((w) => {
                          const isSelected = formData.frameWidth === w.id;
                          return (
                            <div
                              key={w.id}
                              onClick={() => setFormData({ ...formData, frameWidth: w.id })}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                isSelected
                                  ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md"
                                  : "bg-white/[0.03] border-white/5 text-neutral-400 hover:text-white"
                              }`}
                            >
                              <div>
                                <span className="text-xs font-bold block text-white">{w.label}</span>
                                <span className="text-[10px] text-neutral-400">{w.desc}</span>
                              </div>
                              <span className="text-xs font-mono text-cyan-300 font-semibold">{w.range}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* --------------------------------------------------------------
                    STEP 2: FRAME SILHOUETTE & PREMIUM FINISH
                    -------------------------------------------------------------- */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Step 2: Frame Architecture &amp; Handcrafted Finish
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 mt-0.5 font-light">
                        Choose between handcrafted Firozabad workshop styles and aerospace titanium finishes.
                      </p>
                    </div>

                    {/* Silhouettes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {silhouettes.map((item) => {
                        const isSelected = formData.silhouette === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setFormData({ ...formData, silhouette: item.id })}
                            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between ${
                              isSelected
                                ? "bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                                : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/20"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                                  {item.badge}
                                </span>
                                <span className="text-[10px] font-mono text-cyan-400 font-semibold">{item.weight}</span>
                              </div>
                              <span className="font-bold text-sm text-white block mt-1">{item.title}</span>
                              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-light">{item.subtitle}</p>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                              <span className="text-[11px] font-mono text-neutral-400">Select</span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? "border-cyan-400 bg-cyan-500 text-white" : "border-white/20"
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Finish / Material Color Selector */}
                    <div>
                      <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                        Metal &amp; Acetate Material Finish
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {finishes.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, finish: f.id })}
                            className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2.5 transition-all cursor-pointer ${
                              formData.finish === f.id
                                ? "bg-white/15 border-white/40 text-white shadow-lg"
                                : "bg-white/[0.03] border-white/5 text-neutral-400 hover:text-white"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full border border-white/30 flex-shrink-0" style={{ backgroundColor: f.color }} />
                            <span className="truncate">{f.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* --------------------------------------------------------------
                    STEP 3: PRECISION LENS TECH & PRESCRIPTION
                    -------------------------------------------------------------- */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Step 3: Precision Lens Technology &amp; Coating
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 mt-0.5 font-light">
                        Screen use, night driving, ya custom eyesight power ke according laboratory-tested optical coating chunein.
                      </p>
                    </div>

                    {/* Lens Tech Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {lensTechs.map((lens) => {
                        const isSelected = formData.lensTech === lens.id;
                        return (
                          <div
                            key={lens.id}
                            onClick={() => setFormData({ ...formData, lensTech: lens.id })}
                            className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between ${
                              isSelected
                                ? "bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                                : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/20"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10">
                                  {lens.icon}
                                </div>
                                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 font-semibold">
                                  {lens.badge}
                                </span>
                              </div>
                              <h4 className="font-bold text-base text-white">{lens.title}</h4>
                              <p className="text-xs font-mono text-cyan-400/90 mt-0.5">{lens.spec}</p>
                              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{lens.desc}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                              <span className="text-xs font-mono text-neutral-400">Apply Lens Tech</span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSelected ? "border-cyan-400 bg-cyan-500 text-white" : "border-white/20"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Prescription Assurance Banner */}
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                      <span>Zero Power se lekar High Cylindrical Rx tak &bull; Firozabad store optometrist will verify your power via WhatsApp.</span>
                    </div>
                  </motion.div>
                )}

                {/* --------------------------------------------------------------
                    STEP 4: LIVE AI MATCH RECOMMENDATION & CONSULTATION
                    -------------------------------------------------------------- */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Step 4: Your Custom AI Recommendation &amp; Consultation
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 mt-0.5 font-light">
                        Aapke selections ke basis par custom frame generated hai. Free home try-on ya direct expert call book karein.
                      </p>
                    </div>

                    {/* Live Match Engine Preview Card */}
                    <div className="p-5 rounded-2xl bg-black/40 border border-cyan-400/30 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                      
                      {/* Left: Frame Silhouette Graphic */}
                      <div className="md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                        <DynamicFramePreview
                          type={formData.silhouette}
                          finishColor={activeFinishObj.hex}
                          lensTint={formData.lensTech}
                        />
                        <span className="text-[11px] font-mono text-cyan-300 mt-1 uppercase tracking-wider">
                          ALIGH {formData.silhouette.toUpperCase()} &bull; {activeFinishObj.label}
                        </span>
                      </div>

                      {/* Middle: Calculated Telemetry Specs */}
                      <div className="md:col-span-1 space-y-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4 font-mono text-xs">
                        <div className="flex items-center justify-between text-neutral-400">
                          <span>AI MATCH SCORE</span>
                          <span className="text-emerald-400 font-bold">{matchScore}% MATCH</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-400">
                          <span>FACE GEOMETRY</span>
                          <span className="text-white capitalize">{formData.faceShape}</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-400">
                          <span>FRAME WIDTH</span>
                          <span className="text-white capitalize">{formData.frameWidth}</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-400">
                          <span>LENS OPTICS</span>
                          <span className="text-cyan-300 capitalize">{formData.lensTech.replace("_", " ")}</span>
                        </div>
                      </div>

                      {/* Right: Guarantee Badge */}
                      <div className="md:col-span-1 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>100% Free Consultation</span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed font-light">
                          No obligations. Firozabad quality offline guarantee ke sath free sample trial deliver hoga.
                        </p>
                      </div>
                    </div>

                    {/* Select Consultation Delivery Channel */}
                    <div>
                      <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                        Choose Consultation Delivery
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {services.map((srv) => {
                          const isSelected = formData.serviceType === srv.id;
                          return (
                            <div
                              key={srv.id}
                              onClick={() => setFormData({ ...formData, serviceType: srv.id })}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                                isSelected
                                  ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md"
                                  : "bg-white/[0.03] border-white/5 text-neutral-400 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1.5">
                                {srv.icon}
                                <span className="text-xs font-bold text-white">{srv.title}</span>
                              </div>
                              <p className="text-[11px] text-neutral-400 font-light">{srv.subtitle}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact Details Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-neutral-400">YOUR NAME *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="Aapka Naam"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.08] transition-all"
                          />
                        </div>
                      </div>

                      {/* Phone / WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-neutral-400">PHONE / WHATSAPP *</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            placeholder="+91 72173 71499"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.08] transition-all"
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-neutral-400">CITY / PINCODE</label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="e.g. Firozabad / Agra / Delhi"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.08] transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* ================================================================
                  BOTTOM NAVIGATION BUTTONS
                  ================================================================ */}
              <div className="flex items-center justify-between pt-8 mt-6 border-t border-white/10">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-neutral-300 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 shadow-[0_0_16px_rgba(6,182,212,0.4)] border border-cyan-400/40 transition-all cursor-pointer"
                  >
                    <span>Next: {step === 1 ? "Choose Style" : step === 2 ? "Lens Technology" : "Review Recommendation"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-mono font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(6,182,212,0.5)] border border-cyan-400/50 transition-all cursor-pointer"
                  >
                    <span>Confirm Free Consultation &amp; Fit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </>
        ) : (
          /* ====================================================================
              SUCCESS CONFIRMATION STATE
              ==================================================================== */
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="text-center py-12 space-y-5"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              AI MATCH &bull; FREE TRIAL RESERVED
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Shukriya, {formData.name || "Customer"}!
            </h3>
            <p className="text-neutral-300 text-sm max-w-lg mx-auto leading-relaxed">
              Humne aapka <strong className="text-cyan-400 capitalize">{formData.faceShape}</strong> face profile,{" "}
              <strong className="text-indigo-300 capitalize">{formData.silhouette}</strong> frame style, aur{" "}
              <strong className="text-amber-300 capitalize">{formData.lensTech.replace("_", " ")}</strong> lens option successfully lock kar liya hai.
            </p>

            {/* Token & WhatsApp Action */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="px-5 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 font-mono text-xs text-neutral-300">
                TOKEN ID: <strong className="text-cyan-400">{tokenId || "#ALIGH-8821"}</strong>
              </div>
              <a
                href={`https://wa.me/917217371499?text=Hello%20ALIGSWARE,%20my%20Token%20ID%20is%20${tokenId}.%20I%20have%20selected%20the%20${formData.silhouette}%20frame.`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Now</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-mono border border-white/10 transition-colors cursor-pointer"
              >
                Scan Another Profile
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Trust & Early Access Badge */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-center text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Firozabad Workshop Priority Booking</span>
        </div>
        <span className="hidden sm:inline">&bull;</span>
        <p>
          Waitlist members receive priority access to the early APK release and digital 3D try-on features.
        </p>
      </div>

      {/* ======================================================================
          'ALIGH'S WARE APP COMING SOON' & 'JOIN APK WAITLIST'
          ====================================================================== */}
      <div className="mt-14 flex flex-col items-center justify-center text-center">
        
        {/* App Hype Text */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-sm font-mono mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Smartphone className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-semibold tracking-wider">Aligh&apos;s Ware 3D Virtual Try-On App Coming Soon.</span>
        </div>

        {/* Liquid Wave Animated Button Container */}
        <div className="relative group">
          {/* Animated Neon Ambient Aura Glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-70 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse" />

          {/* Waitlist Button: Join APK Waitlist */}
          <button
            onClick={() => {
              cardRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="
              relative overflow-hidden
              px-8 sm:px-12 py-4 sm:py-5
              rounded-2xl
              bg-[#0a0a0a]
              border-2 border-cyan-400/60
              group-hover:border-indigo-300
              shadow-[0_0_30px_rgba(6,182,212,0.35)]
              text-white font-bold text-base sm:text-lg tracking-wider uppercase font-mono
              cursor-pointer select-none
              transition-all duration-500
              group-hover:scale-[1.02]
              group-active:scale-[0.98]
            "
          >
            {/* Liquid Wave CSS Background Layer */}
            <div
              className="
                pointer-events-none absolute inset-x-0 bottom-0 h-0
                bg-gradient-to-t from-cyan-500 via-indigo-500 to-purple-600/80
                group-hover:h-[350%]
                transition-all duration-700 ease-out
                rounded-t-[50%]
                opacity-90
              "
            />

            {/* Specular Edge Sheen */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* Button Foreground Content */}
            <span className="relative z-10 flex items-center justify-center gap-3 drop-shadow-md">
              <Zap className="w-5 h-5 text-cyan-300 group-hover:text-white transition-colors" />
              <span>Join APK Waitlist</span>
              <Smartphone className="w-5 h-5 text-indigo-300 group-hover:text-white transition-colors" />
            </span>
          </button>
        </div>

        {/* Footnote under button */}
        <p className="text-xs text-neutral-400 font-mono mt-3 max-w-md">
          Early APK release direct download link aur digital 3D try-on access waitlist members ko sabse pehle milega.
        </p>
      </div>

    </section>
  );
}

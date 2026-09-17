// src/components/FrameSilhouette.tsx
"use client";

import React from "react";

interface FrameSilhouetteProps {
  shape?: string;
  frameType?: "full-rim" | "half-rim" | "rimless" | string;
  color?: string;
  isSunglass?: boolean;
  className?: string;
}

export default function FrameSilhouette({
  shape = "rectangle",
  frameType = "full-rim",
  color = "#D4AF37",
  isSunglass = false,
  className = "w-48 h-24"
}: FrameSilhouetteProps) {
  const normShape = shape.toLowerCase();
  const strokeColor = color;
  const lensFill = isSunglass ? "url(#sunGradient)" : "url(#blueCutGradient)";
  const strokeWidth = frameType === "rimless" ? 0 : frameType === "half-rim" ? 2.5 : 3.5;

  return (
    <svg
      viewBox="0 0 200 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="blueCutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.25" />
        </linearGradient>

        <linearGradient id="sunGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#18181b" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#27272a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#09090b" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {normShape === "round" && (
        <g>
          <circle cx="58" cy="45" r="30" fill={lensFill} stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="58" cy="45" r="28" fill="url(#sheen)" pointerEvents="none" />
          <circle cx="142" cy="45" r="30" fill={lensFill} stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="142" cy="45" r="28" fill="url(#sheen)" pointerEvents="none" />
          <path d="M 88 42 Q 100 34 112 42" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="28" y1="42" x2="12" y2="40" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="172" y1="42" x2="188" y2="40" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="85" cy="50" rx="2" ry="4" fill={strokeColor} />
          <ellipse cx="115" cy="50" rx="2" ry="4" fill={strokeColor} />
        </g>
      )}

      {normShape === "aviator" && (
        <g>
          <path
            d="M 32 30 C 35 22, 75 22, 84 28 C 88 38, 86 64, 62 68 C 38 70, 30 52, 32 30 Z"
            fill={lensFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <path
            d="M 168 30 C 165 22, 125 22, 116 28 C 112 38, 114 64, 138 68 C 162 70, 170 52, 168 30 Z"
            fill={lensFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <path d="M 40 24 L 160 24" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 84 32 Q 100 30 116 32" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="28" x2="12" y2="28" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="168" y1="28" x2="188" y2="28" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {normShape === "clubmaster" && (
        <g>
          <rect x="32" y="24" width="56" height="46" rx="14" fill={lensFill} stroke={strokeColor} strokeWidth={frameType === "half-rim" ? 1.5 : strokeWidth} />
          <path d="M 28 25 C 32 18, 82 18, 90 26 L 88 34 C 80 27, 36 27, 30 35 Z" fill={strokeColor} />
          <circle cx="34" cy="27" r="1.5" fill="#ffffff" opacity="0.8" />
          <rect x="112" y="24" width="56" height="46" rx="14" fill={lensFill} stroke={strokeColor} strokeWidth={frameType === "half-rim" ? 1.5 : strokeWidth} />
          <path d="M 172 25 C 168 18, 118 18, 110 26 L 112 34 C 120 27, 164 27, 170 35 Z" fill={strokeColor} />
          <circle cx="166" cy="27" r="1.5" fill="#ffffff" opacity="0.8" />
          <path d="M 88 32 Q 100 26 112 32" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="28" y1="28" x2="10" y2="28" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          <line x1="172" y1="28" x2="190" y2="28" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {normShape === "cat-eye" && (
        <g>
          <path
            d="M 28 22 C 45 18, 80 24, 88 30 C 90 48, 76 66, 52 66 C 34 66, 26 48, 28 22 Z"
            fill={lensFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <path
            d="M 172 22 C 155 18, 120 24, 112 30 C 110 48, 124 66, 148 66 C 166 66, 174 48, 172 22 Z"
            fill={lensFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <path d="M 88 32 Q 100 28 112 32" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="26" y1="22" x2="10" y2="22" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="174" y1="22" x2="190" y2="22" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )}

      {normShape === "hexagonal" && (
        <g>
          <polygon
            points="46,24 74,24 88,44 74,66 46,66 32,44"
            fill={lensFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="126,24 154,24 168,44 154,66 126,66 112,44"
            fill={lensFill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <path d="M 88 40 Q 100 34 112 40" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="40" x2="14" y2="38" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="168" y1="40" x2="186" y2="38" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {normShape !== "round" && normShape !== "aviator" && normShape !== "clubmaster" && normShape !== "cat-eye" && normShape !== "hexagonal" && (
        <g>
          <rect
            x="32"
            y="24"
            width="58"
            height="44"
            rx={normShape === "wayfarer" ? "12" : "8"}
            fill={lensFill}
            stroke={frameType === "rimless" ? "none" : strokeColor}
            strokeWidth={strokeWidth}
          />
          <rect x="34" y="26" width="54" height="40" rx="6" fill="url(#sheen)" pointerEvents="none" />
          <rect
            x="110"
            y="24"
            width="58"
            height="44"
            rx={normShape === "wayfarer" ? "12" : "8"}
            fill={lensFill}
            stroke={frameType === "rimless" ? "none" : strokeColor}
            strokeWidth={strokeWidth}
          />
          <rect x="112" y="26" width="54" height="40" rx="6" fill="url(#sheen)" pointerEvents="none" />

          {frameType === "half-rim" && (
            <>
              <line x1="32" y1="68" x2="90" y2="68" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="110" y1="68" x2="168" y2="68" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3" />
            </>
          )}

          {frameType === "rimless" ? (
            <>
              <circle cx="86" cy="36" r="2" fill={strokeColor} />
              <circle cx="114" cy="36" r="2" fill={strokeColor} />
              <circle cx="36" cy="36" r="2" fill={strokeColor} />
              <circle cx="164" cy="36" r="2" fill={strokeColor} />
              <path d="M 88 36 Q 100 32 112 36" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="36" y1="36" x2="16" y2="34" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="164" y1="36" x2="184" y2="34" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M 90 38 Q 100 32 110 38" stroke={strokeColor} strokeWidth={normShape === "wayfarer" ? 4 : 3} strokeLinecap="round" />
              <line x1="32" y1="32" x2="12" y2="32" stroke={strokeColor} strokeWidth={normShape === "wayfarer" ? 4.5 : 3.5} strokeLinecap="round" />
              <line x1="168" y1="32" x2="188" y2="32" stroke={strokeColor} strokeWidth={normShape === "wayfarer" ? 4.5 : 3.5} strokeLinecap="round" />
              {normShape === "wayfarer" && (
                <>
                  <ellipse cx="36" cy="29" rx="1.5" ry="1" fill="#ffffff" opacity="0.9" />
                  <ellipse cx="164" cy="29" rx="1.5" ry="1" fill="#ffffff" opacity="0.9" />
                </>
              )}
            </>
          )}
        </g>
      )}
    </svg>
  );
}

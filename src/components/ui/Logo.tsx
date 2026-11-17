'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  height?: number;
}

export function Logo({ className = '', iconOnly = false, height = 40 }: LogoProps) {
  // viewBox: 0 0 170 140 for icon, 0 0 440 140 for full logo
  const viewBox = iconOnly ? '0 0 170 140' : '0 0 440 140';
  const width = iconOnly ? Math.round(height * 1.21) : Math.round(height * 3.14);

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NextGen IT Hub"
    >
      <defs>
        {/* Electric Cyan-to-Blue Gradients */}
        <linearGradient id="ngBluePrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>

        <linearGradient id="ngBlueHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id="ngBlueDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="ngSwoosh" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="45%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* 3D Metallic Slate / Titanium Gradient for G */}
        <linearGradient id="ngSlateMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="ngSlateHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* ======================================================== */}
      {/* 1. EMBLEM: 3D "NG" MONOGRAM + SWOOSH + TECH PIXELS       */}
      {/* ======================================================== */}
      <g id="emblem">
        {/* Letter G (Background 3D layer) */}
        <g>
          {/* Main G Body */}
          <path
            d="M 125 32 C 142 32 152 44 152 60 L 152 64 L 132 64 L 132 61 C 132 54 128 49 122 49 C 114 49 108 55 108 68 C 108 81 114 88 123 88 C 130 88 133 83 133 76 L 118 76 L 118 63 L 152 63 L 152 90 C 146 101 135 106 122 106 C 98 106 87 91 87 69 C 87 47 101 32 125 32 Z"
            fill="url(#ngSlateMetal)"
            className="dark:fill-slate-200"
          />
          {/* G 3D Bevel Top Edge */}
          <path
            d="M 125 32 C 142 32 152 44 152 60 L 147 57 C 147 46 138 36 125 36 C 104 36 92 49 92 69 L 87 69 C 87 47 101 32 125 32 Z"
            fill="url(#ngSlateHighlight)"
            opacity="0.8"
          />
        </g>

        {/* Letter N (Foreground 3D layer) */}
        <g id="letter-N">
          {/* Left Vertical Column */}
          <path
            d="M 28 28 L 50 28 L 50 108 L 28 108 Z"
            fill="url(#ngBluePrimary)"
          />
          {/* Left Column Highlight Bevel */}
          <path
            d="M 28 28 L 34 24 L 34 104 L 28 108 Z"
            fill="#38BDF8"
            opacity="0.9"
          />

          {/* Right Vertical Column */}
          <path
            d="M 72 28 L 94 28 L 94 108 L 72 108 Z"
            fill="url(#ngBluePrimary)"
          />

          {/* 3D Diagonal Slash */}
          <path
            d="M 46 28 L 94 98 L 74 108 L 28 38 Z"
            fill="url(#ngBlueHighlight)"
          />
          {/* Diagonal Shadow Underlap */}
          <path
            d="M 50 36 L 94 98 L 94 108 L 84 108 Z"
            fill="url(#ngBlueDark)"
            opacity="0.5"
          />
        </g>

        {/* Cyber Orbital Swoosh wrapping around NG */}
        <g id="swoosh">
          <path
            d="M 14 86 C 10 94 20 98 38 92 C 65 84 102 68 138 48 C 158 37 165 29 160 25 C 155 21 143 25 125 34 C 88 52 48 70 24 81 C 17 84 14 85 14 86 Z"
            fill="url(#ngSwoosh)"
            style={{ filter: 'drop-shadow(0px 2px 3px rgba(2, 132, 199, 0.35))' }}
          />
        </g>

        {/* Floating Cyber Tech Pixels / Digital Data Blocks */}
        <g id="pixels">
          <rect x="150" y="14" width="9" height="9" rx="1.5" fill="#00D4FF" />
          <rect x="162" y="24" width="7" height="7" rx="1" fill="#0284C7" />
          <rect x="154" y="32" width="6" height="6" rx="1" fill="#38BDF8" />
          <rect x="142" y="8" width="5" height="5" rx="1" fill="#0369A1" className="dark:fill-cyan-300" />
          <rect x="164" y="12" width="4" height="4" rx="0.8" fill="#00D4FF" />
        </g>
      </g>

      {/* ======================================================== */}
      {/* 2. TYPOGRAPHY: "NextGen" + "— IT HUB —"                   */}
      {/* ======================================================== */}
      {!iconOnly && (
        <g id="brand-text">
          {/* "Next" in vibrant electric blue */}
          <text
            x="184"
            y="76"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="54"
            fontWeight="900"
            letterSpacing="-1.5"
            fill="url(#ngBlueHighlight)"
          >
            Next
          </text>

          {/* "Gen" in dark slate (light mode) / pure white (dark mode) */}
          <text
            x="304"
            y="76"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="54"
            fontWeight="900"
            letterSpacing="-1.5"
            className="fill-slate-900 dark:fill-white transition-colors"
          >
            Gen
          </text>

          {/* Subtitle Accent Bar Left */}
          <line
            x1="186"
            y1="98"
            x2="250"
            y2="98"
            stroke="url(#ngBluePrimary)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Subtitle "IT HUB" */}
          <text
            x="300"
            y="104"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="18"
            fontWeight="900"
            letterSpacing="6"
            fill="#0284C7"
          >
            IT HUB
          </text>

          {/* Subtitle Accent Bar Right */}
          <line
            x1="350"
            y1="98"
            x2="414"
            y2="98"
            stroke="url(#ngBluePrimary)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}

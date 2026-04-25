"use client";

import { useEffect, useState } from "react";

export function BurjMonolith({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Luminous rays emanating from base */}
      <svg
        viewBox="0 0 400 600"
        className="w-full h-full"
        style={{
          filter: "drop-shadow(0 0 30px rgba(212, 168, 83, 0.4))",
        }}
      >
        <defs>
          {/* Golden gradient for the monolith */}
          <linearGradient id="monolithGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#0f0f0f" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>

          {/* Edge highlight gradient */}
          <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4a853" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f5d78e" stopOpacity="1" />
            <stop offset="100%" stopColor="#d4a853" stopOpacity="0.8" />
          </linearGradient>

          {/* Radial glow for the base */}
          <radialGradient id="baseGlow" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#d4a853" stopOpacity="1" />
            <stop offset="40%" stopColor="#d4a853" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
          </radialGradient>

          {/* Light ray gradient */}
          <linearGradient id="rayGradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#d4a853" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Light rays emanating from base */}
        <g
          className={`transition-opacity duration-1000 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          {[...Array(12)].map((_, i) => {
            const angle = (i - 5.5) * 8;
            const x1 = 200;
            const y1 = 520;
            const length = 180 + Math.random() * 60;
            const x2 = x1 + Math.sin((angle * Math.PI) / 180) * length;
            const y2 = y1 + Math.cos((angle * Math.PI) / 180) * length;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#rayGradient)"
                strokeWidth={1 + Math.random()}
                opacity={0.3 + Math.random() * 0.4}
                className="luminous-line"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            );
          })}
        </g>

        {/* Base glow */}
        <ellipse
          cx="200"
          cy="520"
          rx="80"
          ry="20"
          fill="url(#baseGlow)"
          className={`transition-opacity duration-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* The monolith tower */}
        <path
          d="M200 60 L160 520 L240 520 Z"
          fill="url(#monolithGradient)"
          stroke="#262626"
          strokeWidth="1"
        />

        {/* Left edge glow line */}
        <line
          x1="200"
          y1="60"
          x2="160"
          y2="520"
          stroke="url(#edgeGlow)"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Right edge glow line */}
        <line
          x1="200"
          y1="60"
          x2="240"
          y2="520"
          stroke="url(#edgeGlow)"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Center luminous line */}
        <line
          x1="200"
          y1="80"
          x2="200"
          y2="520"
          stroke="#d4a853"
          strokeWidth="3"
          opacity="0.9"
          className="luminous-line"
        />

        {/* Apex point glow */}
        <circle cx="200" cy="60" r="4" fill="#d4a853" opacity="0.8" />
      </svg>
    </div>
  );
}

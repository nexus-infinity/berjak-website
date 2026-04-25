"use client";

import { BurjMonolith } from "./burj-monolith";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grain-overlay">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-24 pb-16">
        {/* Monolith */}
        <div className="w-48 h-72 md:w-64 md:h-96 mb-12">
          <BurjMonolith />
        </div>

        {/* Arabic Script */}
        <div className="mb-8">
          <span className="font-serif text-5xl md:text-7xl text-primary text-glow-gold">
            برج
          </span>
        </div>

        {/* Wordmark */}
        <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wider text-foreground mb-6">
          burj
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide text-center max-w-md">
          Tower of Trade
        </p>

        {/* Etymology subtitle */}
        <p className="mt-4 text-sm text-muted-foreground/70 tracking-widest uppercase">
          Clarity · Elevation · Orientation
        </p>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Explore
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}

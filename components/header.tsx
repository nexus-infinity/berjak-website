"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { GeometricNav } from "./geometric-nav";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Wordmark */}
          <a href="/" className="flex items-center gap-3">
            <span className="font-serif text-2xl font-light tracking-wide text-primary">
              burj
            </span>
          </a>

          {/* Desktop Navigation */}
          <GeometricNav className="hidden md:flex" />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-6 border-t border-border/50 mt-4">
            <div className="flex flex-col gap-4">
              <a
                href="#evidence"
                className="flex items-center gap-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="geometric-symbol text-primary">●</span>
                <span className="uppercase tracking-widest text-sm">Evidence</span>
              </a>
              <a
                href="#heritage"
                className="flex items-center gap-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="geometric-symbol text-primary">▼</span>
                <span className="uppercase tracking-widest text-sm">Heritage</span>
              </a>
              <a
                href="#approach"
                className="flex items-center gap-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="geometric-symbol text-primary">▲</span>
                <span className="uppercase tracking-widest text-sm">Approach</span>
              </a>
              <a
                href="#contact"
                className="flex items-center gap-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="geometric-symbol text-primary">◼</span>
                <span className="uppercase tracking-widest text-sm">Contact</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

"use client";

import { cn } from "@/lib/utils";

interface GeometricNavItem {
  symbol: string;
  label: string;
  meaning: string;
  href: string;
}

const navItems: GeometricNavItem[] = [
  { symbol: "●", label: "Evidence", meaning: "Witness", href: "#evidence" },
  { symbol: "▼", label: "Time", meaning: "Law / Spine", href: "#heritage" },
  { symbol: "▲", label: "Pattern", meaning: "Synthesis", href: "#approach" },
  { symbol: "◼", label: "Manifest", meaning: "Execution", href: "#contact" },
];

export function GeometricNav({ className }: { className?: string }) {
  return (
    <nav className={cn("flex items-center gap-8", className)}>
      {navItems.map((item) => (
        <a
          key={item.symbol}
          href={item.href}
          className="group flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105"
        >
          <span className="geometric-symbol text-2xl text-primary opacity-60 group-hover:opacity-100 transition-opacity">
            {item.symbol}
          </span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

export function GeometricSymbol({
  symbol,
  size = "md",
  className,
}: {
  symbol: "●" | "▼" | "▲" | "◼";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <span
      className={cn(
        "geometric-symbol text-primary inline-block",
        sizeClasses[size],
        className
      )}
    >
      {symbol}
    </span>
  );
}

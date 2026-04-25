export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-serif text-xl text-primary">burj</span>
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Burj. All rights reserved.
            </p>
          </div>

          {/* Geometric Navigation */}
          <div className="flex items-center gap-6">
            <span className="geometric-symbol text-primary opacity-60">●</span>
            <span className="geometric-symbol text-primary opacity-60">▼</span>
            <span className="geometric-symbol text-primary opacity-60">▲</span>
            <span className="geometric-symbol text-primary opacity-60">◼</span>
          </div>

          {/* Legacy Attribution */}
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground/70 uppercase tracking-widest">
              Formerly Berjak & Partners
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              Est. 1954 · Melbourne, Australia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { GeometricSymbol } from "./geometric-nav";

export function HeritageSection() {
  return (
    <section id="heritage" className="py-24 md:py-32 bg-muted relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12">
          <GeometricSymbol symbol="▼" size="lg" />
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              Heritage
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
              Time · Law · Spine
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Origin Story */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl text-primary">The Origin</h3>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Berjak</strong> emerged from
              the synthesis of two founders — BER + JAK — a personal,
              historical marker of who we were. A legacy of metals and minerals
              trading established in Melbourne since 1954.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Now, we evolve into <strong className="text-primary">Burj</strong>{" "}
              — the tower, the structure, the signal. What the system becomes: a
              clear monolith, a navigational landmark for trade.
            </p>
          </div>

          {/* Etymology */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl text-primary">The Name</h3>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Burj</strong> (Arabic: برج)
              means <em>tower</em>, <em>fortress</em>, or{" "}
              <em>elevated structure</em>. It carries dual significance:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>
                  <strong className="text-foreground">Tower / Landmark</strong>:
                  Visibility, protection, signal. A point of orientation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">—</span>
                <span>
                  <strong className="text-foreground">
                    Station / Constellation
                  </strong>
                  : In astronomy, a station in the sky. Semantic positioning,
                  meaning-by-location.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-20 pt-12 border-t border-border">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            <div className="text-center">
              <span className="font-serif text-4xl md:text-5xl text-primary">
                1954
              </span>
              <p className="text-sm text-muted-foreground mt-2 uppercase tracking-widest">
                Founded
              </p>
            </div>
            <div className="text-center">
              <span className="font-serif text-4xl md:text-5xl text-primary">
                70+
              </span>
              <p className="text-sm text-muted-foreground mt-2 uppercase tracking-widest">
                Years
              </p>
            </div>
            <div className="text-center">
              <span className="font-serif text-4xl md:text-5xl text-primary">
                Melbourne
              </span>
              <p className="text-sm text-muted-foreground mt-2 uppercase tracking-widest">
                Australia
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

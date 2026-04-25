import { GeometricSymbol } from "./geometric-nav";

const principles = [
  {
    symbol: "●" as const,
    title: "Evidence",
    subtitle: "Witness",
    description:
      "We ground every decision in observable reality. Material specifications, market conditions, quality standards — all verified before commitment.",
  },
  {
    symbol: "▼" as const,
    title: "Time",
    subtitle: "Law / Spine",
    description:
      "Seven decades of accumulated knowledge form the structural backbone. Established relationships, proven processes, enduring standards.",
  },
  {
    symbol: "▲" as const,
    title: "Pattern",
    subtitle: "Synthesis",
    description:
      "We recognize market patterns and synthesize disparate signals into coherent strategy. Connecting supply with demand across continents.",
  },
  {
    symbol: "◼" as const,
    title: "Manifest",
    subtitle: "Execution",
    description:
      "Ideas become shipments. Contracts become deliveries. We execute with precision, transforming agreement into physical reality.",
  },
];

export function ApproachSection() {
  return (
    <section id="approach" className="py-24 md:py-32 bg-background relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <GeometricSymbol symbol="▲" size="lg" />
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              Approach
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
              Pattern · Synthesis
            </p>
          </div>
        </div>

        {/* Geometric System Introduction */}
        <div className="max-w-2xl mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our operational philosophy is encoded in a geometric semantic
            system. Four symbols represent the cardinal modes of trade
            execution—each appearing wherever orientation is needed.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="group p-8 bg-card border border-border rounded-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <GeometricSymbol
                  symbol={principle.symbol}
                  size="lg"
                  className="opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <div className="flex-1">
                  <h3 className="font-serif text-xl text-foreground mb-1">
                    {principle.title}
                  </h3>
                  <p className="text-xs text-primary uppercase tracking-widest mb-4">
                    {principle.subtitle}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

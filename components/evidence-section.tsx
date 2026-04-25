import { GeometricSymbol } from "./geometric-nav";

const tradingCategories = [
  {
    name: "Ferrous Metals",
    items: ["HMS Scrap", "Shredded Steel", "Rail Steel", "Bundled Steel", "Tinplate"],
  },
  {
    name: "Non-Ferrous Metals",
    items: ["Copper Scrap", "Brass", "Aluminum UBC", "Zinc Ingots", "Bronze Alloys"],
  },
  {
    name: "Minerals",
    items: ["Rutile Sand", "Mineral Sands", "Industrial Minerals"],
  },
];

export function EvidenceSection() {
  return (
    <section id="evidence" className="py-24 md:py-32 bg-card relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <GeometricSymbol symbol="●" size="lg" />
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              Evidence
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
              Witness · Observable Reality
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="max-w-2xl mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed">
            We trade in materials that form the foundation of industry. Each
            category represents decades of specialized knowledge, established
            supplier relationships, and quality-verified supply chains.
          </p>
        </div>

        {/* Trading Categories */}
        <div className="grid md:grid-cols-3 gap-8">
          {tradingCategories.map((category) => (
            <div key={category.name} className="space-y-6">
              <h3 className="font-serif text-xl text-primary border-b border-border pb-3">
                {category.name}
              </h3>
              <ul className="space-y-3">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Market Statement */}
        <div className="mt-20 pt-12 border-t border-border text-center">
          <blockquote className="font-serif text-2xl md:text-3xl font-light text-foreground italic max-w-3xl mx-auto">
            &ldquo;Trading in Ferrous/Non Ferrous Metals & Minerals since 1954&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}

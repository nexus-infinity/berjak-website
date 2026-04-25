import { GeometricSymbol } from "./geometric-nav";
import { Mail, Phone, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-muted relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <GeometricSymbol symbol="◼" size="lg" />
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              Manifest
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
              Execution · Contact
            </p>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xl text-primary mb-6">
                Connect With Us
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Ready to discuss your metals and minerals trading requirements?
                Our team brings seven decades of market expertise to every
                conversation.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href="mailto:trading@berjak.com.au"
                className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground/70">
                    Email
                  </p>
                  <p className="text-foreground">trading@berjak.com.au</p>
                </div>
              </a>

              <a
                href="tel:+61395966999"
                className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground/70">
                    Phone
                  </p>
                  <p className="text-foreground">+61-3-9596 6999</p>
                </div>
              </a>

              <div className="flex items-center gap-4 text-muted-foreground group">
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground/70">
                    Location
                  </p>
                  <p className="text-foreground">240 Bay Street</p>
                  <p className="text-foreground">Brighton, Victoria 3186</p>
                  <p className="text-foreground">Australia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form Placeholder */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="font-serif text-xl text-foreground mb-6">
              Trade Inquiry
            </h3>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-muted-foreground mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full bg-muted border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-muted-foreground mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-muted border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="inquiry"
                  className="block text-sm text-muted-foreground mb-2"
                >
                  Inquiry
                </label>
                <textarea
                  id="inquiry"
                  name="inquiry"
                  rows={4}
                  className="w-full bg-muted border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="Describe your trading requirements..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded font-medium hover:bg-primary/90 transition-colors"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

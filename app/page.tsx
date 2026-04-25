import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { EvidenceSection } from "@/components/evidence-section";
import { HeritageSection } from "@/components/heritage-section";
import { ApproachSection } from "@/components/approach-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <EvidenceSection />
      <HeritageSection />
      <ApproachSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

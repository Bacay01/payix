import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { PartnersSection } from "@/components/landing/partners-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { AnalysisSection } from "@/components/landing/analysis-section";
import { EarningsSection } from "@/components/landing/earnings-section";
import { FintechSection } from "@/components/landing/fintech-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <PartnersSection />
        <FeaturesSection />
        <AnalysisSection />
        <EarningsSection />
        <FintechSection />
      </main>
      <Footer />
    </>
  );
}
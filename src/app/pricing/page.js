import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { PricingCards } from "@/app/pricing/pricing-cards";
import AnimatedContent from "@/components/AnimatedContent";
import BlurText from "@/components/BlurText";

export const metadata = {
  title: "Pricing — Payix",
  description: "Simple, transparent pricing. Start free, upgrade when you grow.",
};

const faqs = [
  {
    q: "Can I use Payix for free?",
    a: "Yes. The Personal plan is free forever — no credit card required to sign up.",
  },
  {
    q: "What happens after the Business trial ends?",
    a: "You can enter payment details to continue, or you're automatically moved to the free Personal plan. No surprise charges.",
  },
  {
    q: "Can I switch plans later?",
    a: "Anytime. Upgrades apply instantly and downgrades take effect at the end of your billing period.",
  },
  {
    q: "Do you charge transaction fees?",
    a: "Transfers between Payix accounts are always free. External transfers use transparent mid-market rates with a small disclosed fee.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="hero-gradient">
          <div className="container mx-auto px-6 py-20 text-center lg:py-24">
            <Badge>{"{ Simple Pricing }"}</Badge>
            <BlurText
              text="Start free. Upgrade when you grow."
              delay={80}
              animateBy="words"
              direction="top"
              className="mx-auto mt-5 max-w-2xl justify-center text-4xl font-semibold tracking-tight sm:text-5xl"
            />
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              No hidden fees, no surprise charges. Every plan includes the core
              Payix platform.
            </p>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="container mx-auto px-6 py-16">
            <PricingCards />
          </div>
        </section>

        <section className="border-t border-border">
          <div className="container mx-auto max-w-3xl px-6 py-20">
            <h2 className="text-center text-3xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
            <div className="mt-10 space-y-4">
              {faqs.map((faq, index) => (
                <AnimatedContent key={faq.q} distance={40} duration={0.6} delay={index * 0.1}>
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                    <p className="font-medium">{faq.q}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
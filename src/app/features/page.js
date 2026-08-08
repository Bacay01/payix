import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/BlurText";
import AnimatedContent from "@/components/AnimatedContent";
import { ArrowUpRight, Check, Zap, CreditCard, BarChart, Globe, Shield, Users } from "@/components/icons";

export const metadata = {
  title: "Features — Payix",
  description: "Everything Payix gives you to manage cards, payments, and money flow.",
};

const features = [
  {
    icon: Zap,
    title: "Instant Payouts",
    description:
      "Send and receive money in seconds, not days. Direct payouts to cards and bank accounts in 196+ countries.",
  },
  {
    icon: CreditCard,
    title: "Card Issuing",
    description:
      "Launch your own physical and virtual cards. Full control over limits, categories, and spending rules.",
  },
  {
    icon: BarChart,
    title: "Smart Analytics",
    description:
      "Track income and expenses in real time. Weekly, monthly, and yearly views of exactly where money moves.",
  },
  {
    icon: Globe,
    title: "Multi-currency Accounts",
    description:
      "Hold, convert, and spend in multiple currencies with transparent mid-market exchange rates.",
  },
  {
    icon: Shield,
    title: "Bank-grade Security",
    description:
      "Biometric login, real-time fraud monitoring, and instant card freeze. Your money stays yours.",
  },
  {
    icon: Users,
    title: "Team Access",
    description:
      "Invite your team with role-based permissions. Approvals, spending limits, and full audit trails built in.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page hero */}
        <section className="hero-gradient">
          <div className="container mx-auto px-6 py-20 text-center lg:py-28">
            <Badge>{"{ Powerful Features }"}</Badge>
            <BlurText
              text="Everytime you need to move money with confidence"
              delay={80}
              animateBy="words"
              direction="top"
              className="mx-auto mt-5 max-w-2xl justify-center text-4xl font-semibold tracking-tight sm:text-5xl"
            />
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              One platform for payments, cards, and financial insight — built
              for both personal and business accounts.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button variant="primary" size="lg">Open An Account</Button>
              <Button variant="outline" size="lg">Sign In</Button>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="border-t border-border">
          <div className="container mx-auto px-6 py-20">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <AnimatedContent
                    key={feature.title}
                    distance={60}
                    duration={0.7}
                    delay={index * 0.1}
                  >
                    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/60 text-accent-foreground shadow-sm">
                        <Icon size={20} />
                      </span>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="font-medium">{feature.title}</p>
                        <ArrowUpRight
                          size={16}
                          className="text-accent opacity-0 transition-all duration-300 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </AnimatedContent>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="border-t border-border">
          <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="mx-auto max-w-lg text-3xl font-semibold tracking-tight">
              Ready to simplify your payments?
            </h2>
            <div className="mt-6 flex justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Check size={16} className="text-success" /> No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-success" /> Fast acceptance
              </span>
            </div>
            <Button variant="primary" size="lg" className="mt-8">
              Open An Account
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
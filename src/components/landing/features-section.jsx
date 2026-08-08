import { ArrowUpRight, ChevronRight } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import AnimatedContent from "@/components/AnimatedContent";

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border">
      <div className="container mx-auto px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Badge>{"{ Powerful Features }"}</Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Explore the standout features</h2>
          <p className="mt-4 text-muted-foreground">
            Which spokesperson is my target audience responding to. Get real-time answers to improve your creative mid-flight. And see what&apos;s worked in the past to get intel for your next campaign.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <AnimatedContent distance={60} duration={0.7} delay={0}>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-accent/20" />
                <div>
                  <p className="text-sm font-medium">Sahawardi khis</p>
                  <p className="text-xs text-muted-foreground">info@sahawardikhis</p>
                </div>
                <span className="ml-auto text-sm font-medium">659.00</span>
              </div>
              <div className="mt-5 rounded-xl bg-background p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>TARGETING</span>
                  <span className="flex items-center gap-1 text-success">
                    <ArrowUpRight size={12} /> 3.2%
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold">$10,000</p>
                <p className="mt-1 text-xs text-success">4.5% vs last month</p>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground">
                  See Details <ChevronRight size={14} />
                </div>
              </div>
              <p className="mt-4 font-medium">Targeting and Analize</p>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={60} duration={0.7} delay={0.15}>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="rounded-xl bg-background p-4">
                <p className="text-xs text-muted-foreground">Full name</p>
                <p className="mt-1 text-sm font-medium">John Smith</p>
                <p className="mt-3 text-xs text-muted-foreground">Company</p>
                <p className="mt-1 text-sm font-medium">Payix.</p>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">Total Income</p>
                  <p className="mt-1 text-2xl font-semibold">$8,884.00</p>
                </div>
              </div>
              <p className="mt-4 font-medium">Business Out-income</p>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={60} duration={0.7} delay={0.3}>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="rounded-xl bg-background p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Available Balance</span>
                  <ArrowUpRight size={12} />
                </div>
                <p className="mt-1 text-2xl font-semibold">$9,684.00</p>
                <p className="mt-3 text-xs text-muted-foreground">Exp. Date</p>
                <p className="text-sm font-medium">12 / 2024</p>
                <svg viewBox="0 0 120 40" className="mt-3 h-10 w-full text-accent">
                  <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="0,30 15,25 30,32 45,15 60,22 75,8 90,18 105,4 120,12" />
                </svg>
              </div>
              <p className="mt-4 font-medium">Easily Customised</p>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}

import BlurText from "@/components/BlurText";
import Image from "next/image";
import { Check, Sparkles } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero1.png"
        alt=""
        fill
        priority
        className="object-cover object-right"
      />

      {/* Readability overlay: fades from solid page color on the left to transparent on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />

      <div className="container relative mx-auto px-6 py-24 lg:py-36">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            <Sparkles size={14} className="text-accent" />
            4.9 (6k+ Reviews) by Trustpilot
          </span>

          <BlurText
            text="Simplify management and payments from a single platform"
            delay={80}
            animateBy="words"
            direction="top"
            className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
          />

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Meet the new standard for a modern card platform. Launch your
            product, issue cards, and grow your revenue.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="/auth"><Button variant="primary" size="lg">Open An Account</Button></a>

            <a href="/auth"><Button variant="outline" size="lg" className="backdrop-blur-sm">Sign In</Button></a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check size={16} className="text-success" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-success" />
              Fast acceptance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
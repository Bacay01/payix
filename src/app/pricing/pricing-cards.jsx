"use client";

import { useState } from "react";
import { Check } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AnimatedContent from "@/components/AnimatedContent";

const plans = [
  {
    name: "Personal",
    monthly: 0,
    yearly: 0,
    description: "For everyday spending and saving.",
    cta: "Get Started Free",
    variant: "outline",
    features: [
      "Free Payix account & virtual card",
      "Send & receive in 196+ countries",
      "Basic spending analytics",
      "2 currency accounts",
      "Email support",
    ],
  },
  {
    name: "Business",
    monthly: 19,
    yearly: 15,
    description: "For teams that move money daily.",
    cta: "Start 14-day Trial",
    variant: "primary",
    popular: true,
    features: [
      "Everything in Personal",
      "Unlimited team members & roles",
      "Physical + virtual card issuing",
      "Advanced analytics & reports",
      "10 currency accounts",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    yearly: null,
    description: "For platforms and banks at scale.",
    cta: "Contact Sales",
    variant: "outline",
    features: [
      "Everything in Business",
      "Cloud-based API access",
      "Dedicated account manager",
      "Custom card programs",
      "SLA & compliance support",
    ],
  },
];

export function PricingCards() {
  const [period, setPeriod] = useState("monthly");

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex items-center rounded-full border border-border bg-secondary p-1 text-sm">
          <button
            onClick={() => setPeriod("monthly")}
            className={cn(
              "rounded-full px-5 py-1.5 transition-colors",
              period === "monthly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod("yearly")}
            className={cn(
              "rounded-full px-5 py-1.5 transition-colors",
              period === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            Yearly
            <span className="ml-1.5 text-xs text-accent">-20%</span>
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <AnimatedContent
            key={plan.name}
            distance={60}
            duration={0.7}
            delay={index * 0.15}
          >
            <div
              className={cn(
                "relative rounded-2xl border bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1",
                plan.popular ? "border-accent" : "border-border"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                  Most Popular
                </span>
              )}

              <p className="font-medium">{plan.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-5 flex items-baseline gap-1">
                {plan.monthly === null ? (
                  <span className="text-3xl font-semibold">Custom</span>
                ) : (
                  <>
                    <span className="text-4xl font-semibold">
                      ${period === "monthly" ? plan.monthly : plan.yearly}
                    </span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </>
                )}
              </div>
              {plan.monthly !== null && period === "yearly" && plan.yearly > 0 && (
                <p className="mt-1 text-xs text-accent">Billed yearly</p>
              )}

              <Button variant={plan.variant} className="mt-6 w-full">
                {plan.cta}
              </Button>

              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-success" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </div>
  );
}
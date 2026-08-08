import { ChevronRight } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const legend = [
  { label: "Living", color: "bg-accent" },
  { label: "Shopping", color: "bg-danger" },
  { label: "Travel", color: "bg-amber-400" },
  { label: "Saving", color: "bg-success" },
];

const bars = [40, 65, 50, 90, 60, 75];

export function EarningsSection() {
  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-6 py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="order-2 space-y-6 lg:order-1">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between text-sm font-medium">
                Total Expenses
                <span className="text-xs text-success">↑ 3.2%</span>
              </div>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full">
                <span className="w-[35%] bg-accent" />
                <span className="w-[25%] bg-danger" />
                <span className="w-[15%] bg-amber-400" />
                <span className="w-[25%] bg-success" />
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                {legend.map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground">
                See Details <ChevronRight size={14} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between text-sm font-medium">
                Revenue Overview
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">Last Week</span>
              </div>
              <div className="mt-5 flex h-28 items-end gap-3">
                {bars.map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} className="flex-1 rounded-md bg-accent/70" />
                ))}
              </div>
              <p className="mt-4 text-2xl font-semibold">$8,884.00</p>
              <p className="text-xs text-muted-foreground">Our latest marketing campaign</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Badge>{"{ Watch your money work }"}</Badge>
            <h2 className="mt-5 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">Keep track of and analyze your earnings and expenditures.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              We help to keep track of your expenses and incomes, it shows the flow of records over a specific period of time, such as weekly, monthly or yearly.
            </p>
            <Button variant="primary" size="lg" className="mt-8">Open An Account</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
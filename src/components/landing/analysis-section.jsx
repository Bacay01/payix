import { ArrowUpRight } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AnalysisSection() {
  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-6 py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge>{"{ Analysis Dashboard }"}</Badge>
            <h2 className="mt-5 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">Manage and review your income and spending.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              We help to keep track of your expenses and incomes, it shows the flow of records over a specific period of time, such as weekly, monthly or yearly.
            </p>
            <Button variant="primary" size="lg" className="mt-8">Open An Account</Button>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-accent">$</span>
                  Available Balance:
                </div>
                <span className="font-semibold">8,884.00</span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium">Total Payments</p>
                <span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">USD</span>
              </div>

              <p className="mt-4 text-4xl font-semibold text-accent">60%</p>
              <p className="text-xs text-muted-foreground">Grow since last week</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-background p-3">
                  <p className="text-[11px] text-muted-foreground">Total Income</p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                    90,560.00
                    <ArrowUpRight size={12} className="text-success" />
                  </p>
                  <p className="mt-0.5 text-[10px] text-success">60% increase compared to last week</p>
                </div>
                <div className="rounded-xl bg-background p-3">
                  <p className="text-[11px] text-muted-foreground">Total Expense</p>
                  <p className="mt-1 text-sm font-semibold">19,760.00</p>
                  <p className="mt-0.5 text-[10px] text-danger">40% decrease compared to last week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
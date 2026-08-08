import { ArrowUpRight, Cloud, Users } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FintechSection() {
  return (
    <section id="company" className="border-t border-border">
      <div className="container mx-auto px-6 py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge>{"{ Why Choose Payix }"}</Badge>
            <h2 className="mt-5 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
              Financial technology with banking license, and expert guidance
            </h2>
            <Button variant="primary" size="lg" className="mt-8">Open An Account</Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <Cloud size={16} />
                </span>
                <ArrowUpRight size={16} className="text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium">Cloud-based API</p>
              <p className="mt-2 text-sm text-muted-foreground">
                APIs are designed to simplify the development process by abstracting the underlying complexity of software systems.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <Users size={16} />
                </span>
                <ArrowUpRight size={16} className="text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium">Powered by people</p>
              <p className="mt-2 text-sm text-muted-foreground">
                APIs are designed to simplify the development process by abstracting the underlying complexity of software systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
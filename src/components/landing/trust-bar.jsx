import { CircleIcon } from "@/components/icons";

const stats = [
  { value: "160+", label: "Beneficial Cashback" },
  { value: "1.8M", label: "Satisfied Customer" },
  { value: "196+", label: "County Available" },
];

export function TrustBar() {
  return (
    <section className="border-t border-border">
      <div className="container mx-auto flex flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <CircleIcon size={18} className="text-accent" />
          <span className="max-w-xs">Powered and supported by leading international financial services</span>
        </div>

        <div className="grid grid-cols-3 gap-8 sm:gap-14">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-semibold sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
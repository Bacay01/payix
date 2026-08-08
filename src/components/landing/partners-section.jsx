const partners = ["Northline", "Vaultex", "Corebank", "Fintra", "Lumen Pay", "Meridian", "Circleback", "Trustly Co."];

export function PartnersSection() {
  const loop = [...partners, ...partners];

  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-6 py-14 text-center">
        <p className="text-sm text-muted-foreground">Our partners include some of the world&apos;s leading brands</p>

        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-16">
            {loop.map((name, i) => (
              <span key={`${name}-${i}`} className="whitespace-nowrap text-lg font-semibold tracking-tight text-muted-foreground/60">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
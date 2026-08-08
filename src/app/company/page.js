import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Shield, Users, Zap } from "@/components/icons";
import BlurText from "@/components/BlurText";
import AnimatedContent from "@/components/AnimatedContent";

export const metadata = {
  title: "Company — Payix",
  description: "The team and mission behind Payix — building the new standard for modern money.",
};

const stats = [
  { value: "2019", label: "Founded" },
  { value: "1.8M", label: "Customers" },
  { value: "196+", label: "Countries" },
  { value: "320+", label: "Employees" },
];

const values = [
  {
    icon: Shield,
    title: "Trust before growth",
    description:
      "We're licensed, regulated, and audited. Every product decision starts with keeping customer money safe.",
  },
  {
    icon: Zap,
    title: "Speed as a feature",
    description:
      "Money should move at the speed of a message. We remove every unnecessary step between you and your funds.",
  },
  {
    icon: Globe,
    title: "Borderless by default",
    description:
      "Your money shouldn't care about borders. We build for a world where sending funds abroad feels local.",
  },
  {
    icon: Users,
    title: "Powered by people",
    description:
      "Behind every API is a team that answers. Real humans, real support, real accountability.",
  },
];

const team = [
  { name: "Amara Osei", role: "Co-founder & CEO", photo: "/Amara.png" },
  { name: "Daniel Reyes", role: "Co-founder & CTO", photo: "/Daniel.png" },
  { name: "Lena Fischer", role: "Head of Product", photo: "/Lena.png" },
  { name: "Kwame Boateng", role: "Head of Engineering", photo: "/Kwame.png" },
  { name: "Sofia Marino", role: "Head of Compliance", photo: "/Sofia.png" },
  { name: "James Carter", role: "Head of Design", photo: "/James.png" },
];

export default function CompanyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="hero-gradient">
          <div className="container mx-auto px-6 py-20 text-center lg:py-28">
            <Badge>{"{ Our Company }"}</Badge>
            <BlurText
              text="Building the new standard for modern money"
              delay={80}
              animateBy="words"
              direction="top"
              className="mx-auto mt-5 max-w-2xl justify-center text-4xl font-semibold tracking-tight sm:text-5xl"
            />
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Payix started with a simple frustration: moving money was slower
              than sending a text. We&apos;re a licensed financial technology
              company fixing that — for 1.8 million people and counting.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-t border-border">
          <div className="container mx-auto grid grid-cols-2 gap-8 px-6 py-14 text-center sm:grid-cols-4">
            {stats.map((stat, index) => (
              <AnimatedContent
                key={stat.label}
                distance={40}
                duration={0.6}
                delay={index * 0.1}
              >
                <div>
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-border">
          <div className="container mx-auto px-6 py-20">
            <h2 className="text-center text-3xl font-semibold tracking-tight">
              What we believe
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <AnimatedContent
                    key={value.title}
                    distance={60}
                    duration={0.7}
                    delay={index * 0.1}
                  >
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/60 text-accent-foreground shadow-sm">
                        <Icon size={20} />
                      </span>
                      <p className="mt-4 font-medium">{value.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </AnimatedContent>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="border-t border-border">
          <div className="container mx-auto px-6 py-20">
            <h2 className="text-center text-3xl font-semibold tracking-tight">
              The people behind Payix
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {team.map((person, index) => (
                <AnimatedContent
                  key={person.name}
                  distance={40}
                  duration={0.6}
                  delay={index * 0.08}
                >
                  <div className="text-center">
                    <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-accent/30">
                      <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-3 text-sm font-medium">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        {/* Careers CTA */}
        <section className="border-t border-border">
          <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="mx-auto max-w-lg text-3xl font-semibold tracking-tight">
              Want to help build the future of money?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              We&apos;re hiring across engineering, design, and compliance —
              remote-first, worldwide.
            </p>
            <Button variant="primary" size="lg" className="mt-8">
              View Open Roles
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
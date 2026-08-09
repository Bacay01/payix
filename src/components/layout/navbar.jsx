"use client";

import { useState } from "react";
import { Menu, X } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Company", href: "/company" },
];

export function Navbar() {
  const [mode, setMode] = useState("personal");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
  <img src="/mainlogo.png" alt="Payix" className="h-8 w-8 rounded-full object-cover" />
  <span className="text-lg font-semibold tracking-tight">Payix</span>
</a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center rounded-full border border-border bg-secondary p-1 text-sm">
            <button
              onClick={() => setMode("personal")}
              className={cn(
                "rounded-full px-4 py-1.5 transition-colors",
                mode === "personal" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
              )}
            >
              Personal
            </button>
            <button
              onClick={() => setMode("business")}
              className={cn(
                "rounded-full px-4 py-1.5 transition-colors",
                mode === "business" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              Business
            </button>
          </div>
          <ThemeToggle />
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex items-center justify-between pt-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
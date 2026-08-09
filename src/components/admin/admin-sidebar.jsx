"use client";

import { usePathname } from "next/navigation";
import { CircleDot, Users, LifeBuoy, Home, LogOut } from "@/components/icons";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Users, label: "Users", href: "/admin" },
  { icon: LifeBuoy, label: "Tickets & Audit", href: "/admin/tickets" },
  { icon: Home, label: "Back to app", href: "/dashboard" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: `mutation { logOut }` }),
    });
    window.location.href = "/";
  };

  return (
    <>
      <aside className="hidden w-60 flex-col bg-primary p-5 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <CircleDot size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">Payix</p>
            <p className="text-[10px] uppercase tracking-wider opacity-60">Admin console</p>
          </div>
        </div>

        <nav className="mt-12 flex flex-1 flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors",
                  active ? "bg-white/15 font-medium" : "opacity-70 hover:bg-white/10 hover:opacity-100"
                )}
              >
                <Icon size={17} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm opacity-70 transition-colors hover:bg-white/10 hover:opacity-100"
        >
          <LogOut size={17} />
          Log out
        </button>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-md lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] transition-colors",
                active ? "text-accent" : "text-muted-foreground"
              )}
            >
              <Icon size={18} />
              <span className="truncate px-0.5">{item.label}</span>
            </a>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] text-muted-foreground"
        >
          <LogOut size={18} />
          Exit
        </button>
      </nav>
    </>
  );
}
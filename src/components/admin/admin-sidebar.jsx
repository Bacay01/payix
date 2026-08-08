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
  );
}
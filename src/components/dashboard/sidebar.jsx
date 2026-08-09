"use client";

import { usePathname } from "next/navigation";
import { CircleDot, Home, Users, Message, List, LifeBuoy, Settings, LogOut } from "@/components/icons";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Profile", href: "/dashboard/profile" },
  { icon: Message, label: "Messages", href: "#" },
  { icon: List, label: "Transactions", href: "/dashboard/transactions" },
  { icon: LifeBuoy, label: "Support", href: "/dashboard/support" },
  { icon: Settings, label: "Setting", href: "/dashboard/settings" },
];

export function Sidebar() {
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
      {/* Desktop sidebar */}
      <aside className="sidebar-gradient hidden w-60 flex-col p-5 text-white lg:flex">
        <a href="/" className="flex items-center gap-2">
  <img src="/mainlogo.png" alt="Payix" className="h-9 w-9 rounded-full object-cover" />
  <span className="text-lg font-semibold tracking-tight">Payix Bank</span>
</a>

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
                  active
                    ? "bg-white font-medium text-accent shadow-sm"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
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
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={17} />
          Log out
        </button>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/95 px-2 py-2 backdrop-blur-md lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] transition-colors",
                active ? "text-accent" : "text-muted-foreground"
              )}
            >
              <Icon size={19} />
              {item.label}
            </a>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] text-muted-foreground"
        >
          <LogOut size={19} />
          Exit
        </button>
      </nav>
    </>
  );
}
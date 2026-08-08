"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageLoader } from "@/components/loader";
import { Search, ChevronRight } from "@/components/icons";

async function gql(query, variables) {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  const load = async (q) => {
    try {
      const d = await gql(
        `query($search: String) {
          adminUsers(search: $search) {
            id name email accountType role totalBalance createdAt
            accounts { id frozen }
          }
        }`,
        { search: q || null }
      );
      setUsers(d.adminUsers);
    } catch (err) {
        console.error("adminUsers failed:", err.message);
      if (err.message.includes("authenticated")) {
        
        window.location.href = "/auth";
      } else if (err.message.includes("Admin")) {
        setDenied(true);
      }
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  if (loading) return <PageLoader message="Loading admin console…" />;

  if (denied) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-2xl font-semibold">Admin access required</p>
        <p className="text-sm text-muted-foreground">
          Your account doesn&apos;t have the admin role.
        </p>
        <a href="/dashboard" className="text-sm text-accent hover:underline">Back to dashboard</a>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <AdminSidebar />

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <p className="font-medium">Users</p>
          <ThemeToggle />
        </header>

        <main className="space-y-5 p-6">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-accent"
            />
          </div>

          <div className="rounded-2xl border border-border bg-background shadow-card">
            <div className="flex items-center justify-between px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>{users.length} users</span>
            </div>
            <ul className="divide-y divide-border">
              {users.map((u) => {
                const frozen = u.accounts.filter((a) => a.frozen).length;
                return (
                    
                  <li key={u.id}>
                    <a
                      href={`/admin/users/${u.id}`}
                      className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-secondary/60"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                          {u.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </span>
                        <div>
                          <p className="flex items-center gap-2 text-sm font-medium">
                            {u.name}
                            {u.role === "admin" && (
                              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                ADMIN
                              </span>
                            )}
                            {frozen > 0 && (
                              <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-semibold text-danger">
                                {frozen} FROZEN
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            ${u.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {u.accounts.length} card{u.accounts.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
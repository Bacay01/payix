"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageLoader } from "@/components/loader";
import { Search } from "@/components/icons";
import { cn } from "@/lib/utils";

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

const typeFilters = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
];

export default function TransactionsPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const meData = await gql(`{ me { id } }`);
      if (!meData.me) {
        window.location.href = "/auth";
        return;
      }
      const accData = await gql(`{ accounts { id name balance } }`);
      setAccounts(accData.accounts);
      if (accData.accounts[0]) setSelectedId(accData.accounts[0].id);
    })().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    gql(
      `query($id: ID!) { transactions(accountId: $id) { id type category amount description createdAt } }`,
      { id: selectedId }
    ).then((d) => setTransactions(d.transactions));
  }, [selectedId]);

  if (loading) return <PageLoader />;

  const filtered = transactions.filter((tx) => {
    if (typeFilter !== "all" && tx.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!tx.category.toLowerCase().includes(q) && !tx.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalIn = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <Sidebar />

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <p className="font-medium">Transactions</p>
          <ThemeToggle />
        </header>

        <main className="mx-auto max-w-4xl space-y-6 p-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Account picker */}
            <select
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(e.target.value)}
              className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-accent"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — ${acc.balance.toLocaleString()}
                </option>
              ))}
            </select>

            {/* Type toggle */}
            <div className="flex rounded-full border border-border bg-background p-1 text-sm">
              {typeFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTypeFilter(f.value)}
                  className={cn(
                    "rounded-full px-4 py-1.5 transition-colors",
                    typeFilter === f.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative min-w-48 flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search category or description"
                className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Totals for current view */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
              <p className="text-xs text-muted-foreground">Money in (filtered)</p>
              <p className="mt-1 text-xl font-semibold text-success">+${totalIn.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
              <p className="text-xs text-muted-foreground">Money out (filtered)</p>
              <p className="mt-1 text-xl font-semibold text-danger">-${totalOut.toLocaleString()}</p>
            </div>
          </div>

          {/* List */}
          <div className="rounded-2xl border border-border bg-background shadow-card">
            {filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No transactions match your filters.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold",
                          tx.type === "income" ? "bg-success/15 text-success" : "bg-accent/15 text-accent"
                        )}
                      >
                        {tx.category.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{tx.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.description || "—"} · {new Date(Number(tx.createdAt) || tx.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        tx.type === "income" ? "text-success" : "text-foreground"
                      )}
                    >
                      {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
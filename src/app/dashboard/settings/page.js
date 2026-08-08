"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageLoader } from "@/components/loader";
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

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        on ? "bg-danger" : "border border-border bg-secondary"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    (async () => {
      const meData = await gql(`{ me { id } }`);
      if (!meData.me) {
        window.location.href = "/auth";
        return;
      }
      const d = await gql(`{ accounts { id name balance frozen } }`);
      setAccounts(d.accounts);
    })().finally(() => setLoading(false));
  }, []);

  const handleFreeze = async (id) => {
    setBusy(id);
    try {
      const d = await gql(
        `mutation($accountId: ID!) { toggleFreeze(accountId: $accountId) { id frozen } }`,
        { accountId: id }
      );
      setAccounts((list) =>
        list.map((a) => (a.id === id ? { ...a, frozen: d.toggleFreeze.frozen } : a))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <Sidebar />

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <p className="font-medium">Settings</p>
          <ThemeToggle />
        </header>

        <main className="mx-auto max-w-3xl space-y-6 p-6 pb-28 lg:pb-6">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <p className="font-medium">Card security</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Freeze a card to instantly block all outgoing payments. Money can
              still arrive. Unfreeze anytime.
            </p>

            <ul className="mt-5 divide-y divide-border">
              {accounts.map((acc) => (
                <li key={acc.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium">
                      {acc.name}
                      {acc.frozen && (
                        <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-semibold text-danger">
                          FROZEN
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      •••• {String(acc.id).slice(-4)} · ${acc.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className={busy === acc.id ? "opacity-50" : ""}>
                    <Toggle on={acc.frozen} onClick={() => handleFreeze(acc.id)} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <p className="font-medium">Appearance</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
              <ThemeToggle />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
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

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const d = await gql(
      `query($id: ID!) {
        adminUser(id: $id) {
          id name email accountType role createdAt totalBalance
          accounts { id name currency balance frozen }
        }
      }`,
      { id }
    );
    setUser(d.adminUser);

    const t = await gql(
      `query($userId: ID!) {
        adminUserTransactions(userId: $userId) {
          id account type category amount description occurredAt frozen createdAt
        }
      }`,
      { userId: id }
    );
    setTransactions(t.adminUserTransactions);
  }, [id]);

  useEffect(() => {
    load()
      .catch((err) => {
        window.location.href = err.message.includes("Admin") ? "/dashboard" : "/auth";
      })
      .finally(() => setLoading(false));
  }, [load]);

  const toggleFreeze = async (account) => {
    const reason = window.prompt(
      `Reason for ${account.frozen ? "unfreezing" : "freezing"} "${account.name}" (recorded in the audit log):`
    );
    if (!reason) return;
    try {
      await gql(
        `mutation($accountId: ID!, $frozen: Boolean!, $reason: String!) {
          adminSetFrozen(accountId: $accountId, frozen: $frozen, reason: $reason) { id frozen }
        }`,
        { accountId: account.id, frozen: !account.frozen, reason }
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const addTransaction = async (accountId) => {
    const category = window.prompt("Entry name / category (e.g. Salary, Groceries):");
    if (!category) return;
    const type = window.prompt('Type: "income", "expense", or "transfer":', "income");
    if (!type || !["income", "expense", "transfer"].includes(type)) return alert("Type must be income, expense, or transfer.");
    const raw = window.prompt("Amount:");
    const amount = parseFloat(raw);
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid positive amount.");
    const description = window.prompt("Description (optional):") || "";
    const dateStr = window.prompt("Date (YYYY-MM-DD):", new Date().toISOString().slice(0, 10));
    const timeStr = window.prompt("Time (HH:MM, 24h):", new Date().toTimeString().slice(0, 5));
    const occurredAt = dateStr && timeStr ? new Date(`${dateStr}T${timeStr}:00`) : undefined;
    if (occurredAt && isNaN(occurredAt.getTime())) return alert("Invalid date/time.");

    try {
      await gql(
        `mutation($accountId: ID!, $type: String!, $category: String, $amount: Float!, $description: String, $occurredAt: String) {
          adminCreateTransaction(accountId: $accountId, type: $type, category: $category, amount: $amount, description: $description, occurredAt: $occurredAt) { id }
        }`,
        { accountId, type, category, amount, description, occurredAt: occurredAt?.toISOString() }
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const editTransaction = async (tx) => {
    if (tx.frozen) return alert("This entry is frozen. Unfreeze it first.");
    const category = window.prompt("Entry name / category:", tx.category);
    if (category === null) return;
    const raw = window.prompt("Amount:", tx.amount);
    const amount = parseFloat(raw);
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid positive amount.");
    const description = window.prompt("Description:", tx.description) ?? tx.description;
    const current = new Date(Number(tx.occurredAt) || tx.occurredAt);
    const dateStr = window.prompt("Date (YYYY-MM-DD):", current.toISOString().slice(0, 10));
    const timeStr = window.prompt("Time (HH:MM, 24h):", current.toTimeString().slice(0, 5));
    const occurredAt = dateStr && timeStr ? new Date(`${dateStr}T${timeStr}:00`) : undefined;
    if (occurredAt && isNaN(occurredAt.getTime())) return alert("Invalid date/time.");

    try {
      await gql(
        `mutation($transactionId: ID!, $category: String, $amount: Float, $description: String, $occurredAt: String) {
          adminEditTransaction(transactionId: $transactionId, category: $category, amount: $amount, description: $description, occurredAt: $occurredAt) { id }
        }`,
        { transactionId: tx.id, category, amount, description, occurredAt: occurredAt?.toISOString() }
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteTransaction = async (tx) => {
    if (tx.frozen) return alert("This entry is frozen. Unfreeze it first.");
    if (!window.confirm(`Delete "${tx.category}" ($${tx.amount})? This recalculates the account balance.`)) return;
    try {
      await gql(
        `mutation($transactionId: ID!) { adminDeleteTransaction(transactionId: $transactionId) }`,
        { transactionId: tx.id }
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleFreezeTransaction = async (tx) => {
    const reason = window.prompt(
      `Reason for ${tx.frozen ? "unfreezing" : "freezing"} this entry (recorded in the audit log):`
    );
    if (!reason) return;
    try {
      await gql(
        `mutation($transactionId: ID!, $frozen: Boolean!, $reason: String!) {
          adminSetTransactionFrozen(transactionId: $transactionId, frozen: $frozen, reason: $reason) { id }
        }`,
        { transactionId: tx.id, frozen: !tx.frozen, reason }
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const seedBalance = async (account) => {
    const raw = window.prompt("Test amount to apply (negative to debit):");
    if (!raw) return;
    const amount = parseFloat(raw);
    if (isNaN(amount)) return alert("Enter a valid number.");
    const note = window.prompt("Note (optional):") || "";
    try {
      await gql(
        `mutation($accountId: ID!, $amount: Float!, $note: String) {
          adminSeedBalance(accountId: $accountId, amount: $amount, note: $note) { id balance }
        }`,
        { accountId: account.id, amount, note }
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const setBalance = async (account) => {
    const raw = window.prompt(`Set "${account.name}" balance to:`, account.balance);
    if (raw === null) return;
    const target = parseFloat(raw);
    if (isNaN(target) || target < 0) return alert("Enter a valid amount.");
    const note = window.prompt("Note (optional):") || "";
    try {
      await gql(
        `mutation($accountId: ID!, $target: Float!, $note: String) {
          adminSetBalance(accountId: $accountId, target: $target, note: $note) { id balance }
        }`,
        { accountId: account.id, target, note }
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const issueCard = async () => {
    const name = window.prompt("Name for the new card:");
    if (!name) return;
    try {
      await gql(
        `mutation($userId: ID!, $name: String!) { adminIssueCard(userId: $userId, name: $name) { id } }`,
        { userId: id, name }
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <PageLoader />;
  if (!user) return <PageLoader message="User not found" />;

  const joined = new Date(Number(user.createdAt) || user.createdAt);

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <AdminSidebar />

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <div className="flex items-center gap-2 text-sm">
            <a href="/admin" className="text-muted-foreground hover:text-foreground">Users</a>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="mx-auto max-w-4xl space-y-6 p-6">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-lg font-semibold text-accent">
                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </span>
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {user.accountType} · role: {user.role}
                  {!isNaN(joined) && <> · joined {joined.toLocaleDateString()}</>}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground">Total balance</p>
                <p className="text-2xl font-semibold">
                  ${user.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Profile details are owned by the user and edited from their own Profile page.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <div className="flex items-center justify-between">
              <p className="font-medium">Cards</p>
              <Button size="sm" variant="outline" onClick={issueCard}>Issue new card</Button>
            </div>

            <ul className="mt-4 divide-y divide-border">
              {user.accounts.map((acc) => (
                <li key={acc.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
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
                      •••• {String(acc.id).slice(-4)} · ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} {acc.currency}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setBalance(acc)}>
                      Set balance
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => seedBalance(acc)}>
                      Seed test funds
                    </Button>
                    <Button
                      size="sm"
                      variant={acc.frozen ? "primary" : "outline"}
                      onClick={() => toggleFreeze(acc)}
                    >
                      {acc.frozen ? "Unfreeze" : "Freeze"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {user.accounts.map((acc) => {
            const accTx = transactions.filter((tx) => tx.account === acc.id);
            return (
              <div key={acc.id} className="rounded-2xl border border-border bg-background p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{acc.name} — history</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Admins can add, edit, delete, and freeze entries. Edits recalculate the account balance.
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => addTransaction(acc.id)}>
                    Add entry
                  </Button>
                </div>

                {accTx.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">No transactions.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-border">
                    {accTx.map((tx) => (
                      <li key={tx.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div>
                          <p className="flex items-center gap-2 text-sm font-medium">
                            {tx.category}
                            {tx.frozen && (
                              <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-semibold text-danger">
                                FROZEN
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tx.description || "—"} · {new Date(Number(tx.occurredAt) || tx.occurredAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm font-semibold", tx.type === "income" ? "text-success" : "text-foreground")}>
                            {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => editTransaction(tx)}>Edit</Button>
                          <Button size="sm" variant={tx.frozen ? "primary" : "outline"} onClick={() => toggleFreezeTransaction(tx)}>
                            {tx.frozen ? "Unfreeze" : "Freeze"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteTransaction(tx)}>Delete</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}
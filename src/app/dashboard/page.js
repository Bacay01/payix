"use client";

import { useCallback, useEffect, useState } from "react";
import { Send, Plus, Search, Bell } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/sidebar";
import { NotificationsBell } from "@/components/dashboard/notifications-bell";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { useModal } from "@/components/ui/modal-provider";

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

function Donut({ percent, size = 90, stroke = 9, className = "" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className={className}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${(percent / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-current text-base font-semibold">
        {percent}%
      </text>
    </svg>
  );
}

function BankCard({ name, cardName, balance, last4, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-[1.6/1] w-[17rem] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-[#7C3AED] to-[#4C1D95] p-5 text-left text-white shadow-card transition-all",
        selected ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : "opacity-80 hover:opacity-100"
      )}
    >
      <div className="absolute -left-10 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-14 -right-10 h-40 w-40 rounded-full bg-fuchsia-400/20 blur-2xl" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <svg width="34" height="25" viewBox="0 0 38 28">
              <rect x="1" y="1" width="36" height="26" rx="5" fill="#FCD34D" stroke="#B45309" />
              <path d="M1 10h36M1 18h36M13 1v26M25 1v26" stroke="#B45309" strokeWidth="1" fill="none" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9">
              <path d="M8.5 8.5a6 6 0 0 1 0 7" />
              <path d="M11.5 6a10 10 0 0 1 0 12" />
              <path d="M14.5 3.5a14 14 0 0 1 0 17" />
            </svg>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide opacity-70">{cardName}</p>
            <p className="text-lg font-semibold">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-sm tracking-[0.08em] sm:text-base sm:tracking-[0.14em]">
          <span>4567</span>
          <span>8896</span>
          <span>5564</span>
          <span>{last4}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide opacity-70">Card holder</p>
            <p className="text-sm font-medium">{name}</p>
          </div>
          <div className="flex items-center">
            <span className="h-7 w-7 rounded-full bg-[#EB001B] opacity-90" />
            <span className="-ml-3 h-7 w-7 rounded-full bg-[#F79E1B] opacity-90" />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const { alert, prompt } = useModal();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const account = accounts.find((a) => a.id === selectedId) ?? accounts[0];

  const loadData = useCallback(async (keepSelection) => {
    const meData = await gql(`{ me { id name email } }`);
    if (!meData.me) {
      window.location.href = "/auth";
      return;
    }
    setUser(meData.me);

    const accData = await gql(`{ accounts { id name currency balance frozen frozenReason } }`);
    setAccounts(accData.accounts);
    if (!keepSelection && accData.accounts[0]) setSelectedId(accData.accounts[0].id);
  }, []);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  useEffect(() => {
    if (!account) return;
    gql(
      `query($id: ID!) { transactions(accountId: $id) { id type category amount description occurredAt createdAt } }`,
      { id: account.id }
    ).then((d) => {
      const sorted = [...d.transactions].sort((a, b) => {
        const aTime = new Date(Number(a.occurredAt) || a.occurredAt).getTime();
        const bTime = new Date(Number(b.occurredAt) || b.occurredAt).getTime();
        return bTime - aTime;
      });
      setTransactions(sorted);
    });
  }, [account?.id, accounts]);

  const handleAddCard = async () => {
    const name = await prompt("Name for the new card (e.g. Savings, Business):");
    if (!name) return;
    const data = await gql(
      `mutation($name: String) { createAccount(name: $name) { id } }`,
      { name }
    );
    await loadData(true);
    setSelectedId(data.createAccount.id);
  };

  const handleTransaction = async (type) => {
    if (account.frozen) {
      await alert(account.frozenReason ? `This card is frozen: ${account.frozenReason}` : "This card is frozen. Contact support to resolve this before continuing.");
      return;
    }

    const label = type === "income" ? "Top up amount" : "Amount to send";
    const raw = await prompt(`${label} (USD):`);
    if (!raw) return;
    const amount = parseFloat(raw);
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid amount.");
    if (type === "expense" && amount > account.balance) return alert("Insufficient balance.");

    await gql(
      `mutation($input: CreateTransactionInput!) { createTransaction(input: $input) { id } }`,
      {
        input: {
          accountId: account.id,
          type,
          amount,
          category: type === "income" ? "Top Up" : "Transfer",
          description: type === "income" ? "Account top up" : "Money sent",
        },
      }
    );
    await loadData(true);
  };

  const handleSend = async () => {
    if (account.frozen) {
      await alert(account.frozenReason ? `This card is frozen: ${account.frozenReason}` : "This card is frozen. Contact support to resolve this before sending money.");
      return;
    }

    const toEmail = await prompt("Recipient's Payix email:");
    if (!toEmail) return;
    const raw = await prompt("Amount to send (USD):");
    if (!raw) return;
    const amount = parseFloat(raw);
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid amount.");

    try {
      await gql(
        `mutation($input: SendMoneyInput!) { sendMoney(input: $input) }`,
        { input: { fromAccountId: account.id, toEmail, amount } }
      );
      await loadData(true);
      await alert(`Sent $${amount} to ${toEmail}`);
    } catch (err) {
      await alert(err.message);
    }
  };

  if (loading) return <PageLoader />;
  if (!user) return null;

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const spendPercent = income + expense > 0 ? Math.round((expense / (income + expense)) * 100) : 0;
  const savePercent = 100 - spendPercent;

  const groups = {};
  for (const tx of transactions.slice(0, 5)) {
    const d = new Date(Number(tx.occurredAt) || tx.occurredAt);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    const key =
      d.toDateString() === today.toDateString() ? "Today"
      : d.toDateString() === yesterday.toDateString() ? "Yesterday"
      : d.toLocaleDateString(undefined, { day: "numeric", month: "long" });
    (groups[key] ??= []).push(tx);
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-secondary/40">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:px-6">
          <div className="relative hidden w-full max-w-sm sm:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search"
              className="h-10 w-full rounded-full border border-border bg-secondary pl-10 pr-4 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationsBell />
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </span>
              <span className="hidden text-sm font-medium sm:block">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="grid gap-6 p-6 xl:grid-cols-[1fr_290px]">
          <div className="min-w-0 space-y-6">
            {/* Cards row + Add Card */}
            <div>
              <p className="mb-3 font-medium">My Cards</p>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {accounts.map((acc) => (
                  <BankCard
                    key={acc.id}
                    name={user.name}
                    cardName={acc.name}
                    balance={acc.balance}
                    last4={String(acc.id).slice(-4)}
                    selected={acc.id === account?.id}
                    onClick={() => setSelectedId(acc.id)}
                  />
                ))}

                {/* Add Card tile */}
                <button
                  onClick={handleAddCard}
                  className="relative aspect-[1.6/1] w-[17rem] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-[#7C3AED] to-[#4C1D95] p-5 text-left text-white shadow-card transition-all hover:opacity-90"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                    <Plus size={20} />
                  </span>
                  <span className="text-sm font-medium">Add Card</span>
                </button>
              </div>
            </div>

            {/* Card Info */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
                <p className="font-medium">Card Info</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Card name</dt>
                    <dd className="font-medium">{account?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Card no</dt>
                    <dd className="font-medium">•••• •••• •••• {String(account?.id ?? "").slice(-4)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Stats</dt>
                    <dd className="flex items-center gap-1.5 font-medium">
                      <span className={cn("h-2 w-2 rounded-full", account?.frozen ? "bg-danger" : "bg-success")} />
                      {account?.frozen ? "Frozen" : "Active"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type of card</dt>
                    <dd className="font-medium">Mastercard</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Currency</dt>
                    <dd className="font-medium">{account?.currency ?? "USD"}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col justify-center rounded-2xl border border-border bg-background p-5 shadow-card">
                <p className="text-sm text-muted-foreground">Selected card balance</p>
                <p className="mt-1 text-2xl font-semibold sm:text-3xl">
                  ${(account?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <div className="mt-5 flex gap-3">
                  <Button size="sm" onClick={handleSend}>
                    <Send size={14} /> Send
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTransaction("income")}>
                    <Plus size={14} /> Top up
                  </Button>
                </div>
              </div>
            </div>

            <ActivityChart transactions={transactions} />

            {/* All Transaction */}
            <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
              <p className="truncate font-medium">All Transaction — {account?.name}</p>

              {transactions.length === 0 ? (
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  No transactions on this card yet — hit Top up to get started.
                </p>
              ) : (
                Object.entries(groups).map(([day, txs]) => (
                  <div key={day} className="mt-4">
                    <p className="text-xs font-medium text-muted-foreground">{day}</p>
                    <ul className="mt-1 divide-y divide-border">
                      {txs.map((tx) => (
                        <li key={tx.id} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold",
                                tx.type === "income" ? "bg-success/15 text-success" : "bg-accent/15 text-accent"
                              )}
                            >
                              {tx.category.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <p className="text-sm font-medium">{tx.category}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(Number(tx.occurredAt) || tx.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                          <span className={cn("text-sm font-semibold", tx.type === "income" ? "text-success" : "text-danger")}>
                            {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}

              {transactions.length > 5 && (
                <a
                  href="/dashboard/transactions"
                  className="mt-5 flex items-center justify-center rounded-xl border border-border py-2.5 text-sm font-medium text-accent transition-colors hover:bg-secondary"
                >
                  Show more
                </a>
              )}
            </div>
          </div>

          {/* Right rail */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-b from-accent to-[#5B21B6] p-5 text-center text-white">
              <p className="font-medium">Financial record</p>
              <Donut percent={savePercent} className="mx-auto mt-4 text-white" />
              <div className="mt-4 flex justify-center gap-6 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> Saved {savePercent}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-fuchsia-300" /> Spent {spendPercent}%
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-[#5B21B6] to-[#4C1D95] p-5 text-white">
              <div className="flex items-center gap-4">
                <Donut percent={spendPercent} size={64} stroke={7} className="shrink-0 text-fuchsia-300" />
                <div>
                  <p className="text-sm font-medium">Total Spending</p>
                  <p className="text-xs text-white/70">
                    You spent ${expense.toLocaleString()} of ${(income || 1).toLocaleString()} income on this card
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 text-center shadow-card">
              <p className="font-medium">Cash Back Up to 25%</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Upgrade your plan and get more savings.
              </p>
              <Button size="sm" className="mt-4">Up Grade</Button>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
              <p className="font-medium">Partner banks</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <img src="/logo1.png" alt="Partner bank" className="h-8 w-auto opacity-70 dark:invert" />
                <img src="/logo2.png" alt="Partner bank" className="h-8 w-auto opacity-70 dark:invert" />
                <img src="/logo3.png" alt="Partner bank" className="h-8 w-auto opacity-70 dark:invert" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Instant transfers supported across our partner network.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PageLoader, Spinner } from "@/components/loader";
import { Search, ChevronRight } from "@/components/icons";
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

const faqs = [
  { q: "How do I freeze my card?", a: "Go to Settings → Card security and flip the freeze toggle. Outgoing payments stop instantly; incoming money still arrives. Unfreeze anytime — no fees, no waiting." },
  { q: "How long do transfers take?", a: "Transfers between Payix accounts are instant, 24/7 — including weekends and holidays. External bank transfers depend on the receiving bank, typically 1–2 business days." },
  { q: "What are the transfer limits?", a: "Personal accounts can send up to $10,000 per day. Business accounts have custom limits — contact support to review yours." },
  { q: "I sent money to the wrong person. What can I do?", a: "Contact us immediately with the transaction details. If the funds haven't been claimed we can often reverse the transfer. Open a ticket below with category Payments." },
  { q: "How is my money protected?", a: "Your password is stored using bcrypt hashing, sessions use secure httpOnly cookies, and every card supports instant freeze. Payix is a licensed financial technology company." },
  { q: "How do I change my password?", a: "Go to Profile → Change password. You'll need your current password. If you've forgotten it, contact support and we'll verify your identity." },
];

const regions = [
  { region: "Americas", line: "+1 (800) 555-0143", hours: "24/7" },
  { region: "Europe, Middle East & Africa", line: "+44 20 5555 0197", hours: "24/7" },
  { region: "Asia Pacific", line: "+65 6555 0122", hours: "24/7" },
];

const categories = ["General", "Payments", "Cards", "Account & Login", "Fraud & Security"];

const statusStyles = {
  open: "bg-amber-500/15 text-amber-600",
  in_progress: "bg-accent/15 text-accent",
  resolved: "bg-success/15 text-success",
};

export default function SupportPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: "", category: "General", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const meData = await gql(`{ me { id } }`);
      if (!meData.me) {
        window.location.href = "/auth";
        return;
      }
      const d = await gql(`{ myTickets { id reference subject category status createdAt } }`);
      setTickets(d.myTickets);
    })().finally(() => setLoading(false));
  }, []);

  const submitTicket = async (e) => {
    e.preventDefault();
    setMsg(null);
    setSubmitting(true);
    try {
      const d = await gql(
        `mutation($subject: String!, $category: String!, $message: String!) {
          createSupportTicket(subject: $subject, category: $category, message: $message) {
            id reference subject category status createdAt
          }
        }`,
        form
      );
      setTickets((t) => [d.createSupportTicket, ...t]);
      setForm({ subject: "", category: "General", message: "" });
      setMsg({ ok: true, text: `Ticket submitted — your reference is ${d.createSupportTicket.reference}.` });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  const visibleFaqs = faqs.filter(
    (f) =>
      !search ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <Sidebar />

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <p className="font-medium">Support</p>
          <ThemeToggle />
        </header>

        <main className="mx-auto max-w-4xl space-y-6 p-6">
          {/* Hero + search */}
          <div className="rounded-2xl bg-gradient-to-br from-accent to-[#5B21B6] p-8 text-center text-white">
            <h1 className="text-2xl font-semibold">How can we help?</h1>
            <p className="mt-1 text-sm text-white/80">
              Search our help center or reach us anytime — we&apos;re available 24/7 worldwide.
            </p>
            <div className="relative mx-auto mt-5 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search help articles…"
                className="h-12 w-full rounded-full border-0 bg-white pl-11 pr-4 text-sm text-foreground outline-none"
              />
            </div>
          </div>

          {/* FAQ accordion */}
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <p className="font-medium">Frequently asked questions</p>
            {visibleFaqs.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No articles match — open a ticket below and we&apos;ll help directly.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-border">
                {visibleFaqs.map((f, i) => (
                  <li key={f.q}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
                    >
                      {f.q}
                      <ChevronRight
                        size={16}
                        className={cn("shrink-0 text-muted-foreground transition-transform", openFaq === i && "rotate-90")}
                      />
                    </button>
                    {openFaq === i && (
                      <p className="pb-4 text-sm text-muted-foreground">{f.a}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact channels */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((r) => (
              <div key={r.region} className="rounded-2xl border border-border bg-background p-5 shadow-card">
                <p className="text-sm font-medium">{r.region}</p>
                <p className="mt-2 text-sm text-accent">{r.line}</p>
                <p className="mt-1 text-xs text-muted-foreground">Available {r.hours}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
              <p className="text-sm font-medium">Email us</p>
              <a href="mailto:support@payix.com" className="mt-2 block text-sm text-accent hover:underline">
                support@payix.com
              </a>
              <p className="mt-1 text-xs text-muted-foreground">Response within 24 hours</p>
            </div>
          </div>

          {/* Ticket form */}
          <form onSubmit={submitTicket} className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <p className="font-medium">Open a support ticket</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We typically respond within 24 hours. Urgent card issues? Freeze the card in Settings first, then call us.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Brief summary of the issue"
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-accent"
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                placeholder="Describe the issue with as much detail as possible…"
                className="mt-1.5 w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-accent"
              />
            </div>

            {msg && (
              <p className={cn("mt-3 text-sm", msg.ok ? "text-success" : "text-danger")}>{msg.text}</p>
            )}

            <Button type="submit" size="sm" className="mt-4" disabled={submitting}>
              {submitting ? <Spinner /> : "Submit ticket"}
            </Button>
          </form>

          {/* My tickets */}
          {tickets.length > 0 && (
            <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
              <p className="font-medium">My tickets</p>
              <ul className="mt-2 divide-y divide-border">
                {tickets.map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-3.5">
                    <div>
                      <p className="text-sm font-medium">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.reference} · {t.category} · {new Date(Number(t.createdAt) || t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase", statusStyles[t.status])}>
                      {t.status.replace("_", " ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
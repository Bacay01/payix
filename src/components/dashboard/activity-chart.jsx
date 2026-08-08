"use client";

import { cn } from "@/lib/utils";

export function ActivityChart({ transactions }) {
  // build the last 7 days as buckets
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({ date: d, income: 0, expense: 0 });
  }

  for (const tx of transactions) {
    const t = new Date(Number(tx.createdAt) || tx.createdAt);
    t.setHours(0, 0, 0, 0);
    const bucket = days.find((day) => day.date.getTime() === t.getTime());
    if (bucket) bucket[tx.type === "income" ? "income" : "expense"] += tx.amount;
  }

  const max = Math.max(...days.map((d) => Math.max(d.income, d.expense)), 1);

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-medium">Your activity</p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" /> In
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" /> Out
          </span>
        </div>
      </div>

      <div className="mt-5 flex h-36 items-end gap-2">
        {days.map((day) => (
          <div key={day.date.toISOString()} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-28 w-full items-end justify-center gap-1">
              <div
                className={cn("w-3 rounded-t-md bg-success/80", day.income === 0 && "h-0.5 bg-secondary")}
                style={day.income > 0 ? { height: `${(day.income / max) * 100}%` } : undefined}
                title={`In: $${day.income.toLocaleString()}`}
              />
              <div
                className={cn("w-3 rounded-t-md bg-accent/80", day.expense === 0 && "h-0.5 bg-secondary")}
                style={day.expense > 0 ? { height: `${(day.expense / max) * 100}%` } : undefined}
                title={`Out: $${day.expense.toLocaleString()}`}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {day.date.toLocaleDateString(undefined, { weekday: "short" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
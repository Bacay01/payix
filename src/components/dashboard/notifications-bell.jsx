"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "@/components/icons";

async function gql(query) {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  return json.data;
}

export function NotificationsBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unread = items.some((n) => !n.read);

  useEffect(() => {
    gql(`{ notifications { id message read createdAt } }`).then(
      (d) => d?.notifications && setItems(d.notifications)
    );
  }, []);

  // close when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && unread) {
      await gql(`mutation { markNotificationsRead }`);
      setItems((list) => list.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unread && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-border bg-background p-2 shadow-card">
          <p className="px-3 py-2 text-sm font-medium">Notifications</p>
          {items.length === 0 ? (
            <p className="px-3 pb-3 text-sm text-muted-foreground">Nothing yet.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id} className="rounded-xl px-3 py-2.5 text-sm hover:bg-secondary">
                  <p>{n.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(Number(n.createdAt) || n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PageLoader, Spinner } from "@/components/loader";


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

function Field({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [nameMsg, setNameMsg] = useState(null);
  const [savingName, setSavingName] = useState(false);

  const [pw, setPw] = useState({ current: "", next: "", repeat: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    gql(`{ me { id name email accountType createdAt } }`)
      .then((d) => {
        if (!d.me) {
          window.location.href = "/auth";
        } else {
          setUser(d.me);
          setName(d.me.name);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const saveName = async (e) => {
    e.preventDefault();
    setNameMsg(null);
    setSavingName(true);
    try {
      const d = await gql(
        `mutation($name: String!) { updateProfile(name: $name) { id name } }`,
        { name }
      );
      setUser((u) => ({ ...u, name: d.updateProfile.name }));
      setNameMsg({ ok: true, text: "Name updated." });
    } catch (err) {
      setNameMsg({ ok: false, text: err.message });
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.next !== pw.repeat) {
      setPwMsg({ ok: false, text: "New passwords do not match." });
      return;
    }
    setSavingPw(true);
    try {
      await gql(
        `mutation($currentPassword: String!, $newPassword: String!) {
          changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
        }`,
        { currentPassword: pw.current, newPassword: pw.next }
      );
      setPw({ current: "", next: "", repeat: "" });
      setPwMsg({ ok: true, text: "Password changed." });
    } catch (err) {
      setPwMsg({ ok: false, text: err.message });
    } finally {
      setSavingPw(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
  const joined = new Date(Number(user.createdAt) || user.createdAt);

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <Sidebar />

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <p className="font-medium">Profile</p>
          <ThemeToggle />
        </header>

        <main className="mx-auto max-w-3xl space-y-6 p-6">
          {/* Identity card */}
          <div className="flex items-center gap-5 rounded-2xl border border-border bg-background p-6 shadow-card">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-xl font-semibold text-accent">
              {initials}
            </span>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {user.accountType === "business" ? "Business" : "Personal"} account
                {!isNaN(joined) && <> · Member since {joined.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</>}
              </p>
            </div>
          </div>

          {/* Edit name */}
          <form onSubmit={saveName} className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <p className="font-medium">Personal information</p>
            <div className="mt-4 space-y-4">
              <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Field label="Email" value={user.email} onChange={() => {}} />
              <p className="text-xs text-muted-foreground">Email can&apos;t be changed for now.</p>
              {nameMsg && (
                <p className={nameMsg.ok ? "text-sm text-success" : "text-sm text-danger"}>{nameMsg.text}</p>
              )}
              <Button type="submit" size="sm" disabled={savingName}>
                {savingName ? <Spinner /> : "Save changes"}
              </Button>
            </div>
          </form>

          {/* Change password */}
          <form onSubmit={savePassword} className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <p className="font-medium">Change password</p>
            <div className="mt-4 space-y-4">
              <Field label="Current password" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
              <Field label="New password" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
              <Field label="Repeat new password" type="password" value={pw.repeat} onChange={(e) => setPw({ ...pw, repeat: e.target.value })} />
              {pwMsg && (
                <p className={pwMsg.ok ? "text-sm text-success" : "text-sm text-danger"}>{pwMsg.text}</p>
              )}
              <Button type="submit" size="sm" disabled={savingPw}>
                {savingPw ? <Spinner /> : "Update password"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
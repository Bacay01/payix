"use client";

import { useState } from "react";
import { Eye, EyeOff } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner, PageLoader } from "@/components/loader";

function Field({ label, type = "text", value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-1.5">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function AuthForm() {
  const [tab, setTab] = useState("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "", repeat: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (tab === "signup") {
      if (!form.name || !form.email || !form.password) {
        setError("Please fill in all fields.");
        return;
      }
      if (form.password !== form.repeat) {
        setError("Passwords do not match.");
        return;
      }
    } else if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    const query =
      tab === "signup"
        ? `mutation SignUp($input: SignUpInput!) { signUp(input: $input) { user { id name email } } }`
        : `mutation LogIn($input: LogInInput!) { logIn(input: $input) { user { id name email } } }`;

    const variables =
      tab === "signup"
        ? { input: { name: form.name, email: form.email, password: form.password } }
        : { input: { email: form.email, password: form.password } };

    setLoading(true);
    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      const json = await res.json();

      if (json.errors?.length) {
        setError(json.errors[0].message);
        setLoading(false);
        return;
      }

const meRes = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `{ me { role } }` }),
      });
      const meJson = await meRes.json();
      window.location.href = meJson.data?.me?.role === "admin" ? "/admin" : "/dashboard";    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <PageLoader
          message={tab === "signup" ? "Creating your account…" : "Signing you in…"}
        />
      )}
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          {tab === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {tab === "signup"
            ? "Open a free Payix account in minutes."
            : "Sign in to continue to Payix."}
        </p>

        {/* Tab toggle */}
        <div className="mt-8 flex rounded-full border border-border bg-secondary p-1 text-sm">
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={cn(
              "flex-1 rounded-full py-2 transition-colors",
              tab === "signup" ? "bg-background shadow-sm" : "text-muted-foreground"
            )}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => setTab("login")}
            className={cn(
              "flex-1 rounded-full py-2 transition-colors",
              tab === "login" ? "bg-background shadow-sm" : "text-muted-foreground"
            )}
          >
            Log in
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {tab === "signup" && (
            <Field label="Full name" value={form.name} onChange={set("name")} placeholder="Enter your name" />
          )}
          <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="Enter your email" />
          <Field label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Enter your password" />
          {tab === "signup" && (
            <Field label="Repeat the password" type="password" value={form.repeat} onChange={set("repeat")} placeholder="Enter your password" />
          )}

          {tab === "login" && (
            <p className="text-right text-sm">
              <a href="#" className="text-accent hover:underline">Forgot password?</a>
            </p>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Spinner /> : tab === "signup" ? "Sign up" : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing up, you agree to the{" "}
          <a href="#" className="text-accent hover:underline">Terms of Service</a> and{" "}
          <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </>
  );
}
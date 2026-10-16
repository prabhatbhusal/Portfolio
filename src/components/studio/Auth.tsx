"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { api } from "@/lib/studio/client";

type Mode = "login" | "signup" | "verify" | "reset" | "reset-confirm";

const COPY: Record<Mode, { title: string; lead: string; button: string }> = {
  login: { title: "Studio", lead: "Sign in to write and publish.", button: "Sign in" },
  signup: {
    title: "Create the studio account",
    lead: "One account, for the site owner. A code goes to your email to confirm it is you.",
    button: "Send the code",
  },
  verify: {
    title: "Check your email",
    lead: "Enter the six-digit code we just sent, and choose your password.",
    button: "Create account",
  },
  reset: { title: "Reset your password", lead: "A code goes to the owner's email.", button: "Send the code" },
  "reset-confirm": {
    title: "Choose a new password",
    lead: "Enter the code from your email and a new password. Other devices get signed out.",
    button: "Save and sign in",
  },
};

const Field = (props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => {
  const { label, ...input } = props;
  return (
    <label className="flex flex-col gap-2 text-[11px] font-semibold uppercase text-ink-faint">
      {label}
      <input {...input} required className="field rounded-xl px-4 py-3 text-[15px] normal-case" />
    </label>
  );
};

const Auth = ({ hasOwner }: { hasOwner: boolean }) => {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(hasOwner ? "login" : "signup");
  const [form, setForm] = useState({ email: "", password: "", code: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api<{ next?: Mode }>(`/api/auth/${mode}`, { body: form });
      if (result.next) {
        setMode(result.next);
        setForm({ ...form, code: "", password: "" });
      } else {
        // signed in: the server page re-renders into the studio
        router.refresh();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const copy = COPY[mode];
  const wantsPassword = mode === "login" || mode === "verify" || mode === "reset-confirm";
  const wantsCode = mode === "verify" || mode === "reset-confirm";

  return (
    <main className="rail grid min-h-[70svh] place-items-center py-16">
      <div className="surface w-full max-w-md rounded-[28px] p-8 md:p-10">
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-brand-ink">{"// studio"}</p>
        <h1 className="display mt-3 text-3xl font-bold text-ink">{copy.title}</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{copy.lead}</p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
          <Field
            label="Email"
            type="email"
            autoComplete="username"
            value={form.email}
            onChange={set("email")}
            readOnly={wantsCode}
          />
          {wantsCode && (
            <Field
              label="Code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={form.code}
              onChange={set("code")}
              autoFocus
            />
          )}
          {wantsPassword && (
            <Field
              label={mode === "login" ? "Password" : "New password (10+ characters)"}
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "login" ? undefined : 10}
              value={form.password}
              onChange={set("password")}
            />
          )}

          {error && (
            <p role="alert" className="text-[13px] text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-solid mt-2 h-12 rounded-xl text-[15px] font-semibold disabled:opacity-60"
          >
            {busy ? "One moment…" : copy.button}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-soft">
          {mode === "login" && (
            <button type="button" onClick={() => setMode("reset")} className="hover:text-ink">
              Forgot password?
            </button>
          )}
          {mode !== "login" && hasOwner && (
            <button type="button" onClick={() => setMode("login")} className="hover:text-ink">
              Back to sign in
            </button>
          )}
          {(mode === "verify" || mode === "reset-confirm") && (
            <button
              type="button"
              onClick={() => setMode(mode === "verify" ? "signup" : "reset")}
              className="hover:text-ink"
            >
              Send a new code
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default Auth;

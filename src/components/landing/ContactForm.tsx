"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { author } from "@/lib/seo/site";

const budgets = ["under $5k", "$5k – $20k", "$20k+", "not sure yet"];

type State = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string };

const labelClass = "text-[11px] font-semibold uppercase leading-relaxed text-ink-faint";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" });
  const [budget, setBudget] = useState(budgets[3]);
  const [state, setState] = useState<State>({ kind: "idle" });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  /* the server can be offline (no database or email configured yet); the
     form then hands the message to the visitor's own mail app rather than
     dropping it */
  const viaMailApp = () => {
    const subject = encodeURIComponent(`Project enquiry — ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nBudget: ${budget}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${author.email}?subject=${subject}&body=${body}`;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget }),
      });
      if (res.status === 503 || res.status === 404) return viaMailApp();
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setState({ kind: "error", message: data.error ?? "That did not go through." });
      setState({ kind: "sent" });
    } catch {
      viaMailApp();
    }
  }

  if (state.kind === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <span className="grid size-12 place-items-center rounded-full bg-(--ok-soft) text-ok-ink">
          <Check size={22} strokeWidth={2.5} />
        </span>
        <p className="display text-2xl font-bold text-ink">Got it — thank you.</p>
        <p className="text-[15px] leading-relaxed text-ink-soft">
          It landed in my inbox. I usually reply within a day, from {author.email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            placeholder="Jane Doe"
            className="field w-full rounded-xl px-4 py-3 text-[14px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            placeholder="jane@company.com"
            className="field w-full rounded-xl px-4 py-3 text-[14px]"
          />
        </div>
      </div>

      {/* bots fill in every field they find; people never see this one */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="company">company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={set("company")} />
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className={`mb-2.5 ${labelClass}`}>rough budget</legend>

        <div className="flex flex-wrap gap-2">
          {budgets.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBudget(option)}
              aria-pressed={budget === option}
              className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors duration-300 ${
                budget === option ? "btn-solid" : "chip hover:border-line-strong"
              }`}
            >
              {budget === option && <Check size={13} strokeWidth={3} />}
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          what are you building?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          value={form.message}
          onChange={set("message")}
          placeholder="A sentence or two is plenty to start."
          className="field w-full resize-y rounded-xl px-4 py-3 text-[14px]"
        />
      </div>

      {state.kind === "error" && (
        <p role="alert" className="text-[13px] text-red-500">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className="btn-solid group inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold disabled:opacity-60"
        >
          {state.kind === "sending" ? "sending…" : "send it over"}
          <ArrowRight size={17} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        <p className="text-[11px] font-semibold leading-relaxed text-ink-soft">goes straight to my inbox</p>
      </div>
    </form>
  );
};

export default ContactForm;

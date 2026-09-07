"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const EMAIL = "prabhatbhusal777@gmail.com";

const budgets = ["under 1k", "1k – 5k", "5k+", "not sure yet"];

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState(budgets[3]);
  const [message, setMessage] = useState("");

  // no backend on this site, so the draft is handed to the mail client
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent(`Project enquiry — ${name}`);
    const body = encodeURIComponent(
      `${message}\n\nBudget: ${budget}\n\n— ${name}\n${email}`
    );

    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="mono text-[10px] uppercase tracking-[0.18em] text-ink-faint"
          >
            your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="field w-full rounded-xl px-4 py-3 text-[14px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="mono text-[10px] uppercase tracking-[0.18em] text-ink-faint"
          >
            your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            className="field w-full rounded-xl px-4 py-3 text-[14px]"
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          rough budget
        </legend>

        <div className="flex flex-wrap gap-2">
          {budgets.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBudget(option)}
              aria-pressed={budget === option}
              className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors duration-300 ${
                budget === option
                  ? "btn-solid"
                  : "chip hover:border-line-strong"
              }`}
            >
              {budget === option && <Check size={13} strokeWidth={3} />}
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="mono text-[10px] uppercase tracking-[0.18em] text-ink-faint"
        >
          what are you building?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="A sentence or two is plenty to start."
          className="field w-full resize-y rounded-xl px-4 py-3 text-[14px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="btn-solid group inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold"
        >
          send it over
          <ArrowRight
            size={17}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>

        <p className="mono text-[11px] leading-relaxed text-ink-faint">
          opens your mail app — nothing is sent from this page
        </p>
      </div>
    </form>
  );
};

export default ContactForm;

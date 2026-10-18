"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { author } from "@/lib/seo/site";

const budgets = ["under $5k", "$5k – $20k", "$20k+", "not sure yet"];

const labelClass = "text-[11px] font-semibold uppercase leading-relaxed text-ink-faint";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [budget, setBudget] = useState(budgets[3]);
  const [mailed, setMailed] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  /* the site is static, so there is no server to post to: the message is
     handed to the visitor's own mail app, already written */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent(`Project enquiry — ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nBudget: ${budget}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${author.email}?subject=${subject}&body=${body}`;
    setMailed(true);
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

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="btn-solid group inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold"
        >
          send it over
          <ArrowRight size={17} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        <p role="status" className="text-[11px] font-semibold leading-relaxed text-ink-soft">
          {mailed ? (
            <>
              opened your mail app — nothing? write to <a href={`mailto:${author.email}`} className="text-brand-ink underline">{author.email}</a>
            </>
          ) : (
            "opens your mail app, already written"
          )}
        </p>
      </div>
    </form>
  );
};

export default ContactForm;

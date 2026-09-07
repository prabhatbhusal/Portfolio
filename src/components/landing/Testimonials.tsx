import React from "react";
import { Quote } from "lucide-react";

import { testimonialsdata } from "@/lib/constants/data";
import Headerbanner from "../props/Headerbanner";
import Reveal from "../props/Reveal";
import { Stagger, StaggerItem } from "../motion";

const Testimonials = () => {
  if (testimonialsdata.length === 0) return null;

  // a lone quote reads better full width than stranded in one column
  const columns =
    testimonialsdata.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2";

  return (
    <section className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <Reveal>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start gap-5">
            <Headerbanner header="kind words" />
            <h2 className="display max-w-2xl text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
              What the people I
              <span className="block text-brand-ink">built for say</span>
            </h2>
          </div>

          <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
            Short projects, long conversations. These are the folks who put
            their name to the work.
          </p>
        </div>
      </Reveal>

      <Stagger className={`mt-12 grid gap-4 ${columns}`} stagger={0.09}>
        {testimonialsdata.map((item) => (
          <StaggerItem key={item.id} hover>
            <figure className="surface lift flex h-full flex-col rounded-[28px] p-8 md:p-10">
              <Quote
                size={26}
                strokeWidth={1.6}
                aria-hidden="true"
                className="mb-7 shrink-0 text-brand-ink"
              />

              <blockquote className="flex-1 text-[16px] leading-relaxed text-ink md:text-lg md:leading-relaxed">
                {item.quote}
              </blockquote>

              <figcaption className="mt-9 flex items-center gap-4">
                <span className="borderbg amber-bg grid size-11 shrink-0 place-items-center rounded-full mono text-[12px] font-bold text-brand-ink">
                  {item.initials}
                </span>

                <span className="flex min-w-0 flex-col">
                  <span className="text-[15px] font-semibold text-ink">
                    {item.name}
                  </span>

                  {item.companyUrl ? (
                    <a
                      href={item.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mono text-[11px] uppercase tracking-[0.16em] text-ink-faint transition-colors duration-300 hover:text-brand-ink"
                    >
                      {item.company}
                    </a>
                  ) : (
                    <span className="mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                      {item.company}
                    </span>
                  )}
                </span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
};

export default Testimonials;

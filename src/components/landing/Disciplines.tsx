import React from "react";

import { disciplinesdata } from "@/lib/constants/data";
import Headerbanner from "../props/Headerbanner";
import Reveal from "../props/Reveal";
import { Stagger, StaggerItem } from "../motion";

const Disciplines = () => {
  return (
    <section id="disciplines" className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <Reveal>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start gap-5">
            
            <h2 className="display max-w-2xl text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
              Three fields, one
              <span className="block text-brand-ink">way of thinking</span>
            </h2>
          </div>

          <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
            They look separate on a CV. In practice they all come down to
            modelling space and then making it interactive.
          </p>
        </div>
      </Reveal>

      <Stagger className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {disciplinesdata.map((item, idx) => {
          const Icon = item.icon;

          return (
            <StaggerItem key={item.id} hover>
              <article className="surface lift flex h-full flex-col rounded-[28px] p-8 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <span className="borderbg amber-bg grid size-12 place-items-center rounded-[16px] text-brand-ink">
                    <Icon size={21} strokeWidth={1.6} />
                  </span>
                  <span className="mono text-[11px] tabular-nums text-ink-faint">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="display mt-8 text-2xl font-extrabold leading-tight text-ink">
                  {item.title}
                </h3>

                <p className="mt-1.5 mono text-[11px] uppercase tracking-[0.16em] text-brand-ink">
                  {item.tagline}
                </p>

                <p className="mt-5 flex-1 text-[14px] leading-relaxed text-ink-soft">
                  {item.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-1.5">
                  {item.tools.map((tool) => (
                    <span
                      key={tool}
                      className="chip rounded-full px-2.5 py-1 mono text-[11px]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
};

export default Disciplines;

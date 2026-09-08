import React from "react";
import { processdata } from "@/lib/constants/data";
import Headerbanner from "../props/Headerbanner";
import Reveal from "../props/Reveal";
import { Stagger, StaggerItem } from "../motion";

const Process = () => {
  return (
    <section className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <Reveal>
      <div className="flex flex-col items-start gap-5">
        
        <h2 className="display max-w-3xl text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
          From a rough idea to something running
        </h2>
        <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          Four steps, no surprises. You always know what is being built and
          where it has got to.
        </p>
      </div>
      </Reveal>

      <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {processdata.map((item) => {
          const Icon = item.icon;

          return (
            <StaggerItem key={item.id} hover>
            <article className="surface lift flex h-full flex-col rounded-2xl p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="borderbg amber-bg grid size-11 place-items-center rounded-[14px] text-brand-ink">
                  <Icon size={19} strokeWidth={1.6} />
                </span>
                <span className="mono text-[11px] tabular-nums text-ink-faint">
                  {item.step}
                </span>
              </div>

              <h3 className="display text-lg font-bold text-ink">
                {item.title}
              </h3>

              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                {item.description}
              </p>
            </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
};

export default Process;

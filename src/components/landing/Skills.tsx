import React from "react";
import { skillsdata } from "@/lib/constants/data";
import Headerbanner from "../props/Headerbanner";
import Reveal from "../props/Reveal";

interface prop {
  // the /skills page already has a masthead, so it turns this off
  heading?: boolean;
}

const Skills = ({ heading = true }: prop) => {
  return (
    <section className="rail py-16 md:py-24">
      {heading && <div className="hairline mb-16 md:mb-24" />}

      {heading && (
        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start gap-5">
            <Headerbanner header="what I work with" />
            <h2 className="display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
              Skills
            </h2>
          </div>

          <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Four areas I keep sharp — the web stack I ship with, and the spatial
            work that sits underneath it.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillsdata.map((item, idx) => {
          const Icon = item.icon;

          return (
            <Reveal key={item.id} delay={idx * 70}>
            <article className="surface lift flex h-full flex-col rounded-2xl p-6">
              {Icon && (
                <span className="borderbg amber-bg mb-5 grid size-11 place-items-center rounded-[14px] text-brand-ink">
                  <Icon size={19} strokeWidth={1.6} />
                </span>
              )}

              <h3 className="display text-lg font-bold text-ink">
                {item.title}
              </h3>

              {item.blurb && (
                <p className="mt-2 text-[13px] leading-relaxed text-ink-faint">
                  {item.blurb}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-1.5">
                {item.stack.map((skill, idx) => (
                  <span
                    key={idx}
                    className="chip rounded-full px-2.5 py-1 mono text-[11px]"
                  >
                    {skill.lang}
                  </span>
                ))}
              </div>
            </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;

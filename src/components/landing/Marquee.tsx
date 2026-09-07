import React from "react";
import { techstack } from "@/lib/constants/data";

const Marquee = () => {
  // rendered twice so the -50% shift lands exactly on the seam
  const row = [...techstack, ...techstack];

  return (
    <section className="rail py-10 md:py-14">
      <p className="mb-8 text-center mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        the tools I reach for
      </p>

      <div className="marquee overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-12 md:gap-16">
          {row.map((tech, idx) => {
            const Icon = tech.icon;

            return (
              <span
                key={`${tech.id}-${idx}`}
                className="flex shrink-0 items-center gap-2.5 text-ink-faint transition-colors duration-300 hover:text-brand-ink"
                aria-hidden={idx >= techstack.length}
              >
                <Icon size={22} />
                <span className="text-[14px] font-medium">{tech.name}</span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Marquee;

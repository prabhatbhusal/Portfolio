import React from "react";
import { techstack } from "@/lib/constants/data";

const Marquee = ({ className = "py-10 md:py-14" }: { className?: string }) => {
  // the list is rendered twice so the -50% shift lands exactly on the seam
  const row = [...techstack, ...techstack];

  return (
    <div className={className}>
      <p className="rail mb-7 mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        the tools I reach for
      </p>

      {/* runs full width rather than inside the rail, so it reads as motion */}
      <div className="marquee overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-10 md:gap-14">
          {row.map((tech, idx) => {
            const Icon = tech.icon;

            return (
              <span
                key={`${tech.id}-${idx}`}
                aria-hidden={idx >= techstack.length}
                className="flex shrink-0 items-center gap-2.5 text-ink-faint transition-colors duration-300 hover:text-brand-ink"
              >
                <Icon size={22} />
                <span className="whitespace-nowrap text-[14px] font-medium">
                  {tech.name}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Marquee;

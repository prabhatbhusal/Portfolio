import React from "react";
import { techstack } from "@/lib/constants/data";
import DragMarquee from "../motion/DragMarquee";

/* a lap in ~25s. the old css loop took 45s, which was slow enough to read
   as a static row */
const SPEED = 2;

const Marquee = ({ className = "py-10 md:py-14" }: { className?: string }) => (
  <div className={className}>
    

    {/* runs full width rather than inside the rail, so it reads as motion */}
    <DragMarquee speed={SPEED}>
      {techstack.map((tech) => {
        const Icon = tech.icon;

        return (
          <span
            key={tech.id}
            className="flex shrink-0 items-center gap-2.5 text-ink-faint transition-colors duration-300 hover:text-brand-ink"
          >
            <Icon size={22} />
            <span className="whitespace-nowrap text-[14px] font-medium">
              {tech.name}
            </span>
          </span>
        );
      })}
    </DragMarquee>
  </div>
);

export default Marquee;

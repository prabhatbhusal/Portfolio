"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, type MotionValue } from "motion/react";

import HeroBackdrop from "../props/HeroBackdrop";
import { useRange } from "../motion";

const lines = [
  "Gameplay systems in Unity and Unreal — movement, combat and AI that feel right.",
  "Worlds on real terrain, built from LiDAR and survey data.",
  "And the full-stack web — backends, tools and sites — to ship them.",
];

const stats = [
  { value: "2", label: "games in the works" },
  { value: "6", label: "web & spatial builds" },
  { value: "<1d", label: "typical reply time" },
];

/* each line lights up in turn while the card is pinned */
const Line = ({ progress, index, text }: { progress: MotionValue<number>; index: number; text: string }) => {
  const start = 0.12 + index * 0.2;
  const opacity = useRange(progress, [start, start + 0.16], [0.28, 1]);

  return (
    <motion.p
      style={{ opacity }}
      className="text-[clamp(1.15rem,2.4vw,2rem)] font-bold leading-snug tracking-tight text-white"
    >
      {text}
    </motion.p>
  );
};

/** the reference's signature beat: an inset, rounded card that opens out
 *  to full-bleed as it rises into place, then holds while its copy reads.
 *  it grows with clip-path rather than width/height, so the scroll drives
 *  a repaint and never a relayout */
const Statement = () => {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress: grow } = useScroll({
    target: ref,
    offset: ["start 0.85", "start start"],
  });
  const { scrollYProgress: read } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const insetY = useRange(grow, [0, 1], [14, 0]);
  const insetX = useRange(grow, [0, 1], [9, 0]);
  const radius = useRange(grow, [0, 1], [56, 0]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% round ${radius}px)`;

  return (
    <section id="statement" data-label="Intro" ref={ref} className="relative h-[220svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          style={{ clipPath }}
          className="absolute inset-0 flex items-center bg-[radial-gradient(120%_70%_at_50%_100%,#1d3aa0_0%,#0d1638_55%,#0b1026_100%)]"
        >
          <HeroBackdrop className="pointer-events-none absolute inset-0 h-full w-full opacity-50" />

          <div className="rail relative flex flex-col items-center gap-10 text-center md:gap-14">
            <div className="flex flex-col items-center gap-5">
              <span className="mono text-[11px] uppercase tracking-[0.22em] text-[#8eaaff]">
                what I build
              </span>
              <h2 className="display max-w-4xl text-[clamp(2.2rem,5.5vw,4.25rem)] font-bold leading-[1.02] text-white">
                Games that know where they are.
              </h2>
            </div>

            <div className="flex max-w-3xl flex-col gap-4 md:gap-6">
              {lines.map((text, i) => (
                <Line key={text} progress={read} index={i} text={text} />
              ))}
            </div>

            <dl className="grid w-full max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[#070a18]/80 px-3 py-5 backdrop-blur md:px-5 md:py-6">
                  <dt className="display text-2xl font-bold text-white md:text-3xl">{stat.value}</dt>
                  <dd className="mt-1 mono text-[10px] text-white/55 md:text-[11px]">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-[#05060b]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Statement;

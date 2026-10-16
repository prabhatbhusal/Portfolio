import React from "react";
import { Check } from "lucide-react";

import { Reveal } from "../motion";

const points = [
  {
    id: 1,
    title: "Three disciplines, one build",
    text: "I build the game, the tools and web stack around it, and I understand the spatial data underneath. That is usually three people.",
  },
  {
    id: 2,
    title: "Data model before pixels",
    text: "Schema, projections and endpoints get settled first, so the interface has something solid to sit on.",
  },
  {
    id: 3,
    title: "Nothing you cannot maintain",
    text: "Dockerised, documented, conventional. No clever tricks that only make sense to the person who wrote them.",
  },
  {
    id: 4,
    title: "Honest about scope",
    text: "If something is a bad idea or outside what I do well, I will say so before you have paid for it.",
  },
];

const About = () => {
  return (
    <section id="about" className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col items-start gap-5">
          <h2 className="display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
            A game developer who
            <span className="block text-brand-ink">reads the map</span>
          </h2>

          <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft">
            Games taught me to think in 3D space, a Geomatics degree taught
            me to measure it, and the web is how the work gets shipped. The
            overlap is the interesting part — levels built on real terrain,
            and the tools and backends around a game where a generic stack
            starts to creak.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <ul className="flex flex-col gap-6">
            {points.map((point) => (
              <li key={point.id} className="flex gap-3.5">
                <span className="borderbg brand-bg mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-brand-ink">
                  <Check size={13} strokeWidth={3} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold text-ink">
                    {point.title}
                  </span>
                  <span className="max-w-md text-[14px] leading-relaxed text-ink-soft">
                    {point.text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

export default About;

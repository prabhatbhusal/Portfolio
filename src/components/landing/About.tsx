import React from "react";
import { Check } from "lucide-react";

import Reveal from "../props/Reveal";

const points = [
  {
    id: 1,
    title: "Two disciplines, one build",
    text: "I write the application and I understand the spatial data underneath it. That is usually two people.",
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
    <section className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col items-start gap-5">
          <h2 className="display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
            A developer who
            <span className="block text-brand-ink">reads the map</span>
          </h2>

          <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft">
            I trained as a Geomatics Engineer and ended up building for the web.
            The overlap turned out to be the interesting part — most products
            eventually need to know where something is, and that is where a
            generic stack starts to creak.
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

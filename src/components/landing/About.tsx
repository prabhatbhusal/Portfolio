import React from "react";
import { Check } from "lucide-react";

import Headerbanner from "../props/Headerbanner";
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

const figures = [
  { id: 1, value: "2.34h", label: "LiDAR model training" },
  { id: 2, value: "754k", label: "points processed" },
  { id: 3, value: "24.31", label: "PSNR achieved" },
  { id: 4, value: "6", label: "projects shipped" },
];

const About = () => {
  return (
    <section className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col items-start gap-5">
          <Headerbanner header="about" />

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

          <ul className="mt-2 flex flex-col gap-5">
            {points.map((point) => (
              <li key={point.id} className="flex gap-3.5">
                <span className="borderbg amber-bg mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-brand-ink">
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

        <Reveal delay={120}>
        <div className="surface flex h-full flex-col justify-between gap-10 rounded-2xl p-8 md:p-10">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              thesis, in numbers
            </p>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              Automated road defect monitoring from LiDAR point clouds — the
              project that pulled the two halves of my work together.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {figures.map((figure) => (
              <div key={figure.id} className="bg-canvas px-5 py-6">
                <dt className="display text-2xl font-extrabold text-ink md:text-3xl">
                  {figure.value}
                </dt>
                <dd className="mt-1 mono text-[11px] text-ink-faint">
                  {figure.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        </Reveal>
      </div>
    </section>
  );
};

export default About;

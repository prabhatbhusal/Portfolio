import React from "react";
import { Check } from "lucide-react";

import { Reveal } from "../motion";

const points = [
  {
    id: 1,
    title: "Three disciplines, one build",
    text: "I build the game, model the props that go in it, and capture the real places it can stand on. That is usually three people.",
  },
  {
    id: 2,
    title: "Systems before polish",
    text: "Movement, rules and data get settled first, so the art and the feel have something solid to sit on.",
  },
  {
    id: 3,
    title: "Nothing you cannot maintain",
    text: "Documented, conventional and profiled. No clever tricks that only make sense to the person who wrote them.",
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
          <p className="eyebrow">player profile</p>
          <h2 className="display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
            A game developer who
            <span className="pixel-end block text-brand-ink">reads the map</span>
          </h2>

          <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft">
            Games taught me to think in 3D space, a Geomatics degree taught
            me to measure it, and LiDAR is how real places get into it. Today
            that overlap is my job: at RCAAS Technology I build VR and the
            studio platform that turns captured places into tours people can
            walk through.
          </p>

          <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft">
            Lately I model my own props in Blender as well. They go up on{" "}
            <a
              href="https://sketchfab.com/bhusalprabhat"
              target="_blank"
              rel="noopener noreferrer"
              className="wipe font-semibold text-ink transition-colors duration-300 hover:text-brand-ink"
            >
              Sketchfab
            </a>{" "}
            and{" "}
            <a
              href="https://www.artstation.com/prabhatbhusal"
              target="_blank"
              rel="noopener noreferrer"
              className="wipe font-semibold text-ink transition-colors duration-300 hover:text-brand-ink"
            >
              ArtStation
            </a>
            , and the finished ones land in my work.
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

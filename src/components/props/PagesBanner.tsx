import React from "react";
import Headerbanner from "./Headerbanner";
import HeroBackdrop from "./HeroBackdrop";

interface prop {
  eyebrow?: string;
  title: string;
  desc: string;
}

const PagesBanner = ({ eyebrow, title, desc }: prop) => {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none opacity-55 dark:opacity-50" />

      <div className="rail flex flex-col items-start gap-6 pb-12 pt-10 md:pb-16 md:pt-16">
        {eyebrow && <Headerbanner header={eyebrow} />}

        <h1 className="display text-5xl font-extrabold leading-[1.02] text-ink sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          {title}
        </h1>

        <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft md:text-base">
          {desc}
        </p>
      </div>

      <div className="rail">
        <div className="hairline" />
      </div>
    </section>
  );
};

export default PagesBanner;

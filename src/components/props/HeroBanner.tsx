import React from "react";
import Headerbanner from "./Headerbanner";
import Buttonbanner from "./Buttonbanner";

interface prop {
  header: string;
  title: string;
  desc: string;
}

const Herobanner = ({ header, title, desc }: prop) => {
  return (
    <section className="rail flex flex-col items-start gap-6 pb-14 pt-10 md:pb-20 md:pt-16">
      <Headerbanner header={header} />

      <h1 className="display text-5xl font-extrabold leading-[1.02] text-ink sm:text-6xl md:text-7xl">
        {title}
      </h1>

      <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft md:text-base">
        {desc}
      </p>

      <Buttonbanner title1="view projects" title2="contact me" />
    </section>
  );
};

export default Herobanner;

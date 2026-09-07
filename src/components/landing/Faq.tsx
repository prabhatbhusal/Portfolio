import React from "react";
import { Plus } from "lucide-react";

import { faqdata } from "@/lib/constants/data";
import Headerbanner from "../props/Headerbanner";
import Reveal from "../props/Reveal";

const Faq = () => {
  return (
    <section className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col items-start gap-5">
          <Headerbanner header="questions" />
          <h2 className="display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
            Before you
            <span className="block text-brand-ink">write in</span>
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
            The things people usually ask first. Anything else, just send it
            over — I reply within a day.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqdata.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 60}>
            <details className="faq surface rounded-2xl">
              <summary className="flex items-center justify-between gap-4 p-5 md:p-6">
                <span className="text-[15px] font-semibold text-ink md:text-base">
                  {item.question}
                </span>
                <Plus
                  size={18}
                  strokeWidth={2.2}
                  className="faq-mark shrink-0 text-ink-faint"
                />
              </summary>

              <div className="faq-body">
                <p className="px-5 pb-5 text-[14px] leading-relaxed text-ink-soft md:px-6 md:pb-6">
                  {item.answer}
                </p>
              </div>
            </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;

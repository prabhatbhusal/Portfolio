"use client";

import React, { useEffect, useRef, useState } from "react";

import LazyScene from "../three/LazyScene";
import type { Model } from "../three/turntable";
import { stackProgress } from "@/lib/stack";

export interface StackItem {
  title: string;
  tagline: string;
  description: string;
  tools: string[];
  /* rendered on the server and passed in, so this file never imports the
     data module (and its icon sets) into the browser bundle */
  icon: React.ReactNode;
  /** what the turntable brings round for this card */
  model: Model;
}

const loadTurntable = () => import("../three/turntable").then((m) => m.mountTurntable);

const vars = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** the three disciplines as cards that stack on one another while the page
 *  scrolls, beside a 3d turntable that turns a third each time one lands —
 *  and the three options listed under it, the current one lit */
const DisciplineStack = ({ items }: { items: StackItem[] }) => {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // which card is on top, read from the cards the same way the plate is
  useEffect(() => {
    const cards = [...ref.current!.querySelectorAll<HTMLElement>("[data-stack-card]")];
    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(Math.round(stackProgress(cards)));
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // a sticky card's own offset is wherever it is stuck, so its resting
  // place is worked out from the column it sits in
  const jump = (i: number) => {
    const cards = [...ref.current!.querySelectorAll<HTMLElement>("[data-stack-card]")];
    const column = cards[0].parentElement!;
    const style = getComputedStyle(column);
    const gap = parseFloat(style.rowGap) || 0;
    let top = column.getBoundingClientRect().top + window.scrollY + parseFloat(style.paddingTop);
    for (let k = 0; k < i; k++) top += cards[k].offsetHeight + gap;
    window.scrollTo({ top: top - parseFloat(getComputedStyle(cards[i]).top) + 2, behavior: "smooth" });
  };

  return (
    <section id="disciplines" ref={ref} className="relative py-20 md:py-28">
      <div className="rail flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col items-start gap-5">
          <p className="eyebrow">three fields</p>
          <h2 className="display pixel-end max-w-2xl text-4xl font-bold leading-[1.05] text-ink md:text-5xl">
            Three fields, one way of thinking
          </h2>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
          They look separate on a CV. In practice they all come down to
          modelling space and then making it interactive.
        </p>
      </div>

      <div className="rail mt-10 grid lg:mt-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
        {/* the turntable and the three options, held while the cards stack */}
        <div className="stack-stage">
          <div className="stack-frame relative aspect-square h-full overflow-hidden rounded-[28px] border border-line bg-[radial-gradient(90%_70%_at_50%_100%,#222222_0%,#070707_60%)]">
            <LazyScene load={loadTurntable} section={ref} className="absolute inset-0">
              <div className="grid size-full place-items-center text-[#c8c8c8] [&_svg]:size-16">{items[active]?.icon}</div>
            </LazyScene>
            <span className="absolute left-4 top-4 mono text-[10px] uppercase tracking-[0.2em] text-(--accent)">
              {items[active]?.tagline}
            </span>
          </div>

          <ol className="mt-6 hidden w-full max-w-[32rem] flex-col gap-2 lg:flex">
            {items.map((item, i) => (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={active === i ? "step" : undefined}
                  className="stack-option"
                >
                  <span aria-hidden="true" className="stack-pip" />
                  <span className="flex-1 text-left text-[15px] font-semibold">{item.title}</span>
                  <span className="mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">{item.tagline}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* the cards: each sticks a little lower than the last, so the
            pile shows every edge */}
        <div className="flex flex-col gap-[12svh] pb-[24svh] pt-6 lg:gap-[16svh] lg:pb-[40svh] lg:pt-[14svh]">
          {items.map((item, i) => (
            <article
              key={item.title}
              data-stack-card=""
              data-model={item.model}
              data-under={i < active ? "" : undefined}
              style={vars(i)}
              className="stack-card overflow-hidden rounded-[28px] border border-line bg-raised p-7 md:p-9"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-(--brand-soft) text-brand-ink [&_svg]:size-6">
                {item.icon}
              </span>
              <h3 className="text-gradient display mt-6 text-3xl font-bold leading-tight md:text-[2.4rem]">{item.title}</h3>
              <p className="mt-2 mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">{item.tagline}</p>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-soft md:text-[17px]">{item.description}</p>
              <div className="mt-7 flex flex-wrap gap-1.5">
                {item.tools.map((tool) => (
                  <span key={tool} className="chip rounded-full px-3 py-1 mono text-[11px]">
                    {tool}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DisciplineStack;

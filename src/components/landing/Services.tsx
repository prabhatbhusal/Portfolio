import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { servicesdata } from "@/lib/constants/data";
import Headerbanner from "../props/Headerbanner";
import Reveal from "../props/Reveal";
import { Stagger, StaggerItem } from "../motion";

const Services = () => {
  return (
    <section id="services" className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <Reveal>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start gap-5">
            
            <h2 className="display max-w-2xl text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
              Work I take on
            </h2>
          </div>

          <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
            Seven things I do well. Most projects are some combination of two
            or three of them.
          </p>
        </div>
      </Reveal>

      <Stagger className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {servicesdata.map((item) => {
          const Icon = item.icon;

          return (
            <StaggerItem key={item.id} hover>
              <article className="surface lift flex h-full flex-col rounded-2xl p-6 md:p-7">
                <span className="borderbg amber-bg mb-6 grid size-11 place-items-center rounded-[14px] text-brand-ink">
                  <Icon size={19} strokeWidth={1.6} />
                </span>

                <h3 className="display text-lg font-bold text-ink">
                  {item.title}
                </h3>

                <p className="mt-2.5 flex-1 text-[14px] leading-relaxed text-ink-soft">
                  {item.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {item.deliverables.map((thing) => (
                    <span
                      key={thing}
                      className="chip rounded-full px-2.5 py-1 mono text-[11px]"
                    >
                      {thing}
                    </span>
                  ))}
                </div>
              </article>
            </StaggerItem>
          );
        })}

        <StaggerItem hover className="md:col-span-2 lg:col-span-2">
        <Link
          href="/contact"
          className="surface lift group flex h-full flex-col items-start justify-between gap-6 rounded-2xl p-8 md:flex-row md:items-center md:p-10"
        >
          <div>
            <h3 className="display text-xl font-bold text-ink md:text-2xl">
              Something not on this list?
            </h3>
            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink-soft">
              Ask anyway. If it is outside what I do well I will say so, and
              usually point you at someone better placed.
            </p>
          </div>

          <span className="btn-solid inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold">
            get in touch
            <ArrowUpRight
              size={17}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </Link>
        </StaggerItem>
      </Stagger>
    </section>
  );
};

export default Services;

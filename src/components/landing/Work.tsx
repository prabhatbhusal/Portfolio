import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Headerbanner from "../props/Headerbanner";
import Reveal from "../props/Reveal";
import { workprojects } from "@/lib/constants/data";

const Work = () => {
  return (
    <section className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-start gap-5">
          <Headerbanner header="selected projects" />
          <h2 className="display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
            Things I have built
          </h2>
        </div>

        <Link
          href="/work"
          className="btn-quiet group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
        >
          all projects
          <ArrowUpRight
            size={16}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {workprojects.map((item, idx) => (
          <Reveal key={item.id} delay={idx * 80}>
          <Link
            href={`/work/${item.slug}`}
            className="surface lift group flex h-full flex-col rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-2">
              <span className="mono text-[11px] tabular-nums text-brand-ink">
                {item.index}
              </span>
              <span className="mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                {item.stack} · {item.sector}
              </span>

              {item.featured && (
                <span className="borderbg amber-bg ml-auto rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider text-brand-ink">
                  featured
                </span>
              )}
            </div>

            <h3 className="display mt-5 text-xl font-bold text-ink transition-colors duration-300 group-hover:text-brand-ink md:text-2xl">
              {item.title}
            </h3>

            <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
              {item.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {item.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="chip rounded-full px-2.5 py-1 mono text-[11px]"
                >
                  {skill}
                </span>
              ))}
            </div>

            <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-ink">
              read more
              <ArrowUpRight
                size={15}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Work;

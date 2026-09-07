import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { workprojects } from "@/lib/constants/data";
import { Stagger, StaggerItem } from "../motion";

const Projects = () => {
  return (
    <div className="rail py-14 md:py-20">
      <Stagger className="flex flex-col gap-4" stagger={0.07}>
        {workprojects.map((item) => (
          <StaggerItem key={item.id}>
          <article
            className={`surface rounded-2xl p-6 md:p-8 ${
              item.featured ? "borderbg" : ""
            }`}
          >
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="mono text-[11px] tabular-nums text-brand-ink">
                {item.index}
              </span>
              <span className="mono text-[11px] text-ink-faint">
                {item.stack} · {item.sector}
              </span>

              <span className="ml-auto flex flex-wrap items-center gap-1.5">
                {item.featured && (
                  <span className="borderbg amber-bg rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider text-brand-ink">
                    featured
                  </span>
                )}
                <span className="chip rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider">
                  {item.badge}
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="display text-xl font-bold text-ink md:text-2xl">
                  {item.title}
                </h2>

                <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
                  {item.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {item.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="chip rounded-full px-2.5 py-1 mono text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2 md:flex-col md:items-end">
                {item.live && (
                  <Link
                    href={item.live}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-solid group inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13px] font-semibold"
                  >
                    live
                    <ArrowUpRight
                      size={15}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                )}

                {item.github && (
                  <Link
                    href={item.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-quiet group inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13px] font-semibold"
                  >
                    github
                    <ArrowUpRight
                      size={15}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                )}

                {!item.live && !item.github && (
                  <span className="mono text-[11px] text-ink-faint">
                    coming soon
                  </span>
                )}
              </div>
            </div>
          </article>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
};

export default Projects;

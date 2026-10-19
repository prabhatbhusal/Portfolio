import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { WorkProject } from "@/@types/common.types";

interface WorkRowProps {
  item: WorkProject;
  /* the list on /work carries the blurb; the homepage teaser does not */
  detailed?: boolean;
}

/** one line in the work index. the title carries a stretched link so the
 *  whole row is clickable, while the github and live links stay on top of
 *  it — an anchor cannot be nested inside another anchor */
const WorkRow = ({ item, detailed = true }: WorkRowProps) => (
  <article className="group relative">
    <div className="hairline" />

    <div className="flex flex-col gap-4 py-7 md:flex-row md:gap-8 md:py-9">
      <div className="flex shrink-0 items-center gap-3 md:w-48 md:flex-col md:items-start md:gap-2.5">
        <span className="mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
          {item.year ?? "—"} · {item.sector}
        </span>
        {item.featured && (
          <span className="borderbg brand-bg rounded-full px-2 py-0.5 mono text-[9px] uppercase tracking-wider text-brand-ink">
            featured
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="display text-2xl font-extrabold leading-tight text-ink transition-colors duration-300 group-hover:text-brand-ink md:text-3xl">
          <Link
            href={`/work/${item.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {item.title}
          </Link>
        </h3>

        {detailed && (
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="mono text-[11px] text-ink-faint">
            {item.skills.join(" · ")}
          </span>
        </div>

        {(item.live || item.github || item.artstation) && (
          <div className="relative z-10 mt-4 flex flex-wrap items-center gap-4">
            {item.live && (
              <Link
                href={item.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft transition-colors duration-300 hover:text-brand-ink"
              >
                live
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>
            )}

            {item.github && (
              <Link
                href={item.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft transition-colors duration-300 hover:text-brand-ink"
              >
                source
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>
            )}

            {item.artstation && (
              <Link
                href={item.artstation}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft transition-colors duration-300 hover:text-brand-ink"
              >
                artstation
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>
            )}
          </div>
        )}
      </div>

      <ArrowUpRight
        size={22}
        strokeWidth={2}
        aria-hidden="true"
        className="hidden shrink-0 self-center text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-ink md:block"
      />
    </div>
  </article>
);

export default WorkRow;

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Quote } from "lucide-react";

import type { Testimonial, WorkProject } from "@/@types/common.types";
import { testimonialsdata } from "@/lib/constants/data";
import { getProjects } from "@/server/content";
import { Reveal } from "../motion";
import DragMarquee from "../motion/DragMarquee";

/* slower than the tools row — these are sentences, not logos */
const SPEED = 0.7;

const initialsOf = (item: Testimonial) =>
  item.initials ??
  item.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const Card = ({ item, projects }: { item: Testimonial; projects: WorkProject[] }) => {
  const project = projects.find((entry) => entry.slug === item.projectSlug);

  return (
    <figure className="surface lift flex h-full w-[min(84vw,30rem)] shrink-0 flex-col rounded-[28px] p-8 md:p-10">
      <Quote
        size={26}
        strokeWidth={1.6}
        aria-hidden="true"
        className="mb-7 shrink-0 text-brand-ink"
      />

      <blockquote className="flex-1 text-[15px] leading-relaxed text-ink md:text-base md:leading-relaxed">
        {item.quote}
      </blockquote>

      <figcaption className="mt-9 border-t border-line pt-6">
        <div className="flex items-center gap-4">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              width={44}
              height={44}
              draggable={false}
              className="size-11 shrink-0 rounded-full border border-line object-cover"
            />
          ) : (
            /* no headshot yet, so the name carries it */
            <span className="borderbg brand-bg grid size-11 shrink-0 place-items-center rounded-full mono text-[12px] font-bold text-brand-ink">
              {initialsOf(item)}
            </span>
          )}

          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-ink">
              {item.name}
            </span>

            <span className="text-[13px] leading-snug text-ink-soft">
              {item.role && <>{item.role}, </>}

              {item.companyUrl ? (
                <a
                  href={item.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-ink transition-colors duration-300 hover:text-brand-ink"
                >
                  {item.company}
                </a>
              ) : (
                <span className="font-medium text-ink">{item.company}</span>
              )}
            </span>

            {item.location && (
              <span className="mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                {item.location}
                {item.date && <> · {item.date}</>}
              </span>
            )}
          </span>
        </div>

        {/* the piece of work the quote is actually about */}
        {project && (
          <Link
            href={`/work/${project.slug}`}
            className="group/link mt-5 inline-flex items-center gap-2 text-[12px] font-semibold text-ink-soft transition-colors duration-300 hover:text-brand-ink"
          >
            <span className="mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              on
            </span>
            {project.title}
            <ArrowUpRight
              size={14}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
          </Link>
        )}
      </figcaption>
    </figure>
  );
};

const Testimonials = async () => {
  if (testimonialsdata.length === 0) return null;
  const projects = await getProjects();

  /* a row that scrolls needs something to scroll past. with one quote the
     marquee would just show the same card twice, so it sits still instead */
  const single = testimonialsdata.length === 1;

  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="rail">
        <div className="hairline mb-16 md:mb-24" />

        <Reveal>
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col items-start gap-5">
              <p className="eyebrow">reviews</p>
              <h2 className="display pixel-end max-w-2xl text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
                Client feedback
              </h2>
            </div>

            <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
              Short projects, long conversations.
            </p>
          </div>
        </Reveal>

        {single && (
          <Reveal className="mt-12" delay={80}>
            <Card item={testimonialsdata[0]} projects={projects} />
          </Reveal>
        )}
      </div>

      {/* full width like the tools row, so the movement has somewhere to go */}
      {!single && (
        <DragMarquee className="mt-12" speed={SPEED} gap="gap-4" pauseOnHover>
          {testimonialsdata.map((item) => (
            <Card key={item.id} item={item} projects={projects} />
          ))}
        </DragMarquee>
      )}
    </section>
  );
};

export default Testimonials;

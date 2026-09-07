import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import PagesBanner from "@/components/props/PagesBanner";
import Reveal from "@/components/props/Reveal";
import { blogdata } from "@/lib/constants/data";

export const metadata: Metadata = {
  title: "Blog | Prabhat Bhusal",
  description:
    "Notes on full-stack development, spatial data and the things that break in between.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Page = () => {
  const [lead, ...rest] = blogdata;

  return (
    <main>
      <PagesBanner
        eyebrow="writing"
        title="Blog"
        desc="Notes on building for the web, working with spatial data, and the things that break in between."
      />

      <section className="rail py-14 md:py-20">
        {blogdata.length === 0 ? (
          <div className="surface flex flex-col items-start gap-4 rounded-[28px] px-8 py-20">
            <p className="display text-2xl font-bold text-ink">
              Nothing published yet
            </p>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
              First post is in progress.
            </p>
          </div>
        ) : (
          <>
            {/* lead story gets the room */}
            <Reveal>
              <Link
                href={`/blog/${lead.slug}`}
                className="surface lift group flex flex-col gap-6 rounded-[28px] p-8 md:p-12"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="borderbg amber-bg rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider text-brand-ink">
                    latest
                  </span>
                  <span className="mono text-[11px] text-ink-faint">
                    {formatDate(lead.date)} · {lead.readingTime}
                  </span>
                </div>

                <h2 className="display max-w-3xl text-3xl font-extrabold leading-[1.06] text-ink transition-colors duration-300 group-hover:text-brand-ink md:text-4xl lg:text-5xl">
                  {lead.title}
                </h2>

                <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-base">
                  {lead.excerpt}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {lead.tags.map((tag) => (
                      <span
                        key={tag}
                        className="chip rounded-full px-2.5 py-1 mono text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
                    read it
                    <ArrowUpRight
                      size={16}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {rest.map((post, idx) => (
                <Reveal key={post.id} delay={idx * 80}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="surface lift group flex h-full flex-col rounded-2xl p-6 md:p-8"
                  >
                    <span className="mono text-[11px] text-ink-faint">
                      {formatDate(post.date)} · {post.readingTime}
                    </span>

                    <h2 className="display mt-4 text-xl font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-brand-ink md:text-2xl">
                      {post.title}
                    </h2>

                    <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-soft">
                      {post.excerpt}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="chip rounded-full px-2.5 py-1 mono text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-ink">
                      read it
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
          </>
        )}
      </section>
    </main>
  );
};

export default Page;

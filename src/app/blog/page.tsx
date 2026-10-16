/* eslint-disable @next/next/no-img-element -- covers are uploaded files with
   known width/height; there is no image optimiser in a static export */
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import PagesBanner from "@/components/props/PagesBanner";
import { Stagger, StaggerItem } from "@/components/motion";
import { formatDate, readingTime, type BlogPost } from "@/lib/blog/format";
import { getPosts } from "@/server/content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Notes on game development, full-stack work, spatial data and the things that break in between.",
  path: "/blog",
});

const Meta = ({ post }: { post: BlogPost }) => (
  <span className="mono text-[11px] text-ink-faint">
    {formatDate(post.date)} · {readingTime(post)}
  </span>
);

const Tags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-1.5">
    {tags.map((tag) => (
      <span key={tag} className="chip rounded-full px-2.5 py-1 mono text-[11px]">
        {tag}
      </span>
    ))}
  </div>
);

/* the cover zooms a touch inside its frame on hover, the way the
   reference's news cards do */
const Cover = ({ post, className = "" }: { post: BlogPost; className?: string }) =>
  post.cover ? (
    <div className={`overflow-hidden rounded-2xl border border-line bg-raised ${className}`}>
      <img
        src={post.cover.src}
        alt={post.cover.alt}
        width={post.cover.w}
        height={post.cover.h}
        loading="lazy"
        decoding="async"
        className="size-full object-cover transition-transform duration-700 ease-(--ease-reveal) group-hover:scale-[1.04]"
      />
    </div>
  ) : null;

const Page = async () => {
  const [lead, ...rest] = await getPosts();

  return (
    <main>
      <PagesBanner
        title="Blog"
        desc="Notes on building for the web, working with spatial data, and the things that break in between."
      />

      <section className="rail py-14 md:py-20">
        {!lead ? (
          <div className="surface flex flex-col items-start gap-4 rounded-[28px] px-8 py-20">
            <p className="display text-2xl font-bold text-ink">Nothing published yet</p>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
              First post is in progress.
            </p>
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2" stagger={0.08}>
            {/* lead story gets the room */}
            <StaggerItem className="md:col-span-2">
              <Link
                href={`/blog/${lead.slug}`}
                className={`surface lift group grid gap-8 rounded-[28px] p-6 md:p-10 ${
                  lead.cover ? "lg:grid-cols-[1.15fr_1fr] lg:items-center" : ""
                }`}
              >
                <Cover post={lead} className="aspect-[16/9]" />

                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="borderbg brand-bg rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider text-brand-ink">
                      latest
                    </span>
                    <Meta post={lead} />
                  </div>

                  <h2 className="display max-w-3xl text-3xl font-bold leading-[1.06] text-ink transition-colors duration-300 group-hover:text-brand-ink md:text-4xl lg:text-5xl">
                    {lead.title}
                  </h2>

                  <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-base">
                    {lead.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <Tags tags={lead.tags} />
                    <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
                      read it
                      <ArrowUpRight
                        size={16}
                        strokeWidth={2.5}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>

            {rest.map((post) => (
              <StaggerItem key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="surface lift group flex h-full flex-col rounded-2xl p-6 md:p-8"
                >
                  <Cover post={post} className="mb-6 aspect-[16/9]" />
                  <Meta post={post} />

                  <h2 className="display mt-4 text-xl font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-brand-ink md:text-2xl">
                    {post.title}
                  </h2>

                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-soft">
                    {post.excerpt}
                  </p>

                  <div className="mt-6">
                    <Tags tags={post.tags} />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </main>
  );
};

export default Page;

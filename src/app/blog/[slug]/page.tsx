import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { blogdata } from "@/lib/constants/data";
import JsonLd from "@/components/seo/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

// a static export serves only the slugs listed below; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return blogdata.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogdata.find((item) => item.slug === slug);

  if (!post) return { title: "Not found" };

  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
  });
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const post = blogdata.find((item) => item.slug === slug);

  if (!post) notFound();

  const index = blogdata.findIndex((item) => item.slug === slug);
  const next = blogdata[(index + 1) % blogdata.length];

  return (
    <main>
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${slug}` },
        ])}
      />

      <div className="rail pt-10 md:pt-14">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-[13px] font-semibold text-ink-soft transition-colors duration-300 hover:text-ink"
        >
          <ArrowLeft
            size={15}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          all writing
        </Link>
      </div>

      <article className="rail pb-16 pt-8 md:pb-24 md:pt-10">
        <header className="rise flex flex-col items-start gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <time dateTime={post.date} className="mono text-[11px] text-ink-faint">
              {formatDate(post.date)}
            </time>
            <span className="mono text-[11px] text-ink-faint">·</span>
            <span className="mono text-[11px] text-ink-faint">
              {post.readingTime}
            </span>
          </div>

          <h1 className="display max-w-3xl text-4xl font-extrabold leading-[1.04] text-ink sm:text-5xl md:text-6xl">
            {post.title}
          </h1>

          <p className="max-w-2xl text-[16px] leading-relaxed text-ink-soft md:text-lg md:leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="chip rounded-full px-2.5 py-1 mono text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-12 md:mt-16">
          <div className="hairline mb-12 md:mb-16" />

          {/* measure kept near 70 characters so long reads stay comfortable */}
          <div className="flex max-w-[68ch] flex-col gap-6">
            {post.body.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-[16px] leading-[1.75] text-ink-soft md:text-[17px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      <section className="rail pb-8">
        <div className="hairline mb-10" />

        <Link
          href={`/blog/${next.slug}`}
          className="surface lift group flex flex-col gap-2 rounded-2xl p-6 md:p-8"
        >
          <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            read next
          </span>

          <span className="display flex items-center gap-3 text-xl font-bold text-ink transition-colors duration-300 group-hover:text-brand-ink md:text-2xl">
            {next.title}
            <ArrowUpRight
              size={20}
              strokeWidth={2.5}
              className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      </section>
    </main>
  );
};

export default Page;

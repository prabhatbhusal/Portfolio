import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import PostView from "@/components/blog/PostView";
import JsonLd from "@/components/seo/JsonLd";
import { getAllPosts, getPosts } from "@/lib/content";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

// every post is prerendered at build, archived ones included
export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getAllPosts()).find((item) => item.slug === slug);

  if (!post) return { title: "Not found" };

  const meta = pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
    ...(post.cover?.w && post.cover.h
      ? {
          image: {
            url: post.cover.src,
            width: post.cover.w,
            height: post.cover.h,
            alt: post.cover.alt || post.title,
          },
        }
      : {}),
  });

  // archived: the url still works, but search engines are asked to let it go
  return post.archived ? { ...meta, robots: { index: false } } : meta;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const post = (await getAllPosts()).find((item) => item.slug === slug);

  if (!post) notFound();

  // next is always a live post other than this one; from an archived post
  // (index -1) that is the newest, which leads back into current writing
  const posts = await getPosts();
  const index = posts.findIndex((item) => item.slug === slug);
  const others = posts.length - (index === -1 ? 0 : 1);
  const next = others > 0 ? posts[(index + 1) % posts.length] : null;

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

      <div className="rail pt-8 md:pt-12">
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

      <PostView post={post} />

      {next && (
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
      )}
    </main>
  );
};

export default Page;

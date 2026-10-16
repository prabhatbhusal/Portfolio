/* eslint-disable @next/next/no-img-element -- post images are arbitrary
   uploads (and data: urls in the admin preview); a static export has no
   optimiser, so a plain img with width/height is the honest element */
import React from "react";

import {
  formatDate,
  parseInline,
  readingTime,
  slugify,
  type Block,
  type BlogPost,
} from "@/lib/blog/format";

/* text goes through React as text nodes — never as html — so nothing in a
   post file can inject markup. links were filtered by parseInline */
export const InlineText = ({ text }: { text: string }) => (
  <>
    {parseInline(text).map((part, i) => {
      switch (part.kind) {
        case "strong":
          return <strong key={i}>{part.text}</strong>;
        case "em":
          return <em key={i}>{part.text}</em>;
        case "code":
          return <code key={i}>{part.text}</code>;
        case "link": {
          const external = /^https?:/i.test(part.href);
          return (
            <a
              key={i}
              href={part.href}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {part.text}
            </a>
          );
        }
        default:
          return <React.Fragment key={i}>{part.text}</React.Fragment>;
      }
    })}
  </>
);

const BlockView = ({ block }: { block: Block }) => {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={slugify(block.text)}
          className="display mt-14 text-2xl font-bold leading-tight text-ink md:text-[2rem]"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="display mt-10 text-xl font-semibold leading-snug text-ink md:text-2xl">
          {block.text}
        </h3>
      );
    case "quote":
      return (
        <blockquote className="mt-10 border-l-2 border-brand pl-5 text-xl leading-relaxed text-ink md:text-2xl">
          <InlineText text={block.text} />
        </blockquote>
      );
    case "code":
      return (
        <pre className="mt-8 overflow-x-auto rounded-2xl border border-line bg-raised p-5 mono text-[13px] leading-relaxed text-ink">
          <code>{block.text}</code>
        </pre>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          className={`mt-6 flex flex-col gap-2.5 pl-6 text-[17px] leading-[1.75] text-ink-soft ${
            block.ordered ? "list-decimal" : "list-disc"
          } marker:text-brand-ink`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <InlineText text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "img":
      return (
        <figure className="mt-10">
          <img
            src={block.src}
            alt={block.alt}
            width={block.w}
            height={block.h}
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-2xl border border-line bg-raised"
          />
          {block.caption && (
            <figcaption className="mt-3 text-center text-[13px] text-ink-faint">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return (
        <p className="mt-6 text-[17px] leading-[1.8] text-ink-soft">
          <InlineText text={block.text} />
        </p>
      );
  }
};

/** the one template every post renders through — the site and the admin
 *  preview both use it, so what you preview is what ships */
const PostView = ({ post }: { post: BlogPost }) => (
  <article>
    <header className="rail rise flex flex-col items-center gap-6 pt-10 text-center md:pt-16">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mono text-[12px] text-ink-faint">
        {post.date && <time dateTime={post.date}>{formatDate(post.date, "long")}</time>}
        <span aria-hidden="true">·</span>
        <span>{readingTime(post)}</span>
      </div>

      <h1 className="display max-w-4xl text-4xl font-bold leading-[1.05] text-ink sm:text-5xl md:text-6xl">
        {post.title || "Untitled"}
      </h1>

      {(post.subtitle || post.excerpt) && (
        <p className="max-w-2xl text-[17px] leading-relaxed text-ink-soft md:text-xl md:leading-relaxed">
          {post.subtitle || post.excerpt}
        </p>
      )}

      {post.tags.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag} className="chip rounded-full px-2.5 py-1 mono text-[11px]">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </header>

    {post.cover && (
      <div className="rail mt-12 md:mt-16">
        <img
          src={post.cover.src}
          alt={post.cover.alt}
          width={post.cover.w}
          height={post.cover.h}
          fetchPriority="high"
          className="aspect-[16/9] h-auto w-full rounded-[28px] border border-line bg-raised object-cover md:rounded-[40px]"
        />
      </div>
    )}

    <div className="rail pb-16 pt-6 md:pb-24 md:pt-10">
      {/* measure kept near 70 characters so long reads stay comfortable */}
      <div className="prose-post mx-auto max-w-[68ch]">
        {post.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>
    </div>
  </article>
);

export default PostView;

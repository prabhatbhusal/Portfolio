// the post format, shared by the build (which reads content/blog/*.json),
// the post template, and the admin editor that writes those files.
// no imports on purpose: `node --test` loads this file directly.

export type Block =
  | { type: "h2" | "h3" | "p" | "quote" | "code"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "img"; src: string; alt: string; caption?: string; w?: number; h?: number };

export interface PostImage {
  src: string;
  alt: string;
  w?: number;
  h?: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  /* yyyy-mm-dd */
  date: string;
  tags: string[];
  cover?: PostImage;
  blocks: Block[];
}

export type Inline =
  | { kind: "text" | "strong" | "em" | "code"; text: string }
  | { kind: "link"; text: string; href: string };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TEXT_TYPES = new Set(["h2", "h3", "p", "quote", "code"]);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");

/* links in post text may only go somewhere a reader expects — never
   javascript:, data: or a protocol-relative //host */
export const safeHref = (href: string): string | null =>
  /^(https?:\/\/|mailto:|#)/i.test(href) || /^\/(?!\/)/.test(href) ? href : null;

/* images come from this site's own /blog folder or plain https */
export const safeSrc = (src: string) =>
  (/^\/(?!\/)[\w\-./]+$/.test(src) && !src.includes("..")) ||
  /^https:\/\/[^\s"'<>]+$/.test(src);

/* **bold**, *italic*, `code` and [label](href). flat — no nesting.
   ponytail: flat inline marks; reach for a markdown lib if posts need more */
const INLINE =
  /\*\*([^*]+?)\*\*|\*([^\s*](?:[^*]*[^\s*])?)\*|`([^`]+)`|\[([^\]]+)\]\(([^()\s]+)\)/g;

export function parseInline(source: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;

  for (const match of source.matchAll(INLINE)) {
    const at = match.index ?? 0;
    if (at > last) out.push({ kind: "text", text: source.slice(last, at) });

    const [, strong, em, code, label, href] = match;
    if (strong !== undefined) out.push({ kind: "strong", text: strong });
    else if (em !== undefined) out.push({ kind: "em", text: em });
    else if (code !== undefined) out.push({ kind: "code", text: code });
    else {
      const safe = safeHref(href);
      out.push(safe ? { kind: "link", text: label, href: safe } : { kind: "text", text: label });
    }

    last = at + match[0].length;
  }

  if (last < source.length) out.push({ kind: "text", text: source.slice(last) });
  return out;
}

export const plainText = (source: string) =>
  parseInline(source)
    .map((part) => part.text)
    .join("");

export const readingTime = (post: Pick<BlogPost, "blocks">) => {
  const words = post.blocks
    .map((b) => (b.type === "list" ? b.items.join(" ") : b.type === "img" ? "" : b.text))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
};

/* first paragraph, cut on a word boundary */
export const makeExcerpt = (blocks: Block[], max = 180) => {
  const first = blocks.find((b) => b.type === "p");
  const text = first && "text" in first ? plainText(first.text).trim() : "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
};

/* dates are calendar days, so they are formatted in utc — otherwise a
   reader west of greenwich sees the day before */
export const formatDate = (value: string, month: "short" | "long" = "short") =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month,
    year: "numeric",
    timeZone: "UTC",
  });

// ------------------------------------------------------------------
// validation — the build runs every post file through this, and so does
// the admin before it commits. a bad file fails the build, and a failed
// build never deploys, so the live site keeps the last good version.
// ------------------------------------------------------------------

const fail = (message: string): never => {
  throw new Error(message);
};

const str = (value: unknown, field: string, max: number, required = true): string => {
  if (value === undefined || value === "") {
    return required ? fail(`${field} is required`) : "";
  }
  if (typeof value !== "string") return fail(`${field} must be text`);
  if (value.length > max) return fail(`${field} is longer than ${max} characters`);
  return value;
};

const dim = (value: unknown, field: string) => {
  if (value === undefined) return undefined;
  if (!Number.isInteger(value) || (value as number) <= 0 || (value as number) > 20000) {
    return fail(`${field} must be a positive whole number`);
  }
  return value as number;
};

const image = (value: unknown, field: string): PostImage => {
  if (!value || typeof value !== "object") return fail(`${field} must be an object`);
  const raw = value as Record<string, unknown>;
  const src = str(raw.src, `${field}.src`, 2000);
  if (!safeSrc(src)) fail(`${field}.src must be a site path or an https url`);
  const w = dim(raw.w, `${field}.w`);
  const h = dim(raw.h, `${field}.h`);
  return { src, alt: str(raw.alt, `${field}.alt`, 300, false), ...(w && h ? { w, h } : {}) };
};

const block = (value: unknown, at: number): Block => {
  const field = `blocks[${at}]`;
  if (!value || typeof value !== "object") return fail(`${field} must be an object`);
  const raw = value as Record<string, unknown>;

  if (typeof raw.type === "string" && TEXT_TYPES.has(raw.type)) {
    return { type: raw.type as "p", text: str(raw.text, `${field}.text`, 20000) };
  }

  if (raw.type === "list") {
    if (!Array.isArray(raw.items) || raw.items.length === 0 || raw.items.length > 200) {
      return fail(`${field}.items must be a list of 1–200 entries`);
    }
    return {
      type: "list",
      ...(raw.ordered === true ? { ordered: true } : {}),
      items: raw.items.map((item, i) => str(item, `${field}.items[${i}]`, 2000)),
    };
  }

  if (raw.type === "img") {
    const caption = str(raw.caption, `${field}.caption`, 500, false);
    return { type: "img", ...image(raw, field), ...(caption ? { caption } : {}) };
  }

  return fail(`${field}.type "${String(raw.type)}" is not a block type`);
};

/** checks a parsed post file and returns a clean copy — unknown fields dropped */
export function validatePost(value: unknown): BlogPost {
  if (!value || typeof value !== "object") return fail("post must be an object");
  const raw = value as Record<string, unknown>;

  const slug = str(raw.slug, "slug", 80);
  if (!SLUG.test(slug)) fail("slug may only use a-z, 0-9 and single dashes");

  const date = str(raw.date, "date", 10);
  if (!DATE.test(date) || Number.isNaN(Date.parse(date))) fail("date must be yyyy-mm-dd");

  const tags = raw.tags ?? [];
  if (!Array.isArray(tags) || tags.length > 10) fail("tags must be a list of up to 10");

  const blocks = raw.blocks;
  if (!Array.isArray(blocks) || blocks.length === 0) fail("a post needs at least one block");
  if ((blocks as unknown[]).length > 500) fail("a post can have at most 500 blocks");

  const subtitle = str(raw.subtitle, "subtitle", 300, false);

  return {
    slug,
    title: str(raw.title, "title", 200),
    ...(subtitle ? { subtitle } : {}),
    excerpt: str(raw.excerpt, "excerpt", 400),
    date,
    tags: (tags as unknown[]).map((tag, i) => str(tag, `tags[${i}]`, 40)),
    ...(raw.cover ? { cover: image(raw.cover, "cover") } : {}),
    blocks: (blocks as unknown[]).map(block),
  };
}

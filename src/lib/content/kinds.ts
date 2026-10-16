// the editable collections, described once. the studio renders its forms
// from these fields and the server validates every write against them, so
// the two cannot drift apart. posts are richer and have their own format
// (src/lib/blog/format.ts); everything else is a flat record.

import { safeHref, safeSrc, validatePost } from "@/lib/blog/format";

export type Kind = "post" | "project" | "game" | "photo";
export const KINDS: Kind[] = ["post", "project", "game", "photo"];

export type Field =
  | { key: string; label: string; type: "text" | "textarea" | "url"; required?: boolean; hint?: string }
  | { key: string; label: string; type: "list"; hint?: string }
  | { key: string; label: string; type: "bool" }
  | { key: string; label: string; type: "select"; options: string[] }
  | { key: string; label: string; type: "image"; required?: boolean }
  | { key: string; label: string; type: "images" };

export const FIELDS: Record<Exclude<Kind, "post">, Field[]> = {
  project: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "description", label: "Summary", type: "textarea", required: true },
    { key: "year", label: "Year", type: "text" },
    { key: "role", label: "Your role", type: "text" },
    { key: "sector", label: "Domain", type: "text", hint: "e.g. GIS" },
    { key: "stack", label: "Type", type: "text", hint: "e.g. Full Stack" },
    { key: "badge", label: "Badge", type: "text", hint: "e.g. geospatial" },
    { key: "skills", label: "Built with", type: "list", hint: "one per line" },
    { key: "highlights", label: "What it took", type: "list", hint: "one point per line" },
    { key: "github", label: "Source link", type: "url" },
    { key: "live", label: "Live link", type: "url" },
    { key: "featured", label: "Featured", type: "bool" },
    { key: "cover", label: "Cover image", type: "image" },
  ],
  game: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "tagline", label: "Tagline", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea", required: true },
    { key: "engine", label: "Engine", type: "select", options: ["Unity", "Unreal Engine"] },
    { key: "status", label: "Status", type: "select", options: ["released", "in development", "prototype"] },
    { key: "genre", label: "Genre", type: "text" },
    { key: "year", label: "Year", type: "text" },
    { key: "role", label: "Your role", type: "text" },
    { key: "platforms", label: "Platforms", type: "list", hint: "one per line" },
    { key: "features", label: "Features", type: "list", hint: "one per line" },
    { key: "tech", label: "Tech", type: "list", hint: "one per line" },
    { key: "download", label: "Download link", type: "url" },
    { key: "source", label: "Source link", type: "url" },
    { key: "featured", label: "Featured", type: "bool" },
    { key: "cover", label: "Cover", type: "image", required: true },
    { key: "shots", label: "Screenshots", type: "images" },
  ],
  photo: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "location", label: "Location", type: "text" },
    { key: "date", label: "Date", type: "text", hint: "a year is fine" },
    { key: "image", label: "Photo", type: "image", required: true },
  ],
};

export const LABELS: Record<Kind, { plural: string; one: string }> = {
  post: { plural: "Posts", one: "post" },
  project: { plural: "Projects", one: "project" },
  game: { plural: "Games", one: "game" },
  photo: { plural: "Photos", one: "photo" },
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LIMIT = { text: 200, textarea: 4000, url: 500, item: 600 };

const fail = (message: string): never => {
  throw new Error(message);
};

const text = (value: unknown, label: string, max: number) => {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return fail(`${label} must be text`);
  if (value.length > max) return fail(`${label} is longer than ${max} characters`);
  return value.trim();
};

const dimension = (value: unknown, label: string) =>
  Number.isInteger(value) && (value as number) > 0 && (value as number) <= 20000
    ? (value as number)
    : fail(`${label} needs a width and height`);

const image = (value: unknown, label: string) => {
  if (!value || typeof value !== "object") return fail(`${label} must be an image`);
  const raw = value as Record<string, unknown>;
  const src = text(raw.src, `${label} source`, 2000);
  if (!safeSrc(src)) fail(`${label} must be an uploaded image or an https url`);
  const caption = text(raw.caption, `${label} caption`, 300);
  return {
    src,
    alt: text(raw.alt, `${label} description`, 300),
    width: dimension(raw.width, label),
    height: dimension(raw.height, label),
    ...(caption ? { caption } : {}),
  };
};

/** a clean copy of one record, or an error naming the first bad field */
export function validateItem(kind: Kind, value: unknown): Record<string, unknown> & { slug: string } {
  if (kind === "post") return validatePost(value) as unknown as Record<string, unknown> & { slug: string };
  if (!value || typeof value !== "object") return fail("expected a record");

  const raw = value as Record<string, unknown>;
  const slug = text(raw.slug, "address", 80);
  if (!SLUG.test(slug)) fail("the address may only use a-z, 0-9 and single dashes");

  const out: Record<string, unknown> & { slug: string } = { slug };

  for (const field of FIELDS[kind]) {
    const v = raw[field.key];

    switch (field.type) {
      case "text":
      case "textarea": {
        const t = text(v, field.label, LIMIT[field.type]);
        if (field.required && !t) fail(`${field.label} is required`);
        out[field.key] = t;
        break;
      }
      case "url": {
        const t = text(v, field.label, LIMIT.url);
        if (t && !/^https?:\/\//i.test(t)) fail(`${field.label} must start with https://`);
        if (t && !safeHref(t)) fail(`${field.label} is not a usable link`);
        out[field.key] = t || null;
        break;
      }
      case "list": {
        const list = v ?? [];
        if (!Array.isArray(list) || list.length > 50) fail(`${field.label} must be a list of up to 50`);
        out[field.key] = (list as unknown[])
          .map((item) => text(item, field.label, LIMIT.item))
          .filter(Boolean);
        break;
      }
      case "bool":
        out[field.key] = v === true;
        break;
      case "select": {
        if (!field.options.includes(v as string)) fail(`${field.label} must be one of ${field.options.join(", ")}`);
        out[field.key] = v;
        break;
      }
      case "image":
        if (v) out[field.key] = image(v, field.label);
        else if (field.required) fail(`${field.label} is required`);
        break;
      case "images": {
        const list = v ?? [];
        if (!Array.isArray(list) || list.length > 24) fail(`${field.label} must be up to 24 images`);
        out[field.key] = (list as unknown[]).map((item, i) => image(item, `${field.label} ${i + 1}`));
        break;
      }
    }
  }

  return out;
}

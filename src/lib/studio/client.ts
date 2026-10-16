// browser-side helpers for the studio: talking to the api, shrinking
// images before they upload, and turning a word document into a post.

import { makeExcerpt, safeHref, type Block, type BlogPost, type PostImage } from "@/lib/blog/format";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

/** json in, json out; a raw blob is sent as the body untouched */
export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown; raw?: Blob } = {}) {
  const hasBody = init.body !== undefined || init.raw !== undefined;
  const res = await fetch(path, {
    method: init.method ?? (hasBody ? "POST" : "GET"),
    headers: init.raw
      ? { "Content-Type": init.raw.type || "application/octet-stream" }
      : init.body !== undefined
        ? { "Content-Type": "application/json" }
        : undefined,
    body: init.raw ?? (init.body !== undefined ? JSON.stringify(init.body) : undefined),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? `Request failed (${res.status}).`);
  return data as T;
}

// ------------------------------------------------------------------
// images
// ------------------------------------------------------------------

const MAX_WIDTH = 1600;

/** decodes, downsizes and re-encodes to webp. re-encoding through a canvas
 *  is also the safety step: whatever came in leaves as plain pixels */
async function compress(file: Blob) {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("That file is not an image this browser can read.");
  });
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const encode = (type: string, quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

  let blob = await encode("image/webp", 0.82);
  // older safari cannot encode webp and quietly hands back a png
  if (!blob || blob.type !== "image/webp") {
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#fff"; // jpeg has no transparency
    ctx.fillRect(0, 0, width, height);
    blob = await encode("image/jpeg", 0.85);
  }
  if (!blob) throw new Error("That image could not be encoded.");
  return { blob, width, height };
}

/** shrink, then store; returns where the image now lives */
export async function uploadImage(file: Blob) {
  if (file.size > 25 * 1024 * 1024) throw new Error("That image is over 25 MB.");
  const { blob, width, height } = await compress(file);
  const { src } = await api<{ src: string }>("/api/media", { raw: blob });
  return { src, width, height };
}

export const pickFile = (accept: string) =>
  new Promise<File | null>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });

// ------------------------------------------------------------------
// word documents
// ------------------------------------------------------------------

const dataUrlToBlob = (url: string) => {
  const [head, body] = url.split(",");
  const bytes = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return new Blob([bytes], { type: head.slice(5, head.indexOf(";")) });
};

/* html element -> the post's inline syntax (**b**, *i*, `c`, [a](href)) */
const inline = (node: Node): string =>
  Array.from(node.childNodes)
    .map((child) => {
      if (child.nodeType === Node.TEXT_NODE) return child.textContent ?? "";
      if (!(child instanceof Element)) return "";

      const tag = child.tagName.toLowerCase();
      if (tag === "br") return " ";
      if (tag === "ul" || tag === "ol" || tag === "img") return "";

      const inner = inline(child);
      if (!inner.trim()) return inner;
      if (tag === "strong" || tag === "b") return `**${inner}**`;
      if (tag === "em" || tag === "i") return `*${inner}*`;
      if (tag === "code") return `\`${inner}\``;
      if (tag === "a") {
        const href = child.getAttribute("href") ?? "";
        // mammoth passes javascript: links straight through — this is the filter
        return safeHref(href) ? `[${inner}](${href})` : inner;
      }
      return inner;
    })
    .join("");

const clean = (text: string) => text.replace(/\s+/g, " ").trim();

/** a .docx becomes a ready-to-publish post: the Title style (or first
 *  heading) is the title, Subtitle the subtitle, an image before any text
 *  the cover, and the rest maps onto blocks. images upload as they go */
export async function docxToPost(file: File, onProgress?: (note: string) => void) {
  const { default: mammoth } = await import("mammoth");
  const { value: html } = await mammoth.convertToHtml(
    { arrayBuffer: await file.arrayBuffer() },
    { styleMap: ["p[style-name='Title'] => h1:fresh", "p[style-name='Subtitle'] => p.subtitle:fresh"] }
  );

  // a DOMParser document is inert: no scripts run, no images load
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: Block[] = [];
  let title = "";
  let subtitle = "";
  let cover: PostImage | undefined;
  let images = 0;

  for (const el of Array.from(doc.body.children)) {
    const tag = el.tagName.toLowerCase();

    for (const img of Array.from(el.querySelectorAll("img"))) {
      const src = img.getAttribute("src") ?? "";
      if (!src.startsWith("data:image/")) continue;
      onProgress?.(`Uploading image ${++images}…`);
      // emf/wmf drawings will not decode in a browser — they are skipped
      const stored = await uploadImage(dataUrlToBlob(src)).catch(() => null);
      if (!stored) continue;
      const image = { src: stored.src, alt: img.getAttribute("alt") ?? "", w: stored.width, h: stored.height };

      if (!cover && blocks.length === 0) cover = image;
      else blocks.push({ type: "img", ...image });
    }

    const text = clean(inline(el));
    if (!text) continue;

    if (tag === "h1" && !title) title = clean(el.textContent ?? "");
    else if (el.classList.contains("subtitle") && !subtitle) subtitle = clean(el.textContent ?? "");
    else if (tag === "h1" || tag === "h2") blocks.push({ type: "h2", text: clean(el.textContent ?? "") });
    else if (/^h[3-6]$/.test(tag)) blocks.push({ type: "h3", text: clean(el.textContent ?? "") });
    else if (tag === "ul" || tag === "ol") {
      // nested lists come out flattened, one entry per item
      const items = Array.from(el.querySelectorAll("li"))
        .map((li) => clean(inline(li)))
        .filter(Boolean);
      if (items.length) blocks.push({ type: "list", ...(tag === "ol" ? { ordered: true } : {}), items });
    } else if (tag === "blockquote") blocks.push({ type: "quote", text });
    else if (tag === "pre") blocks.push({ type: "code", text: el.textContent ?? "" });
    else if (tag === "table") {
      // ponytail: tables flatten to one paragraph per row
      for (const row of Array.from(el.querySelectorAll("tr"))) {
        const cells = Array.from(row.children).map((cell) => clean(inline(cell))).filter(Boolean);
        if (cells.length) blocks.push({ type: "p", text: cells.join(" · ") });
      }
    } else blocks.push({ type: "p", text });
  }

  return {
    title: title || file.name.replace(/\.docx$/i, ""),
    ...(subtitle ? { subtitle } : {}),
    excerpt: subtitle || makeExcerpt(blocks),
    tags: [],
    ...(cover ? { cover } : {}),
    blocks,
  } satisfies Omit<BlogPost, "slug" | "date">;
}

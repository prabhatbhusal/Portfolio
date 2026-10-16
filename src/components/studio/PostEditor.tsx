"use client";

/* eslint-disable @next/next/no-img-element -- previews of uploads */
import React, { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Eye, FileText, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";

import PostView from "@/components/blog/PostView";
import { makeExcerpt, slugify, validatePost, type Block, type BlogPost } from "@/lib/blog/format";
import { api, docxToPost, pickFile, uploadImage } from "@/lib/studio/client";
import type { Row } from "./Studio";

const LABELS: Record<Block["type"], string> = {
  p: "Paragraph",
  h2: "Heading",
  h3: "Subheading",
  quote: "Quote",
  list: "List",
  code: "Code",
  img: "Image",
};

// local calendar day, not utc — late at night in kathmandu is still today
const today = () => new Date().toLocaleDateString("en-CA");

const blank = (): BlogPost => ({
  slug: "",
  title: "",
  excerpt: "",
  date: today(),
  tags: [],
  blocks: [{ type: "p", text: "" }],
});

const hasContent = (b: Block) =>
  b.type === "list" ? b.items.some((i) => i.trim()) : b.type === "img" ? !!b.src : !!b.text.trim();

/* the draft as it would publish: empty blocks dropped, gaps filled */
const finalize = (draft: BlogPost): BlogPost => {
  const blocks = draft.blocks
    .filter(hasContent)
    .map((b) => (b.type === "list" ? { ...b, items: b.items.map((i) => i.trim()).filter(Boolean) } : b));
  return {
    ...draft,
    slug: slugify(draft.slug || draft.title),
    title: draft.title.trim(),
    excerpt: draft.excerpt.trim() || makeExcerpt(blocks),
    tags: draft.tags.map((t) => t.trim()).filter(Boolean),
    blocks,
  };
};

const rows = (text: string) => Math.min(24, Math.max(2, text.split("\n").length + Math.floor(text.length / 90)));

/* every keystroke is kept in this browser until the post is saved, so a
   closed tab loses nothing. images are already uploaded urls, so it stays small */
const storageKey = (slug: string | undefined) => `studio-post:${slug ?? "new"}`;

const restore = (key: string): BlogPost | null => {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "null");
    return saved?.blocks ? saved : null;
  } catch {
    return null;
  }
};

const PostEditor = ({ initial, onDone }: { initial: Row | null; onDone: () => void }) => {
  const key = storageKey(initial?.slug);
  const [restored, setRestored] = useState(() => !!restore(key));
  const [draft, setDraft] = useState<BlogPost>(
    () => restore(key) ?? ((initial?.data as unknown as BlogPost) || blank())
  );
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [preview, setPreview] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [insertAt, setInsertAt] = useState<number | null>(null);

  const save = (next: BlogPost) => {
    setDraft(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // storage full or blocked — the editor still works, just without the net
    }
  };

  const patch = (fields: Partial<BlogPost>) => {
    const next = { ...draft, ...fields };
    if (fields.title !== undefined && !slugTouched) next.slug = slugify(fields.title);
    save(next);
  };
  const setBlocks = (blocks: Block[]) => patch({ blocks });
  const setBlock = (i: number, block: Block) => setBlocks(draft.blocks.map((b, j) => (j === i ? block : b)));
  const move = (i: number, by: number) => {
    const blocks = [...draft.blocks];
    const [block] = blocks.splice(i, 1);
    blocks.splice(Math.max(0, Math.min(blocks.length, i + by)), 0, block);
    setBlocks(blocks);
  };
  const add = (block: Block) => {
    const at = insertAt ?? draft.blocks.length;
    setBlocks([...draft.blocks.slice(0, at), block, ...draft.blocks.slice(at)]);
    setInsertAt(null);
  };

  async function task<T>(label: string, run: () => Promise<T>) {
    setBusy(true);
    setNote(label);
    try {
      const result = await run();
      setNote("");
      return result;
    } catch (err) {
      setNote((err as Error).message);
      return undefined;
    } finally {
      setBusy(false);
    }
  }

  async function importWord() {
    const file = await pickFile(".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) return setNote("That document is over 25 MB.");
    const hasWork = draft.title.trim() || draft.blocks.some(hasContent);
    if (hasWork && !confirm("Replace what is in the editor with this document?")) return;

    const imported = await task("Reading the document…", () => docxToPost(file, setNote));
    if (!imported) return;
    save({ ...blank(), ...imported, slug: initial ? draft.slug : slugify(imported.title), date: draft.date });
    setNote(`Imported “${imported.title}” — ${imported.blocks.length} blocks. Check the preview, then publish.`);
  }

  async function addImage(onto: (image: { src: string; w: number; h: number }) => void) {
    const file = await pickFile("image/*");
    if (!file) return;
    const stored = await task("Uploading image…", () => uploadImage(file));
    if (stored) onto({ src: stored.src, w: stored.width, h: stored.height });
  }

  async function publish(published: boolean) {
    const post = finalize(draft);
    try {
      validatePost(post);
    } catch (err) {
      return setNote(`Not ready yet: ${(err as Error).message}.`);
    }
    const ok = await task(published ? "Publishing…" : "Saving draft…", () =>
      api("/api/content/post", { body: { data: post, published, previous: initial?.slug ?? null } })
    );
    if (!ok) return;
    localStorage.removeItem(key);
    onDone();
  }

  const addBar = (
    <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-dashed border-line p-2">
      {(["p", "h2", "h3", "quote", "list", "code"] as const).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => add(type === "list" ? { type, items: [""] } : { type, text: "" })}
          className="chip inline-flex h-8 items-center gap-1 rounded-full px-3 text-[12px] font-medium hover:text-ink"
        >
          <Plus size={12} /> {LABELS[type]}
        </button>
      ))}
      <button
        type="button"
        onClick={() => addImage((image) => add({ type: "img", alt: "", ...image }))}
        className="chip inline-flex h-8 items-center gap-1 rounded-full px-3 text-[12px] font-medium hover:text-ink"
      >
        <ImagePlus size={12} /> Image
      </button>
      {insertAt !== null && (
        <button type="button" onClick={() => setInsertAt(null)} className="ml-auto px-2 text-[12px] text-ink-faint">
          cancel
        </button>
      )}
    </div>
  );

  const control = "grid size-7 place-items-center rounded-md text-ink-faint hover:text-ink disabled:opacity-30";
  const field = "field rounded-xl px-3 py-2 text-[13px] normal-case";
  const label = "flex flex-col gap-1.5 text-[11px] font-semibold uppercase text-ink-faint";

  return (
    <main className="rail py-8 md:py-12">
      <button type="button" onClick={onDone} className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-soft hover:text-ink">
        <ArrowLeft size={15} /> Back to posts
      </button>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <h1 className="display mr-auto text-3xl font-bold text-ink">{initial ? "Edit post" : "New post"}</h1>
        <button type="button" disabled={busy} onClick={importWord} className="btn-quiet inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold">
          <FileText size={15} /> Import Word
        </button>
        <button type="button" onClick={() => setPreview(!preview)} aria-pressed={preview} className="btn-quiet inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold">
          {preview ? <Pencil size={15} /> : <Eye size={15} />} {preview ? "Edit" : "Preview"}
        </button>
        <button type="button" disabled={busy} onClick={() => publish(false)} className="btn-quiet h-10 rounded-full px-4 text-[13px] font-semibold">
          Save draft
        </button>
        <button type="button" disabled={busy} onClick={() => publish(true)} className="btn-solid h-10 rounded-xl px-5 text-[13px] font-semibold disabled:opacity-60">
          {initial?.published ? "Update" : "Publish"}
        </button>
      </div>

      <div aria-live="polite" className="mt-3 min-h-5 text-[13px] text-ink-soft">
        {note}
        {restored && !note && (
          <span>
            Restored your unsaved changes.{" "}
            <button
              type="button"
              className="underline"
              onClick={() => {
                localStorage.removeItem(key);
                setDraft((initial?.data as unknown as BlogPost) || blank());
                setRestored(false);
              }}
            >
              Discard them
            </button>
          </span>
        )}
      </div>

      {preview ? (
        <div className="mt-4 overflow-hidden rounded-[28px] border border-line">
          <PostView post={finalize(draft)} />
        </div>
      ) : (
        <div className="mt-4 flex max-w-4xl flex-col gap-4">
          <input
            aria-label="Title"
            value={draft.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Post title"
            className="display w-full bg-transparent text-3xl font-bold text-ink outline-none placeholder:text-ink-faint md:text-5xl"
          />
          <input
            aria-label="Subtitle"
            value={draft.subtitle ?? ""}
            onChange={(e) => patch({ subtitle: e.target.value })}
            placeholder="Subtitle (optional)"
            className="w-full bg-transparent text-lg text-ink-soft outline-none placeholder:text-ink-faint md:text-xl"
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <label className={label}>
              Address
              <input
                value={draft.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  patch({ slug: e.target.value });
                }}
                placeholder="from-the-title"
                className={`${field} mono`}
              />
            </label>
            <label className={label}>
              Date
              <input type="date" value={draft.date} onChange={(e) => patch({ date: e.target.value })} className={field} />
            </label>
            <label className={label}>
              Tags
              <input
                value={draft.tags.join(", ")}
                onChange={(e) => patch({ tags: e.target.value.split(",") })}
                placeholder="PostGIS, Django"
                className={field}
              />
            </label>
          </div>

          <label className={label}>
            Summary — shown on cards and in search results
            <textarea
              value={draft.excerpt}
              onChange={(e) => patch({ excerpt: e.target.value })}
              placeholder={makeExcerpt(draft.blocks) || "Leave empty to use the first paragraph"}
              rows={2}
              className={`${field} resize-y text-[14px]`}
            />
          </label>

          <div className="surface flex flex-wrap items-center gap-4 rounded-2xl p-3">
            {draft.cover ? (
              <img src={draft.cover.src} alt="" className="h-20 w-36 rounded-lg object-cover" />
            ) : (
              <span className="grid h-20 w-36 place-items-center rounded-lg border border-dashed border-line text-[12px] text-ink-faint">
                no cover
              </span>
            )}
            <div className="flex min-w-48 flex-1 flex-col gap-2">
              {draft.cover && (
                <input
                  value={draft.cover.alt}
                  onChange={(e) => patch({ cover: { ...draft.cover!, alt: e.target.value } })}
                  placeholder="Describe the cover for screen readers"
                  className={field}
                />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addImage((image) => patch({ cover: { ...image, alt: draft.cover?.alt ?? "" } }))}
                  className="chip inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium hover:text-ink"
                >
                  <ImagePlus size={13} /> {draft.cover ? "Replace cover" : "Add cover"}
                </button>
                {draft.cover && (
                  <button type="button" onClick={() => patch({ cover: undefined })} className="chip inline-flex h-8 items-center rounded-full px-3 text-[12px] font-medium hover:text-ink">
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <ol className="flex flex-col gap-3">
            {draft.blocks.map((block, i) => (
              <li key={i} className="flex flex-col gap-3">
                <div className="surface rounded-2xl p-3">
                  <div className="mb-2 flex items-center gap-1">
                    {block.type === "img" ? (
                      <span className="px-1 text-[11px] font-semibold uppercase text-ink-faint">Image</span>
                    ) : (
                      <select
                        aria-label="Block type"
                        value={block.type === "list" ? (block.ordered ? "ol" : "list") : block.type}
                        onChange={(e) => {
                          const type = e.target.value;
                          const text = block.type === "list" ? block.items.join("\n") : block.text;
                          setBlock(
                            i,
                            type === "list" || type === "ol"
                              ? { type: "list", ...(type === "ol" ? { ordered: true } : {}), items: text.split("\n") }
                              : { type: type as "p", text }
                          );
                        }}
                        className="rounded-md bg-transparent px-1 text-[11px] font-semibold uppercase text-ink-faint outline-none"
                      >
                        <option value="p">Paragraph</option>
                        <option value="h2">Heading</option>
                        <option value="h3">Subheading</option>
                        <option value="quote">Quote</option>
                        <option value="list">Bullet list</option>
                        <option value="ol">Numbered list</option>
                        <option value="code">Code</option>
                      </select>
                    )}
                    <span className="ml-auto" />
                    <button type="button" aria-label="Insert below" title="Insert below" onClick={() => setInsertAt(i + 1)} className={control}>
                      <Plus size={14} />
                    </button>
                    <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className={control}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" aria-label="Move down" disabled={i === draft.blocks.length - 1} onClick={() => move(i, 1)} className={control}>
                      <ArrowDown size={14} />
                    </button>
                    <button type="button" aria-label="Remove block" onClick={() => setBlocks(draft.blocks.filter((_, j) => j !== i))} className={`${control} hover:text-red-500`}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {block.type === "img" ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <img src={block.src} alt="" className="max-h-56 rounded-lg border border-line object-contain sm:w-64" />
                      <div className="flex flex-1 flex-col gap-2">
                        <input value={block.alt} onChange={(e) => setBlock(i, { ...block, alt: e.target.value })} placeholder="Alt text — what is in the picture" className={field} />
                        <input value={block.caption ?? ""} onChange={(e) => setBlock(i, { ...block, caption: e.target.value })} placeholder="Caption (optional)" className={field} />
                      </div>
                    </div>
                  ) : block.type === "list" ? (
                    <textarea
                      aria-label="List items, one per line"
                      value={block.items.join("\n")}
                      onChange={(e) => setBlock(i, { ...block, items: e.target.value.split("\n") })}
                      placeholder="One item per line"
                      rows={rows(block.items.join("\n"))}
                      className="w-full resize-y bg-transparent text-[15px] leading-relaxed text-ink outline-none"
                    />
                  ) : (
                    <textarea
                      aria-label={LABELS[block.type]}
                      value={block.text}
                      onChange={(e) => setBlock(i, { ...block, text: e.target.value })}
                      placeholder={block.type === "p" ? "Write…" : LABELS[block.type]}
                      rows={block.type === "h2" || block.type === "h3" ? 1 : rows(block.text)}
                      className={`w-full resize-y bg-transparent leading-relaxed text-ink outline-none ${
                        block.type === "h2"
                          ? "text-2xl font-bold"
                          : block.type === "h3"
                            ? "text-xl font-semibold"
                            : block.type === "code"
                              ? "mono text-[13px]"
                              : "text-[15px]"
                      }`}
                    />
                  )}
                </div>
                {insertAt === i + 1 && addBar}
              </li>
            ))}
          </ol>

          {insertAt === null && addBar}

          <p className="text-[12px] text-ink-faint">
            In text: <span className="mono">**bold**</span>, <span className="mono">*italic*</span>,{" "}
            <span className="mono">`code`</span>, <span className="mono">[link](https://…)</span>
          </p>
        </div>
      )}
    </main>
  );
};

export default PostEditor;

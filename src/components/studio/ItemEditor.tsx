"use client";

/* eslint-disable @next/next/no-img-element -- previews of uploads */
import React, { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Trash2 } from "lucide-react";

import { slugify } from "@/lib/blog/format";
import { FIELDS, LABELS, validateItem, type Field, type Kind } from "@/lib/content/kinds";
import { api, pickFile, uploadImage } from "@/lib/studio/client";
import type { Row } from "./Studio";

type Image = { src: string; alt: string; width: number; height: number; caption?: string };
type Data = Record<string, unknown>;

const label = "flex flex-col gap-1.5 text-[11px] font-semibold uppercase text-ink-faint";
const input = "field rounded-xl px-3 py-2.5 text-[14px] normal-case";

/** one image field: preview, upload/replace, alt text */
const ImageInput = ({
  value,
  onChange,
  onBusy,
  caption = false,
}: {
  value: Image | undefined;
  onChange: (next: Image | undefined) => void;
  onBusy: (note: string) => void;
  caption?: boolean;
}) => {
  async function upload() {
    const file = await pickFile("image/*");
    if (!file) return;
    onBusy("Uploading image…");
    try {
      const stored = await uploadImage(file);
      onChange({ ...stored, alt: value?.alt ?? "", ...(value?.caption ? { caption: value.caption } : {}) });
      onBusy("");
    } catch (err) {
      onBusy((err as Error).message);
    }
  }

  return (
    <div className="surface flex flex-wrap items-start gap-4 rounded-2xl p-3">
      {value ? (
        <img src={value.src} alt="" className="h-24 w-40 rounded-lg object-cover" />
      ) : (
        <span className="grid h-24 w-40 place-items-center rounded-lg border border-dashed border-line text-[12px] normal-case text-ink-faint">
          no image
        </span>
      )}
      <div className="flex min-w-48 flex-1 flex-col gap-2">
        {value && (
          <input
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder="Describe it for screen readers"
            className={input}
          />
        )}
        {value && caption && (
          <input
            value={value.caption ?? ""}
            onChange={(e) => onChange({ ...value, caption: e.target.value })}
            placeholder="Caption (optional)"
            className={input}
          />
        )}
        <div className="flex gap-2">
          <button type="button" onClick={upload} className="chip inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium normal-case hover:text-ink">
            <ImagePlus size={13} /> {value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange(undefined)} className="chip inline-flex h-8 items-center rounded-full px-3 text-[12px] font-medium normal-case hover:text-ink">
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/** a form built from the kind's field list — projects, games and photos */
const ItemEditor = ({
  kind,
  initial,
  nextSort,
  onDone,
}: {
  kind: Exclude<Kind, "post">;
  initial: Row | null;
  nextSort: number;
  onDone: () => void;
}) => {
  const [data, setData] = useState<Data>(() => initial?.data ?? {});
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [sort, setSort] = useState(initial?.sort ?? nextSort);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key: string, value: unknown) => {
    const next = { ...data, [key]: value };
    // the address follows the title until it is edited by hand
    if (key === "title" && !slugTouched) next.slug = slugify(String(value));
    setData(next);
  };

  async function save() {
    setNote("");
    try {
      validateItem(kind, data); // same check the server runs — fail fast, here
    } catch (err) {
      return setNote(`Not ready yet: ${(err as Error).message}.`);
    }
    setBusy(true);
    try {
      await api(`/api/content/${kind}`, {
        body: { data, published, sort, previous: initial?.slug ?? null },
      });
      onDone();
    } catch (err) {
      setNote((err as Error).message);
      setBusy(false);
    }
  }

  const render = (field: Field) => {
    const value = data[field.key];
    switch (field.type) {
      case "text":
      case "url":
        return (
          <label key={field.key} className={label}>
            {field.label}
            <input
              value={String(value ?? "")}
              onChange={(e) => set(field.key, e.target.value)}
              placeholder={"hint" in field ? field.hint : field.type === "url" ? "https://…" : ""}
              className={input}
            />
          </label>
        );
      case "textarea":
        return (
          <label key={field.key} className={`${label} sm:col-span-2`}>
            {field.label}
            <textarea value={String(value ?? "")} onChange={(e) => set(field.key, e.target.value)} rows={4} className={`${input} resize-y`} />
          </label>
        );
      case "list":
        return (
          <label key={field.key} className={`${label} sm:col-span-2`}>
            {field.label} <span className="font-normal normal-case">— {field.hint}</span>
            <textarea
              value={((value as string[]) ?? []).join("\n")}
              onChange={(e) => set(field.key, e.target.value.split("\n"))}
              rows={Math.max(3, ((value as string[]) ?? []).length + 1)}
              className={`${input} resize-y`}
            />
          </label>
        );
      case "bool":
        return (
          <label key={field.key} className="flex items-center gap-3 text-[14px] font-medium text-ink">
            <input type="checkbox" checked={value === true} onChange={(e) => set(field.key, e.target.checked)} className="size-4 accent-(--brand)" />
            {field.label}
          </label>
        );
      case "select":
        return (
          <label key={field.key} className={label}>
            {field.label}
            <select value={String(value ?? "")} onChange={(e) => set(field.key, e.target.value)} className={input}>
              <option value="" disabled>
                Choose…
              </option>
              {field.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        );
      case "image":
        return (
          <div key={field.key} className={`${label} sm:col-span-2`}>
            {field.label}
            <ImageInput value={value as Image | undefined} onChange={(v) => set(field.key, v)} onBusy={setNote} />
          </div>
        );
      case "images": {
        const list = (value as Image[]) ?? [];
        const update = (next: Image[]) => set(field.key, next);
        return (
          <div key={field.key} className={`${label} sm:col-span-2`}>
            {field.label}
            {list.map((img, i) => (
              <div key={img.src + i} className="flex items-start gap-2">
                <div className="flex-1">
                  <ImageInput
                    value={img}
                    caption
                    onBusy={setNote}
                    onChange={(v) => update(v ? list.map((x, j) => (j === i ? v : x)) : list.filter((_, j) => j !== i))}
                  />
                </div>
                <div className="flex flex-col">
                  <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => update(list.toSpliced(i - 1, 2, list[i], list[i - 1]))} className="grid size-8 place-items-center text-ink-faint hover:text-ink disabled:opacity-30">
                    <ArrowUp size={14} />
                  </button>
                  <button type="button" aria-label="Move down" disabled={i === list.length - 1} onClick={() => update(list.toSpliced(i, 2, list[i + 1], list[i]))} className="grid size-8 place-items-center text-ink-faint hover:text-ink disabled:opacity-30">
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))}
            <ImageInput value={undefined} onBusy={setNote} onChange={(v) => v && update([...list, v])} />
          </div>
        );
      }
    }
  };

  return (
    <main className="rail py-8 md:py-12">
      <button type="button" onClick={onDone} className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-soft hover:text-ink">
        <ArrowLeft size={15} /> Back to {LABELS[kind].plural.toLowerCase()}
      </button>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="display mr-auto text-3xl font-bold text-ink">
          {initial ? `Edit ${LABELS[kind].one}` : `New ${LABELS[kind].one}`}
        </h1>
        <label className="flex items-center gap-2 text-[13px] font-medium text-ink-soft">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="size-4 accent-(--brand)" />
          Visible on the site
        </label>
        <button type="button" disabled={busy} onClick={save} className="btn-solid h-10 rounded-xl px-5 text-[13px] font-semibold disabled:opacity-60">
          {busy ? "Saving…" : "Save"}
        </button>
        {initial && (
          <button
            type="button"
            aria-label="Delete"
            onClick={async () => {
              if (!confirm("Delete this? It cannot be undone.")) return;
              await api(`/api/content/${kind}/${initial.slug}`, { method: "DELETE" });
              onDone();
            }}
            className="btn-quiet grid size-10 place-items-center rounded-xl text-ink-faint hover:text-red-500"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-[13px] text-ink-soft">
        {note}
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {FIELDS[kind].map(render)}

        <label className={label}>
          Address
          <input
            value={String(data.slug ?? "")}
            onChange={(e) => {
              setSlugTouched(true);
              setData({ ...data, slug: e.target.value });
            }}
            className={`${input} mono`}
          />
        </label>
        <label className={label}>
          Position — lower comes first
          <input type="number" value={sort} onChange={(e) => setSort(Number(e.target.value) || 0)} className={input} />
        </label>
      </div>
    </main>
  );
};

export default ItemEditor;

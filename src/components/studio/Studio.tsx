"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ExternalLink, LogOut, Mail, Pencil, Plus, Trash2 } from "lucide-react";

import { KINDS, LABELS, type Kind } from "@/lib/content/kinds";
import { api } from "@/lib/studio/client";
import { cn } from "@/lib/utils";
import Inbox from "./Inbox";
import ItemEditor from "./ItemEditor";
import PostEditor from "./PostEditor";

export interface Row {
  slug: string;
  data: Record<string, unknown>;
  sort: number;
  published: boolean;
  updated_at: string;
}

type Tab = Kind | "inbox";

const PUBLIC: Record<Kind, (slug: string) => string> = {
  post: (slug) => `/blog/${slug}`,
  project: (slug) => `/work/${slug}`,
  game: (slug) => `/games/${slug}`,
  photo: () => "/gallery",
};

const when = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const Studio = ({ email }: { email: string }) => {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("post");
  const [rows, setRows] = useState<Row[] | null>(null);
  // null = the list; "new" = a blank editor; a row = editing that row
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async (kind: Kind) => {
    setRows(null);
    try {
      setRows(await api<Row[]>(`/api/content/${kind}`));
    } catch (err) {
      setError((err as Error).message);
      setRows([]);
    }
  }, []);

  useEffect(() => {
    if (tab === "inbox") return;
    let live = true;
    api<Row[]>(`/api/content/${tab}`)
      .then((list) => live && setRows(list))
      .catch((err) => live && (setError(err.message), setRows([])));
    return () => {
      live = false;
    };
  }, [tab]);

  const switchTo = (next: Tab) => {
    setEditing(null);
    setError("");
    setRows(null);
    setTab(next);
  };

  const done = () => {
    setEditing(null);
    if (tab !== "inbox") load(tab);
  };

  async function remove(kind: Kind, row: Row) {
    if (!confirm(`Delete “${String(row.data.title ?? row.slug)}”? This cannot be undone.`)) return;
    try {
      await api(`/api/content/${kind}/${row.slug}`, { method: "DELETE" });
      load(kind);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function signOut() {
    await api("/api/auth/logout", { body: {} });
    router.refresh();
  }

  if (editing && tab !== "inbox") {
    const initial = editing === "new" ? null : editing;
    return tab === "post" ? (
      <PostEditor initial={initial} onDone={done} />
    ) : (
      <ItemEditor kind={tab} initial={initial} nextSort={rows?.length ?? 0} onDone={done} />
    );
  }

  return (
    <main className="rail py-8 md:py-12">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-brand-ink">{"// studio"}</p>
          <h1 className="display mt-1 text-3xl font-bold text-ink md:text-4xl">Everything on the site</h1>
        </div>
        <span className="hidden mono text-[12px] text-ink-faint sm:inline">{email}</span>
        <button
          type="button"
          onClick={signOut}
          className="btn-quiet inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>

      <div role="tablist" className="no-scrollbar mt-8 flex gap-1 overflow-x-auto border-b border-line">
        {[...KINDS, "inbox" as const].map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => switchTo(t)}
            className={cn(
              "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-[14px] font-semibold transition-colors",
              tab === t ? "border-brand text-ink" : "border-transparent text-ink-faint hover:text-ink"
            )}
          >
            {t === "inbox" ? (
              <>
                <Mail size={14} /> Inbox
              </>
            ) : (
              LABELS[t].plural
            )}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-[13px] text-red-500">{error}</p>}

      {tab === "inbox" ? (
        <Inbox />
      ) : (
        <section className="mt-6">
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="btn-solid inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-semibold"
          >
            <Plus size={16} /> New {LABELS[tab].one}
          </button>

          {rows === null ? (
            <p className="mt-8 text-[14px] text-ink-faint">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="mt-8 text-[14px] text-ink-faint">Nothing here yet.</p>
          ) : (
            <ul className="mt-6 flex flex-col divide-y divide-line rounded-2xl border border-line">
              {rows.map((row) => (
                <li key={row.slug} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => setEditing(row)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate text-[15px] font-semibold text-ink hover:text-brand-ink">
                      {String(row.data.title ?? row.slug)}
                    </span>
                    <span className="mono text-[11px] text-ink-faint">
                      /{row.slug} · updated {when(row.updated_at)}
                    </span>
                  </button>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider",
                      row.published ? "bg-(--ok-soft) text-ok-ink" : "chip"
                    )}
                  >
                    {row.published ? "live" : "draft"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setEditing(row)} aria-label="Edit" className="grid size-9 place-items-center rounded-lg text-ink-faint hover:bg-(--chip-bg) hover:text-ink">
                      <Pencil size={15} />
                    </button>
                    {row.published && (
                      <a href={PUBLIC[tab](row.slug)} target="_blank" rel="noopener" aria-label="View on the site" className="grid size-9 place-items-center rounded-lg text-ink-faint hover:bg-(--chip-bg) hover:text-ink">
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button type="button" onClick={() => remove(tab, row)} aria-label="Delete" className="grid size-9 place-items-center rounded-lg text-ink-faint hover:bg-(--chip-bg) hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
};

export default Studio;

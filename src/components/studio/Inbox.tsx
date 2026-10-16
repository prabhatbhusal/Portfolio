"use client";

import { useEffect, useState } from "react";
import { Reply, Trash2 } from "lucide-react";

import { api } from "@/lib/studio/client";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  name: string;
  email: string;
  budget: string | null;
  body: string;
  read: boolean;
  created_at: string;
}

/** what came through the contact form — the copy that cannot bounce */
const Inbox = () => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    api<Message[]>("/api/messages")
      .then((list) => live && setMessages(list))
      .catch((err) => live && setError(err.message));
    return () => {
      live = false;
    };
  }, []);

  async function act(message: Message, change: { read?: boolean; delete?: boolean }) {
    try {
      await api("/api/messages", { body: { id: message.id, ...change } });
      setMessages((list) =>
        change.delete
          ? list!.filter((m) => m.id !== message.id)
          : list!.map((m) => (m.id === message.id ? { ...m, read: change.read ?? m.read } : m))
      );
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const toggle = (message: Message) => {
    setOpen(open === message.id ? null : message.id);
    if (!message.read) act(message, { read: true });
  };

  if (error) return <p className="mt-6 text-[13px] text-red-500">{error}</p>;
  if (!messages) return <p className="mt-8 text-[14px] text-ink-faint">Loading…</p>;
  if (messages.length === 0) return <p className="mt-8 text-[14px] text-ink-faint">No messages yet.</p>;

  return (
    <ul className="mt-6 flex flex-col divide-y divide-line rounded-2xl border border-line">
      {messages.map((m) => (
        <li key={m.id} className="px-4 py-3.5">
          <button type="button" onClick={() => toggle(m)} className="flex w-full items-baseline gap-3 text-left">
            <span className={cn("size-2 shrink-0 rounded-full", m.read ? "bg-transparent" : "bg-brand")} />
            <span className={cn("min-w-0 flex-1 truncate text-[15px]", m.read ? "text-ink-soft" : "font-semibold text-ink")}>
              {m.name} <span className="font-normal text-ink-faint">— {m.body.slice(0, 80)}</span>
            </span>
            <span className="shrink-0 mono text-[11px] text-ink-faint">
              {new Date(m.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
          </button>

          {open === m.id && (
            <div className="mt-4 pl-5">
              <p className="mono text-[12px] text-ink-faint">
                {m.email}
                {m.budget && <> · budget {m.budget}</>}
              </p>
              {/* rendered as text — it is a stranger's message */}
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{m.body}</p>
              <div className="mt-4 flex gap-2">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}
                  className="btn-quiet inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-semibold"
                >
                  <Reply size={14} /> Reply
                </a>
                <button
                  type="button"
                  onClick={() => confirm("Delete this message?") && act(m, { delete: true })}
                  className="btn-quiet inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-semibold"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Inbox;

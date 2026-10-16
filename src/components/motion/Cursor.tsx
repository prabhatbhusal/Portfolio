"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

const INTERACTIVE = "a, button, summary, label, select, [role='button'], [role='tab'], [data-cursor]";
const TEXT_FIELD =
  "input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=button]):not([type=submit]), textarea, [contenteditable='true']";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/* the reticle at rest, and how far a lock stands off its target */
const IDLE = 26;
const PAD = 6;
/* past this the target is a whole card: boxing it would frame half the
   screen, so the reticle just opens up around the pointer instead */
const MAX_LOCK = { w: 420, h: 220 };

type Mode = "idle" | "lock" | "aim" | "drag" | "hidden";

/* a coarse pointer has no cursor to replace, so none of this mounts on
   touch and the native cursor is never taken away there */
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const tagFor = (el: Element) =>
  el.getAttribute("data-cursor") === "drag" ? "drag" : el.tagName === "A" ? "link" : "action";

type Crystal = { setLocked: (value: boolean) => void; press: () => void; dispose: () => void };

/** a game hud reticle: corner brackets that snap onto whatever is clickable
 *  ("target lock"), a 3d crystal standing on its tip at the pointer (a flat
 *  crosshair until three.js has loaded, and for good without webgl), a
 *  live screen-coordinate readout, and a ping on every click */
const Cursor = () => {
  const enabled = useSyncExternalStore(subscribe, () => window.matchMedia(FINE_POINTER).matches, () => false);

  const [mode, setMode] = useState<Mode>("idle");
  const [tag, setTag] = useState("");
  const [seen, setSeen] = useState(false);
  const [shots, setShots] = useState(0);
  const readout = useRef<HTMLSpanElement>(null);
  const crystalHost = useRef<HTMLDivElement>(null);
  const crystal = useRef<Crystal | null>(null);
  const [solid, setSolid] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const box = { x: useMotionValue(-100), y: useMotionValue(-100), w: useMotionValue(IDLE), h: useMotionValue(IDLE) };
  const spring = { stiffness: 560, damping: 40, mass: 0.45 };
  const bx = useSpring(box.x, spring);
  const by = useSpring(box.y, spring);
  const bw = useSpring(box.w, spring);
  const bh = useSpring(box.h, spring);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let target: Element | null = null;
    let current: Mode = "idle";
    let currentTag = "";

    const frame = (px: number, py: number) => {
      if (target) {
        const r = target.getBoundingClientRect();
        box.x.set(r.left - PAD);
        box.y.set(r.top - PAD);
        box.w.set(r.width + PAD * 2);
        box.h.set(r.height + PAD * 2);
        return;
      }
      const size = current === "aim" || current === "drag" ? 44 : IDLE;
      box.x.set(px - size / 2);
      box.y.set(py - size / 2);
      box.w.set(size);
      box.h.set(size);
    };

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setSeen(true);
      if (readout.current) {
        const pad = (n: number) => String(Math.round(n)).padStart(4, "0");
        readout.current.textContent = `${pad(event.clientX)} ${pad(event.clientY)}`;
      }

      const el = event.target as Element | null;
      let next: Mode = "idle";
      let hit: Element | null = null;

      if (el?.closest?.(TEXT_FIELD)) next = "hidden";
      else {
        hit = el?.closest?.(INTERACTIVE) ?? null;
        if (hit) {
          const r = hit.getBoundingClientRect();
          next = tagFor(hit) === "drag" ? "drag" : r.width > MAX_LOCK.w || r.height > MAX_LOCK.h ? "aim" : "lock";
        }
      }

      target = next === "lock" ? hit : null;
      const nextTag = hit ? tagFor(hit) : "";
      // state only changes when the mode does — not on every pixel moved
      if (next !== current) {
        current = next;
        setMode(next);
      }
      if (nextTag !== currentTag) {
        currentTag = nextTag;
        setTag(nextTag);
      }
      frame(event.clientX, event.clientY);
    };

    // a locked target moves under a still pointer when the page scrolls
    const onScroll = () => frame(x.get(), y.get());
    const onDown = () => setShots((n) => n + 1);
    const onLeave = () => setSeen(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
    // the motion values are stable for the component's life
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // the crystal waits for an idle moment, so it never competes with the page
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 1200));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => {
      import("../three/crystal")
        .then(({ mountCrystal }) => {
          if (cancelled || !crystalHost.current) return;
          crystal.current = mountCrystal(crystalHost.current);
          setSolid(true);
        })
        .catch(() => {
          // no webgl — the flat crosshair stays
        });
    });
    return () => {
      cancelled = true;
      cancelIdle(handle);
      crystal.current?.dispose();
      crystal.current = null;
    };
  }, [enabled]);

  useEffect(() => crystal.current?.setLocked(mode === "lock"), [mode, solid]);
  useEffect(() => {
    if (shots) crystal.current?.press();
  }, [shots]);

  if (!enabled) return null;

  const visible = seen && mode !== "hidden";
  const locked = mode === "lock";

  return (
    <div
      aria-hidden="true"
      className={cn("hud pointer-events-none fixed inset-0 z-[95] transition-opacity duration-200", visible ? "opacity-100" : "opacity-0")}
    >
      {/* the brackets */}
      <motion.div style={{ x: bx, y: by, width: bw, height: bh }} className={cn("absolute left-0 top-0", locked && "hud-locked")}>
        <span className="hud-corner left-0 top-0 border-l-[1.5px] border-t-[1.5px]" />
        <span className="hud-corner right-0 top-0 border-r-[1.5px] border-t-[1.5px]" />
        <span className="hud-corner bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]" />
        <span className="hud-corner bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]" />
        {mode !== "idle" && (
          <span className="absolute -top-[18px] left-0 whitespace-nowrap rounded-sm bg-(--hud) px-1 mono text-[9px] font-bold uppercase leading-[14px] tracking-[0.14em] text-black">
            {locked ? `lock · ${tag}` : tag}
          </span>
        )}
      </motion.div>

      {/* the pointer: the crystal's tip sits exactly on it (a 56px canvas,
          tip 47px down its middle), or the flat crosshair until it loads */}
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <div ref={crystalHost} className="absolute -left-7 -top-[47px] size-14" />
        {!solid && (
          <>
            <span className={cn("hud-dot", locked && "scale-150")} />
            <span className="absolute -left-[9px] -top-px h-0.5 w-[5px] bg-(--hud)" />
            <span className="absolute left-[5px] -top-px h-0.5 w-[5px] bg-(--hud)" />
            <span className="absolute -left-px -top-[9px] h-[5px] w-0.5 bg-(--hud)" />
            <span className="absolute -left-px top-[5px] h-[5px] w-0.5 bg-(--hud)" />
          </>
        )}
        <span ref={readout} className="absolute left-4 top-3 whitespace-nowrap mono text-[9px] tracking-wider text-(--hud) opacity-70" />
        {shots > 0 && <span key={shots} className="hud-ping" />}
      </motion.div>
    </div>
  );
};

export default Cursor;

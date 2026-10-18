"use client";

import { useEffect, useRef } from "react";

/* how long the css count runs (globals.css, loader-count) */
const COUNT_MS = 1400;
/* a slow asset never holds the screen up past this */
const CAP_MS = 4000;

/** the boot screen: once per visit, a game's "loading world" with a
 *  segmented bar and a 000% counter. the count is pure css (an animated
 *  custom property), so it runs from the first paint, before any script;
 *  this only decides when it may leave — counted out and page loaded —
 *  then lets it wipe away upward behind a scan line. the theme script
 *  hides it outright on later pages of the same visit */
const Loader = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const node = ref.current;
    if (!node || root.classList.contains("booted")) return;

    let loaded = document.readyState === "complete";
    let counted = false;
    const finish = () => loaded && counted && node.setAttribute("data-done", "");
    const onLoad = () => {
      loaded = true;
      finish();
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName !== "loader-out") return;
      root.classList.add("booted");
      try {
        sessionStorage.setItem("booted", "1");
      } catch {
        // private mode: it simply shows again next visit
      }
    };

    // performance.now() counts from navigation, so this is the time the
    // css count still has left, however late the script arrived
    const count = window.setTimeout(() => {
      counted = true;
      finish();
    }, Math.max(0, COUNT_MS - performance.now()));
    const cap = window.setTimeout(onLoad, Math.max(0, CAP_MS - performance.now()));
    window.addEventListener("load", onLoad);
    node.addEventListener("animationend", onEnd);

    return () => {
      window.clearTimeout(count);
      window.clearTimeout(cap);
      window.removeEventListener("load", onLoad);
      node.removeEventListener("animationend", onEnd);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="loader">
      <span className="absolute left-5 top-5 size-6 border-l-2 border-t-2 border-(--hud) opacity-60" />
      <span className="absolute right-5 top-5 size-6 border-r-2 border-t-2 border-(--hud) opacity-60" />
      <span className="absolute bottom-5 left-5 size-6 border-b-2 border-l-2 border-(--hud) opacity-60" />
      <span className="absolute bottom-5 right-5 size-6 border-b-2 border-r-2 border-(--hud) opacity-60" />

      <div className="flex w-[min(440px,78vw)] flex-col items-center gap-6">
        <span className="relative grid size-12 place-items-center rounded-xl bg-brand text-[13px] font-extrabold tracking-tighter text-on-brand">
          pb
          <span className="absolute -inset-1.5 rounded-[14px] border border-dashed border-brand/50" />
        </span>
        <p className="mono text-[12px] uppercase tracking-[0.3em] text-ink">
          loading world<span className="loader-caret">_</span>
        </p>
        <div className="flex w-full items-center gap-4">
          <span className="loader-bar">
            <span className="loader-fill" />
          </span>
          <span className="loader-pct mono text-[13px] tabular-nums text-(--hud)" />
        </div>
        <p className="mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
          tip · scroll the build to take the controller apart
        </p>
      </div>

      <span className="absolute bottom-6 left-14 hidden mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:block">
        prabhat bhusal · game developer
      </span>
      <span className="absolute bottom-6 right-14 hidden mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:block">
        kathmandu · 27.72° n 85.32° e
      </span>
      <span className="loader-scan" />
    </div>
  );
};

export default Loader;

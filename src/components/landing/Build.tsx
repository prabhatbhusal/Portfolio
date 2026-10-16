"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, Gamepad2 } from "lucide-react";

import LazyScene from "../three/LazyScene";
import { useRange } from "../motion";
import { cn } from "@/lib/utils";

type Side = "top" | "left" | "right" | "bottom";

/* five beats over one pinned screen. `at` is the slice of the section's
   scroll each one owns; gamepad.ts poses the pad to match */
const chapters: {
  at: [number, number];
  side: Side;
  label: string;
  title: string;
  body: string;
  tags?: string[];
}[] = [
  {
    at: [0, 0.2],
    side: "top",
    label: "press start",
    title: "Every game starts in someone's hands.",
    body: "Keep scrolling and I will take one apart — the way I build them.",
  },
  {
    at: [0.2, 0.42],
    side: "left",
    label: "gameplay",
    title: "Systems that feel right.",
    body: "Movement, combat and enemy AI: state machines, input buffering and tuning curves, iterated until the controller disappears in your hands.",
    tags: ["C#", "C++", "state machines", "AI"],
  },
  {
    at: [0.42, 0.62],
    side: "right",
    label: "engine & tools",
    title: "Under the shell.",
    body: "Unity and Unreal Engine 5. Editor tools and ScriptableObject pipelines, Blueprints where they help and C++ where they do not — profiled until it holds its frame rate.",
    tags: ["Unity", "Unreal Engine 5", "tools", "profiling"],
  },
  {
    at: [0.62, 0.82],
    side: "left",
    label: "real worlds",
    title: "Levels on real ground.",
    body: "A geomatics engineer's habit: LiDAR scans and survey data become terrain, so a level can sit on a real valley instead of a guessed one.",
    tags: ["LiDAR", "heightmaps", "Gaussian splats"],
  },
  {
    at: [0.82, 1],
    side: "bottom",
    label: "ship it",
    title: "Then it ships.",
    body: "Builds you can download and play — and the web stack around them: backends, dashboards, the site you are on.",
  },
];

const place: Record<Side, string> = {
  top: "inset-x-0 top-[calc(var(--nav-h)+3svh)] items-center text-center",
  bottom: "inset-x-0 bottom-[12svh] items-center text-center",
  left: "inset-x-0 bottom-[11svh] lg:inset-x-auto lg:bottom-auto lg:left-0 lg:top-1/2 lg:max-w-md lg:-translate-y-1/2",
  right: "inset-x-0 bottom-[11svh] lg:inset-x-auto lg:bottom-auto lg:right-0 lg:top-1/2 lg:max-w-md lg:-translate-y-1/2",
};

const FADE = 0.045;

const loadGamepad = () => import("../three/gamepad").then((m) => m.mountGamepad);

const Chapter = ({ progress, index }: { progress: MotionValue<number>; index: number }) => {
  const c = chapters[index];
  const [a, b] = c.at;
  const first = index === 0;
  const last = index === chapters.length - 1;

  // the first is up before any scroll; the last stays once it arrives
  const input = first ? [0, b - FADE, b] : last ? [a - FADE, a, 1] : [a - FADE, a, b - FADE, b];
  const opacity = useRange(progress, input, first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]);
  const y = useRange(progress, input, first ? [0, 0, -28] : last ? [28, 0, 0] : [28, 0, 0, -28]);
  // hidden copy must not catch clicks meant for the one on screen
  const pointerEvents = useTransform(opacity, (o) => (o > 0.6 ? "auto" : "none"));

  return (
    <motion.div style={{ opacity, y, pointerEvents }} className={cn("absolute flex flex-col gap-4", place[c.side])}>
      <span className="mono text-[11px] uppercase tracking-[0.22em] text-[#5ad8ff]">
        {c.label}
      </span>
      <h3
        className={cn(
          "display font-bold leading-[1.02] text-white",
          first || last ? "max-w-3xl text-[clamp(2.2rem,5.5vw,4.25rem)]" : "text-[clamp(1.9rem,3.6vw,3rem)]"
        )}
      >
        {c.title}
      </h3>
      <p className={cn("text-[15px] leading-relaxed text-white/70 md:text-[17px]", (first || last) && "max-w-xl")}>
        {c.body}
      </p>
      {c.tags && (
        <ul className="flex flex-wrap gap-2">
          {c.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-white/12 bg-white/5 px-3 py-1 mono text-[11px] text-white/75 backdrop-blur"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      {last && (
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/games"
            className="btn-solid group inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold"
          >
            Play the games
            <ArrowRight size={17} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/work"
            className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/5 px-6 text-[15px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            See the web work
          </Link>
        </div>
      )}
    </motion.div>
  );
};

/** the portalcam-style product beat, with a controller as the product:
 *  the section pins for five screens while a 3d gamepad turns, travels
 *  from side to side and comes apart around the copy */
const Build = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [current, setCurrent] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setCurrent(Math.max(0, chapters.findLastIndex((c) => v >= c.at[0])));
  });

  const percent = useTransform(scrollYProgress, (v) => `${String(Math.round(v * 100)).padStart(3, "0")}%`);

  return (
    <section id="build" ref={ref} aria-label="Inside a build" className="relative h-[520svh] bg-[#05060b]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_42%,#14245e_0%,#0a1030_45%,#05060b_100%)]"
        />

        <LazyScene load={loadGamepad} section={ref} className="absolute inset-0">
          <div className="grid size-full place-items-center">
            <Gamepad2 size={220} strokeWidth={0.8} className="text-[#5ad8ff] opacity-40 drop-shadow-[0_0_30px_#5ad8ff]" />
          </div>
        </LazyScene>

        {/* phones read the copy under the pad; this keeps it legible */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-linear-to-b from-transparent via-[#05060b]/70 to-[#05060b] lg:hidden"
        />

        <div className="rail relative h-full">
          {chapters.map((c, i) => (
            <Chapter key={c.label} progress={scrollYProgress} index={i} />
          ))}
        </div>

        {/* a loading bar for the build, game-hud style */}
        <div
          aria-hidden="true"
          className="absolute inset-x-4 bottom-5 flex items-center gap-4 mono text-[10px] uppercase tracking-[0.2em] text-white/55 sm:inset-x-8"
        >
          <span className="shrink-0 text-[#5ad8ff]">{chapters[current].label}</span>
          <span className="relative h-px flex-1 bg-white/12">
            <motion.span
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 origin-left bg-linear-to-r from-[#3364ff] to-[#5ad8ff] shadow-[0_0_10px_#5ad8ff]"
            />
          </span>
          <motion.span className="shrink-0 tabular-nums">{percent}</motion.span>
        </div>
      </div>
    </section>
  );
};

export default Build;

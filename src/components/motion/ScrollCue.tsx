"use client";

import { motion } from "motion/react";
import ScrollLink from "./ScrollLink";

/* one lap of the segment around the capsule, and one draw of the arrow */
const LOOP = 2.6;

const ease = [0.22, 0.7, 0.25, 1] as const;

/* stem first, then the head — one path so the two draw as a single stroke */
const ARROW = "M14 15.5 L14 27.5 M9.6 23 L14 27.5 L18.4 23";

interface Props {
  /* selector for the section below */
  to: string;
  href: string;
  className?: string;
}

const ScrollCue = ({ to, href, className = "" }: Props) => (
  <ScrollLink
    to={to}
    href={href}
    aria-label="Scroll to the next section"
    className={`group inline-flex items-center gap-3 ${className}`}
  >
    <svg
      width="28"
      height="46"
      viewBox="0 0 28 46"
      fill="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      {/* the capsule itself never moves */}
      <rect
        x="1"
        y="1"
        width="26"
        height="44"
        rx="13"
        stroke="var(--line-strong)"
        strokeWidth="1.5"
      />

      {/* a short lit segment running around that outline */}
      <motion.rect
        x="1"
        y="1"
        width="26"
        height="44"
        rx="13"
        stroke="var(--brand)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ pathLength: 0.22 }}
        animate={{ pathOffset: [0, 1] }}
        transition={{ duration: LOOP, repeat: Infinity, ease: "linear" }}
      />

      {/* the arrow draws itself inside, holds, then fades */}
      <motion.path
        d={ARROW}
        stroke="var(--brand)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1, 1], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: LOOP,
          times: [0, 0.4, 0.78, 1],
          repeat: Infinity,
          ease,
        }}
      />
    </svg>

    <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition-colors duration-300 group-hover:text-brand-ink">
      scroll
    </span>
  </ScrollLink>
);

export default ScrollCue;

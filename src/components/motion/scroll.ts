"use client";

import { animate } from "motion/react";

/* matches scroll-padding-top, so a section never lands under the navbar */
const NAV_OFFSET = 96;

const ease = [0.22, 0.7, 0.25, 1] as const;

/* resolves a css selector, or "top", to a document offset */
const resolve = (target: string) => {
  if (target === "top") return 0;

  const node = document.querySelector(target);
  if (!node) return null;

  return Math.max(0, window.scrollY + node.getBoundingClientRect().top - NAV_OFFSET);
};

/* the page scrolls itself rather than leaving it to the browser, so the
   curve is the same one the rest of the site animates on and the os
   "reduce motion" flag cannot turn it back into a jump */
export const smoothScrollTo = (target: string) => {
  const to = resolve(target);
  if (to === null) return;

  const from = window.scrollY;
  if (Math.abs(to - from) < 2) return;

  // long pages should not take proportionally longer to cross
  const duration = Math.min(1.3, Math.max(0.45, Math.abs(to - from) / 1800));

  const controls = animate(from, to, {
    duration,
    ease,
    onUpdate: (value) => window.scrollTo(0, value),
  });

  // the moment the reader reaches for the wheel, hand control back
  const release = () => controls.stop();
  const options = { passive: true, once: true } as const;
  window.addEventListener("wheel", release, options);
  window.addEventListener("touchstart", release, options);

  const cleanup = () => {
    window.removeEventListener("wheel", release);
    window.removeEventListener("touchstart", release);
  };
  controls.then(cleanup, cleanup);
};

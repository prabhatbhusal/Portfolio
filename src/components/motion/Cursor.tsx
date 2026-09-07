"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const INTERACTIVE = "a, button, summary, label, [role='button'], [data-cursor]";
const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/* a coarse pointer has no cursor to replace, so none of this mounts on
   touch and the native cursor is never taken away there */
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const sized = (size: number, opacity: number) => ({
  width: size,
  height: size,
  marginLeft: -size / 2,
  marginTop: -size / 2,
  opacity,
});

/* the ring changes size, so it is centred with margins that move with
   width and height rather than with a fixed offset */
const ring = {
  idle: sized(30, 0.55),
  interactive: sized(52, 0.9),
  drag: sized(72, 0.9),
  hidden: sized(30, 0),
};

type Mode = keyof typeof ring;

const Cursor = () => {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false
  );

  const [mode, setMode] = useState<Mode>("idle");
  const [seen, setSeen] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // the dot tracks the pointer exactly, the ring trails it
  const ringX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setSeen(true);

      const target = event.target as Element | null;
      if (!target?.closest) return;

      if (target.closest(TEXT_FIELD)) {
        setMode("hidden");
        return;
      }

      const hit = target.closest(INTERACTIVE);
      setMode(
        hit
          ? hit.getAttribute("data-cursor") === "drag"
            ? "drag"
            : "interactive"
          : "idle"
      );
    };

    const onLeave = () => setSeen(false);
    const onEnter = () => setSeen(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const visible = seen && mode !== "hidden";

  return (
    /* `difference` keeps one white cursor legible on every surface the
       page has, in both themes */
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95] mix-blend-difference"
    >
      <motion.span
        style={{ x: ringX, y: ringY }}
        animate={{ ...ring[mode], opacity: visible ? ring[mode].opacity : 0 }}
        transition={{ duration: 0.22, ease: [0.22, 0.7, 0.25, 1] }}
        className="absolute left-0 top-0 block rounded-full border border-white"
      />
      <motion.span
        style={{ x, y }}
        animate={{ scale: visible && mode === "idle" ? 1 : 0 }}
        transition={{ duration: 0.18, ease: [0.22, 0.7, 0.25, 1] }}
        className="absolute -left-[3px] -top-[3px] block size-1.5 rounded-full bg-white"
      />
    </div>
  );
};

export default Cursor;

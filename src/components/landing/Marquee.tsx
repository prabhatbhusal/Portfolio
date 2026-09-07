"use client";

import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  wrap,
} from "motion/react";

import { techstack } from "@/lib/constants/data";

/* percent of the track travelled per second. the old css loop ran a lap
   in 45s, which was slow enough to read as a static row — this is ~25s,
   where the movement is obvious without being distracting */
const SPEED = 2;

/* how fast a throw bleeds off, per 60fps frame */
const FRICTION = 0.94;

/* keeps a hard flick from launching the row into next week */
const MAX_THROW = 70;

const Marquee = ({ className = "py-10 md:py-14" }: { className?: string }) => {
  // the list is rendered twice so the -50% shift lands exactly on the seam
  const row = [...techstack, ...techstack];

  const trackRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);

  const drag = useRef({ active: false, lastX: 0, lastT: 0, velocity: 0 });

  useAnimationFrame((_, delta) => {
    if (drag.current.active) return;

    // a backgrounded tab hands back a huge delta on return
    const seconds = Math.min(delta, 50) / 1000;
    let move = -SPEED * seconds;

    if (Math.abs(drag.current.velocity) > 0.02) {
      move += drag.current.velocity * seconds;
      drag.current.velocity *= Math.pow(FRICTION, delta / 16.67);
    } else {
      drag.current.velocity = 0;
    }

    if (move !== 0) baseX.set(baseX.get() + move);
  });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = {
      active: true,
      lastX: event.clientX,
      lastT: performance.now(),
      velocity: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;

    const width = trackRef.current?.offsetWidth ?? 1;
    const percent = ((event.clientX - drag.current.lastX) / width) * 100;
    const now = performance.now();
    const seconds = Math.max(now - drag.current.lastT, 1) / 1000;

    baseX.set(baseX.get() + percent);
    drag.current.lastX = event.clientX;
    drag.current.lastT = now;
    drag.current.velocity = Math.max(
      -MAX_THROW,
      Math.min(MAX_THROW, percent / seconds)
    );
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className={className}>
      <p className="rail mb-7 mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        the tools I reach for — drag it
      </p>

      {/* runs full width rather than inside the rail, so it reads as motion */}
      <div
        data-cursor="drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="marquee overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-center gap-10 select-none md:gap-14"
        >
          {row.map((tech, idx) => {
            const Icon = tech.icon;

            return (
              <span
                key={`${tech.id}-${idx}`}
                aria-hidden={idx >= techstack.length}
                className="flex shrink-0 items-center gap-2.5 text-ink-faint transition-colors duration-300 hover:text-brand-ink"
              >
                <Icon size={22} />
                <span className="whitespace-nowrap text-[14px] font-medium">
                  {tech.name}
                </span>
              </span>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;

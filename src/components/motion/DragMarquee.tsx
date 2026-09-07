"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  wrap,
} from "motion/react";

/* how fast a throw bleeds off, per 60fps frame */
const FRICTION = 0.94;

/* keeps a hard flick from launching the row into next week */
const MAX_THROW = 70;

/* past this much travel a pointer-up is a drag, not a click */
const DRAG_SLOP = 6;

interface Props {
  /* the row content, rendered by the caller so it can stay on the server */
  children: React.ReactNode;
  /* percent of the track travelled per second */
  speed?: number;
  /* tailwind gap between items, and across the seam */
  gap?: string;
  /* text people are trying to read should hold still while they read it */
  pauseOnHover?: boolean;
  className?: string;
}

/* one continuously looping row that can also be grabbed and thrown. the
   list is rendered twice so the -50% wrap lands exactly on the seam */
function DragMarquee({
  children,
  speed = 2,
  gap = "gap-10 md:gap-14",
  pauseOnHover = false,
  className = "",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);

  const [hovered, setHovered] = useState(false);
  const drag = useRef({
    active: false,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    travel: 0,
  });

  useAnimationFrame((_, delta) => {
    if (drag.current.active) return;

    // a backgrounded tab hands back a huge delta on return
    const seconds = Math.min(delta, 50) / 1000;
    const paused = pauseOnHover && hovered;
    let move = paused ? 0 : -speed * seconds;

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
      travel: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;

    const width = trackRef.current?.offsetWidth ?? 1;
    const moved = event.clientX - drag.current.lastX;
    const percent = (moved / width) * 100;
    const now = performance.now();
    const seconds = Math.max(now - drag.current.lastT, 1) / 1000;

    baseX.set(baseX.get() + percent);
    drag.current.lastX = event.clientX;
    drag.current.lastT = now;
    drag.current.travel += Math.abs(moved);
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

  /* a drag that ends on top of a link must not also follow it */
  const onClickCapture = (event: React.MouseEvent) => {
    if (drag.current.travel <= DRAG_SLOP) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current.travel = 0;
  };

  /* `contents` keeps the flex gap even across the seam */
  const copy = (hidden: boolean) => (
    <div className="contents" aria-hidden={hidden || undefined}>
      {children}
    </div>
  );

  return (
    <div
      data-cursor="drag"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onMouseEnter={pauseOnHover ? () => setHovered(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setHovered(false) : undefined}
      className={`marquee touch-pan-y cursor-grab overflow-hidden active:cursor-grabbing ${className}`}
    >
      <motion.div
        ref={trackRef}
        style={{ x }}
        className={`flex w-max items-stretch select-none ${gap}`}
      >
        {copy(false)}
        {copy(true)}
      </motion.div>
    </div>
  );
}

export default DragMarquee;

"use client";

import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type Mount = (host: HTMLElement, section: HTMLElement, onReady: () => void) => () => void;

/** a three.js scene driven by `section`'s scroll, fetched once the section
 *  is a screen away. `load` must be a stable (module-level) function.
 *  `children` is the fallback, kept for good without webgl */
const LazyScene = ({
  load,
  section,
  className,
  children,
}: {
  load: () => Promise<Mount>;
  section: React.RefObject<HTMLElement | null>;
  className?: string;
  children?: React.ReactNode;
}) => {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        load()
          .then((mount) => {
            if (cancelled || !host.current || !section.current) return;
            dispose = mount(host.current, section.current, () => setReady(true));
          })
          .catch(() => {
            // no webgl, or the chunk failed — the fallback simply stays
          });
      },
      { rootMargin: "100% 0px" }
    );
    near.observe(node);

    return () => {
      cancelled = true;
      near.disconnect();
      dispose?.();
    };
  }, [load, section]);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none", className)}>
      <div className={cn("absolute inset-0 transition-opacity duration-700", ready && "opacity-0")}>{children}</div>
      <div ref={host} className={cn("absolute inset-0 opacity-0 transition-opacity duration-700", ready && "opacity-100")} />
    </div>
  );
};

export default LazyScene;

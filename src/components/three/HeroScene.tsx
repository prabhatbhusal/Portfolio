"use client";

import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** the 3d point cloud behind the hero. `children` is the static fallback —
 *  it shows until the scene's first frame, and stays for good if webgl is
 *  unavailable or three.js fails to load */
const HeroScene = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;

    import("./terrain")
      .then(({ mountTerrain }) => {
        if (cancelled || !host.current) return;
        dispose = mountTerrain(host.current, () => setReady(true));
      })
      .catch(() => {
        // no webgl, or the chunk failed — the fallback simply stays
      });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none", className)}>
      <div className={cn("absolute inset-0 transition-opacity duration-1000", ready && "opacity-0")}>{children}</div>
      <div ref={host} className={cn("absolute inset-0 opacity-0 transition-opacity duration-1000", ready && "opacity-100")} />
    </div>
  );
};

export default HeroScene;

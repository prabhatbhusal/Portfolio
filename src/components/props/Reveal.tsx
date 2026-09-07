"use client";

import React, { useEffect, useRef } from "react";

interface prop {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

// toggles a class through the ref rather than state, so revealing a
// section never costs a re-render
const Reveal = ({ children, delay = 0, className = "" }: prop) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default Reveal;

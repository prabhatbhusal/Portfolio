"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import ScrollLink from "@/components/motion/ScrollLink";

interface Section {
  id: string;
  label: string;
}

const titleCase = (id: string) => id.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** the section nav, stood on its end down the right edge of every page: a
 *  scroll track with a readout, a tick per section and the current one's
 *  name written up the rail (hover it for the list). sections are found, not
 *  configured — any <section id> inside <main>, labelled by data-label or
 *  its id — so a new section joins the rail by existing */
const ScrollRail = () => {
  const pathname = usePathname();
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState<string>();
  const fill = useRef<HTMLSpanElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  // find this page's sections, and watch which one is in
  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    // read once the page has painted: the rail lives in the layout, and
    // after a navigation the new page's sections are what count
    const frame = requestAnimationFrame(() => {
      const nodes = [...document.querySelectorAll<HTMLElement>("main section[id]")];
      setSections(nodes.map((node) => ({ id: node.id, label: node.dataset.label ?? titleCase(node.id) })));
      setActive(nodes[0]?.id);

      const seen = new Map<string, boolean>();
      // a band across the middle of the screen decides which section is "in"
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting);
          const current = nodes.findLast((node) => seen.get(node.id));
          if (current) setActive(current.id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      for (const node of nodes) observer.observe(node);
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  // the track and the readout follow the page, written straight to the dom
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.current?.style.setProperty("transform", `scaleY(${progress})`);
      if (readout.current) readout.current.textContent = `${String(Math.round(progress * 100)).padStart(3, "0")}%`;
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  if (pathname.startsWith("/studio")) return null;

  // pages without sections still get the track, named after the page
  const page = pathname.split("/")[1] || "home";
  const index = Math.max(0, sections.findIndex((s) => s.id === active));
  const now = sections[index];

  return (
    <nav aria-label="On this page" className="srail">
      {/* the current section, written up the rail beside its tick */}
      <span aria-hidden="true" className="srail-now" style={{ "--at": index } as React.CSSProperties}>
        <span key={now?.id ?? page} className="srail-now-text">
          {now && <span className="srail-n">{String(index + 1).padStart(2, "0")}</span>}
          {now?.label ?? page}
        </span>
      </span>

      <ol className="srail-list">
        {sections.length > 0 ? (
          sections.map((s, i) => (
            <li key={s.id}>
              <ScrollLink
                to={`#${s.id}`}
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className="srail-item"
              >
                <span className="srail-label">
                  <span className="srail-n">{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </span>
                <span aria-hidden="true" className="srail-tick" />
              </ScrollLink>
            </li>
          ))
        ) : (
          <li>
            <span aria-current="true" className="srail-item">
              <span className="srail-label">{page}</span>
              <span aria-hidden="true" className="srail-tick" />
            </span>
          </li>
        )}
      </ol>

      <span aria-hidden="true" className="srail-track">
        <span ref={fill} className="srail-fill" />
      </span>
      <span ref={readout} aria-hidden="true" className="srail-pct">
        000%
      </span>
    </nav>
  );
};

export default ScrollRail;

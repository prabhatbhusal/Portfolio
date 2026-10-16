"use client";

/* eslint-disable @next/next/no-img-element -- panel thumbnails are small
   decorative crops of images that are already cached by the pages */
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CircleHelp,
  Download,
  Images,
  Layers,
  Mail,
  Plus,
  User,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import type { NavIcon, NavItem } from "@/@types/navbar.types";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

/* the floating nav from the 3dgs platform, in this site's colours:
 *  - a glass pill; scrolling down past FOLD_AFTER folds it to just the
 *    links, any scroll up opens it again; a scan line along its foot is
 *    drawn by the page's scroll (the section nav is ScrollRail, down the
 *    right edge);
 *  - the current page wears a viewfinder that glides from link to link;
 *    hover grows a faint pill from the middle;
 *  - menus open a panel that unrolls like a curtain behind a scan line,
 *    framed by corner brackets, items arriving one after another;
 *  - below lg a Menu button grows the bar into one card of numbered
 *    chapters.
 * styles: globals.css "navbar" (.snav-*, .mnav-*) */

const RESUME_URL = "/Prabhat_s_Resume.pdf";
const GITHUB_URL = "https://github.com/prabhatbhusal";

/* past this the bar folds on the way down; any scroll up opens it again */
const FOLD_AFTER = 200;

const ICONS: Record<NavIcon, React.ElementType> = {
  user: User,
  layers: Layers,
  image: Images,
  help: CircleHelp,
  mail: Mail,
};

const vars = (i: number) => ({ "--i": i }) as React.CSSProperties;

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <Link href="/" onClick={onClick} aria-label="Prabhat Bhusal home" className="snav-brand">
    <span className="relative grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-[10px] font-extrabold tracking-tighter text-white">
      pb
      <span aria-hidden="true" className="absolute -inset-1 rounded-[10px] border border-dashed border-brand/50" />
    </span>
    <span className="snav-word">
      <span className="block leading-none">Prabhat Bhusal</span>
      {/* five pips, lit one by one as the page scrolls */}
      <span aria-hidden="true" className="snav-pips">
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} style={vars(i)} />
        ))}
      </span>
    </span>
  </Link>
);

/* the square beside an item's title */
const Tile = ({ child }: { child: NonNullable<NavItem["children"]>[number] }) => {
  const Icon = child.icon ? ICONS[child.icon] : null;
  return (
    <span className="snav-tile row-span-2 grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-(--brand-soft) text-brand-ink">
      {child.thumb ? (
        <img src={child.thumb} alt="" className="size-full object-cover" loading="lazy" />
      ) : Icon ? (
        <Icon size={18} strokeWidth={1.7} />
      ) : (
        <span className="mono text-[11px] font-semibold">{child.tile}</span>
      )}
    </span>
  );
};

const Navbar = ({ links }: { links: NavItem[] }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [unfolded, setUnfolded] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const bar = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const drop = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));
  const panel = links.find((item) => item.url === open && item.children);

  // the panel keeps its last menu while the curtain rolls back up
  const [shown, setShown] = useState(panel);
  if (panel && panel.url !== shown?.url) setShown(panel);

  const closeAll = () => {
    window.clearTimeout(timer.current);
    setOpen(null);
    setMenu(false);
  };

  /* fold on the way down, open on the way up. written to <html> as an
     attribute, so css does the morph and nothing re-renders while the
     page moves */
  useEffect(() => {
    const root = document.documentElement;
    let last = window.scrollY;
    let frame = 0;

    // the folded pill is exactly the links plus the mark
    const measure = () => {
      const width = linksRef.current?.scrollWidth ?? 0;
      if (width) root.style.setProperty("--merged-w", `${width + 72}px`);
    };

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      let folded = root.hasAttribute("data-folded");
      if (y <= FOLD_AFTER) {
        folded = false;
        last = y;
      } else if (Math.abs(y - last) > 6) {
        // compared against the last turn, not the last frame, so a slow
        // trackpad scroll still adds up to a fold
        folded = y > last;
        last = y;
      }
      if (folded === root.hasAttribute("data-folded")) return;
      root.toggleAttribute("data-folded", folded);
      // the bar changes shape under an open panel — close it rather than
      // let it jump
      setOpen(null);
    };

    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };

    measure();
    document.fonts?.ready.then(measure);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
      root.removeAttribute("data-folded");
    };
  }, []);

  // esc shuts the panel or the menu, focus back on what opened it
  useEffect(() => {
    if (!open && !menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menu) menuButton.current?.focus();
      else bar.current?.querySelector<HTMLElement>(`[data-drop="${open}"]`)?.focus();
      setOpen(null);
      setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, menu]);

  // the dimmed page lets clicks through, so a click anywhere else shuts it
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!bar.current?.contains(target) && !drop.current?.contains(target)) setOpen(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // the open menu holds the page still under it
  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menu]);

  /* hover intent: a beat before the first panel opens, so sweeping across
     the bar does not flash it; instant when moving between open panels;
     a grace period on the way out so the pointer can cross the gap */
  const openSoon = (url: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(url), open === null ? 90 : 0);
  };

  const closeNow = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    setOpen(null);
  };

  const closeSoon = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(null), 180);
  };

  const keep = () => window.clearTimeout(timer.current);

  return (
    <>
      <div aria-hidden="true" data-open={panel ? "" : undefined} className="snav-scrim" />

      <header
        ref={bar}
        data-menu={menu ? "" : undefined}
        onPointerLeave={closeSoon}
        onPointerEnter={keep}
        className="snav"
      >
        <Logo onClick={closeAll} />

        <nav ref={linksRef} aria-label="Main" className="snav-links">
          {links.map((item) => {
            const on = isActive(item.url);
            const link = (
              <Link
                key={item.url}
                href={item.url}
                onClick={closeAll}
                onPointerEnter={item.children ? undefined : closeNow}
                aria-current={on ? "page" : undefined}
                data-open={open === item.url ? "" : undefined}
                className="snav-link"
              >
                {on && (
                  <motion.span
                    layoutId="snav-vf"
                    aria-hidden="true"
                    className="snav-vf"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{item.title}</span>
              </Link>
            );
            if (!item.children) return link;

            /* a split trigger: the label goes to the section, the chevron
               opens the panel; hover opens it too */
            return (
              <span key={item.url} className="snav-drop-at" onPointerEnter={openSoon(item.url)}>
                {link}
                <button
                  type="button"
                  data-drop={item.url}
                  onClick={() => setOpen(open === item.url ? null : item.url)}
                  // keyboard focus opens it; a tap focuses and clicks at
                  // once, and letting both act would open then shut it
                  onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOpen(item.url)}
                  aria-label={`Show ${item.title} menu`}
                  aria-haspopup="true"
                  aria-expanded={open === item.url}
                  aria-controls="snav-drop"
                  className="snav-drop-btn"
                >
                  <ChevronDown
                    size={14}
                    strokeWidth={2.4}
                    className={cn("transition-transform duration-300", open === item.url && "rotate-180")}
                  />
                </button>
              </span>
            );
          })}
        </nav>

        <div className="snav-actions" onPointerEnter={closeNow}>
          <ThemeToggle className="snav-icon" />
          <a href={RESUME_URL} download className="snav-quiet hidden xl:inline-flex">
            <Download size={14} strokeWidth={2.2} />
            Resume
          </a>
          <Link href="/contact" onClick={closeAll} className="snav-primary">
            Let&apos;s collaborate
          </Link>
        </div>

        <button
          ref={menuButton}
          type="button"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-controls="snav-menu"
          className="snav-menu-btn"
        >
          <span className="snav-menu-word">{menu ? "Close" : "Menu"}</span>
          <span className="snav-menu-ic" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      {/* a sibling of the bar, not a child: the bar's backdrop-filter would
          become this panel's containing block */}
      <div
        ref={drop}
        id="snav-drop"
        data-open={panel ? "" : undefined}
        inert={!panel}
        onPointerEnter={keep}
        onPointerLeave={closeSoon}
        className="snav-drop hidden lg:block"
      >
        <span className="snav-drop-corners" aria-hidden="true" />
        {shown && (
          <div key={shown.url} className="snav-drop-in grid grid-cols-[minmax(0,1fr)_minmax(220px,0.36fr)] gap-x-10 gap-y-6">
            <ul className="grid grid-cols-2 content-start gap-1.5">
              {shown.children!.map((child, i) => (
                <li key={child.url} className="snav-rise" style={vars(i)}>
                  <Link href={child.url} onClick={closeAll} className="snav-item group/i">
                    <Tile child={child} />
                    <span className="truncate text-[14px] font-bold tracking-tight text-ink">{child.title}</span>
                    <span className="col-start-2 line-clamp-1 text-[12px] leading-relaxed text-ink-faint">
                      {child.description}
                    </span>
                    {child.tags && child.tags.length > 0 && (
                      <span className="col-start-2 mt-1.5 flex flex-wrap gap-1.5">
                        {child.tags.map((tag) => (
                          <span key={tag} className="chip rounded-full px-2 py-0.5 text-[11px] font-medium">
                            {tag}
                          </span>
                        ))}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <aside className="snav-rise grid content-start gap-3.5 pt-1" style={vars(2)}>
              <p className="mono text-[11px] uppercase tracking-widest text-ink-faint">{shown.title}</p>
              {shown.feature && (
                <Link
                  href={shown.feature.url}
                  onClick={closeAll}
                  className="group relative flex min-h-52 overflow-hidden rounded-xl bg-[#05060b] text-left"
                >
                  {shown.feature.image ? (
                    <img
                      src={shown.feature.image}
                      alt=""
                      className="absolute inset-0 size-full object-cover opacity-80 saturate-50 transition-[transform,filter] duration-700 ease-(--ease-reveal) group-hover:scale-105 group-hover:saturate-100"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_110%,#1d3aa0_0%,#0b1026_60%)]"
                    />
                  )}
                  <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
                  <span aria-hidden="true" className="scanline absolute inset-x-0 top-0 h-px" />

                  <span className="relative mt-auto flex flex-col gap-1.5 p-4">
                    <span className="mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8eaaff]">
                      {shown.feature.eyebrow}
                    </span>
                    <span className="text-[16px] font-bold leading-snug tracking-tight text-white">
                      {shown.feature.title}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-2 text-[12px] font-semibold text-white">
                      {shown.feature.cta}
                      <span className="grid size-5 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight size={12} strokeWidth={2.5} />
                      </span>
                    </span>
                  </span>
                </Link>
              )}
              <Link href={shown.url} onClick={closeAll} className="snav-all">
                {shown.more ?? `All ${shown.title.toLowerCase()}`}
                <ArrowRight size={14} />
              </Link>
            </aside>
          </div>
        )}
      </div>

      {/* phone menu: the bar's own shape, grown to the screen */}
      <div aria-hidden="true" data-open={menu ? "" : undefined} onClick={closeAll} className="mnav-scrim lg:hidden" />
      <div
        id="snav-menu"
        data-open={menu ? "" : undefined}
        inert={!menu}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="mnav lg:hidden"
      >
        <span className="mnav-scan" aria-hidden="true" />
        <nav aria-label="Pages" className="mnav-body">
          <ol>
            {links.map((item, i) => {
              const on = isActive(item.url);
              const sub = unfolded === item.url;
              return (
                <li key={item.url} className="mnav-line border-b border-line" style={vars(i)}>
                  <div className="flex items-center gap-2">
                    <Link
                      href={item.url}
                      onClick={closeAll}
                      aria-current={on ? "page" : undefined}
                      className="flex flex-1 items-baseline gap-3.5 pb-3.5 pt-4 text-ink"
                    >
                      <span
                        className={cn(
                          "mono -translate-y-[0.45em] text-[11px] tabular-nums",
                          on ? "text-brand-ink" : "text-ink-faint"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mnav-t">
                        {item.title}
                        {on && (
                          <span aria-hidden="true" className="ml-3 inline-block size-2 rounded-full bg-brand align-[0.35em]" />
                        )}
                      </span>
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        onClick={() => setUnfolded(sub ? null : item.url)}
                        aria-expanded={sub}
                        aria-controls={`mnav-${i}`}
                        aria-label={`${item.title}: ${sub ? "hide" : "show"} the list`}
                        className="mnav-more"
                      >
                        <Plus size={20} />
                      </button>
                    )}
                  </div>
                  {item.children && (
                    <div id={`mnav-${i}`} data-open={sub ? "" : undefined} inert={!sub} className="mnav-sub">
                      <ul className="min-h-0 overflow-hidden pl-8">
                        {item.children.map((child) => (
                          <li key={child.url}>
                            <Link
                              href={child.url}
                              onClick={closeAll}
                              className="block py-2 text-[15px] text-ink-soft transition-colors hover:text-brand-ink"
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                        <li className="pb-3.5">
                          <Link
                            href={item.url}
                            onClick={closeAll}
                            className="block py-2 text-[15px] font-medium text-brand-ink"
                          >
                            {item.more ?? `All ${item.title.toLowerCase()}`}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mnav-line mt-auto grid gap-2.5 pt-7" style={vars(links.length)}>
            <Link
              href="/contact"
              onClick={closeAll}
              className="btn-solid flex h-[50px] items-center justify-between rounded-2xl px-5 text-[15px] font-semibold"
            >
              Let&apos;s collaborate
              <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2.5">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-quiet flex h-[50px] items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold"
              >
                <FaGithub size={17} />
                GitHub
              </a>
              <a
                href={RESUME_URL}
                download
                onClick={closeAll}
                className="btn-quiet flex h-[50px] items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold"
              >
                <Download size={17} strokeWidth={2} />
                Resume
              </a>
              <ThemeToggle className="btn-quiet grid size-[50px] place-items-center rounded-2xl" />
            </div>
            <p aria-hidden="true" className="mt-1 text-center mono text-[11px] tracking-wider text-ink-faint">
              Kathmandu · 27.72° N, 85.32° E
            </p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

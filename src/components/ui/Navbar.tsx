"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowRight, ChevronDown, Download, Menu, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { NavLinks } from "@/lib/constants/data";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

const RESUME_URL = "/Prabhat_s_Resume.pdf";
const GITHUB_URL = "https://github.com/prabhatbhusal";

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <Link
    href="/"
    onClick={onClick}
    aria-label="Prabhat Bhusal home"
    className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-raised shadow-[0_1px_2px_rgba(0,0,0,0.14)] transition-transform duration-300 hover:scale-105"
  >
    <span className="text-[11px] font-extrabold tracking-tighter text-ink">
      {"<"}
      <span className="text-brand">pb</span>
      {"/>"}
    </span>
  </Link>
);

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<number | null>(null);
  const [openMobile, setOpenMobile] = useState<number | null>(null);

  const closeAll = () => {
    setIsOpen(false);
    setOpenDesktop(null);
    setOpenMobile(null);
  };

  // stop the page scrolling behind the mobile sheet
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      setOpenDesktop(null);
      setOpenMobile(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
        <nav className="glass mx-auto flex w-full max-w-6xl items-center gap-1 rounded-[28px] p-2.5 backdrop-blur-xl">
          <Logo />

          <Link
            href="/contact"
            className="btn-solid ml-1 hidden h-11 items-center gap-6 rounded-full pl-5 pr-4 text-[14px] font-bold xl:inline-flex"
          >
            hire me
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>

          <div className="ml-1 hidden items-center gap-0.5 md:flex xl:ml-2">
            {NavLinks.map((item) =>
              item.children ? (
                <div key={item.id} className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDesktop(openDesktop === item.id ? null : item.id)
                    }
                    aria-expanded={openDesktop === item.id}
                    aria-haspopup="menu"
                    className={cn(
                      "glass-link inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[15px] font-semibold",
                      (openDesktop === item.id || isActive(item.url)) &&
                        "bg-[var(--glass-hover)]"
                    )}
                  >
                    {item.title}
                    <ChevronDown
                      size={16}
                      strokeWidth={2.5}
                      className={cn(
                        "transition-transform duration-300",
                        openDesktop === item.id && "rotate-180"
                      )}
                    />
                  </button>

                  {openDesktop === item.id && (
                    <>
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-hidden="true"
                        onClick={() => setOpenDesktop(null)}
                        className="fixed inset-0 -z-10 cursor-default"
                      />
                      <div
                        role="menu"
                        className="pop absolute left-0 top-[calc(100%+12px)] w-72 rounded-2xl border border-line bg-raised p-2 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.45)]"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            role="menuitem"
                            onClick={closeAll}
                            className="block rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-[var(--surface-bg-hover)]"
                          >
                            <span className="block text-[14px] font-semibold text-ink">
                              {child.title}
                            </span>
                            <span className="mt-0.5 block text-[12px] font-medium text-ink-faint">
                              {child.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.url}
                  className={cn(
                    "glass-link inline-flex h-11 items-center rounded-full px-4 text-[15px] font-semibold",
                    isActive(item.url) && "bg-[var(--glass-hover)]"
                  )}
                >
                  {item.title}
                </Link>
              )
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/contact"
              className="btn-quiet hidden h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold lg:inline-flex"
            >
              status
              <span className="rounded-full bg-[var(--ok-soft)] px-2 py-0.5 text-[11px] font-bold text-ok-ink">
                open
              </span>
            </Link>

            <ThemeToggle className="btn-quiet grid size-11 shrink-0 place-items-center rounded-full" />

            <a
              href={RESUME_URL}
              download
              className="btn-quiet hidden h-11 items-center gap-2 rounded-full px-5 text-[14px] font-bold md:inline-flex"
            >
              <Download size={17} strokeWidth={2.2} />
              resume
            </a>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              aria-expanded={isOpen}
              className="btn-quiet grid size-11 shrink-0 place-items-center rounded-full md:hidden"
            >
              <Menu size={20} strokeWidth={2.2} />
            </button>
          </div>
        </nav>
      </header>

      {isOpen && (
        <div className="sheet fixed inset-0 z-60 flex flex-col overflow-y-auto bg-canvas px-4 pb-10 pt-3 sm:pt-4 md:hidden">
          <div className="flex items-center justify-between">
            <Logo onClick={closeAll} />

            <div className="flex items-center gap-2">
              <ThemeToggle className="btn-quiet grid size-11 shrink-0 place-items-center rounded-full" />
              <button
                type="button"
                onClick={closeAll}
                aria-label="Close menu"
                className="btn-quiet grid size-11 shrink-0 place-items-center rounded-full"
              >
                <X size={20} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <Link
            href="/contact"
            onClick={closeAll}
            className="btn-solid mt-6 flex h-16 shrink-0 items-center justify-between rounded-2xl px-5 text-[17px] font-bold"
          >
            hire me
            <ArrowRight size={20} strokeWidth={2.5} />
          </Link>

          <div className="mt-4 flex flex-col gap-3">
            {NavLinks.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                const expanded = openMobile === item.id;

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-line bg-raised"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenMobile(expanded ? null : item.id)}
                      aria-expanded={expanded}
                      className="flex h-16 w-full items-center justify-between px-5 text-[17px] font-semibold text-ink"
                    >
                      {item.title}
                      <ChevronDown
                        size={20}
                        strokeWidth={2.5}
                        className={cn(
                          "transition-transform duration-300",
                          expanded && "rotate-180"
                        )}
                      />
                    </button>

                    {expanded && (
                      <div className="border-t border-line p-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            onClick={closeAll}
                            className="block rounded-xl px-3 py-2.5"
                          >
                            <span className="block text-[15px] font-semibold text-ink">
                              {child.title}
                            </span>
                            <span className="mt-0.5 block text-[12px] font-medium text-ink-faint">
                              {child.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={closeAll}
                  className="flex h-16 shrink-0 items-center gap-4 rounded-2xl border border-line bg-raised px-5 text-[17px] font-semibold text-ink"
                >
                  {Icon && <Icon size={22} strokeWidth={1.8} />}
                  {item.title}
                </Link>
              );
            })}

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="flex h-16 shrink-0 items-center gap-4 rounded-2xl border border-line bg-raised px-5 text-[17px] font-semibold text-ink"
            >
              <FaGithub size={22} />
              github
            </a>
          </div>

          <div className="my-6 h-px shrink-0 bg-line" />

          <Link
            href="/contact"
            onClick={closeAll}
            className="flex h-16 shrink-0 items-center justify-between rounded-2xl border border-line bg-raised px-5 text-[17px] font-semibold text-ink"
          >
            status
            <span className="rounded-full bg-[var(--ok-soft)] px-2.5 py-1 text-[12px] font-bold text-ok-ink">
              open
            </span>
          </Link>

          <div className="my-6 h-px shrink-0 bg-line" />

          <a
            href={RESUME_URL}
            download
            onClick={closeAll}
            className="btn-solid flex h-16 shrink-0 items-center gap-4 rounded-2xl px-5 text-[17px] font-bold"
          >
            <Download size={22} strokeWidth={2} />
            resume
          </a>
        </div>
      )}

      {/* the bar is fixed, this keeps page content clear of it */}
      <div aria-hidden="true" className="h-[80px] sm:h-[88px]" />
    </>
  );
};

export default Navbar;

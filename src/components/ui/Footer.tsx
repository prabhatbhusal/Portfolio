import Link from "next/link";
import React from "react";
import { ArrowUp, type LucideIcon } from "lucide-react";
import ScrollLink from "@/components/motion/ScrollLink";
import type { IconType } from "react-icons";

import { NavLinks, contactdata, workprojects } from "@/lib/constants/data";

type FooterLink = {
  id: number;
  label: string;
  href: string;
  external: boolean;
  icon?: LucideIcon | IconType;
};

type FooterColumn = {
  id: number;
  heading: string;
  links: FooterLink[];
};

const year = new Date().getFullYear();

const Footer = () => {
  const columns: FooterColumn[] = [
    {
      id: 1,
      heading: "explore",
      links: NavLinks.map((item) => ({
        id: item.id,
        label: item.title,
        href: item.url,
        external: false,
      })),
    },
    {
      id: 2,
      heading: "projects",
      links: workprojects.slice(0, 4).map((item) => ({
        id: item.id,
        label: item.title,
        href: "/work",
        external: false,
      })),
    },
    {
      id: 3,
      heading: "elsewhere",
      // the contact column carries its icons, which marks it out from the
      // two navigation columns beside it
      links: contactdata
        .filter((item) => item.url !== "#")
        .map((item) => ({
          id: item.id,
          label: item.label,
          href: item.url,
          external: item.url.startsWith("http"),
          icon: item.icon,
        })),
    },
  ];

  return (
    <footer className="relative">
      <div className="rail pb-12 pt-16 md:pb-16 md:pt-24">
        <div className="hairline mb-16 md:mb-20" />

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <h2 className="display text-5xl font-extrabold leading-[0.95] text-ink sm:text-6xl md:text-7xl">
              Prabhat
              <span className="block text-brand-ink">Bhusal</span>
            </h2>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Full-stack developer and Geomatics Engineer based in Kathmandu. I
              build web applications with React, Next.js and Django, and work
              with spatial data — PostGIS, LiDAR and everything in between.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.id}>
                <h3 className="mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
                  {column.heading}
                </h3>

                <ul className="mt-6 flex flex-col gap-4">
                  {column.links.map((link) => {
                    const Icon = link.icon;

                    return (
                      <li key={link.id}>
                        <Link
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noreferrer" : undefined}
                          className="group inline-flex items-center gap-2.5 text-[14px] text-ink-soft transition-colors duration-300 hover:text-brand-ink"
                        >
                          {Icon && (
                            <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-line bg-(--chip-bg) text-ink-faint transition-colors duration-300 group-hover:border-(--brand-line) group-hover:bg-(--brand-soft) group-hover:text-brand-ink">
                              <Icon size={13} strokeWidth={1.8} />
                            </span>
                          )}
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="hairline mt-16 md:mt-20" />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <p className="mono text-[12px] text-ink-faint">
            © {year} Prabhat Bhusal. Built in Kathmandu.
          </p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 mono text-[12px] text-ok-ink">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-ok" />
              </span>
              open to opportunities
            </span>

            <ScrollLink
              to="top"
              href="#top"
              aria-label="Back to top"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-[#1a0e00] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </ScrollLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

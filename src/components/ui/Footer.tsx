import Link from "next/link";
import React from "react";
import { ArrowUp } from "lucide-react";
import ScrollLink from "@/components/motion/ScrollLink";

import {
  NavLinks,
  blogdata,
  contactdata,
  servicesdata,
  workprojects,
} from "@/lib/constants/data";

type FooterLink = {
  id: number;
  label: string;
  href: string;
  external?: boolean;
  /* long titles get trimmed rather than wrapping a column three lines deep */
  clamp?: boolean;
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
      })),
    },
    {
      id: 2,
      heading: "services",
      // there is no services route, so these land on the section itself
      links: servicesdata.slice(0, 5).map((item) => ({
        id: item.id,
        label: item.title,
        href: "/#services",
      })),
    },
    {
      id: 3,
      heading: "work",
      links: workprojects.slice(0, 5).map((item) => ({
        id: item.id,
        label: item.title,
        href: `/work/${item.slug}`,
        clamp: true,
      })),
    },
    {
      id: 4,
      heading: "blog",
      links: blogdata.slice(0, 4).map((item) => ({
        id: item.id,
        label: item.title,
        href: `/blog/${item.slug}`,
        clamp: true,
      })),
    },
  ];

  /* location has no link behind it, so it would be a dead icon */
  const elsewhere = contactdata.filter((item) => item.url !== "#");

  return (
    <footer className="relative">
      <div className="rail pb-12 pt-16 md:pb-16 md:pt-24">
        <div className="hairline mb-16 md:mb-20" />

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_2fr] lg:gap-16">
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

            {/* icons only up here — the labels would repeat the columns */}
            <div className="mt-10">
              <h3 className="text-[11px] leading-relaxed uppercase  font-semibold">
                elsewhere
              </h3>

              <div className="mt-5 flex flex-wrap gap-3">
                {elsewhere.map((item) => {
                  const Icon = item.icon;
                  const external = item.url.startsWith("http");

                  return (
                    <Link
                      key={item.id}
                      href={item.url}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      aria-label={item.label}
                      title={item.label}
                      className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-(--chip-bg) text-ink-soft transition-colors duration-300 hover:border-(--brand-line) hover:bg-(--brand-soft) hover:text-brand-ink"
                    >
                      <Icon size={19} strokeWidth={1.8} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.id}>
                <h3 className="text-[11px] leading-relaxed uppercase  font-semibold">
                  {column.heading}
                </h3>

                <ul className="mt-6 flex flex-col gap-4">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        className={`block text-[14px] leading-snug text-ink-soft transition-colors duration-300 hover:text-brand-ink ${
                          link.clamp ? "line-clamp-2" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="hairline mt-16 md:mt-20" />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <p className="text-[12px] leading-relaxed uppercase text-ink-soft font-bold">
            © {year} Prabhat Bhusal. Built in Kathmandu.
          </p>

          
          
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6"> 
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
    </footer>
  );
};

export default Footer;

import Link from "next/link";
import React from "react";
import { ArrowUp } from "lucide-react";
import ScrollLink from "@/components/motion/ScrollLink";
import LocalTime from "./LocalTime";

import { contactdata, servicesdata } from "@/lib/constants/data";
import { getPosts, getProjects } from "@/lib/content";

const explore = [
  { title: "Work", url: "/work" },
  { title: "Games", url: "/games" },
  { title: "Skills", url: "/skills" },
  { title: "Blog", url: "/blog" },
  { title: "Gallery", url: "/gallery" },
  { title: "Contact", url: "/contact" },
];

type FooterLink = {
  id: number | string;
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

const Footer = async () => {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const columns: FooterColumn[] = [
    {
      id: 1,
      heading: "explore",
      links: explore.map((item) => ({
        id: item.url,
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
      links: projects.slice(0, 5).map((item) => ({
        id: item.id,
        label: item.title,
        href: `/work/${item.slug}`,
        clamp: true,
      })),
    },
    {
      id: 4,
      heading: "blog",
      links: posts.slice(0, 4).map((item) => ({
        id: item.slug,
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
              Game and VR developer based in Kathmandu, building the
              RCAAS.tech studio platform. Gameplay systems in Unity and
              Unreal, the web around them in Next.js and Django, and worlds
              on real terrain from LiDAR.
            </p>

            <div className="mt-10">
              <h3 className="eyebrow">follow</h3>

              <div className="mt-5 flex flex-wrap gap-2">
                {elsewhere.map((item) => {
                  const Icon = item.icon;
                  const external = item.url.startsWith("http");

                  return (
                    <Link
                      key={item.id}
                      href={item.url}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="inline-flex h-11 items-center gap-2.5 rounded-full border border-line px-4 text-[13px] text-ink-soft transition-colors duration-300 hover:border-(--brand-line) hover:bg-(--brand-soft) hover:text-brand-ink"
                    >
                      <Icon size={15} strokeWidth={1.8} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.id}>
                <h3 className="eyebrow">{column.heading}</h3>

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

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          {/* where, and what time it is there */}
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            <span className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-3.5">
              <span className="pulse-dot size-1.5 rounded-full bg-(--hud)" />
              <strong className="font-bold text-ink">kathmandu</strong> · np · <LocalTime />
            </span>
            <span className="inline-flex h-9 items-center rounded-full border border-line px-3.5">
              games · vr · web · spatial
            </span>
          </div>

          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            © {year} Prabhat Bhusal · built in Kathmandu
          </p>

          <ScrollLink
            to="top"
            href="#top"
            aria-label="Back to top"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-on-brand transition-transform duration-300 hover:-translate-y-0.5"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </ScrollLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

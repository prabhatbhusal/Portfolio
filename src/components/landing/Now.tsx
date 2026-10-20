import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Reveal } from "../motion";

const RESUME_URL = "/Prabhat_s_Resume.pdf";

/* the platform's capture-to-publish run, as one line of steps */
const flow = ["scan", "import", "author", "publish", "enquire"];

const stack = ["Next.js", "React 19", "React Three Fiber", "Gaussian splats", "Express", "Cloudflare R2"];

/* what a tour and the studio actually do, from the platform's feature book */
const features = [
  "walk, fly and orbit",
  "hotspots and portals",
  "day / night in one tap",
  "English · नेपाली · 中文",
  "bookings and enquiries in-tour",
  "team roles and version history",
];

/* the cv, short: what, in a line, and when — no dates invented */
const record = [
  { what: "RCAAS Technology", detail: "Game & VR developer, building the studio platform", when: "now" },
  { what: "Ridge Runner · Signal Depth", detail: "My own PC games, in Unity and Unreal Engine", when: "ongoing" },
  { what: "Blender props", detail: "A crate, a stool and a cabinet, on Sketchfab and ArtStation", when: "now" },
  { what: "Freelance web & spatial", detail: "WebGIS, e-commerce and computer-vision builds", when: "before" },
  { what: "Geomatics Engineering", detail: "Thesis: road-defect monitoring with LiDAR and YOLOv8", when: "degree" },
];

const Tag = ({ children }: { children: React.ReactNode }) => (
  <li className="chip rounded-full px-3 py-1 text-[11px]">{children}</li>
);

/** what is on the bench today: the rcaas.tech platform, the vr work, and
 *  the record that led here */
const Now = () => (
  <section id="now" data-label="Now" className="rail py-16 md:py-24">
    <Reveal className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col items-start gap-5">
        <p className="eyebrow">right now</p>
        <h2 className="display pixel-end max-w-3xl text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
          What I am building
        </h2>
      </div>
      <a
        href={RESUME_URL}
        download
        className="btn-quiet group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[13px] font-semibold"
      >
        <Download size={15} strokeWidth={2.2} />
        Download CV
      </a>
    </Reveal>

    <div className="mt-12 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      {/* the platform */}
      <Reveal className="surface relative flex flex-col rounded-[28px] p-7 md:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            <span className="pulse-dot size-1.5 rounded-full bg-ok" />
            live · rcaas technology
          </span>
          <span className="flex gap-2">
            <a
              href="https://rcaas.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-quiet inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold"
            >
              rcaas.tech
              <ArrowUpRight size={13} strokeWidth={2.4} />
            </a>
            <a
              href="https://github.com/prabhatbhusal/Three-D-GS-platform"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Platform source on GitHub"
              className="btn-quiet grid size-9 place-items-center rounded-full"
            >
              <FaGithub size={15} />
            </a>
          </span>
        </div>

        <h3 className="display mt-7 text-3xl leading-tight text-ink md:text-[2.5rem]">RCAAS.tech studio</h3>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          Real places, captured with LiDAR, become Gaussian-splat tours anyone
          can walk, fly or orbit through in a browser — authored in a private
          studio, published with enquiries and bookings built in.
        </p>

        {/* the run, start to finish */}
        <ol className="mt-8 flex flex-wrap items-center gap-y-3 text-[11px] uppercase tracking-[0.16em]">
          {flow.map((step, i) => (
            <li key={step} className="flex items-center">
              {i > 0 && <span aria-hidden="true" className="mx-2 h-px w-5 bg-line-strong" />}
              <span
                className={
                  i === flow.length - 1
                    ? "rounded-full border border-(--brand-line) bg-(--brand-soft) px-3 py-1 text-brand-ink"
                    : "rounded-full border border-line px-3 py-1 text-ink-soft"
                }
              >
                {step}
              </span>
            </li>
          ))}
        </ol>

        <ul className="mt-8 grid gap-x-6 gap-y-2.5 text-[13px] text-ink-soft sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span aria-hidden="true" className="size-1.5 shrink-0 bg-(--hud)" />
              {feature}
            </li>
          ))}
        </ul>

        <ul className="mt-8 flex flex-wrap gap-1.5">
          {stack.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </ul>

        <Link href="/work/rcaas-studio-platform" className="snav-all mt-auto pt-8">
          How it is built
          <ArrowRight size={14} />
        </Link>
      </Reveal>

      <div className="grid gap-4">
        {/* the vr work */}
        <Reveal delay={80} className="surface rounded-[28px] p-7 md:p-8">
          <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            <span className="pulse-dot size-1.5 rounded-full bg-(--hud)" />
            in development · vr
          </span>
          <h3 className="display mt-5 text-2xl leading-tight text-ink md:text-3xl">VR walk-throughs</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            Putting people inside captured places at full scale: room-scale VR
            for standalone headsets, built with game-engine tooling on the same
            captures the tours use.
          </p>
          <ul className="mt-6 flex flex-wrap gap-1.5">
            <Tag>6DoF</Tag>
            <Tag>standalone headsets</Tag>
            <Tag>teleport controls</Tag>
          </ul>
        </Reveal>

        {/* the record */}
        <Reveal delay={140} className="surface rounded-[28px] p-7 md:p-8">
          <p className="eyebrow">record</p>
          <ul className="mt-4 flex flex-col divide-y divide-line">
            {record.map((row) => (
              <li key={row.what} className="flex items-baseline justify-between gap-4 py-3.5">
                <span>
                  <span className="block text-[14px] font-semibold text-ink">{row.what}</span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-faint">{row.detail}</span>
                </span>
                <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-(--hud)">{row.when}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Now;

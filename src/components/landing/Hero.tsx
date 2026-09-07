import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroBackdrop from "../props/HeroBackdrop";

const stats = [
  { id: 1, value: "6", label: "projects shipped" },
  { id: 2, value: "3", label: "web · geomatics · games" },
  { id: 3, value: "<1d", label: "typical reply time" },
];

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none opacity-70 dark:opacity-60" />

      <div className="rail flex flex-col items-start gap-7 pb-16 pt-12 md:pb-24 md:pt-16">
        <span
          className="rise chip inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 mono text-[10px] uppercase tracking-[0.18em] text-ok-ink"
          style={{ "--d": "0ms" } as React.CSSProperties}
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-ok" />
          </span>
          available for work
        </span>

        <h1
          className="rise display max-w-4xl text-[2.6rem] font-extrabold leading-[1.02] text-ink sm:text-6xl md:text-7xl lg:text-[5rem]"
          style={{ "--d": "80ms" } as React.CSSProperties}
        >
          Web applications that
          <span className="block text-brand-ink">know where they are</span>
        </h1>

        <p
          className="rise max-w-xl text-[15px] leading-relaxed text-ink-soft md:text-lg md:leading-relaxed"
          style={{ "--d": "160ms" } as React.CSSProperties}
        >
          I&apos;m Prabhat Bhusal — a full-stack developer and Geomatics
          Engineer in Kathmandu. I build with React, Next.js and Django, and I
          take the spatial half seriously: PostGIS, LiDAR and 3D Gaussian
          Splatting — with a game engine background underneath it.
        </p>

        <div
          className="rise flex flex-wrap items-center gap-3"
          style={{ "--d": "240ms" } as React.CSSProperties}
        >
          <Link
            href="/work"
            className="btn-solid group inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold"
          >
            view my work
            <ArrowRight
              size={17}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/contact"
            className="btn-quiet inline-flex h-12 items-center rounded-full px-6 text-[15px] font-semibold"
          >
            start a project
          </Link>
        </div>

        <dl
          className="rise mt-8 grid w-full max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
          style={{ "--d": "320ms" } as React.CSSProperties}
        >
          {stats.map((stat) => (
            <div key={stat.id} className="bg-canvas px-5 py-6">
              <dt className="display text-2xl font-extrabold text-ink md:text-3xl">
                {stat.value}
              </dt>
              <dd className="mt-1 mono text-[11px] text-ink-faint">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Hero;

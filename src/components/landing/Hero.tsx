import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroBackdrop from "../props/HeroBackdrop";
import Marquee from "./Marquee";
import { Stagger, StaggerItem } from "../motion";
import ScrollCue from "../motion/ScrollCue";

const stats = [
  { id: 1, value: "6", label: "projects shipped" },
  { id: 2, value: "3", label: "web · geomatics · games" },
  { id: 3, value: "<1d", label: "typical reply time" },
];

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none opacity-70 dark:opacity-60" />

      {/* above the fold, so it runs on mount rather than on scroll */}
      <Stagger
        immediate
        delay={250}
        stagger={0.12}
        className="rail flex flex-col items-start gap-7 pb-12 pt-12 md:pb-16 md:pt-16"
      >
        

        <StaggerItem>
          <h1 className="display max-w-5xl text-[2.6rem] font-extrabold leading-[1.02] text-ink sm:text-6xl md:text-7xl lg:text-[5rem]">
            I&apos;m
            <span className="block text-brand-ink">Prabhat </span>
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-lg md:leading-relaxed">
            I&apos;m Prabhat Bhusal — a full-stack developer and Geomatics
            Engineer in Kathmandu. I build with React, Next.js and Django, and I
            take the spatial half seriously: PostGIS, LiDAR and 3D Gaussian
            Splatting — with a game engine background underneath it.
          </p>
        </StaggerItem>

        <StaggerItem className="flex flex-wrap items-center gap-3">
          <Link
            href="/work"
            className="btn-solid group inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold"
          >
            View my work
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
            Let's Collaborate
          </Link>
        </StaggerItem>

        <StaggerItem className="mt-8 w-full">
          <dl className="grid w-full max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
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
        </StaggerItem>

        <StaggerItem className="mt-2">
          <ScrollCue to="#disciplines" href="#disciplines" />
        </StaggerItem>
      </Stagger>

      <Marquee className="pb-14 md:pb-20" />
    </section>
  );
};

export default Hero;

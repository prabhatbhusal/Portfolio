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

const DecorativeStar = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`} aria-hidden="true">
    <span className="absolute left-1/2 top-0 h-full w-[0.16rem] -translate-x-1/2 rounded-full bg-ink/80 dark:bg-[#f7f5f2]" />
    <span className="absolute left-0 top-1/2 h-[0.16rem] w-full -translate-y-1/2 rounded-full bg-ink/80 dark:bg-[#f7f5f2]" />
  </div>
);

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none opacity-70 dark:opacity-60" />

      <DecorativeStar className="absolute left-[7%] top-[17%] h-10 w-10 opacity-80 md:h-12 md:w-12" />
      <DecorativeStar className="absolute right-[10%] top-[12%] h-12 w-12 opacity-85 md:h-14 md:w-14" />
      <DecorativeStar className="absolute left-[10%] bottom-[20%] h-9 w-9 opacity-75 md:h-11 md:w-11" />
      <DecorativeStar className="absolute right-[9%] bottom-[18%] h-10 w-10 opacity-80 md:h-12 md:w-12" />

      <Stagger
        immediate
        delay={250}
        stagger={0.12}
        className="rail flex flex-col items-center gap-7 pb-12 pt-12 text-center md:pb-16 md:pt-16"
      >
        <StaggerItem className="w-full">
          <h1 className="mx-auto max-w-6xl font-black leading-[0.95] tracking-[-0.01em] text-ink text-[clamp(3.5rem,8vw,12rem)] [font-family:var(--font-acorn),ui-sans-serif,system-ui,sans-serif]">
            <span className="block">I&apos;m Prabhat.</span>
            <span className="block text-brand-ink">Game Developer</span>
          </h1>
        </StaggerItem>

        <StaggerItem className="w-full">
          <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-lg md:leading-relaxed">
            I build immersive experiences with code, design, and spatial thinking.
          </p>
        </StaggerItem>

        <StaggerItem className="flex flex-wrap items-center justify-center gap-3">
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
            Let&apos;s Collaborate
          </Link>
        </StaggerItem>

        <StaggerItem className="mt-8 w-full">
          <dl className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
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

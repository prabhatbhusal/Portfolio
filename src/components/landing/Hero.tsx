import Link from "next/link";
import { ArrowRight } from "lucide-react";

import HeroBackdrop from "../props/HeroBackdrop";
import HeroScene from "../three/HeroScene";
import Marquee from "./Marquee";
import { ScrollFade, Stagger, StaggerItem } from "../motion";
import ScrollCue from "../motion/ScrollCue";
import { getGames, getProjects } from "@/server/content";

/* viewfinder corners framing the scan, like a capture app's hud */
const Corner = ({ className }: { className: string }) => (
  <span aria-hidden="true" className={`absolute size-6 border-(--hud) opacity-60 ${className}`} />
);

/* full-bleed under the bar: a live lidar scan of a valley, a big name over
   it, two pills, and the readouts a capture rig would show */
const Hero = async () => {
  const [games, projects] = await Promise.all([getGames(), getProjects()]);
  // the numbers, laid over the tech they were built with — counted, so a
  // project added in the studio shows up here too
  const stats = [
    { value: String(games.length), label: "games in the works" },
    { value: String(projects.length), label: "builds shipped" },
    { value: "3", label: "fields" },
    { value: "<1d", label: "reply time" },
  ];

  return (
    <>
      <section
        id="overview"
        className="relative isolate -mt-(--nav-h) flex h-svh min-h-[640px] flex-col overflow-hidden"
      >
        <HeroScene className="absolute inset-0 -z-10">
          <HeroBackdrop className="h-full w-full select-none opacity-70 dark:opacity-60" />
        </HeroScene>

        {/* lifts the type off the cloud without hiding it */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_38%_at_50%_45%,var(--canvas)_0%,transparent_100%)] opacity-60"
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 bottom-6 top-[calc(var(--nav-h)+16px)] sm:inset-x-8">
          <Corner className="left-0 top-0 border-l-2 border-t-2" />
          <Corner className="right-0 top-0 border-r-2 border-t-2" />
          <Corner className="bottom-0 left-0 border-b-2 border-l-2" />
          <Corner className="bottom-0 right-0 border-b-2 border-r-2" />
          <span className="absolute left-8 top-1 hidden mono text-[10px] uppercase tracking-[0.2em] text-(--hud) opacity-80 sm:block">
            <span className="pulse-dot mr-2 inline-block size-1.5 rounded-full bg-(--hud) align-middle" />
            loading world
          </span>
          <span className="absolute right-8 top-1 hidden mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:block">
            27.7172° n · 85.3240° e
          </span>
        </div>

        <ScrollFade className="flex flex-1">
          <Stagger
            immediate
            delay={150}
            stagger={0.12}
            className="rail flex flex-1 flex-col items-center justify-center gap-6 pt-(--nav-h) text-center md:gap-7"
          >
            <StaggerItem>
              <span className="chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium backdrop-blur">
                <span className="pulse-dot size-1.5 rounded-full bg-ok" />
                Now building VR + the RCAAS.tech studio
              </span>
            </StaggerItem>

            <StaggerItem>
              <h1 className="display pixel-end pixel-blink text-[clamp(2.9rem,9vw,8rem)] leading-[0.95] text-ink">
                Prabhat Bhusal
              </h1>
            </StaggerItem>

            <StaggerItem>
              <p className="text-gradient text-balance text-[clamp(1.25rem,2.6vw,2.25rem)] font-bold tracking-tight">
                Game &amp; VR developer · full&#8209;stack engineer
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-lg md:leading-relaxed">
                Gameplay systems and VR in Unity and Unreal Engine 5. The
                RCAAS.tech studio, where real places become Gaussian-splat
                tours in the browser. A geomatics degree underneath it all.
              </p>
            </StaggerItem>

            <StaggerItem className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/games"
                className="btn-solid group inline-flex h-13 items-center gap-2.5 rounded-full px-7 text-[15px] font-semibold"
              >
                Play my games
                <ArrowRight
                  size={17}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/contact"
                className="btn-glass inline-flex h-13 items-center rounded-full px-7 text-[15px] font-semibold"
              >
                Let&apos;s collaborate
              </Link>
            </StaggerItem>
          </Stagger>
        </ScrollFade>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-canvas"
        />

        <div className="absolute inset-x-0 bottom-10 flex justify-center">
          <ScrollCue to="#statement" href="#statement" />
        </div>
      </section>

      <div className="relative">
        <Marquee />
        <ul className="stats-pill relative mx-4 mb-8 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl px-5 py-4 text-[11px] uppercase tracking-[0.18em] text-ink-faint sm:mx-auto sm:w-fit lg:absolute lg:left-1/2 lg:top-1/2 lg:m-0 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2 lg:items-center lg:gap-0 lg:py-3">
          {stats.map((stat, i) => (
            <li key={stat.label} className="flex items-baseline gap-2 whitespace-nowrap">
              {i > 0 && (
                <span aria-hidden="true" className="hidden px-4 text-(--hud) lg:inline">
                  ·
                </span>
              )}
              <strong className="text-[13px] font-bold text-ink">{stat.value}</strong>
              {stat.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Hero;

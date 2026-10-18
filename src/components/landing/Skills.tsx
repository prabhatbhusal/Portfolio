import React from "react";
import Link from "next/link";
import { Check, Lock } from "lucide-react";

import type { SkillArea, SkillUnlock } from "@/@types/common.types";
import {
  skillAreaLabel,
  skillAreaOrder,
  skillpursuits,
  deriveUnlocks,
} from "@/lib/constants/data";
import { getGames, getProjects } from "@/lib/content";
import { Stagger, StaggerItem } from "../motion";
import { Reveal } from "../motion";

interface SkillsProps {
  // the /skills page already has a masthead, so it turns this off
  heading?: boolean;
}


/* an unlock is only listed once something has shipped with it, so the row
   always has a project to point at */
const Unlocked = ({ item }: { item: SkillUnlock }) => (
  <div className="surface group/row relative flex items-center gap-3.5 rounded-xl px-4 py-3.5">
    <span className="borderbg brand-bg grid size-9 shrink-0 place-items-center rounded-[10px] text-brand-ink">
      <Check size={14} strokeWidth={3} />
    </span>

    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="flex items-baseline gap-2">
        <span className="truncate text-[14px] font-semibold text-ink">
          {item.name}
        </span>
        {item.uses > 1 && (
          <span className="mono shrink-0 text-[10px] tabular-nums text-ink-faint">
            ×{item.uses}
          </span>
        )}
      </span>

      <Link
        href={item.href}
        className="mono truncate text-[11px] text-ink-faint transition-colors duration-300 hover:text-brand-ink"
      >
        {item.project}
      </Link>
    </span>

    <span className="mono shrink-0 tabular-nums text-[10px] uppercase tracking-[0.14em] text-brand-ink">
      {item.year}
    </span>
  </div>
);

/* the other half: in flight, nothing shipped with it yet */
const Locked = ({ item }: { item: (typeof skillpursuits)[number] }) => (
  <div className="relative flex items-center gap-3.5 rounded-xl border border-dashed border-line px-4 py-3.5">
    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-line text-ink-faint">
      <Lock size={13} strokeWidth={2} />
    </span>

    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="truncate text-[14px] font-semibold text-ink-soft">
        {item.name}
      </span>
      <span className="mono truncate text-[11px] text-ink-faint">
        {item.note}
      </span>
    </span>

    <span className="mono shrink-0 text-[10px] uppercase tracking-[0.14em] text-ink-faint">
      in progress
    </span>
  </div>
);

const Skills = async ({ heading = true }: SkillsProps) => {
  const skillunlocks = deriveUnlocks(await getProjects(), await getGames());
  const unlocked = skillunlocks.length;
  const total = unlocked + skillpursuits.length;
  const percent = Math.round((unlocked / total) * 100);

  return (
    <section id="skills" className="rail py-16 md:py-24">
      {heading && <div className="hairline mb-16 md:mb-24" />}

      {heading && (
        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start gap-5">
            <p className="eyebrow">skill tree</p>
            <h2 className="display pixel-end text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
              Skills
            </h2>
          </div>

          <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
            The web stack I ship with, and the spatial work that sits underneath
            it.
          </p>
        </div>
      )}

      {/* the count is arithmetic, not a self-assessment */}
      <Reveal>
        <div className="surface flex flex-col gap-5 rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="display text-2xl font-extrabold text-ink md:text-3xl">
              {unlocked}
              <span className="text-ink-faint">/{total}</span>{" "}
              <span className="text-[15px] font-semibold text-ink-soft md:text-base">
                unlocked
              </span>
            </p>

            <p className="mono text-[11px] text-ink-faint">
              unlocked by shipping, not by rating
            </p>
          </div>

          <span
            role="presentation"
            className="block h-1.5 w-full overflow-hidden rounded-full bg-line"
          >
            <span
              className="block h-full rounded-full bg-brand"
              style={{ width: `${percent}%` }}
            />
          </span>
        </div>
      </Reveal>

      {skillAreaOrder.map((area: SkillArea) => {
        const unlocks = skillunlocks.filter((item) => item.area === area);
        const pursuits = skillpursuits.filter((item) => item.area === area);

        if (unlocks.length === 0 && pursuits.length === 0) return null;

        return (
          <div key={area} className="mt-10 md:mt-12">
            <div className="mb-4 flex items-baseline gap-3">
              <h3 className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                {skillAreaLabel[area]}
              </h3>
              <span className="hairline h-px flex-1" />
              <span className="mono text-[10px] tabular-nums text-ink-faint">
                {unlocks.length}
              </span>
            </div>

            <Stagger
              className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3"
              stagger={0.04}
            >
              {unlocks.map((item) => (
                <StaggerItem key={item.name} y={10}>
                  <Unlocked item={item} />
                </StaggerItem>
              ))}

              {pursuits.map((item) => (
                <StaggerItem key={item.name} y={10}>
                  <Locked item={item} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        );
      })}
    </section>
  );
};

export default Skills;

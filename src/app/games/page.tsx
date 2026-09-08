import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

import PagesBanner from "@/components/props/PagesBanner";
import GameCard from "@/components/props/GameCard";
import { Stagger, StaggerItem } from "@/components/motion";
import { gamesdata } from "@/lib/constants/data";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Games",
  description:
    "PC games built by Prabhat Bhusal in Unity and Unreal Engine — gameplay systems, terrain tooling and level work.",
  path: "/games",
});

const Page = () => {
  return (
    <main>
      <PagesBanner
        eyebrow=""
        title="Games"
        desc="PC builds made in Unity and Unreal Engine — the systems underneath, and what each one was an excuse to learn."
      />

      <section className="rail py-14 md:py-20">
        {gamesdata.length === 0 ? (
          <div className="surface flex flex-col items-start gap-5 rounded-[28px] p-8 md:p-12">
            <span className="borderbg amber-bg grid size-12 place-items-center rounded-[16px] text-brand-ink">
              <Gamepad2 size={21} strokeWidth={1.6} />
            </span>

            <h2 className="display max-w-xl text-2xl font-extrabold leading-tight text-ink md:text-3xl">
              Builds are still being packaged
            </h2>

            <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
              Drop the captures into{" "}
              <span className="mono text-brand-ink">/public/games</span> and add
              a row to <span className="mono text-brand-ink">gamesdata</span> —
              this page and its inner pages build themselves from that.
            </p>

            <Link
              href="/work"
              className="btn-quiet mt-2 inline-flex h-11 items-center rounded-full px-5 text-[14px] font-semibold"
            >
              see the work instead
            </Link>
          </div>
        ) : (
          <Stagger className="flex flex-col gap-4" stagger={0.07}>
            {gamesdata.map((game, idx) => (
              <StaggerItem key={game.id}>
                <GameCard game={game} priority={idx === 0} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </main>
  );
};

export default Page;

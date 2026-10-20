import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

import PagesBanner from "@/components/props/PagesBanner";
import GameCard from "@/components/props/GameCard";
import { Stagger, StaggerItem } from "@/components/motion";
import { getGames, getModels } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Games",
  description:
    "PC games built by Prabhat Bhusal in Unity and Unreal Engine — gameplay systems, terrain tooling, level work and the 3D props that fill them.",
  path: "/games",
});

const Page = async () => {
  const gamesdata = await getGames();
  const assets = await getModels();
  return (
    <main>
      <PagesBanner
        title="Games"
        desc="PC builds made in Unity and Unreal Engine — the systems underneath, and what each one was an excuse to learn."
      />

      <section className="rail py-14 md:py-20">
        {gamesdata.length === 0 ? (
          <div className="surface flex flex-col items-start gap-5 rounded-[28px] p-8 md:p-12">
            <span className="borderbg brand-bg grid size-12 place-items-center rounded-[16px] text-brand-ink">
              <Gamepad2 size={21} strokeWidth={1.6} />
            </span>

            <h2 className="display max-w-xl text-2xl font-extrabold leading-tight text-ink md:text-3xl">
              Builds are still being packaged
            </h2>

            <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
              Nothing is ready to download yet. The builds are being cleaned up
              before they go out — the project write-ups have more in the
              meantime.
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

      {assets.length > 0 && (
        <section className="rail pb-14 md:pb-20">
          <p className="eyebrow">game assets</p>
          <h2 className="display pixel-end mt-5 text-3xl font-extrabold leading-[1.05] text-ink md:text-4xl">
            Props I have modelled
          </h2>

          {/* each card is the render, then the way into the model's page,
              where the viewer and the sketchfab / artstation links are */}
          <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {assets.map((item) => (
              <StaggerItem key={item.id} hover>
                <Link
                  href={`/work/${item.slug}`}
                  className="surface lift group flex h-full flex-col overflow-hidden rounded-2xl"
                >
                  {item.cover && (
                    <div className="aspect-video overflow-hidden bg-raised">
                      <Image
                        src={item.cover.src}
                        alt={item.cover.alt}
                        width={item.cover.width}
                        height={item.cover.height}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}

                  <span className="flex flex-col gap-1 p-5">
                    <span className="display text-lg font-bold text-ink transition-colors duration-300 group-hover:text-brand-ink">
                      {item.title}
                    </span>
                    <span className="mono text-[11px] text-ink-faint">
                      {[item.year, ...item.skills].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
    </main>
  );
};

export default Page;

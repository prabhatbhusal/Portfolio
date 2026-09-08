import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { gamesdata } from "@/lib/constants/data";
import FactGrid from "@/components/props/FactGrid";
import MediaFrame from "@/components/props/MediaFrame";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, videoGameSchema } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

// a static export serves only the slugs listed below; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return gamesdata.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = gamesdata.find((item) => item.slug === slug);

  if (!game) return { title: "Not found" };

  return pageMetadata({
    title: game.title,
    description: game.description,
    path: `/games/${slug}`,
    // the cover shares better than the site-wide card here
    image: {
      url: game.cover.src,
      type: "image/png",
      width: game.cover.width,
      height: game.cover.height,
      alt: game.cover.alt,
    },
  });
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const game = gamesdata.find((item) => item.slug === slug);

  if (!game) notFound();

  const index = gamesdata.findIndex((item) => item.slug === slug);
  const next = gamesdata[(index + 1) % gamesdata.length];

  const facts = [
    { id: 1, label: "engine", value: game.engine },
    { id: 2, label: "platform", value: game.platforms.join(", ") },
    { id: 3, label: "genre", value: game.genre },
    { id: 4, label: "year", value: game.year },
    { id: 5, label: "role", value: game.role },
  ];

  return (
    <main>
      <JsonLd data={videoGameSchema(game)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Games", path: "/games" },
          { name: game.title, path: `/games/${slug}` },
        ])}
      />

      <div className="rail pt-10 md:pt-14">
        <Link
          href="/games"
          className="group inline-flex items-center gap-2 text-[13px] font-semibold text-ink-soft transition-colors duration-300 hover:text-ink"
        >
          <ArrowLeft
            size={15}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          all games
        </Link>
      </div>

      <section className="rail flex flex-col items-start gap-6 pb-10 pt-8 md:pt-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="borderbg amber-bg rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider text-brand-ink">
            {game.status}
          </span>
          <span className="chip rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider">
            {game.engine}
          </span>
          <span className="chip rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider">
            {game.platforms.join(" · ")}
          </span>
        </div>

        <h1 className="display max-w-3xl text-4xl font-extrabold leading-[1.03] text-ink sm:text-5xl md:text-6xl">
          {game.title}
        </h1>

        <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-lg md:leading-relaxed">
          {game.description}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {game.download && (
            <Link
              href={game.download}
              target="_blank"
              rel="noreferrer"
              className="btn-solid group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
            >
              download the build
              <ArrowUpRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}

          {game.source && (
            <Link
              href={game.source}
              target="_blank"
              rel="noreferrer"
              className="btn-quiet group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
            >
              source on github
              <ArrowUpRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}

          {!game.download && !game.source && (
            <span className="mono text-[11px] text-ink-faint">
              no public build yet
            </span>
          )}
        </div>
      </section>

      <section className="rail">
        <MediaFrame
          shot={game.cover}
          priority
          showCaption={false}
          sizes="(min-width: 1400px) 1280px, 100vw"
        />
      </section>

      <section className="rail pt-10">
        <FactGrid facts={facts} className="md:grid-cols-5" />
      </section>

      <section className="rail grid grid-cols-1 gap-12 py-16 md:py-24 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
        <div>
          <h2 className="display text-2xl font-bold text-ink md:text-3xl">
            What is in it
          </h2>

          <ul className="mt-8 flex flex-col gap-6">
            {game.features.map((feature, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="mono mt-0.5 shrink-0 text-[11px] tabular-nums text-brand-ink">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft">
                  {feature}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface h-fit rounded-2xl p-6 md:p-8">
          <h3 className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            built with
          </h3>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {game.tech.map((item) => (
              <span
                key={item}
                className="chip rounded-full px-2.5 py-1 mono text-[11px]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {game.shots.length > 0 && (
        <section className="rail pb-16 md:pb-24">
          <h2 className="display text-2xl font-bold text-ink md:text-3xl">
            Screenshots
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {game.shots.map((shot) => (
              <MediaFrame key={shot.src} shot={shot} />
            ))}
          </div>
        </section>
      )}

      <section className="rail pb-8">
        <div className="hairline mb-10" />

        <Link
          href={`/games/${next.slug}`}
          className="surface group flex flex-col gap-2 rounded-2xl p-6 md:p-8"
        >
          <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            next build
          </span>

          <span className="display flex items-center gap-3 text-xl font-bold text-ink transition-colors duration-300 group-hover:text-brand-ink md:text-2xl">
            {next.title}
            <ArrowUpRight
              size={20}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      </section>
    </main>
  );
};

export default Page;

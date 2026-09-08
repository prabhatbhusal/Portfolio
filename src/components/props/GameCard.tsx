import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { GameItem } from "@/@types/common.types";
import MediaFrame from "./MediaFrame";

interface prop {
  game: GameItem;
  /* "split" is the wide row used on /games, "tile" the compact one on the
     home page — same card, the caller picks the shape */
  layout?: "split" | "tile";
  /* the first card on a page carries the largest image, so it loads eagerly */
  priority?: boolean;
}

const Meta = ({ game }: { game: GameItem }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="chip rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider">
      {game.engine}
    </span>
    <span className="chip rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider">
      {game.platforms[0]}
    </span>
    <span className="borderbg amber-bg rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider text-brand-ink">
      {game.status}
    </span>
    <span className="mono ml-auto text-[11px] tabular-nums text-ink-faint">
      {game.year}
    </span>
  </div>
);

/** one game, wherever it is listed: the cover, the pitch, and the way in */
const GameCard = ({ game, layout = "split", priority = false }: prop) => {
  const href = `/games/${game.slug}`;

  const cover = (
    <MediaFrame
      shot={game.cover}
      priority={priority}
      showCaption={false}
      // the frame is the card here, so it drops its own border and corners
      className="h-full rounded-none border-0 bg-transparent"
      ratio={layout === "tile" ? "video" : "fill"}
      sizes={
        layout === "tile"
          ? "(min-width: 1024px) 33vw, 100vw"
          : "(min-width: 1024px) 50vw, 100vw"
      }
    />
  );

  if (layout === "tile") {
    return (
      <Link
        href={href}
        className="surface lift group flex h-full flex-col overflow-hidden rounded-2xl"
      >
        <div className="overflow-hidden">{cover}</div>

        <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
          <Meta game={game} />

          <div>
            <h3 className="display text-xl font-bold text-ink transition-colors duration-300 group-hover:text-brand-ink md:text-2xl">
              {game.title}
            </h3>
            <p className="mt-1 text-[13px] text-brand-ink">{game.tagline}</p>
          </div>

          <p className="text-[14px] leading-relaxed text-ink-soft">
            {game.description}
          </p>

          <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[13px] font-semibold text-ink">
            open the build
            <ArrowUpRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <article
      className={`surface group overflow-hidden rounded-2xl ${
        game.featured ? "borderbg" : ""
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Link
          href={href}
          aria-label={`${game.title} — ${game.tagline}`}
          className="block h-full overflow-hidden"
        >
          {cover}
        </Link>

        <div className="flex flex-col gap-5 p-6 md:p-8">
          <Meta game={game} />

          <div>
            <h2 className="display text-xl font-bold text-ink md:text-2xl">
              {game.title}
            </h2>
            <p className="mt-1 text-[13px] text-brand-ink">{game.tagline}</p>
          </div>

          <p className="max-w-xl text-[14px] leading-relaxed text-ink-soft">
            {game.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {game.tech.slice(0, 4).map((item) => (
              <span
                key={item}
                className="chip rounded-full px-2.5 py-1 mono text-[11px]"
              >
                {item}
              </span>
            ))}
          </div>

          <Link
            href={href}
            className="btn-quiet mt-auto inline-flex h-10 w-fit items-center gap-2 rounded-full px-4 text-[13px] font-semibold"
          >
            open the build
            <ArrowUpRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default GameCard;

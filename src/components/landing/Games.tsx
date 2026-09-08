import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Headerbanner from "../props/Headerbanner";
import GameCard from "../props/GameCard";
import { Stagger, StaggerItem } from "../motion";
import { gamesdata } from "@/lib/constants/data";

const Games = () => {
  if (gamesdata.length === 0) return null;

  return (
    <section className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-start gap-5">
          <Headerbanner header="unity & unreal" />
          <h2 className="display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
            Games I have shipped
          </h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft">
            PC builds where the engine work is the point — terrain tooling,
            movement systems and levels that teach themselves.
          </p>
        </div>

        <Link
          href="/games"
          className="btn-quiet group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
        >
          all games
          <ArrowUpRight
            size={16}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* the cards carry the art, so two across is enough to read them */}
      <Stagger className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {gamesdata.map((game) => (
          <StaggerItem key={game.id} hover>
            <GameCard game={game} layout="tile" />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
};

export default Games;

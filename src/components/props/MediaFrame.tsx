import React from "react";
import Image from "next/image";

import type { GameShot } from "@/@types/common.types";
import { cn } from "@/lib/utils";

interface prop {
  /* the shot itself — same shape next/image wants, so it spreads straight in */
  shot: GameShot;
  /* only the first frame on a page should be eager */
  priority?: boolean;
  /* set on frames that are decoration next to a heading that already names them */
  showCaption?: boolean;
  className?: string;
  sizes?: string;
  /* "video" keeps 16:9, "fill" lets the frame take the height of its cell */
  ratio?: "video" | "fill";
}

/** a rounded, bordered image frame — cards, hero shots and screenshot grids
 *  all use this so a picture looks the same wherever it lands */
const MediaFrame = ({
  shot,
  priority = false,
  showCaption = true,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  ratio = "video",
}: prop) => (
  <figure className={cn("surface overflow-hidden rounded-2xl", className)}>
    <div
      className={cn(
        "relative w-full overflow-hidden bg-raised",
        ratio === "fill" ? "h-full min-h-60" : "aspect-video",
      )}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
      />
    </div>

    {showCaption && shot.caption && (
      <figcaption className="px-5 py-4 text-[13px] leading-relaxed text-ink-soft">
        {shot.caption}
      </figcaption>
    )}
  </figure>
);

export default MediaFrame;

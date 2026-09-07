import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";

import PagesBanner from "@/components/props/PagesBanner";
import Reveal from "@/components/props/Reveal";
import { gallerydata } from "@/lib/constants/data";

export const metadata: Metadata = {
  title: "Gallery | Prabhat Bhusal",
  description:
    "Scenes and photographs by Prabhat Bhusal — field work, survey sites and everything in between.",
};

// placeholder frames so the page has shape before the photographs land
const frames = [
  { id: 1, ratio: "aspect-[4/5]" },
  { id: 2, ratio: "aspect-[4/3]" },
  { id: 3, ratio: "aspect-square" },
  { id: 4, ratio: "aspect-[3/4]" },
  { id: 5, ratio: "aspect-[4/3]" },
  { id: 6, ratio: "aspect-[5/4]" },
];

const Page = () => {
  return (
    <main>
      <PagesBanner
        eyebrow="scenes"
        title="Gallery"
        desc="Photographs from the field and elsewhere — survey sites, captures, and whatever the light was doing that day."
      />

      <section className="rail py-14 md:py-20">
        {gallerydata.length === 0 ? (
          <>
            <Reveal>
              <div className="surface flex flex-col items-start gap-5 rounded-[28px] p-8 md:p-12">
                <span className="borderbg amber-bg grid size-12 place-items-center rounded-[16px] text-brand-ink">
                  <Camera size={21} strokeWidth={1.6} />
                </span>

                <h2 className="display max-w-xl text-2xl font-extrabold leading-tight text-ink md:text-3xl">
                  Scenes are still being sorted
                </h2>

                <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
                  Drop the files into{" "}
                  <span className="mono text-brand-ink">/public/gallery</span>{" "}
                  and add a row to{" "}
                  <span className="mono text-brand-ink">gallerydata</span> — this
                  page fills itself in, no layout work needed.
                </p>

                <Link
                  href="/work"
                  className="btn-quiet mt-2 inline-flex h-11 items-center rounded-full px-5 text-[14px] font-semibold"
                >
                  see the work instead
                </Link>
              </div>
            </Reveal>

            {/* the shape the grid will take */}
            <div
              aria-hidden="true"
              className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3"
            >
              {frames.map((frame, idx) => (
                <Reveal key={frame.id} delay={idx * 70}>
                  <div
                    className={`surface mb-4 break-inside-avoid rounded-2xl ${frame.ratio}`}
                  />
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          // css columns, so tall and wide shots both sit well together
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {gallerydata.map((scene, idx) => (
              <Reveal key={scene.id} delay={idx * 60}>
                <figure className="surface group mb-4 break-inside-avoid overflow-hidden rounded-2xl">
                  <div className="overflow-hidden">
                    <Image
                      src={scene.src}
                      alt={scene.title}
                      width={scene.width}
                      height={scene.height}
                      className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>

                  <figcaption className="flex items-baseline justify-between gap-4 p-5">
                    <span className="flex flex-col">
                      <span className="text-[14px] font-semibold text-ink">
                        {scene.title}
                      </span>
                      <span className="mono text-[11px] text-ink-faint">
                        {scene.location}
                      </span>
                    </span>
                    <time
                      className="mono text-[11px] text-ink-faint"
                      dateTime={scene.date}
                    >
                      {scene.date}
                    </time>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Page;

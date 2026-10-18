import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getProjects } from "@/lib/content";
import WorkRow from "../props/WorkRow";
import { Stagger, StaggerItem } from "../motion";


const Work = async () => {
  // the homepage shows the top of the index and hands off to /work
  const shown = (await getProjects()).slice(0, 4);
  return (
    <section id="work" className="rail py-16 md:py-24">
      <div className="hairline mb-16 md:mb-24" />

      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-start gap-5">
          <p className="eyebrow">shipped</p>
          <h2 className="display pixel-end text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
            Things I have built
          </h2>
        </div>

        <Link
          href="/work"
          className="btn-quiet group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
        >
          all projects
          <ArrowUpRight
            size={16}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <Stagger className="mt-10 flex flex-col" stagger={0.06}>
        {shown.map((item) => (
          <StaggerItem key={item.id} y={12}>
            <WorkRow item={item} detailed={false} />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="hairline" />
    </section>
  );
};

export default Work;

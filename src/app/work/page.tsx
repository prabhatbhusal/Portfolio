import React from "react";
import type { Metadata } from "next";

import PagesBanner from "@/components/props/PagesBanner";
import Projects from "@/components/landing/Projects";
import WorkRow from "@/components/props/WorkRow";
import { getAllProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description: "VR, 3D modelling and LiDAR work by Prabhat Bhusal.",
  path: "/work",
});

const Page = async () => {
  const archived = (await getAllProjects()).filter((project) => project.archived);

  return (
    <main>
      <PagesBanner title="Work" desc="VR, 3D models and LiDAR work." />
      <Projects />

      {/* the web and spatial work from before the move to games and 3d:
          still linked, folded away by default */}
      {archived.length > 0 && (
        <details className="rail pb-14 md:pb-20">
          <summary className="mono w-fit cursor-pointer text-[11px] uppercase tracking-[0.16em] text-ink-faint transition-colors duration-300 hover:text-ink">
            [ earlier web and spatial work ]
          </summary>

          <div className="mt-8 flex flex-col">
            {archived.map((item) => (
              <WorkRow key={item.id} item={item} detailed={false} />
            ))}
            <div className="hairline" />
          </div>
        </details>
      )}
    </main>
  );
};

export default Page;

import React from "react";
import type { Metadata } from "next";

import PagesBanner from "@/components/props/PagesBanner";
import Skills from "@/components/landing/Skills";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Skills",
  description:
    "Game development, 3D modelling and LiDAR — the tools Prabhat Bhusal builds with, each one unlocked by something that shipped.",
  path: "/skills",
});

const Page = () => {
  return (
    <main>
      <PagesBanner
        title="Skills"
        desc="Technologies, tools and areas of expertise — grouped by where they sit in the stack."
      />
      <Skills heading={false} />
    </main>
  );
};

export default Page;

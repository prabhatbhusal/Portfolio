import React from "react";
import type { Metadata } from "next";

import PagesBanner from "@/components/props/PagesBanner";
import Skills from "@/components/landing/Skills";

export const metadata: Metadata = {
  title: "Skills | Prabhat Bhusal",
  description:
    "Frontend, backend, geospatial and game development — the tools and technologies Prabhat Bhusal builds with.",
};

const Page = () => {
  return (
    <main>
      <PagesBanner
        eyebrow="what I work with"
        title="Skills"
        desc="Technologies, tools and areas of expertise — grouped by where they sit in the stack."
      />
      <Skills heading={false} />
    </main>
  );
};

export default Page;

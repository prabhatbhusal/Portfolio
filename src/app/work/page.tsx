import React from "react";
import type { Metadata } from "next";

import PagesBanner from "@/components/props/PagesBanner";
import Projects from "@/components/landing/Projects";

export const metadata: Metadata = {
  title: "Work | Prabhat Bhusal",
  description:
    "Full-stack, geospatial and machine learning projects built by Prabhat Bhusal.",
};

const Page = () => {
  return (
    <main>
      <PagesBanner
        eyebrow="selected projects"
        title="Work"
        desc="Projects I've built — full-stack, spatial, and machine learning."
      />
      <Projects />
    </main>
  );
};

export default Page;

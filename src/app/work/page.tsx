import React from "react";
import type { Metadata } from "next";

import PagesBanner from "@/components/props/PagesBanner";
import Projects from "@/components/landing/Projects";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Full-stack, geospatial and machine learning projects built by Prabhat Bhusal.",
  path: "/work",
});

const Page = () => {
  return (
    <main>
      <PagesBanner
        eyebrow=""
        title="Work"
        desc="Projects I've built — full-stack, spatial, and machine learning."
      />
      <Projects />
    </main>
  );
};

export default Page;

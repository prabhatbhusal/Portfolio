import React from "react";
import type { Metadata } from "next";

import PagesBanner from "@/components/props/PagesBanner";
import Contact from "@/components/landing/Contact";
import Faq from "@/components/landing/Faq";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Prabhat Bhusal — full-stack developer and Geomatics Engineer based in Kathmandu.",
  path: "/contact",
});

const Page = () => {
  return (
    <main>
      <PagesBanner
        eyebrow="get in touch"
        title="Contact"
        desc="Open to full-stack and geospatial work, freelance or full time. Tell me what you are building."
      />
      <Contact heading={false} />
      <Faq />
    </main>
  );
};

export default Page;

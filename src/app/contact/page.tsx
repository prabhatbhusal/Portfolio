import React from "react";
import type { Metadata } from "next";

import PagesBanner from "@/components/props/PagesBanner";
import Contact from "@/components/landing/Contact";
import Faq from "@/components/landing/Faq";

export const metadata: Metadata = {
  title: "Contact | Prabhat Bhusal",
  description:
    "Get in touch with Prabhat Bhusal — full-stack developer and Geomatics Engineer based in Kathmandu.",
};

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

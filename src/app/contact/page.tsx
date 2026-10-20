import React from "react";
import type { Metadata } from "next";

import PagesBanner from "@/components/props/PagesBanner";
import Contact from "@/components/landing/Contact";
import Faq from "@/components/landing/Faq";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Prabhat Bhusal — game and VR developer and 3D artist based in Kathmandu.",
  path: "/contact",
});

const Page = () => {
  return (
    <main>
      <PagesBanner
        title="Contact"
        desc="Open to game and VR development, 3D props and LiDAR work, freelance or full time. Tell me what you are building."
      />
      <Contact heading={false} />
      <Faq />
    </main>
  );
};

export default Page;

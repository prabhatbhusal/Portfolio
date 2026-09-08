import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/site";

export const dynamic = "force-static";

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      // build output, never a page worth indexing
      disallow: ["/_next/"],
    },
  ],
  sitemap: absoluteUrl("/sitemap.xml"),
  host: absoluteUrl("/"),
});

export default robots;

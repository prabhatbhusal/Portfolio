import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/site";

// built once with the site (and as a plain file in the static export)
export const dynamic = "force-static";

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      // /_next/ stays crawlable: google renders pages with their js and css
      allow: "/",
    },
  ],
  sitemap: absoluteUrl("/sitemap.xml"),
  host: absoluteUrl("/"),
});

export default robots;

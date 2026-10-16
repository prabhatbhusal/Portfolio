import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/site";

// built once with the site (and as a plain file in the static export)
export const dynamic = "force-static";

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      // /_next/ stays crawlable: google renders pages with their js and css.
      // the studio is deliberately not named here — a disallow line would
      // advertise it; its noindex header keeps it out of results instead
      disallow: ["/api/"],
    },
  ],
  sitemap: absoluteUrl("/sitemap.xml"),
  host: absoluteUrl("/"),
});

export default robots;

import type { MetadataRoute } from "next";

import { author, siteDescription, siteName } from "@/lib/seo/site";

export const dynamic = "force-static";

const manifest = (): MetadataRoute.Manifest => ({
  name: `${siteName} — ${author.jobTitle}`,
  short_name: siteName,
  description: siteDescription,
  start_url: "/",
  display: "standalone",
  background_color: "#f4f3ef",
  theme_color: "#e02020",
  icons: [
    { src: "/logo-192.png", sizes: "192x192", type: "image/png" },
    { src: "/logo-512.png", sizes: "512x512", type: "image/png" },
    {
      src: "/logo-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
});

export default manifest;

import type { MetadataRoute } from "next";

import { siteDescription, siteName } from "@/lib/seo/site";

export const dynamic = "force-static";

const manifest = (): MetadataRoute.Manifest => ({
  name: `${siteName} — Full-stack Developer & Geomatics Engineer`,
  short_name: siteName,
  description: siteDescription,
  start_url: "/",
  display: "standalone",
  background_color: "#f4f3ef",
  theme_color: "#ef9f27",
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

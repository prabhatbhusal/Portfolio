import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // every route on this site is prerendered, so ship it as plain files.
  // works the same on Cloudflare Pages and GitHub Pages, no worker needed.
  output: "export",

  // there is no image optimiser in a static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

/* a static site: `next build` writes plain files to out/, served by
   cloudflare (wrangler.jsonc). there is no server, so the security headers
   live in public/_headers, which cloudflare applies to every file */
const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  // there is no image optimiser in a static export
  images: { unoptimized: true },
};

export default nextConfig;

import type { MetadataRoute } from "next";

import { blogdata, gamesdata, workprojects } from "@/lib/constants/data";
import { absoluteUrl } from "@/lib/seo/site";

// static export, so this is written once at build time into out/sitemap.xml
export const dynamic = "force-static";

const buildDate = new Date();

const sitemap = (): MetadataRoute.Sitemap => {
  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { path: "/", changeFrequency: "monthly", priority: 1 },
      { path: "/work", changeFrequency: "monthly", priority: 0.9 },
      { path: "/games", changeFrequency: "monthly", priority: 0.8 },
      { path: "/skills", changeFrequency: "yearly", priority: 0.7 },
      { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
      { path: "/gallery", changeFrequency: "monthly", priority: 0.5 },
      { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
    ] as const
  ).map(({ path, ...rest }) => ({
    ...rest,
    url: absoluteUrl(path),
    lastModified: buildDate,
  }));

  const workRoutes: MetadataRoute.Sitemap = workprojects.map((project) => ({
    url: absoluteUrl(`/work/${project.slug}`),
    lastModified: buildDate,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const gameRoutes: MetadataRoute.Sitemap = gamesdata.map((game) => ({
    url: absoluteUrl(`/games/${game.slug}`),
    lastModified: buildDate,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  // posts carry a real publish date, so use it instead of the build stamp
  const blogRoutes: MetadataRoute.Sitemap = blogdata.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes, ...gameRoutes, ...blogRoutes];
};

export default sitemap;

import type { Metadata } from "next";

import { ogImage, siteLocale, siteName } from "@/lib/seo/site";

type PageMeta = {
  /** page name only — the root layout appends "| Prabhat Bhusal" */
  title: string;
  description: string;
  /** site-relative path, used for the canonical and the og url */
  path: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  tags?: string[];
  /* a page with art of its own shares that instead of the site-wide card */
  image?: { url: string; type?: string; width: number; height: number; alt: string };
};

/** the per-page half of the metadata: canonical, og and twitter in one place */
export const pageMetadata = ({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  tags,
  image = ogImage,
}: PageMeta): Metadata => {
  const fullTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: path,
      siteName,
      locale: siteLocale,
      images: [image],
      ...(type === "article" && publishedTime
        ? { publishedTime, modifiedTime: publishedTime, authors: [siteName], tags }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
};

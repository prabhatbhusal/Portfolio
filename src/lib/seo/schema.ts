import { absoluteUrl, author, siteDescription, siteName } from "@/lib/seo/site";

const personId = `${absoluteUrl("/")}#person`;
const siteId = `${absoluteUrl("/")}#website`;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personId,
  name: author.name,
  url: absoluteUrl("/"),
  image: absoluteUrl("/logo-512.png"),
  jobTitle: author.jobTitle,
  email: `mailto:${author.email}`,
  description: siteDescription,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kathmandu",
    addressCountry: "NP",
  },
  sameAs: author.sameAs,
  knowsAbout: [
    "Web development",
    "React",
    "Next.js",
    "Django",
    "PostGIS",
    "WebGIS",
    "Remote sensing",
    "LiDAR",
    "Photogrammetry",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": siteId,
  url: absoluteUrl("/"),
  name: siteName,
  description: siteDescription,
  inLanguage: "en",
  publisher: { "@id": personId },
};

/** breadcrumbs give search results the "site › work › project" trail */
export const breadcrumbSchema = (
  crumbs: { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
});

export const blogPostingSchema = (post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.excerpt,
  datePublished: post.date,
  dateModified: post.date,
  keywords: post.tags.join(", "),
  inLanguage: "en",
  url: absoluteUrl(`/blog/${post.slug}`),
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": absoluteUrl(`/blog/${post.slug}`),
  },
  author: { "@id": personId },
  publisher: { "@id": personId },
});

export const projectSchema = (project: {
  slug: string;
  title: string;
  description: string;
  year?: string;
  skills: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: project.title,
  description: project.description,
  url: absoluteUrl(`/work/${project.slug}`),
  ...(project.year ? { dateCreated: project.year } : {}),
  keywords: project.skills.join(", "),
  inLanguage: "en",
  creator: { "@id": personId },
});

export const videoGameSchema = (game: {
  slug: string;
  title: string;
  description: string;
  engine: string;
  platforms: string[];
  genre: string;
  year: string;
  cover: { src: string };
}) => ({
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: game.title,
  description: game.description,
  url: absoluteUrl(`/games/${game.slug}`),
  image: absoluteUrl(game.cover.src),
  gamePlatform: game.platforms,
  genre: game.genre,
  dateCreated: game.year,
  inLanguage: "en",
  author: { "@id": personId },
  publisher: { "@id": personId },
  // the engine is not a schema.org field, so it rides along as a property
  additionalProperty: {
    "@type": "PropertyValue",
    name: "Engine",
    value: game.engine,
  },
});

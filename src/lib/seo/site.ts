// one place for everything the metadata, sitemap, robots and JSON-LD read from.
// the domain here has to match the CNAME file, otherwise canonical urls lie.
export const siteUrl = "https://www.prabhatbhusal.com.np";

export const siteName = "Prabhat Bhusal";

export const siteTitle =
  "Prabhat Bhusal | Full-stack Developer & Geomatics Engineer";

export const siteDescription =
  "Portfolio of Prabhat Bhusal — full-stack developer and Geomatics Engineer building web applications with React, Next.js, Django and spatial data.";

export const siteLocale = "en_US";

// regenerate with `npm run og` after changing the wording in scripts/generate-og.mjs
export const ogImage = {
  url: "/og.png",
  type: "image/png",
  width: 1200,
  height: 630,
  alt: "Prabhat Bhusal — Full-stack Developer & Geomatics Engineer",
};

export const author = {
  name: "Prabhat Bhusal",
  jobTitle: "Full-stack Developer & Geomatics Engineer",
  email: "prabhatbhusal777@gmail.com",
  location: "Kathmandu, Nepal",
  // profiles google uses to tie the site to a real person
  sameAs: [
    "https://github.com/prabhatbhusal",
    "https://www.linkedin.com/in/prabhat-bhusal-302672322/",
  ],
};

export const siteKeywords = [
  "Prabhat Bhusal",
  "full-stack developer",
  "geomatics engineer",
  "WebGIS developer",
  "React developer Nepal",
  "Next.js developer",
  "Django developer",
  "PostGIS",
  "LiDAR",
  "remote sensing",
  "Kathmandu",
];

/** absolute url for a site-relative path — sitemap, og tags and JSON-LD all need one */
export const absoluteUrl = (path = "/") =>
  path === "/" ? siteUrl : `${siteUrl}${path}`;

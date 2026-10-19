// one place for everything the metadata, sitemap, robots and JSON-LD read from.
// the domain here has to match the CNAME file, otherwise canonical urls lie.
export const siteUrl = "https://www.prabhatbhusal.com.np";

export const siteName = "Prabhat Bhusal";

export const siteTitle = "Prabhat Bhusal | Game & VR Developer, Full-stack Engineer";

export const siteDescription =
  "Portfolio of Prabhat Bhusal — game and VR developer in Kathmandu, building the RCAAS.tech virtual-tour platform, gameplay systems in Unity and Unreal Engine, and the full-stack web around them.";

export const siteLocale = "en_US";

// regenerate with `npm run og` after changing the wording in scripts/generate-og.mjs
export const ogImage = {
  url: "/og.png",
  type: "image/png",
  width: 1200,
  height: 630,
  alt: "Prabhat Bhusal — Game & VR Developer, Full-stack Engineer",
};

export const author = {
  name: "Prabhat Bhusal",
  jobTitle: "Game & VR Developer, Full-stack Engineer",
  email: "prabhatbhusal777@gmail.com",
  location: "Kathmandu, Nepal",
  // profiles google uses to tie the site to a real person
  sameAs: [
    "https://github.com/prabhatbhusal",
    "https://www.linkedin.com/in/prabhat-bhusal-302672322/",
    "https://sketchfab.com/bhusalprabhat",
    "https://www.artstation.com/prabhatbhusal",
  ],
};

export const siteKeywords = [
  "Prabhat Bhusal",
  "game developer",
  "VR developer",
  "virtual tours",
  "Gaussian splatting",
  "RCAAS",
  "Unity developer",
  "Unreal Engine developer",
  "3D modelling",
  "Blender",
  "gameplay programmer",
  "game developer Nepal",
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

/** the repo the blog admin commits posts into. pushing to the branch
 *  triggers the pages workflow, which rebuilds and deploys the site */
export const repo = {
  owner: "prabhatbhusal",
  name: "Portfolio",
  branch: "main",
};

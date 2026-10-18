import type { Metadata, Viewport } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import ScrollRail from "@/components/ui/ScrollRail";
import Loader from "@/components/ui/Loader";
import MotionProvider from "@/components/motion/MotionProvider";
import Cursor from "@/components/motion/Cursor";
import { Geist, Geist_Mono } from "next/font/google";
import JsonLd from "@/components/seo/JsonLd";
import type { NavItem } from "@/@types/navbar.types";
import { formatDate } from "@/lib/blog/format";
import { getGames, getPosts, getProjects } from "@/lib/content";
import { personSchema, websiteSchema } from "@/lib/seo/schema";
import {
  author,
  siteDescription,
  ogImage,
  siteKeywords,
  siteLocale,
  siteName,
  siteTitle,
  siteUrl,
} from "@/lib/seo/site";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// runs before paint so the saved theme is applied without a flash.
// dark unless the reader picked light — the reference design is dark-first
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme') || 'dark';
    if (t === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.classList.add('js');
    document.documentElement.style.colorScheme = t;
    // the boot screen plays once per visit
    if (sessionStorage.getItem('booted')) document.documentElement.classList.add('booted');
  } catch (e) {}
})();
`;

/* the four panels of the navbar, filled from whatever is live */
async function navLinks(): Promise<NavItem[]> {
  const [projects, games, posts] = await Promise.all([getProjects(), getGames(), getPosts()]);
  const featured = projects.find((p) => p.featured && p.cover) ?? projects.find((p) => p.featured);
  const featuredGame = games.find((g) => g.featured) ?? games[0];
  const latest = posts[0];

  return [
    {
      title: "Games",
      url: "/games",
      more: "Every build",
      children: games.slice(0, 6).map((g) => ({
        title: g.title,
        description: g.tagline,
        url: `/games/${g.slug}`,
        thumb: g.cover.src,
        tags: [g.engine, g.status],
      })),
      feature: featuredGame && {
        eyebrow: "Play it",
        title: featuredGame.tagline,
        cta: `Open ${featuredGame.title}`,
        url: `/games/${featuredGame.slug}`,
        image: featuredGame.cover.src,
      },
    },
    {
      title: "Work",
      url: "/work",
      more: "See every project",
      children: projects.slice(0, 6).map((p) => ({
        title: p.title,
        description: [p.sector, p.year].filter(Boolean).join(" · "),
        url: `/work/${p.slug}`,
        // initials, not a running number
        tile: p.title.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase(),
        tags: p.skills.slice(0, 2),
      })),
      feature: featured && {
        eyebrow: "Featured build",
        title: featured.title,
        cta: "See how it was built",
        url: `/work/${featured.slug}`,
        image: featured.cover?.src,
      },
    },
    {
      title: "Blog",
      url: "/blog",
      more: "All writing",
      children: posts.slice(0, 6).map((post) => ({
        title: post.title,
        description: post.excerpt,
        url: `/blog/${post.slug}`,
        tile: formatDate(post.date).split(" ").slice(0, 2).join(" "),
      })),
      feature: latest && {
        eyebrow: "Latest note",
        title: latest.title,
        cta: "Read it",
        url: `/blog/${latest.slug}`,
        image: latest.cover?.src,
      },
    },
    {
      title: "About",
      url: "/skills",
      children: [
        { title: "Skills", description: "Unlocked by shipping, not by rating", url: "/skills", icon: "layers" },
        { title: "Now", description: "VR and the RCAAS.tech studio", url: "/#now", icon: "live" },
        { title: "About me", description: "Where games, the web and maps meet", url: "/#about", icon: "user" },
        { title: "Gallery", description: "Scenes from the field", url: "/gallery", icon: "image" },
        { title: "FAQ", description: "Quick answers", url: "/#faq", icon: "help" },
        { title: "Contact", description: "Tell me what you are building", url: "/contact", icon: "mail" },
      ],
      feature: {
        eyebrow: "Open for work",
        title: "Games, and the tools and web behind them — let's build one.",
        cta: "Start a conversation",
        url: "/contact",
      },
    },
  ];
}

export const metadata: Metadata = {
  // makes every relative url below (og images, canonicals) resolve absolutely
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    // child pages set only their own name; the suffix is added here
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  applicationName: siteName,
  authors: [{ name: author.name, url: siteUrl }],
  creator: author.name,
  publisher: author.name,
  alternates: {
    canonical: "/",
  },
  category: "technology",
  openGraph: {
    type: "website",
    siteName,
    title: siteTitle,
    description: siteDescription,
    url: "/",
    locale: siteLocale,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // phone numbers and addresses should not be auto-linked by safari
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#07080d" },
  ],
  colorScheme: "light dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full w-full antialiased",
        geist.variable,
        geistMono.variable
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* motion renders its start state inline, so without javascript
            these elements would never be revealed */}
        <noscript>
          <style>{`[data-motion]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body id="top" className="w-full overflow-x-hidden">
        {/* structured data: who runs this site, and what the site is */}
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />

        <Loader />
        <MotionProvider>
          <Cursor />
          <Navbar links={await navLinks()} />
          <ScrollRail />
          {/* the bar floats; this keeps page content clear of it. the home
              hero pulls itself back up underneath to run full-bleed */}
          <div aria-hidden="true" className="h-(--nav-h)" />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}

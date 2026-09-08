import type { Metadata, Viewport } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import MotionProvider from "@/components/motion/MotionProvider";
import Cursor from "@/components/motion/Cursor";
import Loader from "@/components/motion/Loader";
import { Geist, Geist_Mono } from "next/font/google";
import JsonLd from "@/components/seo/JsonLd";
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

// runs before paint so the saved theme is applied without a flash
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (t === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.classList.add('js');
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();
`;

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
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full w-full antialiased", geist.variable, geistMono.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* motion renders its start state inline, so without javascript
            these elements would never be revealed */}
        <noscript>
          <style>{`[data-motion]{opacity:1!important;transform:none!important}[data-loader]{display:none!important}`}</style>
        </noscript>
      </head>
      <body id="top" className="w-full overflow-x-hidden">
        {/* structured data: who runs this site, and what the site is */}
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />

        <MotionProvider>
          <Loader />
          <Cursor />
          <Navbar />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}

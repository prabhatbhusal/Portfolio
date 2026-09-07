import type { Metadata } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { Geist, Geist_Mono } from "next/font/google";

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
  title: "Prabhat Bhusal | Full-stack Developer & Geomatics Engineer",
  description:
    "Portfolio of Prabhat Bhusal — full-stack developer and Geomatics Engineer building web applications with React, Next.js, Django and spatial data.",
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
      </head>
      <body id="top" className="w-full overflow-x-hidden">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

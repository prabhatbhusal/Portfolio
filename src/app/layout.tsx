import type { Metadata } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { Syne, DM_Mono } from 'next/font/google';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-syne',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: "Home | Portfolio",
  description: "Developer Portfolio of Prabhat Bhusal, a full-stack developer and machine learning enthusiast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased w-full", syne.variable, dmMono.variable)}
    >
      <body className="bg-black text-white overflow-x-hidden  w-full"><Navbar/>{children}<Footer/></body>
    </html>
  );
}

import React from "react";

import Hero from "@/components/landing/Hero";
import Statement from "@/components/landing/Statement";
import Build from "@/components/landing/Build";
import Now from "@/components/landing/Now";
import Disciplines from "@/components/landing/Disciplines";
import Services from "@/components/landing/Services";
import Work from "@/components/landing/Work";
import Games from "@/components/landing/Games";
import Skills from "@/components/landing/Skills";
import About from "@/components/landing/About";
import Faq from "@/components/landing/Faq";
import Testimonials from "@/components/landing/Testimonials";
import Contact from "@/components/landing/Contact";
import Ticker from "@/components/landing/Ticker";

/* games lead: the build scene, what is on the bench now, then the games
   themselves, then the rest.
   every <section id> here shows up on the scroll rail by itself */
export default function Home() {
  return (
    <main>
      <Hero />
      <Statement />
      <Build />
      <Now />
      <Games />
      <Disciplines />
      <Work />
      <Services />
      <Skills />
      <About />
      <Faq />
      <Testimonials />
      <Ticker />
      <Contact />
    </main>
  );
}

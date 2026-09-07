import React from 'react';
import Hero from '@/components/landing/Hero';
import Disciplines from '@/components/landing/Disciplines';
import Services from '@/components/landing/Services';
import Process from '@/components/landing/Process';
import Work from '@/components/landing/Work';
import Skills from '@/components/landing/Skills';
import About from '@/components/landing/About';
import Faq from '@/components/landing/Faq';
import Contact from '@/components/landing/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Disciplines />
      <Services />
      <Work />
      <Process />
      <Skills />
      <About />
      <Faq />
      <Contact />
    </main>
  );
}

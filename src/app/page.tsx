import React from 'react';
import Hero from '@/components/landing/Hero';
import Disciplines from '@/components/landing/Disciplines';
import Services from '@/components/landing/Services';
import Work from '@/components/landing/Work';
import Games from '@/components/landing/Games';
import Skills from '@/components/landing/Skills';
import About from '@/components/landing/About';
import Faq from '@/components/landing/Faq';
import Testimonials from '@/components/landing/Testimonials';
import Contact from '@/components/landing/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Disciplines />
      <Services />
      <Work />
      <Games />
      <Skills />
      <About />
      <Faq />
      <Testimonials />
      <Contact />
    </main>
  );
}

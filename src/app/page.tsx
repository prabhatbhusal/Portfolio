import React from 'react';
import Hero from '@/components/landing/Hero';
import Skills from '@/components/landing/Skills';
import Work from '@/components/landing/Work';
import Contact from '@/components/landing/Contact';
export default function Home() {
  return (
    <main className="">
        <Hero/>
        <Skills/>
        <Work/>
        <Contact/>
    </main>
  );
}

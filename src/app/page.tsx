import React from 'react';
import Hero from '@/components/landing/Hero';
import Skills from '@/components/landing/Skills';
import Work from '@/components/landing/Work';
import Contact from '@/components/landing/Contact';
import Headerbanner from '@/components/props/Headerbanner';
export default function Home() {
  return (
    <main className="">
      <Headerbanner header='available for work'/>
        <Hero/>
        <Skills/>
        <Work/>
        <Contact/>
    </main>
  );
}

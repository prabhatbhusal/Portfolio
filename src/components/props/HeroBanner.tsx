import React from 'react';
import Image from 'next/image'
import Headerbanner from './Headerbanner';
import Buttonbanner from './Buttonbanner';
interface prop {
  header: string
}

const Herobanner = ({ header }: prop) => {
  return (
   <section className="relative overflow-hidden px-4 sm:px-6 md:px-7 pt-15 pb-8 md:pt-25 md:pb-12 flex flex-col gap-6">
   
         
   
         {/* Available tag */}
         
   
         {/* Heading */}
         <div className="z-10">
           <h1 className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-[#e8e6e0]">
             Prabhat
           </h1>
           <h1 className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-[#EF9F27]">
             Bhusal
           </h1>
         </div>
   
         {/* Description */}
         <p className="mono text-xs sm:text-sm text-[#888780] leading-relaxed max-w-sm z-10">
           Full-stack developer + Geomatics Engineer. <br />
           Building web apps with React, Next.js, Django + spatial data.
         </p>
   
         {/* Buttons */}w
         <Buttonbanner title1='View Projects' title2='Contact me'/>
   
       </section>
  )
}

export default Herobanner
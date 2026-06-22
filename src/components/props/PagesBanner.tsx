import React from 'react';
import Image from 'next/image'
import Headerbanner from './Headerbanner';
import Buttonbanner from './Buttonbanner';
interface prop {
  title: string;

  desc:string;
}

const PagesBanner = ({ title,desc }: prop) => {
  return (
   <section className="relative overflow-hidden  flex flex-col gap-6">
   
         {/* Background topo */}
         <Image
           src="/hero-topo-bg.svg"
           alt=""
           aria-hidden="true"
           width={800}
           height={1100}
           className="absolute right-0 top-0 h-full w-auto pointer-events-none select-none"
           priority
         />
   
         {/* Available tag */}
         
   
         {/* Heading */}
         <div className="z-10">
           <h1 className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-[#e8e6e0]">
             {title}
           </h1>
           
         </div>
   
         {/* Description */}
         <p className="mono text-xs sm:text-sm text-[#888780] leading-relaxed max-w-sm z-10">
           {desc}
         </p>
   
         {/* Buttons */}
         
   
       </section>
  )
}

export default PagesBanner
import Link from "next/link";
import React from "react";



export default function Hero(){

    return (
        <section className="padding flex flex-col">

            <span className="amber flex flex-wrap items-center gap-6"><hr className="w-10 border border-[#EF9F27] mono "/> available to work</span>
            <div>
            <span className="font-extrabold text-4xl md:text-6xl xl:text-9xl">Prabhat </span><br />
            <span className="font-extrabold text-4xl md:text-6xl xl:text-9xl amber">Bhusal</span>
            </div>
            <p className="text-[12px] text-[#888780] mono ">Full-stack developer + Geomatics Engineer. <br />
Building web apps with React, Next.js, Django + spatial <br />data.</p>
            
        </section>
)
}
import React from "react";
import { skillsdata } from "../../lib/constants/data";
import Headerbanner from "../props/Headerbanner";

const Skills = () => {
  return (
    <>
      <hr className="w-full border-bg" />

      {/* This pulls your clean, symmetric 1.25rem (px-5) px-4 sm:px-6 md:px-7 py-8 md:py-10 space */}
      <section className="px-4 sm:px-6 md:px-7 py-8 md:py-10">
        <Headerbanner header="Skills" />

        {/* FIX: Changing grid-cols-4 to grid-cols-1 on mobile, 
                  cols-2 on tablet, and cols-4 on desktop allows the grid 
                  to scale organically to fill the left-to-right boundaries 
                  identically to your design mock.
                */}
        <div className="grid grid-cols-4 gap-5 rounded-2xl h-full w-full">
          {skillsdata.map((item, index) => (
            <div className="border rounded-sm p-3 bg-white/8" key={index}>
              <h1 className="amber mb-3">{item.title}</h1>

              {/* Inner skills tags array */}
              <div className="" key={index}>
                

                <div className="grid grid-cols-3 gap-2">
                  {item.stack.map((skill, idx) => (
                    <span
                      className="border rounded px-3 py-1 text-sm amber flex opacity-80 amber-bg borderbg items-center justify-center"
                      key={idx}
                    >
                      {skill.lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Skills;

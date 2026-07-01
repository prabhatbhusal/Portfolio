import React from "react";
import { skillsdata } from "../../lib/constants/data";
import Headerbanner from "../props/Headerbanner";

const Skills = () => {
  return (
    <>
      <hr className="w-full border-bg" />

      <section className="px-4 sm:px-6 md:px-7 py-8 md:py-10">
        <Headerbanner header="Skills" />

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

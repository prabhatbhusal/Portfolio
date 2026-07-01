import React from "react";
import Headerbanner from "../props/Headerbanner";
import { ProjectData } from "@/lib/constants/data";
const Work =()=>{
    return (
      <>
        <hr className="w-full    border-bg " />
        <section className="px-4 sm:px-6 md:px-7 py-8 md:py-10">
          <Headerbanner header="Projects" />
          <div className="grid grid-cols-2 gap-10 rounded-2xl h-full w-full">
            {ProjectData.map((item, idx) => (
              <div
                className="border rounded-md borderbg greybg px-7 py-5 "
                key={idx}
              >
                <span className="text-xs mono  greytext ">{item.stack}</span>
                <h2 className=" font-bold  amber">{item.title}</h2>
                <p className="greytext mono text-xs">{item.description}</p>
                <div className="py-5 flex gap-2">
                  <span className="borderbg greytext px-5 py-1 mono text-sm rounded-sm">
                    {item.skills1}
                  </span>
                  <span className="borderbg greytext px-5 py-1 mono text-sm rounded-sm">
                    {item.skills2}
                  </span>
                  <span className="borderbg greytext px-5 py-1 mono text-sm rounded-sm">
                    {item.skills3}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
}
export default Work;
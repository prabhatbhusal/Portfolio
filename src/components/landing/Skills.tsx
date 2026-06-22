import React from "react";
import { skillsdata } from '../../lib/constants/data';
import Headerbanner from "../props/Headerbanner";


const Skills = () => {
    return (
        //SKILLS
        <>
            <hr className="w-full    border-bg " />

            <section className="container">
                <Headerbanner header='Skills'/>
                <div className="grid grid-cols-3 gap-5  rounded-2xl h-full w-full  ">
                    {skillsdata.map((item, index) => (
                        <div className="border rounded-sm p-5 bg-white/8  "  key={index}>
                            <h1 className="amber">{item.title}</h1>
                            <div className="grid grid-cols-3 gap-2  items-center justify-center border-bg ">
                                {item.stack.map((items, idx) =>
                                    (<span className='border rounded p-.5 text-sm amber  flex opacity-80 amber-bg borderbg items-center  justify-center ' key={idx}>{items.lang}</span>))
                                }

                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
export default Skills
import React from "react";
import { skillsdata } from '../../lib/constants/data';
import Headerbanner from "../props/Headerbanner";


const Skills = () => {
    return (
        //SKILLS
        <>
            <hr className="w-full    border-bg " />

            <section className="px-4 sm:px-6 md:px-7 pt-10 pb-8 md:pt-14 md:pb-12 ">
                <Headerbanner header='Skills'/>
                <div className="grid grid-cols-3 gap-2 rounded-2xl h-full w-full  ">
                    {skillsdata.map((item, index) => (
                        <div className="border rounded-2xl p-5" key={index}>
                            <h1>{item.title}</h1>
                            <div className="grid grid-cols-3 gap-2 items-center justify-center border-bg ">
                                {item.stack.map((items, idx) =>
                                    (<span className='border rounded-md p-1 items-center justify-center text-[##888780]' key={idx}>{items.lang}</span>))
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
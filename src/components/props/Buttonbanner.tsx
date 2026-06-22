import React from 'react'
interface buttonsprops{
    title1:string;
    title2:string;
}
const Buttonbanner = ({title1,title2}:buttonsprops) => {
  return (
        /**Buttons */

         <div className="flex items-center gap-3 z-10">
           <button className="mono text-xs bg-[#EF9F27] font-bold text-[#1a0e00] hover:scale-110 hover:transition hover:ease-in-out hover:duration-500 px-5 py-2.5  rounded-lg ">
             {title1}
           </button>
           <button className="mono text-xs border font-bold border-[#888780] text-[#e8e6e0] px-5 py-2.5 rounded-lg hover:scale-110 hover:transition hover:ease-in-out hover:duration-500">
             {title2}
           </button>
         </div>
  )
}

export default Buttonbanner
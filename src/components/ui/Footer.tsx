import React from 'react';

const Footer=()=>{
    return (
        <footer  className=' fixed bottom-0 overflow-x-hidden padding mono text-sm flex flex-col  w-full  '>
            <div><hr className="w-full  border border-white" /></div>
        
        <div className='flex  justify-between  w-full --font-dm-mono'>
            <div className='flex  justify-between  w-full '>
                <h1 className='flex gap-2 justify-center items-center'>Built by <span className='text-[#EF9F27] font-bold'>Prabhat Bhusal</span> 2026</h1>
                <h2 className='flex justify-center items-center '> <span  className='items-center justify-center flex'>.</span>open to opportunities</h2>
            </div>
            
        </div>
        </footer>

    )
}
export default Footer;
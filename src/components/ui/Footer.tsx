import React from 'react';

const Footer = () => {
    return (
        <footer className=' fixed bottom-0 overflow-x-hidden padding mono text-sm flex flex-col  w-full  '>
            <div>
                <hr className="w-full  border-light border-white " /></div>

            <div className='flex  justify-between  w-full --font-dm-mono pt-1'>
                <div className='flex  justify-between  w-full '>
                    <h1 className='flex gap-2 justify-center items-center'>Built by
                        <span className='text-[#EF9F27] font-bold'>Prabhat Bhusal</span> 2026</h1>
                    <h2 className='flex justify-center items-center flex-wrap gap-2 text-[#5DCAA5]'> 
                    <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5DCAA5] opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-[#5DCAA5]"></span>
                    </span>open to opportunities</h2>
                </div>

            </div>
        </footer>

    )
}
export default Footer;
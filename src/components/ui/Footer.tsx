import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <>

        <footer className='  bg-black overflow-hidden px-4 over mono text-sm flex flex-col w-full'>
            <div className='flex  justify-between    w-full --font-dm-mono '>
                <div className='flex  justify-between  w-full '>
                    <Link href='/' className='font-extrabold mono hover:transition amber hover:ease-in-out hover:duration-500 hover:white'>{'<'}<span className='font-extrabold text-white mono amber hover:text-amber py-5'>pb</span>{'/>'} 2026</Link>
                    <h2 className='flex justify-center animate-pulse items-center flex-wrap gap-2 text-[#5DCAA5]'> 
                    <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5DCAA5] opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-[#5DCAA5]"></span>
                    </span >open to opportunities</h2>
                </div>

            </div>
        </footer>
        </>

    )
}
export default Footer;
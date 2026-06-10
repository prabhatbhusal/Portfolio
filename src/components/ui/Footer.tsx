import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <>

        <footer className='fixed bottom-0 left-0 z-50 bg-black overflow-x-hidden mono text-sm flex flex-col w-full'>
            <hr className="w-full   py-2 border-[#888780] " />
            
            <div className='flex  justify-between padding   w-full --font-dm-mono pt-1'>
                <div className='flex  justify-between  w-full '>
                    <Link href='/' className='font-extrabold mono hover:transition hover:ease-in-out hover:duration-500 hover:amber'>pb<span className='font-extrabold mono amber hover:text-white py-5'>.</span>dev 2026</Link>
                    <h2 className='flex justify-center items-center flex-wrap gap-2 text-[#5DCAA5]'> 
                    <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5DCAA5] opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-[#5DCAA5]"></span>
                    </span>open to opportunities</h2>
                </div>

            </div>
        </footer>
        </>

    )
}
export default Footer;
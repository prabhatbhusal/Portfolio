import Link from 'next/link'
import { NavLinks } from '@/lib/constants/data'

import { Download } from 'lucide-react'
import { Button } from './button'


const Navbar = () => {
  return (
    <nav className='flex justify-between items-center py-5 padding'>
      <div>
        <Link href='/' className='font-extrabold mono'>pb<span className='font-extrabold mono amber py-5'>.</span>dev</Link>
      </div>
      <div >{
        NavLinks.map((item, key) => (
          <Link href={item.url} className='px-5 hover:text-[#EF9F27] transition-all mono text-sm' key={key}>{item.title}</Link>
        ))
      }

      </div>
      <div>

        <Link
          href="/Prabhat_Bhusal_Resume.pdf"
          download
          className="font-semibold mono  flex justify-center items-center flex-wrap border-2 rounded-lg p-2 hover:transition-all hover:ease-in-out hover:bg-white hover:duration-500 hover:text-black"
        >
            Resume 
          <Download size={24} strokeWidth={1} />
        </Link>
      </div>

    </nav>
  )
}

export default Navbar
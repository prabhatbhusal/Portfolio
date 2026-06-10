import Link from 'next/link'
import { NavLinks } from '@/lib/constants/data'

import { Download } from 'lucide-react'
import { Button } from './button'


const Navbar = () => {
  return (
    <nav className='flex justify-between py-5'>
      <div>
        <Link href='/' className='font-extrabold'>pb<span className='font-extrabold --font-syre amber py-5'>.</span>dev</Link>
      </div>
      <div >{
        NavLinks.map((item, key) => (
          <Link href={item.url} className='px-5 hover:text-[#EF9F27] transition-all' key={key}>{item.title}</Link>
        ))
      }

      </div>
      <div>
        <Link
          href="/Prabhat_Bhusal_Resume.pdf"
          download
          className="font-extrabold flex justify-center items-center flex-wrap border-2 rounded-lg p-2 hover:transition-all hover:ease-in-out hover:bg-amber-50 hover:duration-500 hover:text-black"
        >
           <Button> Resume</Button> 
          <Download size={27} strokeWidth={3} />
        </Link>
      </div>

    </nav>
  )
}

export default Navbar
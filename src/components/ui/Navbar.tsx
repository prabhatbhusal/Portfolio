import Link from 'next/link'
import { NavLinks } from '@/lib/constants/data'

import { Download } from 'lucide-react'



const Navbar = () => {
  return (
    <nav className="flex justify-between fixed top-0 left-0 z-50 w-full bg-black overflow-auto items-center padding">
      <div>
        <Link
          href="/"
          className="font-extrabold mono amber hover:transition hover:ease-in-out hover:duration-500 hover:text-white"
        >
          {"<"}
          <span className="font-extrabold mono text-white hover:text-amber py-5">
            pb
          </span>
          {"/>"}
        </Link>
      </div>
      <div>
        {NavLinks.map((item, key) => (
          <Link
            href={item.url}
            className="px-5 hover:text-[#EF9F27]  text-[#888780] hover:transition hover:ease-in-out hover:duration-500 mono text-sm"
            key={key}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div>
        <Link
          href="/Prabhat_Bhusal_Resume.pdf"
          download
          className="font-semibold mono amberbg  text-black flex justify-center items-center flex-wrap border  rounded-lg p-2 hover:transition-all hover:ease-in-out  hover:duration-500"
        >
          Resume
          <Download size={24} strokeWidth={1} />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar
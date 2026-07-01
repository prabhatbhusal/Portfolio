"use client";
import Link from "next/link";
import { NavLinks } from "@/lib/constants/data";
import { useState } from "react";

import { Download } from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-5 right-5 z-[60] text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <RxCross1 size={24} /> : <RxHamburgerMenu size={24} />}
      </button>

      <nav
        className={`flex flex-col fixed top-0 left-0 transition-transform duration-500 ease-in-out z-50 w-full h-screen bg-black overflow-auto items-center justify-center padding md:h-auto md:static md:flex-row md:justify-between md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <Link
            href="/"
            className="font-extrabold mono amber hover:transition hover:ease-in-out hover:duration-500 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            {"<"}
            <span className="font-extrabold mono text-white hover:text-amber py-5">
              pb
            </span>
            {"/>"}
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center">
          {NavLinks.map((item, key) => (
            <Link
              href={item.url}
              className="px-5 py-2 hover:text-[#EF9F27] text-[#888780] hover:transition hover:ease-in-out hover:duration-500 mono text-sm"
              key={key}
              onClick={() => setIsOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div>
          <Link
            href="/Prabhat_Bhusal_Resume.pdf"
            download
            className="font-semibold mono amberbg text-black flex justify-center items-center flex-wrap  rounded-lg p-2 hover:transition-all hover:ease-in-out hover:duration-500"
            onClick={() => setIsOpen(false)}
          >
            Resume
            <Download size={24} strokeWidth={1} />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

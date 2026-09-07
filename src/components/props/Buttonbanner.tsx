import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface buttonsprops {
  title1: string;
  title2: string;
  href1?: string;
  href2?: string;
}

const Buttonbanner = ({
  title1,
  title2,
  href1 = "/work",
  href2 = "/contact",
}: buttonsprops) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={href1}
        className="btn-solid group inline-flex h-11 items-center gap-2.5 rounded-full px-5 text-[14px] font-semibold"
      >
        {title1}
        <ArrowRight
          size={16}
          strokeWidth={2.5}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </Link>

      <Link
        href={href2}
        className="btn-quiet inline-flex h-11 items-center rounded-full px-5 text-[14px] font-semibold"
      >
        {title2}
      </Link>
    </div>
  );
};

export default Buttonbanner;

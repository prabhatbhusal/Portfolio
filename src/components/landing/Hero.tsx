import Image from 'next/image'

const Hero = () => {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 md:px-7 pt-10 pb-8 md:pt-14 md:pb-12 flex flex-col gap-6">

      {/* Background topo */}
      <Image
        src="/hero-topo-bg.svg"
        alt=""
        aria-hidden="true"
        width={800}
        height={1100}
        className="absolute right-0 top-0 h-full w-auto pointer-events-none select-none"
        priority
      />

      {/* Available tag */}
      <span className="flex items-center gap-3 mono text-[11px] text-[#EF9F27] tracking-widest uppercase z-10">
        <hr className="w-6 border border-[#EF9F27]" />
        available to work
      </span>

      {/* Heading */}
      <div className="z-10">
        <h1 className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-[#e8e6e0]">
          Prabhat
        </h1>
        <h1 className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-[#EF9F27]">
          Bhusal
        </h1>
      </div>

      {/* Description */}
      <p className="mono text-xs sm:text-sm text-[#888780] leading-relaxed max-w-sm z-10">
        Full-stack developer + Geomatics Engineer. <br />
        Building web apps with React, Next.js, Django + spatial data.
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-3 z-10">
        <button className="mono text-xs bg-[#EF9F27] font-bold text-[#1a0e00] hover:scale-110 hover:transition hover:ease-in-out hover:duration-500 px-5 py-2.5  rounded-lg ">
          view projects →
        </button>
        <button className="mono text-xs border font-bold border-[#888780] text-[#e8e6e0] px-5 py-2.5 rounded-lg hover:scale-110 hover:transition hover:ease-in-out hover:duration-500">
          contact me
        </button>
      </div>

    </section>
  )
}

export default Hero
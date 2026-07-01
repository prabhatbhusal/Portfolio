import { workprojects } from '@/lib/constants/data';
import { Link } from 'lucide-react';
import React from 'react'

const Projects = () => {
  return (
    <>
        <hr className="w-full border-bg" />
      <div className="flex flex-col gap-3 md:gap-4 mt-6">
        {workprojects.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 md:p-6 bg-[#161616] transition-colors hover:border-[#EF9F27]/40
                ${
                  item.featured ? "border-[#EF9F27]/30" : "border-white/[0.08]"
                }`}
          >
            {/* Top row — index + badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="font-mono text-[10px] text-[#888780]">
                {item.index}
              </span>
              <span className="font-mono text-[10px] text-[#888780]">
                {item.stack} · {item.sector}
              </span>

              {item.featured && (
                <span className="font-mono text-[10px] bg-[#EF9F27]/10 text-[#EF9F27] border border-[#EF9F27]/25 px-2 py-0.5 rounded">
                  featured
                </span>
              )}

              <span className="font-mono text-[10px] bg-[#161616] text-[#888780] border border-white/[0.08] px-2 py-0.5 rounded">
                {item.badge}
              </span>
            </div>

            {/* Title + description + links */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="font-syne font-bold text-base md:text-lg text-[#e8e6e0] tracking-tight mb-2">
                  {item.title}
                </h2>
                <p className="font-mono text-xs text-[#888780] leading-relaxed mb-4 max-w-xl">
                  {item.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] border border-white/[0.08] bg-[#1e1e1e] text-[#888780] px-3 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2 items-end flex-shrink-0">
                {item.live && (
                  <Link
                    href={item.live}
                    target="_blank"
                    className="font-mono text-xs text-[#EF9F27] hover:underline whitespace-nowrap"
                  >
                    live ↗
                  </Link>
                )}
                {item.github && (
                  <Link
                    href={item.github}
                    target="_blank"
                    className="font-mono text-xs text-[#888780] hover:text-[#e8e6e0] transition-colors whitespace-nowrap"
                  >
                    github ↗
                  </Link>
                )}
                {!item.live && !item.github && (
                  <span className="font-mono text-[10px] text-[#888780]">
                    coming soon
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Projects

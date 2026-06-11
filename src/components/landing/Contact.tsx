// components/features/contact/ContactList.tsx
import Link from 'next/link'
import { contactdata } from '@/lib/constants/data'
import Headerbanner from '../props/Headerbanner'

const Contact = () => {
  return (
    <>
    <hr />
    
    <section className='container '>
        
    <Headerbanner header='Contacts' />
    <div className="grid grid-cols-2 gap-3 ">
        
      {contactdata.map((item) => {
          const Icon = item.icon          // ← capitalise to use as component
          
        return (
          <Link
            key={item.id}
            href={item.url}
            className="flex items-center gap-3 bg-[#161616] border border-white/8 rounded-xl p-4 hover:border-[#EF9F27]/40 transition-colors"
          >
            {/* Icon box */}
            <div className="w-9 h-9 rounded-lg bg-[#EF9F27]/10 border border-[#EF9F27]/20 flex items-center justify-center shrink-0">
              <Icon size={16} strokeWidth={1.5} className="text-[#EF9F27]" />
            </div>

            {/* Text */}
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[10px] text-[#888780]">
                {item.label}
              </span>
              <span className="font-mono text-xs text-[#e8e6e0] truncate">
                {item.value}
              </span>
            </div>

            {/* Arrow */}
            <span className="font-mono text-sm text-[#888780] ml-auto">
              ↗
            </span>
          </Link>
        )
      })}
    </div>
        </section>
    </>
          
  )
}

export default Contact
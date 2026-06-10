interface prop {
  header: string
}

const Headerbanner = ({ header }: prop) => {
  return (
    <span className="flex items-center gap-3 mono text-[11px] amber pb-5 tracking-widest uppercase z-10">
      <hr className="w-10 border border-[#EF9F27]" />
      {header}
    </span>
  )
}

export default Headerbanner
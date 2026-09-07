interface prop {
  header: string;
}

const Headerbanner = ({ header }: prop) => {
  return (
    <span className="chip inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 mono text-[10px] uppercase tracking-[0.18em] text-brand-ink">
      <span className="size-1.5 rounded-full bg-brand" />
      {header}
    </span>
  );
};

export default Headerbanner;

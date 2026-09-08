import React from "react";

export interface Fact {
  id: number;
  label: string;
  value: string;
}

interface prop {
  facts: Fact[];
  /* columns on desktop — work pages run four, games run five */
  className?: string;
}

/** the label/value strip used on every detail page */
const FactGrid = ({ facts, className = "md:grid-cols-4" }: prop) => (
  <dl
    className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line ${className}`}
  >
    {facts.map((fact) => (
      <div key={fact.id} className="bg-canvas px-5 py-5">
        <dt className="mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
          {fact.label}
        </dt>
        <dd className="mt-2 text-[14px] font-semibold text-ink">{fact.value}</dd>
      </div>
    ))}
  </dl>
);

export default FactGrid;

"use client";

import { useEffect, useRef } from "react";

// Kathmandu runs at UTC+5:45, which Intl knows about and hand-rolled
// offset maths usually gets wrong
function kathmanduTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

const LocalTime = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLTimeElement>(null);

  // written straight to the node, so the clock never re-renders the page
  useEffect(() => {
    const tick = () => {
      if (ref.current) ref.current.textContent = kathmanduTime();
    };

    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <time ref={ref} suppressHydrationWarning className={className}>
      {kathmanduTime()}
    </time>
  );
};

export default LocalTime;

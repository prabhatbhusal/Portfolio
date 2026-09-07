"use client";

import React from "react";
import { smoothScrollTo } from "./scroll";

interface Props {
  /* a css selector, or "top" */
  to: string;
  href: string;
  className?: string;
  "aria-label"?: string;
  children: React.ReactNode;
}

/* still a real anchor, so it works with no javascript and keeps its
   keyboard and right-click behaviour */
const ScrollLink = ({ to, href, children, ...rest }: Props) => (
  <a
    href={href}
    onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      smoothScrollTo(to);
      history.replaceState(null, "", href);
    }}
    {...rest}
  >
    {children}
  </a>
);

export default ScrollLink;

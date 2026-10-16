"use client";

import React from "react";
import { smoothScrollTo } from "./scroll";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  /* a css selector, or "top" */
  to: string;
  href: string;
  [data: `data-${string}`]: string | undefined;
};

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

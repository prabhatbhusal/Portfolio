"use client";

import React from "react";
import { motion, type Transition, type Variants } from "motion/react";

/* the same curve the css animations use, so motion-driven and css-driven
   movement on the page read as one system */
export const ease = [0.22, 0.7, 0.25, 1] as const;

/* cards lift on hover. this used to be `.lift` in css — motion owns the
   transform now so the two never fight over the same property */
export const hoverLift = { y: -6, scale: 1.01 } as const;

const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 22,
  mass: 0.6,
};

interface Common {
  children: React.ReactNode;
  className?: string;
  /* milliseconds, keeping the api the old css-variable version had */
  delay?: number;
}

/* ------------------------------------------------------------------ *
 * Reveal — fade + rise as the element scrolls into view
 * ------------------------------------------------------------------ */

interface RevealProps extends Common {
  y?: number;
  duration?: number;
  /* how much of the element has to be visible before it fires */
  amount?: number;
  once?: boolean;
}

export const Reveal = ({
  children,
  className = "",
  delay = 0,
  y = 24,
  duration = 0.8,
  amount = 0.2,
  once = true,
}: RevealProps) => (
  <motion.div
    data-motion=""
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, amount }}
    transition={{ duration, delay: delay / 1000, ease }}
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------------ *
 * Stagger — a grid or list whose children arrive one after another
 * ------------------------------------------------------------------ */

interface StaggerProps extends Common {
  /* seconds between each child */
  stagger?: number;
  amount?: number;
  once?: boolean;
  /* above the fold: run on mount instead of waiting for the viewport */
  immediate?: boolean;
}

export const Stagger = ({
  children,
  className = "",
  delay = 0,
  stagger = 0.08,
  amount = 0.15,
  once = true,
  immediate = false,
}: StaggerProps) => {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay / 1000 },
    },
  };

  return (
    <motion.div
      data-motion=""
      className={className}
      variants={variants}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once, amount } })}
    >
      {children}
    </motion.div>
  );
};

/* a child of <Stagger>. it takes its timing from the parent, so the
   delay is never hand-counted per item */
interface StaggerItemProps extends Omit<Common, "delay"> {
  y?: number;
  duration?: number;
  /* opt in to the hover lift — for cards that link somewhere */
  hover?: boolean;
}

export const StaggerItem = ({
  children,
  className = "",
  y = 18,
  duration = 0.5,
  hover = false,
}: StaggerItemProps) => {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration, ease } },
  };

  return (
    <motion.div
      data-motion=""
      data-motion-hover={hover ? "" : undefined}
      className={className}
      variants={variants}
      {...(hover && {
        whileHover: hoverLift,
        whileTap: { scale: 0.99 },
        transition: spring,
      })}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ *
 * Lift — a hover-only card wrapper, for anything outside a Stagger
 * ------------------------------------------------------------------ */

export const Lift = ({ children, className = "" }: Omit<Common, "delay">) => (
  <motion.div
    data-motion-hover=""
    className={className}
    whileHover={hoverLift}
    whileTap={{ scale: 0.99 }}
    transition={spring}
  >
    {children}
  </motion.div>
);

export default Reveal;

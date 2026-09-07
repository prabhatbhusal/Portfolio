"use client";

import React from "react";
import { MotionConfig } from "motion/react";

/* the brief is that the motion plays on every machine, so the os
   "reduce motion" flag is deliberately not consulted. the travel
   distances are kept small (16–24px, no parallax, no big sweeps) so
   always-on stays comfortable rather than becoming the thing that flag
   exists to switch off. change to "user" here to hand the choice back */
const MotionProvider = ({ children }: { children: React.ReactNode }) => (
  <MotionConfig reducedMotion="never">{children}</MotionConfig>
);

export default MotionProvider;

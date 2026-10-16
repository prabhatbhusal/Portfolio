import React from "react";

import { disciplinesdata } from "@/lib/constants/data";
import DisciplineStack from "./DisciplineStack";

const Disciplines = () => (
  <DisciplineStack
    items={disciplinesdata.map(({ title, tagline, description, tools, model, icon: Icon }) => ({
      title,
      tagline,
      description,
      tools,
      model,
      icon: <Icon strokeWidth={1.4} />,
    }))}
  />
);

export default Disciplines;

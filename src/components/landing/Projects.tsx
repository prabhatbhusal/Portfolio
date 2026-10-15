import React from "react";

import { workprojects } from "@/lib/constants/data";
import WorkRow from "../props/WorkRow";
import { Stagger, StaggerItem } from "../motion";

const Projects = () => {
  return (
    <div className="rail py-14 md:py-20">
      <Stagger className="flex flex-col" stagger={0.06}>
        {workprojects.map((item) => (
          <StaggerItem key={item.id} y={12}>
            <WorkRow item={item} />
          </StaggerItem>
        ))}
      </Stagger>

      {/* closes the last row, so the index reads as a ruled table */}
      <div className="hairline" />
    </div>
  );
};

export default Projects;

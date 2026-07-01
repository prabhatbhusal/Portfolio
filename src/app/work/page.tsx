import Headerbanner from "@/components/props/Headerbanner";
import PagesBanner from "@/components/props/PagesBanner";
import React from "react";

const Page=()=>{
    return (
      <>
        <section className="px-4 sm:px-6 md:px-7 py-8 md:py-10">
          <Headerbanner header="Selected Projects" />
          <PagesBanner
            title="Work"
            desc="Projects I've built — full-stack, spatial, and ML"
          />
        </section>
      </>
    );

}
export default Page;
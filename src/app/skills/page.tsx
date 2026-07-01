import React from "react";
import PagesBanner from '@/components/props/PagesBanner';
import Headerbanner from '@/components/props/Headerbanner';
const Page=()=>{
    return (
      <section className="px-4 sm:px-6 md:px-7 py-8 md:py-10">
        <Headerbanner header="what I work with" />
        <PagesBanner
          title="Skills"
          desc="Technologies, tools and areas of expertise"
        />
      </section>
    );

}
export default Page;
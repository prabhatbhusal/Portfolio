import React from "react";
import PagesBanner from '@/components/props/PagesBanner';
import Headerbanner from '@/components/props/Headerbanner';
const Page=()=>{
    return(
        <section className="container">
        <Headerbanner header='what I work with'/>
        <PagesBanner title='Skills' desc="Projects I've built — full-stack, spatial, and ML"/>
        
        </section>
    )

}
export default Page;
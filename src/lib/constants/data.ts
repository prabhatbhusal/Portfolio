import { navbar } from "@/@types/navbar.types";
import { heroData, SkillsData } from "@/@types/common.types";
export const NavLinks: navbar[] = [
  { id: 1, title: "work", url: "/work" },
  { id: 2, title: "skills", url: "/skills" },
  { id: 3, title: "contact", url: "/contact" },
];
export const HeroData: heroData[] = [
  {
    id: 1,
    status: "available for work",
    firstName: "Prabhat",
    lastName: "Bhusal",
    description:
      "Full-stack developer + Geomatics Engineer. Building web apps with React, Next.js, Django + spatial data.",
    buttons: [
      {
        id: 1,
        text: "view projects →",
        href: "/projects",
        primary: true,
      },
      {
        id: 2,
        text: "contact me",
        href: "/contact",
        primary: false,
      },
    ],
  },
];

export const skillsdata: SkillsData[] = [
  {
    id: 1,
    title: "Frontend Stack",
    stack: [
      {
        lang: "React",
      },
      {
        lang: "HTML",
      },{
        lang: "Nextjs",
      },{
        lang: "CSS",
      },{
        lang: "Javascript",
      },{
        lang: "TailwindCSS",
      },
      {
        lang: "Typescript",
      },
      {
        lang: "Redux",
      },

    ],
  },
   {
    id: 1,
    title: "Frontend Stack",
    stack: [
      {
        lang: "React",
      },
      {
        lang: "HTML",
      },{
        lang: "Nextjs",
      },{
        lang: "CSS",
      },{
        lang: "Javascript",
      },{
        lang: "TailwindCSS",
      },
      {
        lang: "Typescript",
      },
      {
        lang: "Redux",
      },

    ],
  },
   {
    id: 1,
    title: "Frontend Stack",
    stack: [
      {
        lang: "React",
      },
      {
        lang: "HTML",
      },{
        lang: "Nextjs",
      },{
        lang: "CSS",
      },{
        lang: "Javascript",
      },{
        lang: "TailwindCSS",
      },
      {
        lang: "Typescript",
      },
      {
        lang: "Redux",
      },

    ],
  },
];
export const contactdata:ContactData[]=[{
  
}]

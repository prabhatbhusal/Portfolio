import { Mail, MapPin, FileText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";
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

export const skillsdata: SkillsData[] =[

  {
    id: 1,
    title: "Frontend Stack",
    stack: [
      {
        lang: "React",
      },
      {
        lang: "HTML",
      },
      {
        lang: "Nextjs",
      },
      {
        lang: "CSS",
      },
      {
        lang: "Javascript",
      },
      {
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
    id: 2,
    title: "Frontend Stack",
    stack: [
      {
        lang: "React",
      },
      {
        lang: "HTML",
      },
      {
        lang: "Nextjs",
      },
      {
        lang: "CSS",
      },
      {
        lang: "Javascript",
      },
      {
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
    id: 3,
    title: "Frontend Stack",
    stack: [
      {
        lang: "React",
      },
      {
        lang: "HTML",
      },
      {
        lang: "Nextjs",
      },
      {
        lang: "CSS",
      },
      {
        lang: "Javascript",
      },
      {
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
    id: 4,
    title: "Frontend Stack",
    stack: [
      {
        lang: "React",
      },
      {
        lang: "HTML",
      },
      {
        lang: "Nextjs",
      },
      {
        lang: "CSS",
      },
      {
        lang: "Javascript",
      },
      {
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


export interface ContactData {
  id: number;
  label: string;
  value: string;
  url: string;
  icon: LucideIcon | IconType; // ← accepts both types
}

export const contactdata: ContactData[] = [

  {
    id: 1,
    label: "email",
    value: "prabhat@email.com",
    url: "mailto:prabhat@email.com",
    icon: Mail,
  },
  {
    id: 2,
    label: "github",
    value: "github.com/prabhatbhusal",
    url: "https://github.com/prabhatbhusal",
    icon: FaGithub,
  },
  {
    id: 3,
    label: "linkedin",
    value: "linkedin.com/in/prabhat-bhusal",
    url: "https://linkedin.com/in/prabhat-bhusal",
    icon: FaLinkedin,
  },
  {
    id: 4,
    label: "research",
    value: "ResearchGate — LiDAR thesis",
    url: "https://researchgate.net",
    icon: FileText,
  },
  {
    id: 5,
    label: "location",
    value: "Kathmandu, Nepal",
    url: "#",
    icon: MapPin,
  },
]


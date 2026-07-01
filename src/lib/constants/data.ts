import { Mail, MapPin, FileText,PhoneCallIcon } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";
import { navbar } from "@/@types/navbar.types";
import { heroData, SkillsData,Projectsdata } from "@/@types/common.types";


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
    title: "Frontend ",
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
    title: "Backend ",
    stack: [
      {
        lang: "Django",
      },
      {
        lang: "Django REST",
      },
      {
        lang: "JWT Auth",
      },
      {
        lang: "PostgreSQL",
      },
      {
        lang: "Rest API",
      },
      {
        lang: "Docker",
      },
    ],
  },
  {
    id: 3,
    title: "Geospatial",
    stack: [
      {
        lang: "PostGIS",
      },
      {
        lang: "Leaflet",
      },
      {
        lang: "ArcGIS",
      },
      {
        lang: "GIS Analysis",
      },
    ],
  },
  {
    id: 4,
    title: "Game Development",
    stack: [
      {
        lang: "Unity",
      },
      {
        lang: "Unreal Engine",
      },
      {
        lang: "Game Design",
      },
      {
        lang: "Level Design",
      },
      {
        lang: "C#",
      },
      {
        lang: "C++",
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
    value: "prabhatbhusal777@gmail.com",
    url: "mailto:prabhatbhusal777@gmail.com",
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
    url: "https://www.linkedin.com/in/prabhat-bhusal-302672322/",
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
  {
    id: 6,
    label: "Phone",
    value: "+977 9840177176",
    url: "tel:+9779840177176",
    icon: PhoneCallIcon,
  },
];

export const ProjectData: Projectsdata[] = [
  {
    id: 1,
    stack: "Full Stack",
    title: "Food Delivery WebGIS APP",
    description:
      "Real-time delivery position tracking using React, Django REST, PostGIS spatial queries and Leaflet maps.",
    skills1: "React",
    skills2: "Django",
    skills3: "PostGIS",
  },
  {
    id: 2,
    stack: "Url Shortener",
    title: "Url Shortener APP",
    description:
      "A simple and efficient URL shortening service built with React and Django.",
    skills1: "React",
    skills2: "Django",
    skills3: "PostgreSQL",
  },
  {
    id: 3,
    stack: "Full Stack",
    title: "Food Delivery WebGIS APP",
    description:
      "Real-time delivery position tracking using React, Django REST, PostGIS spatial queries and Leaflet maps.",
    skills1: "React",
    skills2: "Django",
    skills3: "Rest API",
  },
];


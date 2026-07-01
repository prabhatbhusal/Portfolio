interface Button {
  id: number;
  text: string;
  href: string;
  primary: boolean;
}

export interface heroData {
  id: number;
  status: string;
  firstName: string;
  lastName: string;
  description: string;
  buttons: Button[];
}
export interface SkillsData {
  id: number;
  title: string;
  stack: Stack[];
}
interface Stack {
  lang: string;
}

export interface Projectsdata {
  id: number;
  stack: string;
  title: string;
  description: string;
  skills1: string;
  skills2: string;
  skills3: string;
}
export interface workdata{
  id: number
  index: string
  stack: string
  sector: string
  badge: string
  featured: boolean
  title: string
  description: string
  skills: string[]       // ← array instead of skills1, skills2, skills3
  github: string
  live: string | null ;}

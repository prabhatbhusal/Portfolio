import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

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
  blurb?: string;
  icon?: LucideIcon | IconType;
  stack: Stack[];
}
interface Stack {
  lang: string;
}

export interface ProcessStep {
  id: number;
  step: string;
  title: string;
  description: string;
  icon: LucideIcon | IconType;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface TechItem {
  id: number;
  name: string;
  icon: LucideIcon | IconType;
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
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readingTime: string;
  body: string[];
}

export interface DisciplineItem {
  id: number;
  title: string;
  tagline: string;
  description: string;
  tools: string[];
  icon: LucideIcon | IconType;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  deliverables: string[];
  icon: LucideIcon | IconType;
}

export interface GalleryItem {
  id: number;
  slug: string;
  title: string;
  location: string;
  date: string;
  src: string;
  width: number;
  height: number;
}

export interface workdata{
  id: number
  slug: string
  year?: string
  role?: string
  highlights?: string[]
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

import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

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

export interface DisciplineItem {
  id: number;
  title: string;
  tagline: string;
  description: string;
  tools: string[];
  icon: LucideIcon | IconType;
  /** the object the disciplines turntable brings round for it */
  model: "d20" | "code" | "globe";
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
  image: GameShot;
}

export interface WorkProject {
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
  skills: string[]
  github: string | null
  live: string | null;
  /* optional — shown in the navbar's work panel and on the detail page */
  cover?: GameShot;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  /* their job title, e.g. "Managing Director" — omit if you do not know it */
  role?: string;
  /* the organisation they are speaking for */
  company: string;
  companyUrl?: string;
  /* where they are, shown after the company */
  location?: string;
  /* slug of the workprojects entry this quote is about, so the card can
     link through to the work itself */
  projectSlug?: string;
  /* when they said it, e.g. "2025" */
  date?: string;
  /* headshot in /public, e.g. "/clients/saurav.jpg". without one the
     card falls back to the initials taken from the name */
  image?: string;
  /* only needed when the initials from the name read badly */
  initials?: string;
}

/* one screenshot or cover — the same shape the next/image props expect,
   so a frame component can spread it straight through */
export interface GameShot {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface GameItem {
  id: number;
  slug: string;
  title: string;
  /* one line under the title, on the card and on the detail page */
  tagline: string;
  description: string;
  engine: "Unity" | "Unreal Engine";
  platforms: string[];
  genre: string;
  year: string;
  role: string;
  /* released | in development | prototype — shown as a chip */
  status: string;
  featured?: boolean;
  cover: GameShot;
  shots: GameShot[];
  /* what is actually built, one line each */
  features: string[];
  tech: string[];
  download: string | null;
  source: string | null;
}

/* which part of the stack a tool belongs to, used to group the unlock log */
export type SkillArea =
  | "frontend"
  | "backend"
  | "spatial"
  | "vision"
  | "engine"
  | "other";

/* one unlocked tool. every field is derived from the projects that shipped
   with it, so nothing here can be claimed without something backing it */
export interface SkillUnlock {
  name: string;
  area: SkillArea;
  /* the year it first shipped */
  year: string;
  /* the project that first used it */
  project: string;
  href: string;
  /* how many shipped projects use it */
  uses: number;
}

/* something being learned but not yet shipped — shown locked, on purpose */
export interface SkillPursuit {
  name: string;
  area: SkillArea;
  note: string;
}

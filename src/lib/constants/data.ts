import {
  Mail,
  MapPin,
  FileText,
  Phone,
  MonitorSmartphone,
  Server,
  Globe2,
  Gamepad2,
  Boxes,
  Code2,
  Radar,
  Sparkles,
  Glasses,
  Box,
  Wrench,
} from "lucide-react";
import { FaGithub, FaLinkedin, } from "react-icons/fa";
import {
  SiUnity,
  SiUnrealengine,
  SiSketchfab,
  SiArtstation,
  SiBlender,
  SiThreedotjs,
  SiCplusplus,
} from "react-icons/si";
import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";
import {
  SkillsData,
  SkillArea,
  SkillUnlock,
  SkillPursuit,
  WorkProject,
  GameItem,
  FaqItem,
  TechItem,
  ServiceItem,
  DisciplineItem,
  Testimonial,
} from "@/@types/common.types";


export const skillsdata: SkillsData[] = [
  {
    id: 1,
    title: "Frontend",
    blurb: "Interfaces that stay fast and legible at every breakpoint.",
    icon: MonitorSmartphone,
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
      {
        lang: "Three.js",
      },
    ],
  },
  {
    id: 2,
    title: "Backend",
    blurb: "APIs, auth and data models built to be handed over.",
    icon: Server,
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
    title: "Geospatial & 3D",
    blurb: "Spatial queries, digital twins and analysis on real coordinates.",
    icon: Globe2,
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
      {
        lang: "Digital Twin",
      },
      {
        lang: "3D Tiles",
      },
      {
        lang: "Point Clouds",
      },
      {
        lang: "Arrival Space",
      },
      {
        lang: "3D Gaussian Splatting",
      },
    ],
  },
  {
    id: 4,
    title: "Game Development",
    blurb: "Engine work and level design, mostly Unity and Unreal.",
    icon: Gamepad2,
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
  icon: LucideIcon | IconType;
  color: string; // ← accepts both types
}

export const contactdata: ContactData[] = [
  {
    id: 1,
    label: "email",
    value: "prabhatbhusal777@gmail.com",
    url: "mailto:prabhatbhusal777@gmail.com",
    icon: Mail,
    color: "bg-[#E02020]/10 border-[#E02020]/20 text-[#E02020]",
  },
  {
    id: 2,
    label: "github",
    value: "github.com/prabhatbhusal",
    url: "https://github.com/prabhatbhusal",
    icon: FaGithub,
    color: "bg-white/[0.08] border-white/[0.08] text-[#e8e6e0]",
  },
  {
    id: 3,
    label: "linkedin",
    value: "linkedin.com/in/prabhat-bhusal-302672322",
    url: "https://www.linkedin.com/in/prabhat-bhusal-302672322/",
    icon: FaLinkedin,
    color: "bg-white/[0.08] border-white/[0.08] text-[#e8e6e0]",
  },
  {
    id: 7,
    label: "sketchfab",
    value: "sketchfab.com/bhusalprabhat",
    url: "https://sketchfab.com/bhusalprabhat",
    icon: SiSketchfab,
    color: "bg-white/[0.08] border-white/[0.08] text-[#e8e6e0]",
  },
  {
    id: 8,
    label: "artstation",
    value: "artstation.com/prabhatbhusal",
    url: "https://www.artstation.com/prabhatbhusal",
    icon: SiArtstation,
    color: "bg-white/[0.08] border-white/[0.08] text-[#e8e6e0]",
  },
  {
    id: 4,
    label: "research",
    value: "ResearchGate — LiDAR thesis",
    url: "https://researchgate.net",
    icon: FileText,
    color: "bg-[#5DCAA5]/10 border-[#5DCAA5]/20 text-[#5DCAA5]",
  },
  {
    id: 5,
    label: "location",
    value: "Kathmandu, Nepal",
    url: "#",
    icon: MapPin,
    color: "bg-[#E02020]/10 border-[#E02020]/20 text-[#E02020]",
  },
  {
    id: 6,
    label: "phone",
    value: "+977 9840177176",
    url: "tel:+9779840177176",
    icon: Phone,
    color: "bg-[#E02020]/10 border-[#E02020]/20 text-[#E02020]",
  },
];

export const techstack: TechItem[] = [
  { id: 1, name: "Unity", icon: SiUnity },
  { id: 2, name: "Unreal Engine", icon: SiUnrealengine },
  { id: 3, name: "Blender", icon: SiBlender },
  { id: 4, name: "three.js", icon: SiThreedotjs },
  { id: 5, name: "C++", icon: SiCplusplus },
  { id: 6, name: "VR", icon: Glasses },
  { id: 7, name: "Gaussian Splatting", icon: Sparkles },
  { id: 8, name: "LiDAR", icon: Radar },
  { id: 9, name: "Digital Twin", icon: Boxes },
  { id: 10, name: "Sketchfab", icon: SiSketchfab },
];

export const faqdata: FaqItem[] = [
  {
    id: 1,
    question: "What kind of work are you available for?",
    answer:
      "Game and VR development first — gameplay programming, prototypes and tools in Unity or Unreal — then 3D props, virtual tours and LiDAR capture. I build VR and the studio platform at RCAAS Technology, and take on freelance or contract work alongside it; I am based in Kathmandu and work with teams in any timezone.",
  },
  {
    id: 2,
    question: "What does your stack usually look like?",
    answer:
      "Unity with C# or Unreal Engine 5 with C++ and Blueprints for games, Blender for props, and three.js with Gaussian splats when a scene has to open in the browser.",
  },
  {
    id: 3,
    question: "Why does a game developer care about LiDAR?",
    answer:
      "I studied Geomatics, so a real place is something I can measure rather than guess. LiDAR scans and survey data become terrain and splat scenes, which matters the moment a level has to sit on real ground.",
  },
  {
    id: 4,
    question: "Can you take a project from scratch?",
    answer:
      "Yes. Scoping, the prototype, the build and handover. I would rather own the whole thread than pick up a half-finished one, though I am happy to do either.",
  },
  {
    id: 5,
    question: "Do you make the 3D models too?",
    answer:
      "Yes, and that side is newer: low-poly props in Blender, modelled, lit and published on Sketchfab and ArtStation. Each one is on the work page with a viewer you can spin.",
  },
  {
    id: 6,
    question: "How do we start?",
    answer:
      "Email me with a paragraph about what you are building. I usually reply within a day, and I will tell you honestly if it is not a good fit for me.",
  },
];


export const servicesdata: ServiceItem[] = [
  {
    id: 7,
    title: "Game development",
    description:
      "Gameplay systems, prototypes and vertical slices — engine work, level design and the tools underneath.",
    deliverables: ["Unity / C#", "Unreal Engine 5 / C++", "editor tools"],
    icon: Gamepad2,
  },
  {
    id: 1,
    title: "VR development",
    description:
      "Headset and browser VR — getting around, picking things up, and a frame rate that holds past the first minute.",
    deliverables: ["locomotion", "interaction", "performance"],
    icon: Glasses,
  },
  {
    id: 2,
    title: "3D props",
    description:
      "Low-poly props modelled in Blender, lit and ready to drop into a scene.",
    deliverables: ["Blender", "low poly", "materials"],
    icon: Box,
  },
  {
    id: 3,
    title: "Tools and pipelines",
    description:
      "Editor tools and importers that keep content moving, scan-to-engine included.",
    deliverables: ["editor tools", "importers", "automation"],
    icon: Wrench,
  },
  {
    id: 4,
    title: "Virtual tours and digital twins",
    description:
      "Real places captured and published as Gaussian-splat tours that open in any browser.",
    deliverables: ["Gaussian splats", "hotspots", "walk / fly / orbit"],
    icon: Sparkles,
  },
  {
    id: 5,
    title: "LiDAR and point clouds",
    description:
      "Raw scans turned into terrain a level can stand on, or layers you can act on.",
    deliverables: ["classification", "heightmaps", "point clouds"],
    icon: Radar,
  },
  {
    id: 6,
    title: "Real-time 3D on the web",
    description:
      "three.js scenes that load fast and hold their frame rate, like the ones on this site.",
    deliverables: ["three.js", "React Three Fiber", "WebGL"],
    icon: Code2,
  },

];

// drafts — written from my own project notes, edit the prose before publishing
// scenes go here: drop files in /public/gallery and add a row
/* SAMPLE ENTRIES — two PC builds, written to size the pages. the art in
   /public/games is generated placeholder art (npm run art), so swap the
   copy and drop real captures in before this goes live. */
// declared last so the work dropdown can be built from the projects above
export const disciplinesdata: DisciplineItem[] = [
  {
    id: 3,
    title: "Game development",
    tagline: "systems you can play",
    description:
      "Gameplay systems, engine work and level design in Unity and Unreal. Where I learned to think in 3D space — and still the work I care about most.",
    tools: ["Unity", "Unreal Engine 5", "C#", "C++"],
    icon: Gamepad2,
    model: "d20",
  },
  {
    id: 1,
    title: "3D modelling",
    tagline: "one prop at a time",
    description:
      "Props modelled in Blender, from a wooden crate up: shapes, materials and lighting, published on Sketchfab and ArtStation as they land. The newest of the three.",
    tools: ["Blender", "low poly", "materials", "lighting"],
    icon: Box,
    model: "crate",
  },
  {
    id: 2,
    title: "LiDAR and capture",
    tagline: "real places, scanned",
    description:
      "Real places captured with LiDAR and turned into Gaussian-splat tours, or terrain a level can stand on. Where the Geomatics degree earns its keep.",
    tools: ["LiDAR", "Point clouds", "3D Gaussian Splatting", "Digital Twin"],
    icon: Radar,
    model: "globe",
  },
];


/* PLACEHOLDER COPY, none of it written by the people it is attributed to.
   entry 1 is a real client with a quote I drafted — get Saurav's own words
   and his sign-off before this goes live. entries 2 and 3 are invented
   people, there to size the layout; replace them outright rather than
   leaving fictional clients on a published site. */
export const testimonialsdata: Testimonial[] = [
  {
    id: 1,
    quote:
      "Prabhat took a rough brief and came back with something we could actually run ourselves. He was straight with us about what was worth building and what was not, and the site has been steady since the day it went up.",
    name: "Saurav Raj Khanal",
    // his actual title — leave unset rather than guessing at it
    role: undefined,
    company: "Bhumlu Construction",
    companyUrl: "https://bhumluconstruction.com.np",
    location: "Kavre, Nepal",
    projectSlug: "bhumlu-construction",
    date: "2025",
    // add a headshot to /public and point at it here, e.g. "/clients/saurav.jpg"
    image: undefined,
  },

  /* ---- placeholders. invented people, not clients — swap the whole
     entry out as real testimonials come in ---- */
  {
    id: 2,
    quote:
      "We came in with a spreadsheet and a vague idea of a map. Prabhat turned it into something our dispatchers actually use every day, and he explained the trade-offs in language we could follow.",
    name: "Aayush Shrestha",
    role: "Operations Lead",
    company: "Logistics startup",
    location: "Kathmandu, Nepal",
    projectSlug: "food-delivery-webgis",
    date: "2025",
    image: undefined,
  },
  {
    id: 3,
    quote:
      "Deadlines held, and the handover was the easiest part of the project. Everything was documented well enough that our own developer picked it up without a single call.",
    name: "Nisha Gurung",
    role: "Managing Director",
    company: "Retail group",
    location: "Pokhara, Nepal",
    projectSlug: "automax-ecommerce",
    date: "2024",
    image: undefined,
  },
];

/* ------------------------------------------------------------------ *
 * Skill unlocks
 *
 * Nothing below is typed by hand. The list is derived from the projects
 * above, so a tool cannot appear unless something shipped with it, the
 * year is whenever that first happened, and the count is how many
 * projects use it. Add a project and its tools unlock themselves.
 * ------------------------------------------------------------------ */

const SKILL_AREA: Record<string, SkillArea> = {
  React: "frontend",
  "Next.js": "frontend",
  TypeScript: "frontend",
  TailwindCSS: "frontend",
  Leaflet: "frontend",
  Django: "backend",
  DRF: "backend",
  PostgreSQL: "backend",
  "REST API": "backend",
  WebSocket: "backend",
  Khalti: "backend",
  PostGIS: "spatial",
  LiDAR: "spatial",
  "Point Cloud": "spatial",
  GIS: "spatial",
  GDAL: "spatial",
  YOLOv8: "vision",
  OpenCV: "vision",
  Python: "vision",
  "Kalman filter": "vision",
  MOG2: "vision",
  Unity: "engine",
  "C#": "engine",
  URP: "engine",
  ScriptableObjects: "engine",
  "Unreal Engine 5": "engine",
  Blueprints: "engine",
  "C++": "engine",
  Lumen: "engine",
  MetaSounds: "engine",
  Blender: "modelling",
};

export const skillAreaLabel: Record<SkillArea, string> = {
  frontend: "frontend",
  backend: "backend and data",
  spatial: "spatial",
  vision: "vision and ml",
  engine: "game engines",
  modelling: "3d modelling",
  other: "elsewhere",
};

export const skillAreaOrder: SkillArea[] = [
  "engine",
  "modelling",
  "spatial",
  "frontend",
  "backend",
  "vision",
  "other",
];

/* every unlock is derived from what actually shipped — pass in the live
   projects and games, so adding one to content/ updates this too */
export const deriveUnlocks = (projects: WorkProject[], games: GameItem[]): SkillUnlock[] => {
  const sources = [
    ...projects.map((project) => ({
      title: project.title,
      href: `/work/${project.slug}`,
      year: project.year ?? "",
      tools: project.skills,
    })),
    ...games.map((game) => ({
      title: game.title,
      href: `/games/${game.slug}`,
      year: game.year,
      tools: game.tech,
    })),
  ];

  // note: `Map` here would resolve to the lucide icon imported above
  const found: Record<string, SkillUnlock> = {};

  for (const source of sources) {
    for (const tool of source.tools) {
      const seen = found[tool];

      if (!seen) {
        found[tool] = {
          name: tool,
          area: SKILL_AREA[tool] ?? "other",
          year: source.year,
          project: source.title,
          href: source.href,
          uses: 1,
        };
        continue;
      }

      seen.uses += 1;

      // the earliest project is the one that unlocked it
      if (source.year && source.year < seen.year) {
        seen.year = source.year;
        seen.project = source.title;
        seen.href = source.href;
      }
    }
  }

  return Object.values(found).sort(
    (a, b) => a.year.localeCompare(b.year) || a.name.localeCompare(b.name),
  );
};

/* the honest other half: in flight, nothing shipped with it yet. these are
   the only hand-written entries, and they show as locked */
export const skillpursuits: SkillPursuit[] = [
  {
    name: "3D Gaussian Splatting",
    area: "spatial",
    note: "building a capture-to-web platform around it",
  },
  {
    name: "WebGPU",
    area: "frontend",
    note: "for splat rendering that survives a phone",
  },
  {
    name: "PDAL",
    area: "spatial",
    note: "moving the point cloud pipeline off hand-rolled scripts",
  },
];

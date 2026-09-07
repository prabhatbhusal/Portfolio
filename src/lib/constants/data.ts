import {
  Mail,
  MapPin,
  FileText,
  Phone,
  Briefcase,
  Layers,
  MonitorSmartphone,
  Server,
  Globe2,
  Gamepad2,
  Compass,
  Boxes,
  Code2,
  Rocket,
  Newspaper,
  Images,
  Map,
  Radar,
  ScanEye,
  Plug,
} from "lucide-react";
import { FaGithub, FaLinkedin, } from "react-icons/fa";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiDjango,
  SiPostgresql,
  SiPython,
  SiDocker,
  SiOpencv,
  SiLeaflet,
  SiQgis,
  SiUnity,
} from "react-icons/si";
import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";
import { navbar } from "@/@types/navbar.types";
import {
  heroData,
  SkillsData,
  Projectsdata,
  workdata,
  ProcessStep,
  FaqItem,
  TechItem,
  BlogPost,
  GalleryItem,
  ServiceItem,
  DisciplineItem,
} from "@/@types/common.types";


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
    color: "bg-[#EF9F27]/10 border-[#EF9F27]/20 text-[#EF9F27]",
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
    value: "linkedin.com/in/prabhat-bhusal",
    url: "https://linkedin.com/in/prabhat-bhusal",
    icon: FaLinkedin,
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
    color: "bg-[#EF9F27]/10 border-[#EF9F27]/20 text-[#EF9F27]",
  },
  {
    id: 6,
    label: "phone",
    value: "+977 9840177176",
    url: "tel:+9779840177176",
    icon: Phone,
    color: "bg-[#EF9F27]/10 border-[#EF9F27]/20 text-[#EF9F27]",
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
    stack: "Full Stack",
    title: "Url Shortener APP",
    description:
      "A simple and efficient URL shortening service built with React and Django.",
    skills1: "React",
    skills2: "Django",
    skills3: "PostgreSQL",
  },
  
];
export const workprojects: workdata[] = [
  {
    id: 1,
    slug: "food-delivery-webgis",
    year: "2025",
    role: "Design, frontend and backend",
    highlights: [
      "Rider positions stream over WebSockets instead of polling, so the map stays live without hammering the API.",
      "Nearest-rider matching runs as a PostGIS spatial query with a GiST index, not a distance loop in Python.",
      "Leaflet layers are split by concern — riders, routes, delivery zones — so each can update independently.",
    ],
    index: "01",
    stack: "Full Stack",
    sector: "GIS",
    badge: "geospatial",
    featured: true,
    title: "Food Delivery WebGIS APP",
    description:
      "Real-time position tracking for a food delivery platform. Riders locations update live on an interactive map using WebSockets. Spatial queries powered by PostGIS for nearest-rider matching.",
    skills: [
      "React",
      "Django",
      "PostGIS",
      "Leaflet",
      "WebSocket",
      "PostgreSQL",
    ],
    github: "https://github.com/prabhatbhusal/food-delivery",
    live: null,
  },
  {
    id: 2,
    slug: "padel-shot-classification",
    year: "2025",
    role: "Computer vision pipeline",
    highlights: [
      "YOLOv8 detects players and ball per frame; MOG2 background subtraction cleans up the court.",
      "A Kalman filter smooths tracking through occlusion, which is where naive frame-to-frame tracking falls apart.",
      "Shots are classified from the resulting trajectory rather than from single frames.",
    ],
    index: "02",
    stack: "ML",
    sector: "Computer Vision",
    badge: "machine learning",
    featured: false,
    title: "Padel Shot Classification",
    description:
      "AI shot classifier from video using YOLOv8 object detection, MOG2 background subtraction and Kalman filter for stable player tracking.",
    skills: ["YOLOv8", "OpenCV", "Python", "Kalman filter", "MOG2"],
    github: "https://github.com/prabhatbhusal/shot-classification",
    live: null,
  },
  {
    id: 3,
    slug: "automax-ecommerce",
    year: "2026",
    role: "Full stack",
    highlights: [
      "JWT auth with refresh rotation, and an admin dashboard scoped by role.",
      "Khalti payment integration handled server side so no key ever reaches the browser.",
      "Product listing and cart state built to survive a page reload.",
    ],
    index: "03",
    stack: "Full Stack",
    sector: "Ecommerce",
    badge: "in progress",
    featured: false,
    title: "Automax Ecommerce Platform",
    description:
      "Full-stack ecommerce platform with product listings, cart, JWT auth, admin dashboard and Khalti payment integration.",
    skills: ["Next.js", "TypeScript", "Django", "DRF", "Khalti", "PostgreSQL"],
    github: "https://github.com/prabhatbhusal/automax",
    live: null,
  },
  {
    id: 4,
    slug: "lidar-road-monitor",
    year: "2024",
    role: "Undergraduate thesis",
    highlights: [
      "LiDAR point clouds processed into road surface rasters ready for detection.",
      "YOLOv8 trained to classify defect types — cracking, ravelling, potholes.",
      "Output exported as GIS layers so a maintenance team can act on it directly.",
    ],
    index: "04",
    stack: "ML",
    sector: "Research",
    badge: "thesis",
    featured: false,
    title: "LiDAR Road Condition Monitor",
    description:
      "Undergraduate thesis. LiDAR point cloud processing pipeline with YOLOv8 for automated road defect classification and monitoring.",
    skills: ["LiDAR", "YOLOv8", "Point Cloud", "Python", "GIS"],
    github: "",
    live: "https://researchgate.net",
  },
  {
    id: 5,
    slug: "construction-company-website",
    year: "2025",
    role: "Design and build",
    highlights: [
      "Project portfolio built as structured data, so adding a completed job is one entry.",
      "Enquiry flow kept to the few fields a site manager will actually fill in.",
      "Image-heavy pages held to a real performance budget on Nepali mobile connections.",
    ],
    index: "05",
    stack: "Full Stack",
    sector: "Construction",
    badge: "client work",
    featured: false,
    title: "Construction Company Website",
    description:
      "Marketing and project-portfolio site for a construction firm. Services, completed works with galleries, and an enquiry flow that reaches the right person.",
    skills: ["Next.js", "TypeScript", "TailwindCSS", "Django", "PostgreSQL"],
    github: "",
    live: null,
  },

  {
    id: 6,
    slug: "url-shortener",
    year: "2025",
    role: "Full stack",
    highlights: [
      "Short codes generated from a base62 counter rather than random strings, so there are no collisions to retry.",
      "Redirects resolve on a single indexed lookup and nothing else sits in that path.",
      "Click counts recorded without blocking the redirect the visitor is waiting on.",
    ],
    index: "06",
    stack: "Full Stack",
    sector: "Web",
    badge: "tooling",
    featured: false,
    title: "URL Shortener",
    description:
      "A small, fast URL shortening service. Custom short codes, click tracking, and a redirect path kept deliberately boring so it stays quick.",
    skills: ["React", "Django", "PostgreSQL", "REST API"],
    github: "https://github.com/prabhatbhusal/url-shortener",
    live: null,
  },
];




export const techstack: TechItem[] = [
  { id: 1, name: "React", icon: SiReact },
  { id: 2, name: "Next.js", icon: SiNextdotjs },
  { id: 3, name: "TypeScript", icon: SiTypescript },
  { id: 4, name: "Tailwind", icon: SiTailwindcss },
  { id: 5, name: "Django", icon: SiDjango },
  { id: 6, name: "PostgreSQL", icon: SiPostgresql },
  { id: 7, name: "Python", icon: SiPython },
  { id: 8, name: "Docker", icon: SiDocker },
  { id: 9, name: "OpenCV", icon: SiOpencv },
  { id: 10, name: "Leaflet", icon: SiLeaflet },
  { id: 11, name: "QGIS", icon: SiQgis },
  { id: 12, name: "Unity", icon: SiUnity },
];

export const processdata: ProcessStep[] = [
  {
    id: 1,
    step: "01",
    title: "Scope it",
    description:
      "We agree on what the thing actually needs to do before a line of code exists. Fewer features, clearer ones.",
    icon: Compass,
  },
  {
    id: 2,
    step: "02",
    title: "Design the data",
    description:
      "Models, endpoints and spatial schema first. Get this right and the interface almost writes itself.",
    icon: Boxes,
  },
  {
    id: 3,
    step: "03",
    title: "Build in the open",
    description:
      "Small commits, working deploys early. You see progress every week rather than at the end.",
    icon: Code2,
  },
  {
    id: 4,
    step: "04",
    title: "Ship and hand over",
    description:
      "Dockerised, documented and yours. No black boxes and nothing that only I can maintain.",
    icon: Rocket,
  },
];

export const faqdata: FaqItem[] = [
  {
    id: 1,
    question: "What kind of work are you available for?",
    answer:
      "Full-stack web projects and geospatial work — freelance, contract or full time. I am based in Kathmandu and work with teams in any timezone.",
  },
  {
    id: 2,
    question: "What does your stack usually look like?",
    answer:
      "Next.js and TypeScript on the front, Django REST on the back, PostgreSQL with PostGIS when the data has coordinates. Docker for anything that needs to run somewhere other than my machine.",
  },
  {
    id: 3,
    question: "What makes the geospatial part different?",
    answer:
      "Most developers treat location as two float columns. I studied Geomatics, so I work with real projections, spatial indexes and LiDAR point clouds — which matters the moment your queries stop being simple.",
  },
  {
    id: 4,
    question: "Can you take a project from scratch?",
    answer:
      "Yes. Scoping, data modelling, the build, deployment and handover. I would rather own the whole thread than pick up a half-finished one, though I am happy to do either.",
  },
  {
    id: 5,
    question: "Do you work on machine learning too?",
    answer:
      "Applied computer vision, mostly — YOLOv8 detection, tracking and classification pipelines. My thesis used LiDAR and YOLOv8 for automated road defect monitoring.",
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
    id: 1,
    title: "Web applications",
    description:
      "The whole thing, front to back — interface, API, database, deployment.",
    deliverables: ["Next.js + TypeScript", "Django REST", "PostgreSQL"],
    icon: MonitorSmartphone,
  },
  {
    id: 2,
    title: "WebGIS and mapping",
    description:
      "Interactive maps that stay fast when the data stops being small.",
    deliverables: ["Leaflet", "PostGIS", "vector tiles"],
    icon: Map,
  },
  {
    id: 3,
    title: "Spatial analysis",
    description:
      "Proximity, routing, overlays and everything that needs a real projection.",
    deliverables: ["GiST indexes", "QGIS / ArcGIS", "geoprocessing"],
    icon: Globe2,
  },
  {
    id: 4,
    title: "LiDAR and point clouds",
    description:
      "Processing pipelines that turn raw scans into layers you can act on.",
    deliverables: ["classification", "rasterisation", "GIS export"],
    icon: Radar,
  },
  {
    id: 5,
    title: "Applied computer vision",
    description:
      "Detection and tracking pipelines from video, built to run repeatably.",
    deliverables: ["YOLOv8", "OpenCV", "Kalman tracking"],
    icon: ScanEye,
  },
  {
    id: 6,
    title: "APIs and integrations",
    description:
      "Auth, payments and third-party services wired in without leaking keys.",
    deliverables: ["JWT auth", "payment gateways", "Docker"],
    icon: Plug,
  },

  {
    id: 7,
    title: "Games and interactive 3D",
    description:
      "Playable builds and interactive scenes — engine work, level design and the systems underneath.",
    deliverables: ["Unity", "Unreal Engine", "C# / C++"],
    icon: Gamepad2,
  },
];

// drafts — written from my own project notes, edit the prose before publishing
export const blogdata: BlogPost[] = [
  {
    id: 1,
    slug: "postgis-nearest-rider",
    title: "Finding the nearest rider without melting the database",
    excerpt:
      "The naive version loops every rider in Python. The version that survives production is a single spatial query with the right index behind it.",
    date: "2026-02-14",
    tags: ["PostGIS", "Django", "performance"],
    readingTime: "6 min read",
    body: [
      "When I started the food delivery WebGIS project, nearest-rider matching looked trivial. Pull every active rider, compute the distance to the restaurant, sort, take the first. It works. It works right up until you have a few hundred riders online and every order does a full table scan.",
      "The fix is to stop treating coordinates as two float columns. With PostGIS, rider positions become a geography column, and the query becomes a single ORDER BY distance LIMIT 1 that Postgres can plan properly.",
      "The part people miss is the index. Without a GiST index on the position column, PostGIS will still do the work honestly and slowly. With one, the planner switches to an index scan and the query time stops scaling with the number of riders.",
      "There is a second trap worth mentioning: distance on geometry is in degrees, not metres. If you are comparing against a radius in kilometres you want geography, or you want to project first. Getting this wrong produces results that look plausible near the equator and wrong everywhere else.",
    ],
  },
  {
    id: 2,
    slug: "websockets-over-polling",
    title: "Why I stopped polling for live positions",
    excerpt:
      "Polling every two seconds is easy to write and expensive to run. Moving rider tracking onto WebSockets changed the shape of the whole app.",
    date: "2026-01-27",
    tags: ["WebSocket", "Django", "architecture"],
    readingTime: "5 min read",
    body: [
      "The first version of live tracking polled an endpoint every two seconds. Every client, all the time, whether or not anything had moved. It is the obvious thing to build and it is quietly terrible.",
      "The cost is not just requests per second. It is that your map is always somewhere between zero and two seconds stale, and you cannot tell which. The interface ends up feeling laggy in a way that no amount of animation smoothing fixes.",
      "Switching to WebSockets inverted it. Riders push position updates, the server fans them out to the clients watching that order, and the map updates when something actually changes.",
      "The interesting consequence was on the front end. Once updates arrive as events rather than snapshots, you stop re-rendering the whole layer and start moving individual markers. Splitting the Leaflet layers by concern — riders, routes, zones — meant each one could update on its own without touching the others.",
    ],
  },
  {
    id: 3,
    slug: "lidar-road-defects",
    title: "What LiDAR taught me about road defects",
    excerpt:
      "My undergraduate thesis put point clouds and YOLOv8 in the same pipeline. Most of the work was not the model.",
    date: "2025-11-08",
    tags: ["LiDAR", "YOLOv8", "thesis"],
    readingTime: "8 min read",
    body: [
      "The thesis was about automated road condition monitoring: take LiDAR scans of a road, find the defects, and produce something a maintenance team can act on. The model was the part everyone asked about. It was not the part that took the time.",
      "Point clouds do not arrive ready to classify. Before YOLOv8 sees anything, the cloud has to be filtered, the road surface separated from everything beside it, and the result rasterised into an image the detector can work with. Each of those steps has decisions in it that change the final numbers more than the model architecture does.",
      "Training took 2.34 hours across 754,391 points and landed at a PSNR of 24.31. Respectable for an undergraduate project, and much less interesting than the fact that the output exports cleanly as GIS layers.",
      "That last part is the whole point. A model that emits bounding boxes in image space is a demo. A model whose output lands in a GIS as georeferenced defect polygons is something a municipality can put on a map and send a crew to.",
    ],
  },
];

// scenes go here: drop files in /public/gallery and add a row
export const gallerydata: GalleryItem[] = [];

// declared last so the work dropdown can be built from the projects above
export const NavLinks: navbar[] = [
  {
    id: 1,
    title: "work",
    url: "/work",
    icon: Briefcase,
    children: workprojects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.skills.slice(0, 3).join(" · "),
      url: `/work/${project.slug}`,
    })),
  },
  { id: 2, title: "skills", url: "/skills", icon: Layers },
  { id: 3, title: "blog", url: "/blog", icon: Newspaper },
  { id: 4, title: "gallery", url: "/gallery", icon: Images },
  { id: 5, title: "contact", url: "/contact", icon: Mail },
];

export const disciplinesdata: DisciplineItem[] = [
  {
    id: 1,
    title: "Web engineering",
    tagline: "the thing people actually use",
    description:
      "Full-stack applications end to end — interface, API, database and the deploy that puts them in front of someone.",
    tools: ["React", "Next.js", "Django", "PostgreSQL"],
    icon: Code2,
  },
  {
    id: 2,
    title: "Geomatics and spatial",
    tagline: "where it is, properly",
    description:
      "Real projections, spatial indexes, LiDAR and digital twins. The half most stacks fudge until it breaks.",
    tools: ["PostGIS", "LiDAR", "Digital Twin", "3D Gaussian Splatting"],
    icon: Globe2,
  },
  {
    id: 3,
    title: "Game development",
    tagline: "systems you can play",
    description:
      "Engine work, level design and gameplay systems. It is where I learned to think in 3D space before it was my job.",
    tools: ["Unity", "Unreal Engine", "C#", "C++"],
    icon: Gamepad2,
  },
];

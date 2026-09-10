<div align="center">
  <img src="public/logo-192.png" width="88" height="88" alt="pb logo" />

  <h1>Prabhat Bhusal — Portfolio</h1>

  <p><strong>Web applications that know where they are.</strong></p>

  <p>
    Personal site of Prabhat Bhusal — Game Developer,full-stack developer and Geomatics
    Engineer based in Kathmandu, Nepal.
  </p>

  <p>
    <a href="https://www.prabhatbhusal.com.np">www.prabhatbhusal.com.np</a>
  </p>
</div>

---

## About

This is my portfolio: the work I have shipped, the tools I build with, and how
I approach a project.

The through-line is the overlap between two fields. I write full-stack web
applications — React, Next.js, Django, PostgreSQL — and I trained as a
Geomatics Engineer, so the spatial half gets treated properly: real
projections, PostGIS spatial indexes, LiDAR point clouds, digital twins.
Most stacks fudge location until it breaks. A game development background
sits underneath both, which is where thinking in 3D space started.

The site covers:

- **Work** — 6 projects, each with its own page: what it does, the year, my
  role, and the decisions that actually mattered
- **Skills** — frontend, backend, geospatial & 3D, and game development
- **Blog** — notes on spatial queries, live position tracking, and LiDAR
- **Gallery** — scenes and photographs from the field
- **Contact** — a form, direct links, and my local time so you know if I am awake

## Design

Everything is driven from one set of semantic tokens in
[`globals.css`](src/app/globals.css), so the whole site can be retuned from a
single place and nothing drifts between themes.

- **Light and dark themes** — a small script runs before first paint, so the
  saved theme applies with no flash. Falls back to the OS preference.
- **One alignment rail** — a `.rail` class reproduces the floating navbar's
  exact left edge, so every heading on every page lines up with the logo.
- **Generated hero backdrop** — an inline SVG built around a triangulated
  irregular network. It is how terrain gets modelled in geomatics and how a
  mesh gets built in a game engine: one figure for both halves of the work.
  The mesh is computed in code, not traced.
- **Motion** — scroll reveals driven by `IntersectionObserver` through a ref,
  so revealing a section costs no re-render. Every animation respects
  `prefers-reduced-motion`.
- **Type** — Geist and Geist Mono, one grotesque doing body, display and code.

## Built with

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react, react-icons |
| Fonts | Geist, Geist Mono via `next/font` |
| Output | Static export — no server, no runtime |

## Routes

```
/                     home
/work                 all projects
/work/[slug]          project detail
/skills               skills by discipline
/blog                 writing
/blog/[slug]          post
/gallery              scenes
/contact              contact form and links
```

Every route is prerendered at build time. Dynamic routes use
`generateStaticParams`, and unknown slugs 404 rather than rendering.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # static export -> out/
npm run lint
```

`npm start` does not apply — this is a static export, so serve `out/` with any
static file server.

## Adding content

All content lives in [`src/lib/constants/data.ts`](src/lib/constants/data.ts).
Pages read from it, so adding an entry is usually the only step.

- **A project** — add to `workprojects` with a unique `slug`. Its detail page,
  the work grid, the navbar dropdown and the footer all pick it up.
- **A post** — add to `blogdata` with a `slug` and a `body` array of
  paragraphs.
- **A photograph** — drop the file in `public/gallery`, add a row to
  `gallerydata`. The masonry grid handles portrait and landscape together.

## Deployment

Builds to fully static files, so it runs anywhere that serves a directory.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `out` |
| Node | 20.9+ |

> `.npmrc` pins `legacy-peer-deps=true`. This is deliberate: without it,
> `npm install` and `npm ci` disagree about the optional peer dependencies of
> `@napi-rs/wasm-runtime` (pulled in by wasm32 fallback bindings), and CI
> installs fail. Do not remove it.

## Icons

The `<pb/>` mark is generated, not drawn by hand — shapes are distance
functions rasterised with 4×4 supersampling. `favicon.ico` carries 16/32/48/64
sizes, and the smallest two drop the angle brackets so the mark stays legible
at tab size.

## Contact

- **Email** — prabhatbhusal777@gmail.com
- **GitHub** — [@prabhatbhusal](https://github.com/prabhatbhusal)
- **LinkedIn** — [prabhat-bhusal](https://linkedin.com/in/prabhat-bhusal)
- **Location** — Kathmandu, Nepal

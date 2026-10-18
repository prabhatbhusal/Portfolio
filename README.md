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
### 👾 What I Do

- 🔭 I’m currently engineering solutions for a **3D Gaussian Splatting (3DGS) platform**, bringing high-fidelity volumetric scenes to life...
- 🕹️ Building games and interactive experiences using **Unreal Engine**.
- 💻 Creating seamless, responsive user interfaces as a **Frontend Developer**.
- 💬 Ask me about: **Game architectures, 3D rendering pipelines, React, C++, and Backend integrations.**


## About

My portfolio website: the work I have shipped, the tools I build with, and how
I approach a project.

The through-line is the overlap between two fields. I write full-stack web
applications — React, Next.js, Django, PostgreSQL — and I trained as a
Geomatics Engineer, so the spatial half gets treated properly: real
projections, PostGIS spatial indexes, LiDAR point clouds, digital twins.
Most stacks fudge location until it breaks. A game development background
sits underneath both, which is where thinking in 3D space started.

The site covers:

- **Work** — projects, each with its own page: what it does, the year, my
  role, and the decisions that actually mattered
- **Skills** — frontend, backend, geospatial & 3D, and game development
- **Blog** — notes on spatial queries, live position tracking, and LiDAR
- **Gallery** — scenes and photographs from the field
- **Contact** — a form, direct links, and my local time so you know if I am awake

## Design

Everything is driven from one set of semantic tokens in
[`globals.css`](src/app/globals.css), so the whole site can be retuned from a
single place and nothing drifts between themes.

- **Dark first, light on request** — a small script runs before first paint,
  so the saved theme applies with no flash. Dark is the default.
- **Navbar** — the floating nav from the
  [3D-GS platform](https://github.com/prabhatbhusal/Three-D-GS-platform): a
  glass pill that folds to just its links on the way down and opens on the
  way up, a scan line along its foot drawn by the scroll, a viewfinder that
  glides to the current page, and panels that unroll like a curtain behind a
  scan line. Each menu is a split trigger (the label goes to the page, the
  chevron or a hover opens the panel). On phones a Menu button grows the bar
  into one card of numbered chapters.
- **Scroll rail** — the section nav stood on its end down the right edge of
  every page: a track the scroll fills, a `000%` readout, a tick per section
  and the current one's name written up the rail (hover for the list). Sections are found, not
  configured — any `<section id>` inside `<main>` joins it, and `data-label`
  renames it.
- **Inside a build** — the PortalCam beat with a controller as the product:
  the section pins for five screens while a procedural three.js gamepad
  turns, travels side to side and comes apart (shells, circuit board, sticks,
  buttons), with dice, coins, a gem and a health heart in orbit over a
  receding grid. No model files — every part is built in code.
- **3D hero** — a live LiDAR-style point cloud of a valley between ranges,
  built with three.js: points assemble like a reconstruction resolving, a
  scan band sweeps through, the camera follows the pointer and flies in as
  you scroll. Loaded after the page is interactive, paused off screen, and
  the SVG mesh stays as the fallback without WebGL.
- **Boot screen** — once per visit, a game's "loading world" with a segmented
  bar and a `000%` counter. The count is an animated CSS custom property, so
  it runs from the first paint with no script; it leaves once counted out and
  the page has loaded (never later than 4 s), wiping up behind a scan line.
- **HUD cursor** — a small 3D crystal standing on its tip at the pointer,
  spinning and leaning into the motion; corner brackets lock onto whatever is
  clickable and turn it gold, with a live coordinate readout and a ping on
  every click. Mouse only; touch keeps its own behaviour.
- **Stacked disciplines** — three cards that stack on one another as you
  scroll, beside a turntable (a d20, a code cube, a point-cloud globe) that
  turns a third each time a card lands, with the three options listed under
  it. Both read the cards' real positions, so they never drift.
- **Scroll scenes** — the hero fades away under the next section; an inset
  card opens out to full-bleed (clip-path, so no relayout) and its lines light
  up while it is pinned.
- **Type** — Geist Mono for everything, body, display and labels, the way a
  terminal or a game HUD sets type; posts keep Geist for long reading. Titles
  end on one lit pixel, and small `[ bracketed ]` labels sit over them.

## Built with

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React Compiler), static export |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, motion, three.js |
| Content | JSON files in [`content/`](content) |
| Hosting | GitHub Pages |

## Routes

```
/                     home
/work, /work/[slug]   projects
/games, /games/[slug] games
/skills               skills, derived from what shipped
/blog, /blog/[slug]   writing
/gallery              photographs
/contact              contact form (opens the visitor's mail app)
```

The site is fully static: there is no server, api or database. Every page is
prerendered from the files in [`content/`](content) at build time.

## Getting started

```bash
npm install
npm run dev
```

```bash
npm run build     # static site in out/
npm run preview   # build, then serve out/ the way cloudflare does
npm run lint
npm test          # post parser, link/image filtering, validation
```

## Editing content

Everything the site lists lives in [`content/`](content). Edit a file,
commit, and the next deploy picks it up.

- **Posts** — one file per post in [`content/blog/`](content/blog): title,
  subtitle, excerpt, date, tags, cover, then blocks (paragraphs, headings,
  images, quotes, lists, code). The format is in
  [`src/lib/blog/format.ts`](src/lib/blog/format.ts); a bad post fails the
  build instead of reaching the page.
- **Projects, games, photos** — [`projects.json`](content/projects.json),
  [`games.json`](content/games.json), [`photos.json`](content/photos.json).
- **Images** — put them in [`public/`](public) and reference them as `/...`.

## Deployment

GitHub Pages. Every push to `main` runs
[`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml): it builds the
site into `out/` and publishes it.

One-time setup, in the repo's **Settings → Pages**:

- Source: **GitHub Actions**
- Custom domain: `www.prabhatbhusal.com.np` (the same as [`CNAME`](CNAME)),
  then tick **Enforce HTTPS** once the certificate is issued

GitHub Pages sends no custom headers, so the security headers in
[`public/_headers`](public/_headers) (CSP, HSTS, nosniff, referrer and
permissions policies) only apply on a host that reads that file, such as
Cloudflare Pages.

> `.npmrc` pins `legacy-peer-deps=true`. This is deliberate: without it,
> `npm install` and `npm ci` disagree about the optional peer dependencies of
> `@napi-rs/wasm-runtime` (pulled in by wasm32 fallback bindings), and CI
> installs fail. Do not remove it.


## Contact

- **Email** — prabhatbhusal777@gmail.com
- **GitHub** — [@prabhatbhusal](https://github.com/prabhatbhusal)
- **LinkedIn** — [prabhat-bhusal](https://linkedin.com/in/prabhat-bhusal)
- **Location** — Kathmandu, Nepal

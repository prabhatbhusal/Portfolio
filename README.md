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

- 🔭 I’m currently engineering solutions for a **3D Gaussian Splatting (3DGS) platform**, bringing high-fidelity volumetric scenes to life.
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
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, motion, three.js |
| Backend | Next.js route handlers (`src/app/api`, `src/server`) |
| Database | PostgreSQL (Neon / Supabase / any Postgres) via `postgres` |
| Email | Resend |
| Hosting | Vercel or Railway |

## Routes

```
/                     home
/work, /work/[slug]   projects
/games, /games/[slug] games
/skills               skills, derived from what shipped
/blog, /blog/[slug]   writing
/gallery              photographs
/contact              contact form (stored + emailed)
/studio               sign in and edit everything — not linked, not indexed
/api/...              the backend the studio and contact form talk to
/media/[id]           uploaded images, cached forever by content hash
```

Public pages are prerendered and cached; saving anything in the studio
refreshes them (on-demand revalidation), so changes are live on the next
visit without a redeploy.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have — every key is optional locally
npm run dev
```

Without `DATABASE_URL` the site runs from the seed files in
[`content/`](content) and the studio says it needs a database. With it,
`npm run db` creates the tables and copies those files in (once).

```bash
npm run build   # migrates the database (if configured), then builds
npm run lint
npm test        # post parser, link/image filtering, validation
```

## The studio

`/studio` is where the site is edited. It is deliberately not linked from
anywhere, but the address is not the security — the account is:

- **One owner.** Sign-up only accepts `OWNER_EMAIL`, needs a six-digit code
  emailed to it, and closes for good once the account exists.
- **Sessions** are a random token in an `httpOnly`, `__Host-` cookie; only its
  SHA-256 is stored. Passwords use scrypt. Signing out kills the session
  server-side; a password reset signs every other device out.
- **Rate limits** on sign-in, codes and the contact form, kept in Postgres so
  they hold across serverless instances. Codes burn after five wrong guesses.
- **Every write** must come from this site (Origin check), is validated
  against the same schema the editor uses, and is size-capped.

What it edits:

- **Posts** — title, subtitle, cover, then paragraphs, headings, images,
  quotes, lists and code. Or **Import Word**: the Title style becomes the
  title, Subtitle the subtitle, an image before any text the cover, and the
  rest maps onto blocks. Preview renders through the site's own template.
  Save as a draft or publish.
- **Projects, games, photos** — forms generated from
  [`src/lib/content/kinds.ts`](src/lib/content/kinds.ts). Add a field there and
  it appears in the editor and in validation together.
- **Inbox** — everything sent through the contact form.

Images are shrunk to WebP (max 1600px) in the browser, then the server checks
the actual bytes (jpeg/png/webp/gif/avif only — never SVG) before storing
them. They are served with `nosniff` and a sandboxing CSP.

## Deployment

The backend is the Next.js server itself, so it goes wherever the site goes —
there is no second service to host.

### Vercel

1. Import the repo in Vercel.
2. **Storage → Create → Neon** (Postgres). It sets `DATABASE_URL` for you.
3. Add `OWNER_EMAIL` and `RESEND_API_KEY` (and later `MAIL_FROM`, once your
   domain is verified in Resend) under Settings → Environment Variables.
4. Deploy. The build runs `npm run db` first: tables are created and the
   current content is seeded on the first deploy.
5. Visit `/studio`, sign up with `OWNER_EMAIL`, confirm the code.
6. Point `www.prabhatbhusal.com.np` at Vercel (Settings → Domains) — it
   replaces the old GitHub Pages setup.

### Railway

Railway runs it as one long-lived Node server next to a Postgres, which suits
it well. [`railway.json`](railway.json) already holds the build, start and
health-check settings.

1. **New project → Deploy from GitHub repo**, pick this repo.
2. **+ New → Database → PostgreSQL** in the same project.
3. On the app service, **Variables**:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` — the private network, used
     at runtime.
   - `DATABASE_PUBLIC_URL` = `${{Postgres.DATABASE_PUBLIC_URL}}` — builds
     cannot reach the private network, so the build (migrations + prerender)
     uses this one.
   - `OWNER_EMAIL`, `RESEND_API_KEY` (and `MAIL_FROM` later).
4. **Settings → Networking → Generate domain**, or add your own.
5. Deploy. A new build only takes traffic once `/api/health` answers, which
   includes reaching the database.
6. Visit `/studio`, sign up with `OWNER_EMAIL`, confirm the code.

Keep it to one replica: pages refreshed by the studio are cached on that
instance's disk.

Security headers (CSP with `frame-ancestors 'none'`, HSTS, nosniff,
referrer and permissions policies) are set in
[`next.config.ts`](next.config.ts).

> `.npmrc` pins `legacy-peer-deps=true`. This is deliberate: without it,
> `npm install` and `npm ci` disagree about the optional peer dependencies of
> `@napi-rs/wasm-runtime` (pulled in by wasm32 fallback bindings), and CI
> installs fail. Do not remove it.


## Contact

- **Email** — prabhatbhusal777@gmail.com
- **GitHub** — [@prabhatbhusal](https://github.com/prabhatbhusal)
- **LinkedIn** — [prabhat-bhusal](https://linkedin.com/in/prabhat-bhusal)
- **Location** — Kathmandu, Nepal

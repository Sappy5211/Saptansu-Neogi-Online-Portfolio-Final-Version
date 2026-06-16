# Saptansu Neogi — Portfolio

Personal portfolio for **Saptansu Neogi**, targeting roles in Finance, Investment Banking, Private Equity, Consulting, FP&A and Data Analytics. Built as a fast, accessible, single-page React app.

**Live:** _deploy on Vercel (see below)_

---

## Tech stack

- **React 19** + **TypeScript** (Vite 8)
- **Tailwind CSS v4** (`@theme` tokens, no config file)
- **motion/react** (Framer Motion v12) for animation
- **lucide-react** icons, **class-variance-authority** for variants
- Contact form posts to **FormSubmit** (no backend required)

## Project structure

```
web/
├── public/                     # static assets served at site root
│   ├── hero-coastal.mp4         # hero background video (seamless loop)
│   ├── hero-coastal-poster.jpg  # video poster / reduced-data fallback
│   ├── favicon.svg
│   └── (add) Saptansu-Neogi-CV.pdf   # linked by Download CV buttons
├── src/
│   ├── App.tsx                 # composes Navbar + all sections
│   ├── main.tsx                # React entry
│   ├── index.css               # Tailwind import + coastal palette tokens
│   ├── lib/                    # cn() util, shared motion variants
│   └── components/
│       ├── ui/                 # navbar, hero, buttons, section/reveal primitives, stat-visuals
│       └── sections/           # about, experience, projects, now, contact
├── index.html
├── vite.config.ts              # @ alias -> src
├── vercel.json                 # Vercel build config (Vite preset)
└── tsconfig*.json
```

### Sections (in order)
Hero → About → Experience → Projects & Certifications → Now → Contact.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # tsc -b && vite build  ->  outputs to dist/
npm run preview  # preview the production build locally
```

## Deploy to Vercel

1. Push this repo to GitHub (already configured to `Sappy5211/Saptansu-Neogi-Online-Portfolio-Final-Version`).
2. In Vercel, **New Project → Import** this repository.
3. Vercel auto-detects the **Vite** preset from `vercel.json`:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Click **Deploy**. No environment variables are required.

> If the repository root differs (e.g. this app is in a `web/` subfolder of a larger repo), set the Vercel **Root Directory** to that subfolder. This repo is the app root, so no change is needed.

## Before going live (open items)

- **Contact email:** replace the placeholder `EMAIL` in `src/components/sections/contact.tsx` with your real address, then submit the form once to click FormSubmit's one-time activation email.
- **Profile photo:** add `public/pfp.jpg` and swap the "SN" placeholder in `src/components/ui/hero.tsx`.
- **CV:** add `public/Saptansu-Neogi-CV.pdf` (referenced by the Download CV buttons and nav).

## Accessibility & performance

- WCAG AA contrast, full keyboard support, visible focus rings.
- All motion honours `prefers-reduced-motion`.
- Hero video is skipped on small screens / reduced-data; static poster shown instead.

# Bandito — landing page

Marketing landing page for **Bandito**, Instagram content intelligence for agencies, creators and brands.
It tells the product story in Spanish: connect your Instagram, add competitors, and get a side-by-side
view and evidence-backed insights in a single dashboard. Dark-first, one warm orange accent, aligned
with the Bandito app's palette and type.

All calls to action open the app at `APP_URL` (sign-in goes to `${APP_URL}/login`). Both are defined in
`src/data/content.ts`.

## Run

```bash
npm install
npm run dev        # Vite dev server
npm run build      # type-check + production build
```

`npm run build:offline` bundles with esbuild into `dist/` (plus a single-file
`dist/standalone.html`) when Vite isn't available.

## Stack

- React 19 + TypeScript, Vite
- Icons: Lucide via `react-icons/lu`
- Fonts: **Dingos** for display (OTF files in `public/fonts/dingos`, copied from the app, with
  Barlow 700/800 as fallback) and **Plus Jakarta Sans** 400–800 for UI/body (Google Fonts)
- Logo: the white app logo in `public/logo/`, used on the dark background
- Styling: plain CSS with design tokens (`src/styles/tokens.css`) — no utility framework
- Motion: a small in-house engine (`src/motion/`) instead of GSAP/Framer Motion

## Content

- Spanish (neutral, "tú"), `<html lang="es">`.
- Plans and prices shown are the ones that apply **after** the free beta: Creador ($9.990 CLP/mes),
  Empresa ($39.990 CLP/mes) and Agencia (US$279/mes). The Pricing section states that the beta is free now.
- Sample clients, handles, metrics and testimonials are fictional. No security certifications are claimed.

## Structure

```
src/
  components/
    Navbar.tsx             sticky glass nav, gliding hover pill, animated mobile panel
    Hero.tsx / HeroVisual.tsx  manual notes → side-by-side card → evidence chips, pointer parallax
    ProductIntro.tsx       scroll-scrubbed statement with metric cards
    HowItWorks.tsx         connect → add competitors → insights, animated mini-illustrations
    FeatureSection.tsx     pinned product stage + four chapters (desktop); inline on mobile
    FeatureVisuals.tsx     the four feature demos (side by side, insights, content, reports)
    Workflow.tsx           draggable before/after comparison (keyboard accessible range)
    InteractiveDashboard.tsx  working app preview: client switcher, tabs, competitor toggles
    Testimonials.tsx, Security.tsx (privacy and data), Pricing.tsx, FinalCTA.tsx, Footer.tsx
    MagneticButton.tsx     lerped magnetic pull, label travels further than shell
    PointerParallax.tsx    depth layers driven by the shared pointer loop
    ScrollReveal.tsx       Reveal (fade/up/scale/mask/clip, stagger) + RevealLines
    TiltCard.tsx           subtle tilt + cursor spotlight
    ScaledStage.tsx        fixed-size compositions scaled to fit any width
    HandMarks.tsx          annotation marks (circles, arrows, underline) in the accent colour, note card
  motion/
    pointer.ts   one pointermove listener + one rAF lerp loop that sleeps when settled
    scroll.ts    one coalesced scroll ticker + progress helpers
    hooks.ts     useInView, useScrollVar (writes progress to a CSS var, no re-renders)
    env.ts       lerp/damp (frame-rate independent), reduced-motion & fine-pointer checks
  data/content.ts  all copy, URLs and fictional sample data
  styles/          tokens, base, motion, sections, visuals
public/
  fonts/dingos/    display font files
  logo/            app logo PNGs
```

## Motion principles

- Pointer effects only run with `(hover: hover) and (pointer: fine)` and no reduced-motion preference.
- Everything animates `transform`, `opacity` or `clip-path`; per-frame values are written
  straight to styles/CSS variables, never through React state.
- `prefers-reduced-motion: reduce` collapses every entrance to its end state and stops loops.

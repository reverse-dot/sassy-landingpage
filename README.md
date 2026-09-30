# Mendleaf — landing page

A fictional health-tech brand and landing page: handwritten clinical notes become structured,
actionable records. Original brand, copy, illustrations, product UI and motion.

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
- Fonts (Google Fonts, open licence): **Geist** for UI/body, **Caveat** for handwriting
- Styling: plain CSS with design tokens (`src/styles/tokens.css`) — no utility framework
- Motion: a small in-house engine (`src/motion/`) instead of GSAP/Framer Motion

## Structure

```
src/
  components/
    Navbar.tsx             sticky glass nav, gliding hover pill, animated mobile panel
    Hero.tsx / HeroVisual.tsx  messy → organised → actionable story, pointer parallax
    ProductIntro.tsx       scroll-scrubbed statement, fanning paper sheets
    HowItWorks.tsx         three steps with animated mini-illustrations, drawn connector
    FeatureSection.tsx     pinned product stage + three chapters (desktop); inline on mobile
    FeatureVisuals.tsx     the three feature demos
    Workflow.tsx           draggable before/after comparison (keyboard accessible range)
    InteractiveDashboard.tsx  working app preview: patients, tabs, search, tasks
    Testimonials.tsx, Security.tsx, Pricing.tsx, FinalCTA.tsx, Footer.tsx
    MagneticButton.tsx     lerped magnetic pull, label travels further than shell
    PointerParallax.tsx    depth layers driven by the shared pointer loop
    ScrollReveal.tsx       Reveal (fade/up/scale/mask/clip, stagger) + RevealLines
    TiltCard.tsx           subtle tilt + cursor spotlight
    ScaledStage.tsx        fixed-size compositions scaled to fit any width
    HandMarks.tsx          original hand-drawn circles, arrows, underline, signature, paper
  motion/
    pointer.ts   one pointermove listener + one rAF lerp loop that sleeps when settled
    scroll.ts    one coalesced scroll ticker + progress helpers
    hooks.ts     useInView, useScrollVar (writes progress to a CSS var, no re-renders)
    env.ts       lerp/damp (frame-rate independent), reduced-motion & fine-pointer checks
  data/content.ts  all copy and fictional sample data
  styles/          tokens, base, motion, sections, visuals
```

## Motion principles

- Pointer effects only run with `(hover: hover) and (pointer: fine)` and no reduced-motion preference.
- Everything animates `transform`, `opacity` or `clip-path`; per-frame values are written
  straight to styles/CSS variables, never through React state.
- `prefers-reduced-motion: reduce` collapses every entrance to its end state and stops loops.

Names, testimonials, patients and practices are fictional. No real-world certifications are claimed.

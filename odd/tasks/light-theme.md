# Feature: light-theme

## Objective
Add a light version of the landing page and a Dark/Light selector in the top navbar. Dark (current look) stays the default.

## Scope
- Light palette as a `[data-theme="light"]` override of the tokens in `src/styles/tokens.css`.
- Replace hardcoded colors in `base.css`, `sections.css`, `visuals.css`, `motion.css`, `dashboard.css` with tokens where they must change per theme.
- Theme toggle in `Navbar.tsx` (desktop + mobile), persisted in `localStorage` (try/catch), applied before first paint via inline script in `index.html` to avoid flash.
- `Logo.tsx` swaps to `bandito-logo-black.png` in light mode.

## Constraints
- Dark mode must look identical to today.
- Artifacts in English. TDD: no test runner in project (TDD mode enabled globally, runner missing) → functional check is `npm run build` + visual inspection.

## Tasks
- [x] T1 Light tokens + theme attribute + no-flash script (route: delegated writer, 4+ files). Done: `:root[data-theme="light"]` in tokens.css, `src/theme.ts` (useTheme), inline no-flash script + theme-color sync in index.html.
- [x] T2 De-hardcode theme-dependent colors across CSS (delegated writer). Done: white-alpha washes, dots, nav glass, shadows, accent text moved to new tokens (dark values unchanged).
- [x] T3 Navbar toggle + logo swap (delegated writer). Done: ThemeSwitch (Dark | Light, aria-pressed) in desktop nav and mobile panel; Logo uses black PNG in light.
- [x] T4 Build passes, commit on `feat/light-theme` (bde7f7a)

## Acceptance
- Toggle switches between dark and light instantly; choice survives reload.
- Light mode has readable contrast everywhere; no dark leftovers in sections/visuals/dashboard.
- `npm run build` passes.

## Progress
- Branch `feat/light-theme` created. Next: T1–T3 via one writer.

## Verification (T1-T3)
- `npm run build`: passes (tsc -b + vite build, 66 modules).
- Hardcoded color grep over base/sections/visuals/motion/dashboard: remaining are only orange accent glows/gradients (rgba(255,122,80,..), peach tints), `#000` mask alpha stops, white inset highlight on the orange primary button, black ring around the compare handle, and per-metric highlight hues (green/yellow); all are theme-safe (tinted accent or on accent fills). Visual inspection in a browser still pending.

# Feature: dashboard-preview-parity

## Objective
Redesign the app preview below the landing hero (`AppPreview` in `src/components/InteractiveDashboard.tsx` + `src/styles/dashboard.css`) so it looks identical to the real client dashboard of the Sassy app (`C:\Users\lopez\OneDrive\Documents\Sassy`, route `src/routes/(app)/clients/[id]/+page.svelte`).

## Why
The current preview shows an older, invented layout (client list, tabs, side-by-side table). Visitors should see the product as it actually is.

## Scope
- Only this landing repo changes. The Sassy repo is a read-only visual reference; it must not be modified.
- Reproduce the Sassy client page layout: app shell (dark sidebar rail + top bar), client header, 4 KPI cards, "Rendimiento" card (CompetitorComparison, growth chart default) at 60% beside "3 cosas que deberías saber" (InsightsList teaser) at 40%, best posts grid (full width), quality strip.
- Static, invented sample data (Spanish copy, matching the landing's language). No backend.
- Keep the hero integration: `AppPreview` export, `.dash__wrap` root, scroll-driven `--p` transform from `Hero.tsx`.

## Constraints
- Code, identifiers, and comments in English; UI copy in Spanish (landing language).
- TDD: enabled globally, but the project has no test runner → functional check is `npm run build` + visual inspection.
- Dark theme only (landing is dark-only).

## Tasks
- [x] T1 Rewrite `AppPreview` markup + styles + sample data to match the Sassy client dashboard (route: delegated writer — 2+ non-trivial files and 4+ reference files). Done: `InteractiveDashboard.tsx` rewritten (Sassy shell + page), new `PreviewLineChart.tsx` (inline SVG), `dashboard.css` rewritten (`dp-*`), `dashboardPreview` sample data in `content.ts`. Known gaps: no "Rendimiento por formato" metric; Unovis axis/grid defaults approximated; static language flag/theme icon; preview renders full height.
- [x] T2 `npm run build` passes; visual check in the browser; commit on `feat/dashboard-preview-parity`.

## Acceptance
- Side by side with the Sassy client dashboard, the preview has the same sections, order, proportions, card styles, typography scale, colors, and chart look.
- Hero scroll reveal still works; no horizontal overflow at phone width.
- `npm run build` passes.

## Progress
- 2026-09-30: Branch `feat/dashboard-preview-parity` created from `origin/main`. Next: T1.
- 2026-09-30: T1 done. `npm run build`: passes (writer + parent spot check). Sassy repo git status unchanged. Next: user visual check, then commit (T2).
- 2026-09-30: User asked to show only ~half the dashboard. `.dp__body` capped at `max-height: 720px` with a bottom fade mask. Build passes.
- 2026-09-30: KPI fixes from user review: coverage track no longer stretches vertically (`flex: none` on `.dp-track--cover`, it inherited `flex: 1` inside a column card); big values 40px→28px, day/hour 26px→17px (classes renamed `--lg/--md/--sm`). Build passes.
- 2026-09-30: "Mejor momento" card: removed best day/best hour footer (and its data fields + dead CSS); the weekday chart now fills the card with per-day ER labels, rounded bars, accent gradient on the best day. Build passes.
- 2026-09-30: Weekday bars use the striped fill of the format bars; per-bar % labels replaced by a left Y axis (max/mid/floor ticks + gridlines). Build passes.
- 2026-09-30: Bug: weekday bars rendered at 0 height (in-flow % height inside a flexed card is not definite). Fixed by absolutely positioning bars in their slot. Verified with headless Edge screenshot (vite preview): bars visible, Thursday striped orange.
- 2026-09-30: User asked to drop the Y axis % and gridlines: chart is now striped bars + weekday letters only. Build passes; verified by screenshot.
- 2026-09-30: T2 done. Build passes; committed and pushed `feat/dashboard-preview-parity`.

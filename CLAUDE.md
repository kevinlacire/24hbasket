# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev    # dev server on localhost:3000 (Turbopack)
pnpm build  # static export to ./out (production)
```

The package manager is **pnpm** (not npm). No test runner is configured — testing is done manually in the browser.

## Architecture

Single-page Next.js 15 app (static export → GitHub Pages). The entire interface is contained in one viewport: **no scrolling, ever** — this is a hard constraint enforced via `html, body { overflow: hidden }` and a flex column layout on `.scoreboard` that fills exactly `100dvh`.

### Layout hierarchy (top → bottom)

| Section | CSS class | Behaviour |
|---|---|---|
| Header | `.scoreboard__header` | `flex: 0 0 auto` — title + mute toggle |
| Countdown | `.scoreboard__timer` | `flex: 0 0 auto` — ScoremarkDemo font |
| Scores | `.scoreboard__scores` | `flex: 1 1 0; min-height: 0` — fills remaining space |
| Sound effects | `.scoreboard__sounds` | `flex: 0 0 auto` — wrapping pill buttons |
| Sponsors | `.scoreboard__sponsors` | `flex: 0 0 auto` — wrapping logo strip |

### Key files

- `app/page.tsx` — all state and logic (scores, audio, fireworks, countdown)
- `app/globals.css` — entire CSS; no Tailwind, no Bootstrap
- `app/layout.tsx` — loads two custom fonts via `next/font/local`
- `app/photos.tsx` — exports `sponsorUrls[]` using `NEXT_PUBLIC_BASE_PATH` for correct paths in prod

### Tournament date

`OFFICIAL_END` in `page.tsx:10` is hardcoded as `Date.UTC(2026, 4, 30, 17, 0, 0)`. Update this for each tournament year.

### State persistence

Scores are persisted to `localStorage` (`scoreBlue`, `scoreRed` keys) so a page refresh doesn't reset the score. `useExitPrompt` (always active) blocks accidental browser close/refresh with a native confirm dialog.

### Asset paths & basePath

`next.config.js` sets `basePath: process.env.PAGES_BASE_PATH` (injected by GitHub Actions). The same value is exposed as `NEXT_PUBLIC_BASE_PATH` so `photos.tsx` can prefix sponsor image URLs at build time.

### Fonts

Two custom fonts are loaded in `layout.tsx` and exposed as CSS variables:
- `--font-scoremark` (ScoremarkDemo-Regular.otf) — used for countdown display and team scores
- `--font-digital7` (digital-7-mono-italic.ttf) — loaded but not currently referenced in `globals.css`

### Audio

`howler` (`Howl` / `Howler`) plays MP3s from `public/`. `Howler.stop()` kills the current sound before starting a new one. The `isMuted` flag calls `Howler.volume(0|1)` globally. Sounds with `random: true` in the `SOUNDS` array (usa, kaboom) pick randomly between `-1.mp3` and `-2.mp3` variants.

### Fireworks

`@fireworks-js/react` is triggered on countdown completion (`onComplete`) and by the Konami code easter egg (↑↑↓↓←→←→BA). The `Fireworks` component sits fixed-position behind everything (`zIndex: 50, pointerEvents: none`) and is started via a `useRef<FireworksHandlers>`.

### Timer urgency

The countdown color changes state based on remaining time: `normal` (green) → `warning` (amber, < 5 min) → `critical` (red pulsing, < 1 min).

### Score flash animation

`team__flash` uses a `key={`flash-${score}`}` React trick to force a DOM remount on each score change, re-triggering the CSS fade-out animation without JavaScript.

### Adding sponsors

Add the image file to `public/sponsors/` and append the filename to `SPONSOR_IDS` in `app/photos.tsx`.

## Design context

The UI is designed to be read from **8–10 metres** (projected on a TV or large screen at a sports event). Priorities: legibility at distance, no ambiguity for non-technical volunteer operators, festive tournament energy. Avoid mobile-app aesthetics, thin text, glassmorphism, or subtle elements. Score and countdown must always dominate visually.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with `PAGES_BASE_PATH` set by `actions/configure-pages` and deploys the `./out` directory to GitHub Pages.

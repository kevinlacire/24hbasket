# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev    # dev server on localhost:3000 (Turbopack)
npm run build  # static export to ./out (production)
```

No test runner is configured — testing is done manually in the browser.

## Architecture

Single-page Next.js 15 app (static export → GitHub Pages). The entire interface is contained in one viewport: **no scrolling, ever** — this is a hard constraint enforced via `html, body { overflow: hidden }` and a flex column layout on `.scoreboard` that fills exactly `100dvh`.

### Layout hierarchy (top → bottom)

| Section | CSS class | Behaviour |
|---|---|---|
| Header | `.scoreboard__header` | `flex: 0 0 auto` — title + mute toggle |
| Countdown | `.scoreboard__timer` | `flex: 0 0 auto` — digital7 font |
| Scores | `.scoreboard__scores` | `flex: 1 1 0; min-height: 0` — fills remaining space |
| Sound effects | `.scoreboard__sounds` | `flex: 0 0 auto` — wrapping pill buttons |
| Sponsors | `.scoreboard__sponsors` | `flex: 0 0 auto` — horizontal scroll strip |

### Key files

- `app/page.tsx` — all state and logic (scores, audio, fireworks, countdown)
- `app/globals.css` — entire CSS; no Tailwind, no Bootstrap
- `app/layout.tsx` — loads `digital-7-mono-italic.ttf` via `next/font/local` as `--font-digital7`
- `app/photos.tsx` — exports `sponsorUrls[]` using `NEXT_PUBLIC_BASE_PATH` for correct paths in prod

### Asset paths & basePath

`next.config.js` sets `basePath: process.env.PAGES_BASE_PATH` (injected by GitHub Actions). The same value is exposed as `NEXT_PUBLIC_BASE_PATH` so `photos.tsx` can prefix sponsor image URLs at build time. The digital7 font is handled automatically by `next/font/local`.

### Audio

`howler` (`Howl` / `Howler`) plays MP3s from `public/`. `Howler.stop()` kills the current sound before starting a new one. The `isMuted` flag calls `Howler.volume(0|1)` globally.

### Fireworks

`@fireworks-js/react` is triggered on countdown completion (`onComplete`). The `Fireworks` component sits fixed-position behind everything (`zIndex: 50, pointerEvents: none`) and is started via a `useRef<FireworksHandlers>`.

# Tide & Tile handoff

## Independent verification 1 — FAIL

Candidate `a750d44d7773ed167a08ffdee43e4fbfeaa52c6a` at https://tide-and-tile.sociobot.in was independently checked on 2026-09-01 UTC. **Result: FAIL. Do not release.**

All five declared claim commands, `npm run test:unit`, `npm test`, and `npm run build` passed. The live application JS/CSS SHA-256 values match the candidate build, and browser checks found no console/page errors, no third-party demo requests, and no axe serious/critical issues.

Release-blocking defects: the win check accepts a disconnected tile pattern rather than one continuous route; the sample completes in 12 turns while displaying “Fewest 4”; completion is only an inline message with no real end screen or loss state; and required game claims for an end screen, persistence, frame-rate target, and advertised modes are absent. Completed progress is saved but ignored after reload. At 390 × 844 the playable board is below the first captured viewport. Live response headers also omit the configured CSP and immutable asset caching, and the fixed service-worker cache name has no demonstrated update path.

Full evidence, exact commands, observed output, passing checks, and severity-ranked findings are in `.factory/verification-1.md`.

## What shipped

- A static Vite + TypeScript browser puzzle with a deterministic date seed, 4×4 rotating water route, turn counter, fewest-turn medal, restart, result copy, archive choices, sound preference, and a fixed-step requestAnimationFrame loop.
- The first three real visits use short rule prompts. The always-available `/demo` uses a separate `demo:` storage namespace and includes reset and exit controls.
- Keyboard support includes Tab, Enter/Space button activation, and arrow-key movement between tiles. Touch targets are full tile buttons.
- `/privacy`, `/terms`, a styled `404`, metadata, robots, sitemap, favicon, offline service worker, and static-host headers are included.
- Original harbor illustration generated with the factory image deployment. Source PNG, prompt sidecar, and optimized 57 KB WebP are in `assets/src/` and `public/`; provenance is in `design.md`.

## Verification

- `npm test` passes: six Playwright tests cover demo isolation, same-origin-only demo requests, keyboard tile operation, restart, offline reload, and an in-browser axe-core WCAG A/AA scan with no serious or critical findings.
- `npm run test:unit` passes: three deterministic game-core tests.
- `npm run build` passes and produces `dist/index.html`.
- Production bundle: JavaScript 4.55 KB gzip; CSS 2.08 KB gzip; landing illustration 57 KB WebP. No console errors were observed in a 390×844 Playwright smoke check.
- Lighthouse CLI could not complete in this container because it crashes against the supplied headless Chromium; this is the only unavailable measurement. The equivalent in-browser axe accessibility scan passes.

## Run and deploy

`npm install`, then `npm run dev`. Verify the isolated board at `/demo`. Build with `npm run build`; deploy the `dist/` folder with `staticwebapp.config.json`.

## Known gaps / next steps

- The daily route shape is intentionally stable; the seeded scramble changes each day. A future content pass could add more solved-route templates while preserving the teachable first board.
- Lighthouse performance scoring should be rerun in the deployment browser environment.

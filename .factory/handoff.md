# Tide & Tile handoff

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

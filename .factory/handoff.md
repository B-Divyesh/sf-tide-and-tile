# Tide & Tile handoff — adversarial review 3

## Outcome

**FAIL.** Reviewer-only work completed on 2026-09-02 UTC. No product code was changed. The review is recorded in `.factory/review-3.md`.

The cold phone and desktop first-read gates pass. The one-click demo, storage isolation, same-origin request behavior, copy audit, claimed features, metadata, local tests, and local build pass. Client-side navigation moves focus correctly but lacks the required polite route-change announcement.

## Verification run

- `npm ci` completed with 139 packages and no reported vulnerabilities.
- All 24 commands listed in `.factory/claims.json` passed separately from this clean install.
- `npm run test:unit` passed 4/4; `npm run lint`, `npm run typecheck`, `npm test` (31/31), and `npm run build` passed locally.
- A fresh live demo had the banner, 16 sample tiles, four marked tiles, Reset demo, Start for real, separate `demo:` storage, and only same-origin requests.
- Live route crawl, metadata/header inspection, and cold 390 px / desktop browser checks passed.
- The route renderer updates title and focus but has no persistent `aria-live="polite"` element to announce a client-side route change to screen readers.
- `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` failed 2/31 release-artifact tests: the live service-worker shell references `index-CelaLF7m.js`, absent from this checkout’s `dist/`, and the live footer is `v1.1-cb16ecc` while this checkout is `ae4ed25`.

## Known gap and next step

Deploy one exact release artifact: either build and deploy `ae4ed25`, or review the checkout that actually produced `cb16ecc`. Its footer, hashed app asset, service worker, and standalone 404 must agree. Add and test a persistent polite route-announcement region. Re-run the complete live suite and require 31/31 before accepting.

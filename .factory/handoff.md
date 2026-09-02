# Tide & Tile handoff — perfection loop round 2

## Outcome

All findings from `.factory/review-1.md` and `.factory/review-2.md` are closed. Tide & Tile remains a static, local-first browser game with its neo-brutalist harbor-workshop identity intact.

The first screen now uses plain, supportable wording. `/demo` and `/?demo=1` open the isolated four-turn sample in one click, with a persistent banner, reset, and exit. Demo data uses only `demo:tide-and-tile`; leaving removes that record without reading or changing real progress.

The daily and sample headings are “Today’s board” and “Sample board.” Daily results use “Board date,” without player-facing UTC jargon. The unsupported duration statement and tautological claim were removed. A new `medal-thresholds` claim proves Tide, Harbor, and Dock results through real 4-, 8-, and 12-turn browser runs.

## Verification evidence

- Fresh install: `npm ci` completed with zero vulnerabilities.
- Type and lint: `npm run typecheck` and `npm run lint` passed.
- Unit: `npm run test:unit` passed 4/4.
- Full local integration/browser suite: `npm test` passed 31/31.
- Clean clone: every one of the 24 manifest commands in `.factory/claims.json` passed separately.
- Full production suite: `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` passed 31/31.
- URL verifier: `.factory/evidence/polish-2-live/verify.json` records HTTP 200, no console errors, `lang=en`, one h1, one main, no missing alt text, and no unlabeled buttons.
- Accessibility: the Playwright axe integration found no serious or critical WCAG A/AA violations on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, or the win dialog.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100. LCP was 1.1 s, CLS 0, and total blocking time 30 ms. Evidence: `.factory/evidence/polish-2-live/lighthouse-mobile.json`.
- Cold mobile screenshots: `.factory/evidence/polish-2-live/screenshot-mobile.png` and `.factory/evidence/polish-2-live/demo-mobile.png`.
- Routing: `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` returned 200; `/missing-polish-check` returned the designed 404 with HTTP 404.
- Response policy: live hashed JavaScript returned one-year immutable caching. The live page returned strict same-origin CSP, `frame-ancestors 'none'`, nosniff, and strict-origin referrer policy.
- Performance budget: built JavaScript is 19.01 kB raw / 7.53 kB gzip; CSS is 9.10 kB raw / 2.86 kB gzip; the harbor illustration is 60 kB.
- Game loop: the 60 fps claim passed under 4× CPU slowdown, and the hidden-tab test recorded zero simulation steps while paused.

## Run and deploy

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
/opt/fleet/lib/deploy-static.sh tide-and-tile /work/repo/dist
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test
```

Deploy only `dist/`. The build writes the Git revision into the app and standalone 404, and versions the offline cache from its content.

## Known gaps and next steps

None. No finding of any severity remains open, and no external service, account, analytics, payment, or runtime AI dependency was added.

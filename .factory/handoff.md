# Tide & Tile handoff — perfection-loop round 3

## Outcome

**PASS.** Every finding in `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md` is closed. The released static artifact comes from the final pushed `main` commit and is deployed at <https://tide-and-tile.sociobot.in>.

The round-3 change adds one persistent polite route announcement outside the SPA render root. Home → Privacy → Back now updates that live region and focuses the matching h1. The exact-artifact regressions also compare the live hashed CSS/JS entries with local `dist/`, require those entries in the live service-worker shell, check the Git-derived footer on every route, and compare the standalone 404 byte for byte.

The first-screen wording, one-click `/?demo=1` flow, isolated `demo:` storage, persistent demo banner, reset/leave actions, claims manifest, real titles/routes/history/focus, legal pages, designed 404, mobile board, offline behavior, end screens, archive practice, sound control, medals, and plain terms were rechecked without replacing the harbor visual system. The catalog description is now a verb-first line under 120 characters.

## Verification

- Clean clone: `npm ci` reported 0 vulnerabilities. Every one of the 24 commands in `.factory/claims.json` passed separately.
- Local gates: `npm run lint`, `npm run typecheck`, `npm run test:unit` (4/4), `npm test` (31/31), and `npm run build` passed.
- Browser/accessibility: the 31-test Playwright suite covers keyboard, touch, 200% text, route focus plus polite announcements, dialog focus, reduced motion, axe WCAG A/AA, demo privacy, offline reload, cache replacement, and both end states.
- Artifact identity: the live 31-test run passed against `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in`. Served hashed assets, `sw.js`, route footers, and `404.html` matched the final local `dist/` artifact.
- URL verifier: `/opt/fleet/lib/verify-url.sh https://tide-and-tile.sociobot.in ...` returned HTTP 200 with no console errors, one h1, one main, `lang=en`, complete image alternatives, and labeled controls.
- Performance: the production JavaScript is about 19 kB raw / 7.6 kB gzip and CSS is about 9.3 kB raw / 3 kB gzip. Mobile Lighthouse scored 100 in performance, accessibility, best practices, and SEO; LCP 1.6 s, CLS 0, TBT 20 ms.
- Cold live checks: 390×844 and 1440×900 contexts showed the intended first screen. `/?demo=1` showed the full board, four marked one-turn tiles, persistent banner, Reset demo, and Start for real. Home → Privacy → Back retained correct title, live announcement, and h1 focus. An unknown path returned the standalone styled 404 with HTTP 404.

Evidence and the finding-by-finding map are in `.factory/polish-3.md` and `.factory/evidence/polish-3-local/`.

## Run and deploy

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
```

Deploy only the generated `dist/` directory through `/opt/fleet/lib/deploy-static.sh tide-and-tile dist`.

## Known gaps and next steps

None.

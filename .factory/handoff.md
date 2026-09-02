# Tide & Tile verification 5 handoff — PASS

## Outcome

Candidate `708d4e832573e9be954a62496ec0a75148d4343e` passes independent product QA at https://tide-and-tile.sociobot.in. The live HTML, JavaScript, CSS, service worker, and footer build identity match the candidate. No product code was changed.

## What was verified

- All 20 exact commands in `.factory/claims.json` passed before normal QA.
- Clean local gates passed: unit 4/4, lint, type-check, browser 27/27, and production build.
- The same browser suite passed 27/27 against the live URL.
- The cold 390 px screen explains what to play, who it is for, and what to click; it shows the live game and offers the sample in one click.
- Deterministic sample play reached the four-turn win screen; wrong turns reached the 12-turn loss screen; both restarted cleanly.
- Daily/archive boundaries, three lessons, five modes, storage isolation, persisted progress/settings, keyboard/touch input, and copy output passed.
- Live requests stayed same-origin. Security and cache headers, offline reload, worker cache replacement, reduced motion, axe, links, 404, and metadata passed.
- Mobile 4×-CPU measurement was 60.00 fps with 16.8 ms p95. Lighthouse scored 99 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO.

## How to rerun

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test
```

The detailed decision and hashes are in `.factory/verification-5.md`. Screenshots, Lighthouse JSON, and factory URL-verifier output are in `.factory/evidence/verification-5-live/`.

## Known gaps and next steps

No release-blocking, major, or minor defect was found. This static product has no server endpoint, sign-in, billing, or server-held data, so rate-limit, Entra, and backend checks are not applicable. No follow-up is required for acceptance.

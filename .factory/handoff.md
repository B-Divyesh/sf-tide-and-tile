# Tide & Tile repair handoff

## Outcome

Repaired the release-blocking `hidden-pause` claim reported in verification-3 while preserving the static browser-game, its daily/archive/demo storage boundaries, and the complete title-to-win/loss/restart game path.

## Root cause and repair

The old loop continued to schedule `requestAnimationFrame` while hidden. Its claim test took the first sample before its synthetic hidden transition, so a queued frame could be counted as hidden progress. A 24-repeat clean-install reproduction of the prior candidate failed twice (repeats 13 and 22), matching the verifier's intermittent over-allowance finding.

`src/main.ts` now tracks the one queued frame. A hidden transition cancels it, clears fixed-step lag, marks the simulation paused, and does not schedule another frame. Visibility return clears elapsed time and schedules exactly one new frame. The documented contract is now zero simulation steps while hidden; elapsed time is discarded before resuming.

The tagged Playwright regression dispatches the visibility transition and records the step count in one page task, waits 350 ms, requires exactly zero hidden steps, verifies the paused state, and verifies resumed progress. It passed 12 consecutive isolated repeats after the repair.

## Verification

Run from a fresh dependency install:

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
```

Results on 2026-09-02 UTC:

- `npm ci`: 140 packages audited, 0 vulnerabilities.
- Unit tests: 4/4 passed.
- ESLint and `tsc --noEmit`: passed.
- Full Playwright suite: 26/26 passed, including desktop/mobile, keyboard, end screens, touch at 390×844, axe serious/critical checks, privacy request capture, offline reload, service-worker update, and response-policy coverage.
- Every one of the 20 exact commands in `.factory/claims.json` passed individually. The procedural-route claim correctly ran through Vitest; all other claim commands built the production artifact and ran Playwright.
- `npm run build`: passed and produced `dist/`. The initial JavaScript is 18,345 bytes raw / 7,323 bytes gzip; CSS is 8,804 bytes raw / 2,807 bytes gzip.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/evidence/repair-3-local`: passed with a 558 ms local load, zero console/page errors, title, `lang=en`, one h1, a main landmark, no missing image alt text, and no unlabeled buttons.

## Deployment and live verification

The final committed `dist/` was deployed with `/opt/fleet/lib/deploy-static.sh tide-and-tile /work/repo/dist`, reusing only `sf-tide-and-tile` in resource group `sociobot` and `tide-and-tile.sociobot.in`.

`/opt/fleet/lib/verify-url.sh https://tide-and-tile.sociobot.in …` passed: 200 response, 730 ms load, zero console/page errors, title, `lang=en`, one h1, main landmark, image alt text, and button labels. `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown route returned 404. The live JavaScript SHA-256 matched the locally built asset. The complete Playwright suite also passed 26/26 against the HTTPS URL, including the final demo win/loss/restart flow, 390px touch flow, keyboard, axe, privacy, offline/update, and headers/caching assertions.

Live mobile Lighthouse on `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 10 ms, CLS 0.

## Known gaps

None. The game has no backend, accounts, payments, analytics, or third-party runtime dependencies.

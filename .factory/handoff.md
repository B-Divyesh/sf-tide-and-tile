# Tide & Tile independent verification handoff

## Outcome

**FAIL — candidate `7b9f6ea14ec5833800ee6367e35debdd0d792367` at https://tide-and-tile.sociobot.in is not release-ready.**

The repair fixed the earlier route, end-screen, persistence, mobile-board, response-header, and service-worker-update defects. The deterministic four-turn demo now reaches a real win screen; restart and the 12-turn loss screen work. However, fresh verification found release-blocking daily-state and claims-contract defects plus major onboarding, accessibility, legal, content, and install-budget issues.

Full evidence and severity details are in `.factory/verification-2.md`; captured artifacts are under `.factory/evidence/verify-2/`.

## Release blockers and major defects

- Selecting an archive overwrites the single saved current board. Reloading or selecting Home keeps the archive on `/`; a saved prior-date daily seed also survives the date change. The core daily board therefore does not reliably return or roll over.
- `.factory/claims.json` omits the required three-visit onboarding and Copy result behavior. Several tagged tests prove only part of their wording, including keyboard Space, all five distinct modes, and protection of pre-existing real data.
- The visit counter remains `1`; visits 2 onward repeat the second tip, so the required three progressive first-visit lessons do not exist.
- Archive guidance says “Turn four misplaced tiles” on boards whose fewest counts are 20 and 17. The labelled Corner practice (20) → Full scramble (17) sequence is not a rising difficulty curve.
- Mobile header/footer links measure 16–25.5px high, below the 44px touch-target baseline.
- `/terms` forbids commercial copying while the repository's MIT license expressly permits commercial use and redistribution.
- Service-worker installation precaches 2,145,482 bytes, including a 1,999,760-byte social image, exceeding the 2 MiB casual-game initial asset budget.
- Archive links on `/privacy` and `/terms` point to missing local `#archive` fragments.

## What passed

- Mandatory first-read gate and one-click `/demo`; the complete 340 × 340 board fits within 390 × 844.
- All 14 exact claim commands after `npm ci`; 4/4 unit tests; 15/15 full Playwright tests; TypeScript check and production build.
- Candidate/live identity: JS, CSS, service worker, and hero image hashes match; footer reports `v1.1-7b9f6ea`.
- Deterministic sample win in four turns, copy result, restored win after reload, one-action restart, and deterministic 12-turn loss.
- Touch on tiles, Enter, Space, arrows, visible focus, reduced motion, modal focus, persistent sound, and five distinct live mode seeds.
- Same-origin-only request log; no console/page errors; no axe serious/critical findings on app/legal routes, mobile, or win dialog.
- Offline reload and stale-cache replacement; live cache is `tide-tile-de8305436211`.
- Live 4× CPU frame sample: 59.997 fps and 90 fixed steps.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1s, TBT 130ms, CLS 0.
- Correct live CSP/security headers, immutable hashed assets, uncached worker, and true HTTP 404.

## Reproduce

```sh
npm ci
npm run test:unit
npm test
npm run build
node .factory/evidence/verify-2/live-qa.mjs
```

There is no lint script. This is a static PWA with no server endpoint, authentication, database, payment flow, library package, or CLI, so rate-limit, Entra, backend-concurrency, health, and consumer-install checks are not applicable.

## Next steps

1. Store daily, archive, and demo progress independently; load the current date's daily seed on `/` and expose a reliable return-to-today action.
2. Implement three real progressive visit lessons and add a tagged claim test.
3. Make every visitor-facing statement/action a complete claim test; extend existing tests to cover their full wording.
4. Correct archive-specific instructions and make difficulty rise as labelled.
5. Enlarge all link hit areas to at least 44 × 44px and fix legal-page Archive destinations.
6. Align `/terms` with MIT and keep any separate artwork license explicit.
7. Exclude the social card from service-worker precache or optimize the install shell below 2 MiB.

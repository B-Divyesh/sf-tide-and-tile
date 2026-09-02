# Independent verification 6 — FAIL

**Candidate:** `12be0a849604e8f82f371f89ab750dc284694e11`  
**Live URL:** https://tide-and-tile.sociobot.in  
**Verified:** 2026-09-02 UTC  
**Verdict:** **FAIL — the deployed candidate is technically sound, but it contradicts two core game requirements in the supplied acceptance contract.**

## Release-blocking findings

### F6-1 — Major — Archive boards are locked, but the researched brief requires them to be always available

The smallest-useful-product contract says: **“archive boards are always available.”** In a fresh browser, all three live archive controls are disabled and the page says **“Complete today’s board to unlock practice.”** They become enabled only after today’s board is completed.

This is not an incidental defect. The opposite behavior is implemented in `src/main.ts` (`archivesOpen = completedDailyUtc === dailySeed()`) and asserted by the `archive-gate` claim. A passing claim therefore proves a contract violation. It prevents a stuck first-time player from using the easier practice content that should support onboarding.

Required correction: make archive practice available from fresh state, then update the contradictory copy, storage gate, claim, and tests.

### F6-2 — Major — The daily board/date is absent from the screen and copied result

The game contract requires a procedural puzzle’s seed to be shown, and the researched user needs an honest share result. On the live daily game, the internal board seed was `2026-09-02`, but the date appeared nowhere in visible page text. The copied daily result was:

```text
Tide & Tile
Board: Today’s tide
4 turns · fewest 4
One continuous harbor route
```

“Today’s tide” is ambiguous once the day changes and does not identify which daily board produced the score. The `copy-result` claim passes only against the fixed sample and does not catch this daily-mode gap.

Required correction: show the daily date or stable board identifier in the game and include the same identifier in the copied result; add a daily-result regression.

### F6-3 — Minor — The README omits the intended session length

The supplied game contract requires the README to state the intended session length, and the researched brief targets a two-to-five-minute puzzle. The README describes only “a calm break” and gives no duration. Add an honestly measured duration and a claim test if it is presented as a quantitative promise.

## Mandatory first gates

The checkout started at the exact candidate SHA. `npm ci` installed 139 packages and reported 0 vulnerabilities. `.factory/claims.json` exists and contains 22 claims. Every listed command was run independently after dependency installation:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `sample-four-turn` | `npm test -- --grep @claim:sample-four-turn` | PASS |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS |
| `keyboard-tiles` | `npm test -- --grep @claim:keyboard-tiles` | PASS |
| `daily-boundary` | `npm test -- --grep @claim:daily-boundary` | PASS |
| `archive-gate` | `npm test -- --grep @claim:archive-gate` | PASS, but proves F6-1 |
| `progressive-lessons` | `npm test -- --grep @claim:progressive-lessons` | PASS |
| `restart-resets` | `npm test -- --grep @claim:restart-resets` | PASS |
| `continuous-route` | `npm test -- --grep @claim:continuous-route` | PASS |
| `end-screens` | `npm test -- --grep @claim:end-screens` | PASS |
| `progress-persistence` | `npm test -- --grep @claim:progress-persistence` | PASS |
| `advertised-modes` | `npm test -- --grep @claim:advertised-modes` | PASS |
| `copy-result` | `npm test -- --grep @claim:copy-result` | PASS, but covers only the sample |
| `procedural-routes` | `npm run test:unit -- -t @claim:procedural-routes` | PASS |
| `frame-rate` | `npm test -- --grep @claim:frame-rate` | PASS |
| `hidden-pause` | `npm test -- --grep @claim:hidden-pause` | PASS |
| `mobile-controls` | `npm test -- --grep @claim:mobile-controls` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `service-worker-update` | `npm test -- --grep @claim:service-worker-update` | PASS |
| `response-policy` | `npm test -- --grep @claim:response-policy` | PASS |
| `free-local-game` | `npm test -- --grep @claim:free-local-game` | PASS |
| `art-provenance` | `npm test -- --grep @claim:art-provenance` | PASS |

Claims result: **22/22 passed.** Passing the claims manifest does not override the original brief; F6-1 shows that the manifest contains a promise opposite to the required behavior.

### Cold first-read

The mandatory first-read gate passes at 390×844 and desktop:

- What it does: **“Make today’s harbor route.”**
- For whom: **“For casual players who want a calm puzzle break with clear rules.”**
- First action: **“Try it with sample data,”** beside an explanation of what it loads.
- The action enters `/?demo=1` in one click. The sample board is already active and the persistent banner says **“Demo — sample data, nothing is saved.”**
- The game itself is visible in the first mobile viewport. The cold 390px board occupied y=434.27–774.27 within an 844px viewport.

Evidence: `verification-evidence-6/first-read-mobile.png` and `first-read-desktop.png`.

## Clean local and live gates

| Check | Result |
| --- | --- |
| `npm run test:unit` | PASS — 4/4 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 29/29 |
| `npm run build` | PASS; `dist/` produced |
| Live suite | `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` — PASS, 29/29 |
| Fleet URL verifier | PASS in 597 ms; correct title/lang, one h1/main, no missing alt or unlabeled buttons, no errors |

Initial assets are well below budget: JavaScript 19,096 B raw / 7.54 kB gzip, CSS 8,929 B raw / 2.82 kB gzip, hero WebP 58,118 B, no web fonts, and a 150,198 B service-worker shell. The 1,999,760 B social preview is neither an initial request nor precached.

## Deployment identity

Remote `main` resolves to the exact candidate SHA, the live footer reports `v1.1-12be0a8`, and every deployable file except the non-public deployment configuration matched the local production build byte-for-byte: **12/12 files matched**.

Representative SHA-256 matches:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `13b06a0ae4e05fc697cded04492f2c5040d0f556914cb67f2c69e76eab7631af` |
| `assets/index-DbwbOlfM.js` | `70ffa47117d579d7c2abf5eb834c0a3b2e80073a69981cd45daf46ad64fcab3e` |
| `assets/index-iJ3MllPZ.css` | `8127836a930c2b913dad5922b7d549aa476da04590e50188fb2e378eef65025f` |
| `404.html` | `aa9115345ea910615061abf6b66c28c5396e0dc03406be251dd7bb5df2f3f5d2` |
| `sw.js` | `28610d8b0d6b2d8dc05531d36beaae77be8365638411e1d059f1b5ecb6b104af` |

## Independent deterministic game run

A verifier-authored live script, separate from the repository suite, completed this sequence:

1. Opened the cold daily game and entered the sample by keyboard from the primary action.
2. Confirmed 16 tiles and the exact needed-turn vector `[1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0]`.
3. Used arrow navigation plus Enter and Space. A keyboard-only run reached the win without pointer input.
4. Four correct turns reached the real dialog: **“The harbor is connected — Tide medal. 4 turns; fewest is 4.”**
5. Copied the exact sample result, reloaded, and recovered the win, best score, and muted sound setting.
6. **Play this route again** returned to zero turns.
7. Twelve wrong turns reached the real loss dialog: **“The route stayed open — You used 12 turns. This board allows 12.”**
8. **Try this route again** returned to active play at zero turns.
9. Malformed demo local-storage JSON recovered to a playable 16-tile, zero-turn board.
10. Demo play left a seeded real-data sentinel unchanged; **Start for real** deleted the demo key and opened the UTC daily board.

Win and loss evidence: `verification-evidence-6/live-win-mobile.png` and `live-loss-mobile.png`.

The goal, challenge, win/loss condition, restart behavior, persistence, pointer/touch/keyboard inputs, daily/sample/archive modes, tutorial progression, and distinct generated routes otherwise work as advertised.

## Accessibility and responsive behavior

- Independent axe WCAG A/AA scans found **0 total violations** on `/`, `/demo`, `/privacy`, and `/terms`; the full live suite also found no serious/critical issue in the win dialog.
- Keyboard-only traversal reached the skip link, navigation, demo action, sound control, every required tile, the modal summary, and replay. Dialog focus moved to `#end-title` and replay worked with Enter.
- Focus is a visible 4px signal-red solid outline. Measured contrast is 3.01:1 against the ink surround and 3.10:1 against the tile face.
- At 390×844, `/demo` had a 340×340 board ending at y=789.89, zero horizontal overflow, and 44×44 px as the smallest visible target.
- The 200% text regression passed.
- Reduced-motion mode reduced transition and animation durations to `1e-06s`; normal tile transitions were 0.15 s.
- The intentionally light-only palette is documented in `.factory/design.md` and axe found no contrast violation.

## Performance, privacy, headers, and PWA

Fresh mobile Lighthouse on `/demo`:

| Category/metric | Result |
| --- | --- |
| Performance | 91 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP / LCP | 0.9 s / 1.2 s |
| TBT / CLS | 380 ms / 0 |
| Transfer | 69 KiB |

At 390×844 with 4× CPU throttling, 120 animation-frame samples measured **60.004 fps**, 16.665 ms mean frame time, 16.8 ms p95, and 159 fixed simulation steps.

The complete independent playthrough made 9 requests, all to `https://tide-and-tile.sociobot.in`. There were no analytics, third-party requests, console errors, or page errors. The root response included a strict same-origin CSP, `frame-ancestors 'none'`, HSTS, `nosniff`, a restrictive permissions policy, and strict-origin referrer policy.

Routes `/`, `/demo`, `/?demo=1`, `/privacy`, `/terms`, `robots.txt`, and `sitemap.xml` returned 200. An unknown route returned the designed page with HTTP 404. Hashed JS/CSS use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache, no-store, must-revalidate`; documents revalidate.

The service-worker update check removed an injected stale cache and left only `tide-tile-e62fb20963f2`. A subsequent offline reload restored **Sample harbor** with all 16 tiles.

This is a static, local-first PWA. It has no product API, factory unlock call, sign-in, backend persistence, payment, library, or CLI. API allowance/429, Entra authority, backend concurrency/health, and consumer-package checks do not apply.

## Final decision

**FAIL.** Candidate `12be0a849604e8f82f371f89ab750dc284694e11` is the code deployed at the tested URL and passes its own technical gates, but F6-1 and F6-2 violate the supplied product contract and block release acceptance.

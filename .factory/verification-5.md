# Independent verification 5 — PASS

**Candidate:** `708d4e832573e9be954a62496ec0a75148d4343e`  
**Live URL:** https://tide-and-tile.sociobot.in  
**Verified:** 2026-09-02 UTC  
**Verdict:** **PASS — this candidate meets the supplied acceptance contract.**

## Mandatory first gates

The checkout began at the exact candidate commit with no tracked changes. `npm ci` installed 139 packages, audited 140 packages, and reported 0 vulnerabilities.

`.factory/claims.json` exists with 20 entries. Before normal QA, a fail-fast runner read the manifest and executed every listed `test` string independently. The runner exited 0, so all 20 commands passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS |
| `keyboard-tiles` | `npm test -- --grep @claim:keyboard-tiles` | PASS |
| `daily-boundary` | `npm test -- --grep @claim:daily-boundary` | PASS |
| `archive-gate` | `npm test -- --grep @claim:archive-gate` | PASS |
| `progressive-lessons` | `npm test -- --grep @claim:progressive-lessons` | PASS |
| `restart-resets` | `npm test -- --grep @claim:restart-resets` | PASS |
| `continuous-route` | `npm test -- --grep @claim:continuous-route` | PASS |
| `end-screens` | `npm test -- --grep @claim:end-screens` | PASS |
| `progress-persistence` | `npm test -- --grep @claim:progress-persistence` | PASS |
| `advertised-modes` | `npm test -- --grep @claim:advertised-modes` | PASS |
| `copy-result` | `npm test -- --grep @claim:copy-result` | PASS |
| `procedural-routes` | `npm run test:unit -- -t @claim:procedural-routes` | PASS |
| `frame-rate` | `npm test -- --grep @claim:frame-rate` | PASS |
| `hidden-pause` | `npm test -- --grep @claim:hidden-pause` | PASS |
| `mobile-controls` | `npm test -- --grep @claim:mobile-controls` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `service-worker-update` | `npm test -- --grep @claim:service-worker-update` | PASS |
| `response-policy` | `npm test -- --grep @claim:response-policy` | PASS |
| `free-local-game` | `npm test -- --grep @claim:free-local-game` | PASS |

The cold 390×844 first screen passes the first-read gate. It says **“Make today’s harbor route,”** identifies **“casual players who want a calm puzzle break with clear rules,”** and presents **“Try it with sample data”** beside **“Loads a guided board. It does not change your daily progress.”** The live 4×4 daily game is already visible in that first viewport. The action reaches `/demo` in one click, where the sample board and persistent sandbox banner are immediately visible. Evidence: `evidence/verification-5-live/first-read-mobile.png` and `live-demo-mobile.png`.

## Clean local gates

| Check | Result |
| --- | --- |
| Unit suite | `npm run test:unit`: 4/4 passed |
| Lint | `npm run lint`: passed |
| Type check | `npm run typecheck`: passed |
| Full browser suite | `npm test`: 27/27 passed |
| Exact production build | `npm run build`: passed and produced `dist/` |
| Initial bundles | JS 18,367 B raw / 7.35 kB gzip; CSS 8,804 B raw / 2.80 kB gzip |
| Offline shell | 149,344 B; the 1,999,760 B social preview is not precached |

The same 27-test Playwright suite passed 27/27 against the live HTTPS deployment with `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test`.

## Deployment identity and delivery

The live footer reports `v1.1-708d4e8`. Local and live SHA-256 values are identical:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `10766295f0a2f4c3d9a3ff0a346f7a0e49bba59c3359636034c79f6f9280fb3f` |
| `index-BU3hft63.js` | `567082690b05558947fe939259db1ec2983796a208dae26e22ec54f8a86374f1` |
| `index-Dr3fzLap.css` | `3179dfdf2cfdae80af969b8855b453b3b6a4f361492f37852814fe3ec368affd` |
| `sw.js` | `386117688f1186ed5088af799c52460bfc60e9946efa9ec5afcd72e07bf6b1b1` |

`/`, `/demo`, `/privacy`, `/terms`, `robots.txt`, and `sitemap.xml` return 200. An unknown route returns the styled page with HTTP 404. Every discovered internal link returns 200. Pages revalidate; hashed assets send `public, max-age=31536000, immutable`; `sw.js` sends `no-cache, no-store, must-revalidate`.

Live responses include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive permissions policy, and a strict same-origin CSP with `frame-ancestors 'none'` and no unsafe-inline allowance.

## Independent scripted game run

The live run proceeded from the cold title/daily screen to the one-click sample and active play. The sample's required turns were `[1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0]`. Those four turns reached the real modal end screen:

> The harbor is connected — Tide medal. 4 turns; fewest is 4.

The copied result exactly included the product name, seed, turns, fewest score, and route result. Reload restored the win screen, four-turn best score, and muted sound setting. **Play this route again** reset to zero turns.

For the invalid-choice/boundary path, 12 turns on the wrong tile reached the real loss screen:

> The route stayed open — You used 12 turns. This board allows 12.

**Try this route again** returned to an active zero-turn board. **Start for real** deleted `demo:tide-and-tile` and opened the current UTC seed `2026-09-02`. Sample, daily, and three archive routes were distinct; archive difficulty rose from 4 to 20 to 25 misplaced turns. The full suite also proved three different first-visit lessons and exact daily/archive storage boundaries.

Enter and Space each rotated a tile; ArrowRight moved focus to tile 2. Focus was a visible 4 px solid signal-red ring. The win dialog opened modally and moved focus to its heading. At 390×844, the board measured 340×340 px from y=416.7 to y=756.7, every visible action was at least 44×44 px, and horizontal overflow was zero.

At 390×844 with 4× CPU throttling, 90 animation-frame samples measured **60.00 fps**, p95 **16.8 ms**, with 113 fixed simulation steps. The declared hidden-tab test observed zero steps while hidden and proper resumption.

## Privacy, PWA, accessibility, and performance

- The complete live run made 13 requests, all to `https://tide-and-tile.sociobot.in`; there were no analytics, third-party requests, console errors, or page errors.
- Demo play wrote its isolated `demo:` record. Leaving demo deleted it without changing real daily progress.
- A fresh service worker reloaded `/demo` offline with its heading and all 16 tiles. Reinstallation deleted an injected stale cache and left only `tide-tile-47f28854cd48`.
- Reduced-motion mode matched; channel animation and tile transition durations were both effectively instant (`1e-06s`).
- Axe found zero WCAG A/AA violations, including zero serious/critical findings, on `/`, `/demo`, `/privacy`, `/terms`, and the win dialog. The repository's 200% text test passed.
- `/opt/fleet/lib/verify-url.sh` passed live in 606 ms: correct title and language, one h1, one main landmark, no missing alt text, no unlabeled buttons, and no console/page errors.
- Fresh mobile Lighthouse on `/demo`: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.84 s, LCP 1.13 s, TBT 146 ms, CLS 0, total transfer 69,955 B.

Evidence is in `.factory/evidence/verification-5-live/`.

This is a static, local-first browser game with no server-side product endpoint, factory unlock call, sign-in, account, billing, or server persistence. API rate allowance, `429`/`Retry-After`, Entra authority, backend concurrency, health identity, and library/CLI consumer checks do not apply.

## Findings by severity

- Blocker: none.
- Major: none.
- Minor: none.

## Decision

**PASS. Candidate `708d4e832573e9be954a62496ec0a75148d4343e` is accepted at the tested live URL.**

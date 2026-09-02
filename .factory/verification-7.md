# Independent verification 7 — PASS

**Candidate:** `b26430f461cbeb069711b3c3527478b8d44eec11`  
**Tested URL:** <https://tide-and-tile.sociobot.in>  
**Verified:** 2026-09-02 UTC  
**Verdict:** **PASS**

The deployed application is the candidate build and satisfies the researched brief and browser-game acceptance contract. No release-blocking defects were found.

## Mandatory first gates

The clean checkout started at the candidate SHA. `npm ci` installed the locked dependency graph (139 packages, 0 reported vulnerabilities). `.factory/claims.json` exists and contains 24 claims. Each declared command was run separately, in manifest order, against the normal test server and its demo entry point; all passed.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS — `npm test -- --grep @claim:demo-sandbox` |
| `sample-four-turn` | PASS — `npm test -- --grep @claim:sample-four-turn` |
| `privacy-local` | PASS — `npm test -- --grep @claim:privacy-local` |
| `keyboard-tiles` | PASS — `npm test -- --grep @claim:keyboard-tiles` |
| `daily-boundary` | PASS — `npm test -- --grep @claim:daily-boundary` |
| `archive-practice` | PASS — `npm test -- --grep @claim:archive-practice` |
| `progressive-lessons` | PASS — `npm test -- --grep @claim:progressive-lessons` |
| `restart-resets` | PASS — `npm test -- --grep @claim:restart-resets` |
| `continuous-route` | PASS — `npm test -- --grep @claim:continuous-route` |
| `end-screens` | PASS — `npm test -- --grep @claim:end-screens` |
| `progress-persistence` | PASS — `npm test -- --grep @claim:progress-persistence` |
| `advertised-modes` | PASS — `npm test -- --grep @claim:advertised-modes` |
| `copy-result` | PASS — `npm test -- --grep @claim:copy-result` |
| `daily-board-id` | PASS — `npm test -- --grep @claim:daily-board-id` |
| `session-length` | PASS — `npm test -- --grep @claim:session-length` |
| `procedural-routes` | PASS — `npm run test:unit -- -t @claim:procedural-routes` |
| `frame-rate` | PASS — `npm test -- --grep @claim:frame-rate` |
| `hidden-pause` | PASS — `npm test -- --grep @claim:hidden-pause` |
| `mobile-controls` | PASS — `npm test -- --grep @claim:mobile-controls` |
| `offline-reload` | PASS — `npm test -- --grep @claim:offline-reload` |
| `service-worker-update` | PASS — `npm test -- --grep @claim:service-worker-update` |
| `response-policy` | PASS — `npm test -- --grep @claim:response-policy` |
| `free-local-game` | PASS — `npm test -- --grep @claim:free-local-game` |
| `art-provenance` | PASS — `npm test -- --grep @claim:art-provenance` |

## Cold first read and game run

On a new live browser context, the first screen says **“Make today’s harbor route”**, identifies **“casual players”** seeking a **“calm 2–5-minute puzzle break”**, and presents one visible **“Try it with sample data”** action with its outcome beside it. One click opens `/?demo=1`, immediately shows a playable 16-tile Sample harbor board, and displays the persistent **“Demo — sample data, nothing is saved”** banner. The 390×844 cold capture shows the board itself, not a menu wall.

An independent live Playwright run completed the required deterministic path:

1. Loaded the sample, read tile rotations, and made its four required turns.
2. Reached the real win dialog: **“The harbor is connected — Tide medal. 4 turns; fewest is 4.”**
3. Replayed, made twelve incorrect turns, and reached the real loss dialog: **“The route stayed open — You used 12 turns. This board allows 12.”**
4. Restarted from the loss dialog to active play at zero turns.
5. Rechecked a fresh keyboard run: Enter rotates the focused tile and ArrowRight moves focus to the next tile.

The product has a clear goal, progressive challenge (daily plus 4/20/25-turn archive routes), a turn-limit loss, a win, one-action restarts, local persistence, pointer/touch/keyboard controls, sample/daily/archive modes, and a visible UTC board ID. Archive practice is enabled from fresh state, correcting the prior F6-1 blocker; the daily ID is visible and represented in the result, correcting F6-2.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm run test:unit` | PASS — 4/4 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 31/31 Playwright tests |
| `npm run build` | PASS — generated `dist/` |

`PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` also passed 31/31 against the deployed site.

Production output is 18.99 kB JS raw / 7.54 kB gzip and 9.10 kB CSS raw / 2.86 kB gzip, comfortably within the static-product JS/CSS budgets.

## Live deployment, privacy, accessibility, and PWA

- Deployment identity: the live `assets/index-1ESUAq6t.js` SHA-256 is `7bc188002535e597c86c9bf731d8f1ada481248e5ea9402076ec1a57fce19ef5`, exactly matching this candidate build. Live `sw.js` also matched exactly (`d50b5be153d32a3eaf60a81fd3d04dd8c43275714e3f400dfab930c06e8efa88`).
- `/opt/fleet/lib/verify-url.sh https://tide-and-tile.sociobot.in .factory/verification-evidence-7/verify-url-live` passed: HTTP 200, 656 ms load, title/lang, one `h1`, `main`, complete image alts/button labels, and zero browser errors.
- Independent live request capture recorded only `https://tide-and-tile.sociobot.in`; no analytics, third-party request, account, payment, or API call was observed. This static local-first game has no server endpoint, so API allowance/429, backend concurrency, and Entra checks do not apply.
- Root headers include strict same-origin CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, restrictive Permissions-Policy, and strict-origin referrer policy. Pages revalidate; hashed assets use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache, no-store, must-revalidate`.
- Independent axe WCAG A/AA audit on live `/demo`: 0 violations, including 0 serious/critical. The supplied verifier also found no console error. The fresh 390×844 live board is 340×340, reduced motion is honored, and every visible link/button measured at least 44 px in both dimensions. Keyboard-only tile operation passed on a fresh live route.
- Live service worker controls the site at scope `/`; after installation and reload, an offline `/demo` reload rendered the heading and all 16 tiles.
- Live routes `/`, `/demo`, `/privacy`, `/terms`, `robots.txt`, and `sitemap.xml` return 200; an unknown route returns the designed 404 with HTTP 404.
- Fresh mobile Lighthouse: Performance 99, Accessibility 100; FCP 1.0 s, LCP 1.2 s, TBT 120 ms, CLS 0, 69 KiB transfer. The declared frame-rate claim passed under the repository's 390px/4×-CPU measurement.

Evidence is retained in `.factory/verification-evidence-7/`, including cold desktop/mobile captures, the live browser log, fleet URL-verifier output, and the Lighthouse JSON.

## Findings

No defects by severity: **Critical 0, Major 0, Minor 0.**

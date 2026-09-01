# Independent verification 2 — FAIL

**Candidate:** `7b9f6ea14ec5833800ee6367e35debdd0d792367`

**Live URL:** https://tide-and-tile.sociobot.in

**Verified:** 2026-09-01 UTC

**Result:** **FAIL — the deployed candidate does not preserve the daily puzzle and does not meet the claims/onboarding contract.**

## First-read gate

PASS. In a fresh desktop context the first screen says:

- What: **“Make today’s harbor route.”**
- For whom: **“For casual players who want a calm puzzle break with clear rules.”**
- First action: **“Try it with sample data.”** The adjacent sentence says it loads a guided board without changing daily progress.

The action opens `/demo` in one click with no account or setup. At 390 × 844 the demo board is visible in full at x=25, y=416.7, 340 × 340, so its bottom edge is at y=756.7. The captured screen shows the game, not a menu wall. Evidence: `evidence/verify-2/first-read-desktop.png` and `evidence/verify-2/live-demo-mobile.png`.

## Candidate and deployment identity

The clone was clean and at the requested commit before verification. The live footer reports `v1.1-7b9f6ea`.

| Artifact | Local SHA-256 | Live SHA-256 | Result |
| --- | --- | --- | --- |
| `assets/index-XHlAIaoQ.js` | `0517716df1ef9a572ad3f3f2ee311e1212a4dec6ca398a1a0720dc7ad05ae902` | same | PASS |
| `assets/index-BUeXORPU.css` | `7328d641ecba2f1d4c681b402daf19d9812807ae388d459376e6826d09eab280` | same | PASS |
| `sw.js` | `9836edd8f67da4d6eb9248a39aa2c1688f9d09cedd9aba8abd8f680d7ccffec4` | same | PASS |
| `harbor-table.webp` | `52ba38260e467d0ab4211b4d60d4d1237cafb8b962cd035a94c6be7bf42ac26f` | same | PASS |

The live deployment therefore matches the candidate production build. Evidence: `evidence/verify-2/identity.log`.

## Required claims

`.factory/claims.json` exists with 14 entries. The commands were invoked immediately in the dependency-empty clone and exited before test discovery because `tsc`/`vitest` were not installed. After the required `npm ci`, every exact command was rerun separately and passed. This setup-only first attempt is not treated as a product failure; `npm ci` installed 59 packages with zero reported vulnerabilities.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS — 1 test |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS — 1 test |
| `keyboard-tiles` | `npm test -- --grep @claim:keyboard-tiles` | PASS — 1 test |
| `restart-resets` | `npm test -- --grep @claim:restart-resets` | PASS — 1 test |
| `continuous-route` | `npm test -- --grep @claim:continuous-route` | PASS — 1 test |
| `end-screens` | `npm test -- --grep @claim:end-screens` | PASS — 1 test |
| `progress-persistence` | `npm test -- --grep @claim:progress-persistence` | PASS — 1 test |
| `advertised-modes` | `npm test -- --grep @claim:advertised-modes` | PASS — 1 test |
| `procedural-routes` | `npm run test:unit -- -t @claim:procedural-routes` | PASS — 1 test |
| `frame-rate` | `npm test -- --grep @claim:frame-rate` | PASS — 1 test |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — 1 test |
| `service-worker-update` | `npm test -- --grep @claim:service-worker-update` | PASS — 1 test |
| `response-policy` | `npm test -- --grep @claim:response-policy` | PASS — 1 test |
| `free-local-game` | `npm test -- --grep @claim:free-local-game` | PASS — 1 test |

The green commands do not make the claims contract complete. The release-blocking coverage defects are listed below. Full command output: `evidence/verify-2/claims-postinstall.log`.

## Local gates

| Check | Result |
| --- | --- |
| `npm run test:unit` | PASS — 4/4 tests |
| `npm test` | PASS — 15/15 Playwright tests after a production build |
| Type checking | PASS — `tsc --noEmit` runs in `npm run build` |
| Lint | N/A — no lint script or configuration is present |
| `npm run build` | PASS — `dist/` produced |
| Build sizes | PASS — JS 16.23 KB raw / 6.68 KB gzip; CSS 8.31 KB raw / 2.63 KB gzip; hero WebP 58,118 bytes |

Evidence: `evidence/verify-2/unit.log`, `full-playwright.log`, and `build.log`.

## Independent live game run

PASS for the deterministic sample loop itself.

1. Opened the cold landing page, then selected **Try it with sample data**.
2. Verified an unrelated key does not turn a tile. Enter and Space each turn a focused tile; Arrow Right moves focus to the next tile.
3. Restarted, then applied the board's exact four-turn solution.
4. Reached the modal **The harbor is connected** end screen with `Tide medal. 4 turns; fewest is 4.`
5. Copied `Tide & Tile sample-harbor / 4 turns · fewest 4 / One continuous harbor route` to the clipboard.
6. Reloaded and confirmed the four-turn result, best score, and modal were restored.
7. Selected **Play this route again** and confirmed zero turns, no dialog, and disabled share action.
8. Made 12 wrong turns and reached **The route stayed open**, then restarted successfully.

All five advertised board modes had distinct live seeds and initial signatures. The sound-off setting survived reload. The win dialog initially focuses its heading, keeps keyboard navigation within the modal controls, and has no axe A/AA violations. Evidence: `evidence/verify-2/live-qa.json`, `modes-dialog-live.log`, `live-win-desktop.png`, and `live-loss-desktop.png`.

## Accessibility, mobile, privacy, PWA, and performance

| Check | Result / evidence |
| --- | --- |
| Semantic baseline | PASS — title, `lang=en`, one h1, main landmark, image alt, labeled buttons; factory `verify-url.sh` passed |
| Axe | PASS — no WCAG A/AA serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, the 390px demo, or the win dialog |
| Keyboard | PASS — logical Tab path, 4px visible focus outline, Enter, Space, arrows, modal focus containment |
| Touch | PASS for game controls and tiles; FAIL for undersized navigation/footer links (finding below) |
| Reduced motion | PASS — media query matched; tile transition was `0.000001s`; figure transform was `none` |
| 200% text | Mostly readable with no overlap; a 2px horizontal overflow was measured, without observed content loss |
| Request privacy | PASS — the complete browser flow contacted only `https://tide-and-tile.sociobot.in`; no analytics, CDN, or third party |
| Console/page errors | PASS — none on desktop, mobile, routes, win, loss, reload, or offline flow |
| Offline | PASS — a fresh installed worker reloaded `/demo` offline with the board visible |
| Worker update | PASS — seeded stale cache was removed; only `tide-tile-de8305436211` remained |
| Frame rate | PASS — live 390 × 844 at 4× CPU slowdown measured 59.997 fps over 80 retained intervals; 90 fixed steps advanced |
| Lighthouse mobile | PASS — Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9s, LCP 1.1s, TBT 130ms, CLS 0 |
| Initial JS/CSS | PASS — well below the 200 KB / 50 KB budgets |
| PWA initial asset budget | FAIL — worker install fetched a 2,145,482-byte shell, over the 2 MiB game budget |

The product is static and has no server endpoint, sign-in, backend persistence, library package, or CLI. Rate-limit, Entra tenant, concurrency, health endpoint, and consumer-install checks do not apply.

## Live delivery

- `/`, `/demo`, `/privacy`, `/terms`, assets, metadata files, and icons return 200.
- An unknown URL returns the styled 404 with HTTP 404.
- `/` sends `Cache-Control: no-cache, must-revalidate`.
- Hashed JS/CSS send `public, max-age=31536000, immutable`.
- `/sw.js` sends `no-cache, no-store, must-revalidate`.
- Responses include the configured strict CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- `robots.txt` and `sitemap.xml` are present, and the sitemap lists all four public routes.

Evidence: `evidence/verify-2/live-headers.log`, `link-status.log`, and `sw-update-live.log`.

## Findings by severity

### Blocker

1. **The daily puzzle can be displaced permanently by an archive board and does not roll over by date.** In a fresh live context, `/` initially showed `Today’s tide`, seed `2026-09-01`. After selecting **Breakwater bend**, both reload and the home wordmark still showed `Breakwater bend`, seed `archive-breakwater`. The single saved `current` record always wins over `dailySeed()`. A controlled prior-day record also restored seed `2026-08-31` on 2026-09-01. There is no action that returns a user from an archive to today's board without deleting browser data. This breaks the core daily-board job. Evidence: `daily-state-boundary.log` and `daily-rollover.log`.

2. **The required claims contract is incomplete and some tagged tests do not prove their full claim.** There is no claim/test for the brief's first-three-visit onboarding or the visitor-facing **Copy result** action. The README claim that the loop pauses in hidden tabs is also unlisted. The `keyboard-tiles` claim names Enter, Space, and arrows, but its tagged test never presses Space. The `advertised-modes` claim says sample, daily, and three archives are distinct, but its test compares only the three archives. The `demo-sandbox` test starts with no real progress, so it cannot prove that existing real progress is unchanged. The claims rules state that unlisted or incompletely asserted claims fail review. Independent checks found Space, copying, and five distinct seeds currently work, but they lack the required regression contract.

### Major

1. **The required progressive onboarding does not reach three stages.** Across four fresh live visits, the visit counter remained `1`: visit 1 showed the first rule, while visits 2–4 repeated the second rule forever. This misses the brief's “first three visits use progressive micro-tutorials” and undermines its first-time completion target. Evidence: `progressive-visits.log`.

2. **Archive guidance is false and the advertised difficulty labels do not form a clear ramp.** **Breakwater bend / Corner practice** needs 20 turns and **Harbor circuit / Full scramble** needs 17, so the purported full scramble is easier. Both display “Turn four misplaced tiles,” which is false for those boards. Evidence: `difficulty-ramp.log`.

3. **Mobile touch targets fail the 44px baseline.** At 390px, the wordmark is 25.5px high, header Demo and Privacy links are 21.1px high, and footer Privacy and Terms links are 16px high; Demo is also only 39.1px wide and Terms 40.1px. Core game controls and tiles do meet 44px. Evidence: `touch-targets.log`.

4. **The live Terms page contradicts the repository's MIT license.** `LICENSE` permits use, copying, modification, distribution, sublicensing, and sale. `/terms` says “The artwork and game code may not be copied for commercial use.” Users receive incompatible statements about their rights.

5. **The service worker exceeds the casual-game initial asset budget.** Its install immediately fetches a 2,145,482-byte shell. The unused-on-first-screen `social.png` is 1,999,760 bytes by itself. The browser-context request log confirms the worker fetches it on first load. This exceeds the 2 MiB initial-game budget even though Lighthouse's foreground transfer is only 68 KiB. Evidence: `first-load-context-requests.log` and `sw-precache-size.log`.

6. **The Archive navigation link is dead on legal pages.** On `/privacy` and `/terms`, it resolves to `#archive` on the current page, where no such target exists. It should lead to the home page's archive section. Evidence: `link-crawl.json`.

### Minor

1. The standalone 404 has a styled return link, correct title, language, h1, and HTTP status, but it omits the otherwise required shared header, footer, product one-liner, legal links, and build identity.
2. The design document promises a 420ms harbor-flow drawing motion, but the shipped game only rotates tiles; there is no route-flow animation. This is a visual-contract mismatch, not a gameplay blocker.

## Decision

**FAIL. Do not release this candidate as accepted.** Preserve daily identity separately from archive/demo state and roll it over by current date; implement and test all three onboarding visits; repair the claims manifest/tests; correct archive guidance and progression; resolve the license contradiction; make all touch targets at least 44px; remove or optimize the social image from first-install precaching; and fix legal-page archive navigation. Then rerun every claim command, the complete suites, and the live deterministic run.

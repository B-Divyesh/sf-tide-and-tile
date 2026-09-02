# Independent verification 8 — PASS

**Candidate:** `cb16ecc6f861d7ca0319ae0dfa85a4c4feb59d62`  
**Tested URL:** <https://tide-and-tile.sociobot.in>  
**Verified:** 2026-09-02 UTC  
**Verdict:** **PASS**

The deployed browser game matches the candidate and satisfies the researched brief and acceptance contract. No defect was found at any severity.

## Mandatory first gates

The checkout was clean and at the exact candidate SHA. `npm ci` installed the locked dependency graph: 139 packages, zero reported vulnerabilities. `.factory/claims.json` exists and contains 24 claims. After installation, every declared command was run separately in manifest order against the product's demo entry point; all returned exit code 0.

| Claim | Result | Command output |
| --- | --- | --- |
| `demo-sandbox` | PASS | `verification-evidence-8/claims/demo-sandbox.log` |
| `sample-four-turn` | PASS | `verification-evidence-8/claims/sample-four-turn.log` |
| `privacy-local` | PASS | `verification-evidence-8/claims/privacy-local.log` |
| `keyboard-tiles` | PASS | `verification-evidence-8/claims/keyboard-tiles.log` |
| `daily-boundary` | PASS | `verification-evidence-8/claims/daily-boundary.log` |
| `archive-practice` | PASS | `verification-evidence-8/claims/archive-practice.log` |
| `progressive-lessons` | PASS | `verification-evidence-8/claims/progressive-lessons.log` |
| `restart-resets` | PASS | `verification-evidence-8/claims/restart-resets.log` |
| `continuous-route` | PASS | `verification-evidence-8/claims/continuous-route.log` |
| `medal-thresholds` | PASS | `verification-evidence-8/claims/medal-thresholds.log` |
| `end-screens` | PASS | `verification-evidence-8/claims/end-screens.log` |
| `progress-persistence` | PASS | `verification-evidence-8/claims/progress-persistence.log` |
| `advertised-modes` | PASS | `verification-evidence-8/claims/advertised-modes.log` |
| `copy-result` | PASS | `verification-evidence-8/claims/copy-result.log` |
| `daily-board-id` | PASS | `verification-evidence-8/claims/daily-board-id.log` |
| `procedural-routes` | PASS | `verification-evidence-8/claims/procedural-routes.log` |
| `frame-rate` | PASS | `verification-evidence-8/claims/frame-rate.log` |
| `hidden-pause` | PASS | `verification-evidence-8/claims/hidden-pause.log` |
| `mobile-controls` | PASS | `verification-evidence-8/claims/mobile-controls.log` |
| `offline-reload` | PASS | `verification-evidence-8/claims/offline-reload.log` |
| `service-worker-update` | PASS | `verification-evidence-8/claims/service-worker-update.log` |
| `response-policy` | PASS | `verification-evidence-8/claims/response-policy.log` |
| `free-local-game` | PASS | `verification-evidence-8/claims/free-local-game.log` |
| `art-provenance` | PASS | `verification-evidence-8/claims/art-provenance.log` |

Cold first read also passes. Before any interaction, the live page says **“Make today’s harbor route”**, identifies **“casual players who want a calm puzzle break with clear rules,”** and shows **“Try it with sample data”** beside a plain explanation of what the click does. The 390×844 first screen contains the complete live 4×4 daily board. Desktop captures contain the product-specific harbor-board preview and the start of the live board section, not a menu wall. One click opens the playable sample with a persistent **“Demo — sample data, nothing is saved”** banner.

Evidence: `verification-evidence-8/cold-mobile.png`, `demo-mobile.png`, `cold-1280x720.png`, and `cold-1440x900.png`.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm run test:unit` | PASS — 4/4 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 31/31 Playwright tests |
| `npm run build` | PASS — `dist/` produced |
| `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` | PASS — 31/31 against live |

The production build contains 19,008 bytes of JavaScript (7.53 kB gzip) and 9,098 bytes of CSS (2.86 kB gzip), far below the 200 kB and 50 kB budgets. The initially loaded harbor image is 58,118 bytes. No third-party font or script is loaded.

## Deterministic game run and recovery

An independent fresh mobile Playwright context ran the real live game:

1. Opened `/`, entered the sample with one click, and confirmed 16 tiles, four marked one-turn tiles, `Turns 0 / 12`, and `Fewest 4`.
2. Pressed an unrelated `Z` key and confirmed the turn count remained zero. Tab reached a tile with a visible 4 px focus outline; Enter rotated it and ArrowRight moved focus.
3. Reset the sample and made the exact four required turns. The modal said **“The harbor is connected — Tide medal. 4 turns; fewest is 4.”** The copied result exactly named the game, Sample board, four turns, fewest four, and one continuous route.
4. Restarted to zero, changed sound, solved, and reloaded. The completed result, four-turn best, and sound-off setting returned.
5. Restarted and made twelve incorrect turns. The modal said **“The route stayed open — You used 12 turns. This board allows 12.”** Escape closed the modal and the visible restart control recovered to active play at zero turns.
6. Confirmed real storage remained byte-for-byte unchanged during demo use. **Start for real** deleted `demo:tide-and-tile`.
7. Injected malformed demo storage and reloaded. The game recovered to a fresh 16-tile board at zero turns without a page error.

The repository suite separately exercises today's board, its visible date and copied date, the 4/20/25-turn archive difficulty ramp, five distinct modes, all three medal bands, first-three-visit lessons, restart state, and hidden-tab pause behavior.

Evidence: `verification-evidence-8/live-manual.json`, `supplemental.json`, `win-mobile.png`, and `loss-mobile.png`.

## Live identity, privacy, accessibility, PWA, and performance

- Deployment identity is exact. Local and live SHA-256 values match for JavaScript (`adcb53bf...996e47`), CSS (`2be02791...7279a`), and `sw.js` (`67a46e95...fe750`). The live footer identifies `v1.1-cb16ecc`.
- The independent request log across landing, demo, play, legal routes, and exit contains only `https://tide-and-tile.sociobot.in` requests. There were no analytics, third-party calls, console errors, or page errors.
- This is a static local-first game with no server-side API or sign-in. Rate-limit/429, concurrency, backend persistence, health endpoint, and Entra checks do not apply.
- Root responses use a same-origin CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, restrictive Permissions-Policy, and strict-origin referrer policy. HTML revalidates; hashed assets use one-year immutable caching; `sw.js` uses `no-cache, no-store, must-revalidate`.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 614 ms load, correct title/lang, one `h1`, one `main`, complete image alt text and button labels, and zero errors.
- Axe found zero serious or critical WCAG A/AA findings on `/`, both demo URLs, `/privacy`, `/terms`, and the end dialog. Keyboard-only operation, dialog focus, 200% text sizing, the skip link, touch controls, and focus visibility pass. At 390×844 the board is 340×340 from y=449.89 to 789.89; all visible controls are at least 44×44 px and horizontal overflow is zero.
- Reduced motion changes the route animation to `0.000001s`. No flashing or continuous decorative animation was observed.
- The live service worker controls scope `/`; after warm-up, offline `/demo` reload shows the heading and all 16 tiles. The live suite also confirms stale deploy-cache removal during worker update.
- Live routes `/`, `/demo`, `/privacy`, `/terms`, `robots.txt`, and `sitemap.xml` return 200. All visible links return success. An unknown route returns the designed page with HTTP 404.
- Fresh mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 140 ms, CLS 0, 69 KiB transfer.
- A fresh 390px run sampled 90 animation frames under 4× CPU slowdown and measured 60.00 fps, with 106 fixed simulation steps.

Evidence: `verification-evidence-8/deployment-hashes.txt`, `browser-headers.json`, `verify-url-live/verify.json`, `lighthouse-mobile.json`, and `live-suite.log`.

## Claims and scope audit

Live landing and README behavior statements map to entries in `.factory/claims.json`; no unlisted reliance claim was found. The copy audit contains no sentence over 22 words and no banned marketing term. The visual contract documents its single-mode harbor-workshop palette, system type, 8 px spacing, motion/reduced-motion policy, difficulty curve, and original-image provenance.

AI leverage is not appropriate for this deterministic local puzzle. Import, sync, accounts, payments, and leaderboards are explicit non-goals rather than missing core steps.

## Findings

**Critical: 0 · Major: 0 · Minor: 0.**

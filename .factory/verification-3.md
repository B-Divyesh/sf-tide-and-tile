# Verification 3 — FAIL

**Candidate:** `fcdadfe9743252b211a2a677a885fc94cf06f361`  
**Live URL:** https://tide-and-tile.sociobot.in  
**Verified:** 2026-09-02 UTC  
**Verdict:** **FAIL — do not release this candidate.**

## Release blocker

### P0 — declared hidden-tab claim is not reliably testable

`.factory/claims.json` declares `hidden-pause`: “The fixed game loop pauses when the page is hidden.” Its required command is:

```sh
npm test -- --grep @claim:hidden-pause
```

From this clean candidate after `npm ci`, the command failed twice:

- focused claim-matrix run: simulation advanced **4** steps in 350 ms while hidden; allowed maximum is 2;
- full `npm test`: simulation advanced **6** steps; allowed maximum is 2.

The full suite consequently failed: **25 passed, 1 failed**. A third isolated retry passed, confirming that this is nondeterministic rather than a resolved defect. The factory contract makes *any* failing declared claim test release-blocking. The claim must be made deterministic and pass reliably before acceptance.

Live manual instrumentation happened to observe a zero-step hidden interval, so the defect is presently a flaky regression assertion/race rather than evidence that every live hidden tab advances. It is still a release blocker because the advertised claim cannot be verified reliably from a clean checkout.

## Claim gate

`claims.json` exists and contains 20 claims. As required, every listed command was invoked before normal QA; the bare clone initially lacked installed dependencies (`tsc`/`vitest` unavailable), then `npm ci` completed with 0 vulnerabilities and every command was rerun.

- Passed (19): `demo-sandbox`, `privacy-local`, `keyboard-tiles`, `daily-boundary`, `archive-gate`, `progressive-lessons`, `restart-resets`, `continuous-route`, `end-screens`, `progress-persistence`, `advertised-modes`, `copy-result`, `procedural-routes`, `frame-rate`, `mobile-controls`, `offline-reload`, `service-worker-update`, `response-policy`, `free-local-game`.
- Failed (1): `hidden-pause`, as above.

## Local candidate checks

| Check | Evidence | Result |
| --- | --- | --- |
| Install | `npm ci`, 140 packages audited, 0 vulnerabilities | PASS |
| Lint | `npm run lint` | PASS |
| Type check | `npm run typecheck` | PASS |
| Unit tests | `npm run test:unit`, 4/4 | PASS |
| Browser suite | `npm test`, 25/26 | **FAIL** |
| Production build | `npm run build` produced `dist/` | PASS |
| JS/CSS budget | 18.03 kB raw / 7.26 kB gzip JS; 8.80 kB raw / 2.80 kB gzip CSS | PASS |

## Cold live first read

PASS. On a new desktop context, the first visible screen says **“Make today’s harbor route”**, then plainly identifies it as a calm puzzle break for casual players. The adjacent **“Try it with sample data”** action says it loads a guided board without changing daily progress. The actual playable board is already visible beneath the first screen; it is not a menu wall. Screenshot evidence was captured at `/tmp/tide-live-cold-desktop.png` during verification.

## Live deployment, privacy, and security

- The footer identifies the live build as `v1.1-fcdadfe`; the loaded live application file `index-BzZPobh7.js` is SHA-256 identical to local `dist/assets/index-BzZPobh7.js` (`b6f183d2f4a182b448252fb12d831e510b5968b5dcbc5e29b51198dfddfd862c`). Deployment matches the candidate.
- Complete live demo-route request capture had exactly one origin: `https://tide-and-tile.sociobot.in`. No third-party request, analytics, account, or payment request occurred.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200 with route-specific titles and one h1. All discovered internal links returned 200. Unknown route returned 404.
- Live headers include strict same-origin CSP with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and permissions policy. Hashed JS is `public, max-age=31536000, immutable`; `/sw.js` is `no-cache, no-store, must-revalidate`.
- This is a static, local-first game: no server endpoint, sign-in, billing, or rate allowance applies.

## Product and accessibility QA

- Deterministic live `/demo` run: tile turns `[1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0]` reached **“The harbor is connected”** in 4 turns / fewest 4. The wrong-turn scripted run reached **“The route stayed open”** at 12/12 turns. Both end screens reset to 0 turns in one action.
- Keyboard smoke test passed: Enter rotates, and ArrowRight moves focus to the adjacent tile. At 390×844 touch viewport, the complete board was 340×340 px, the first tile 82×82 px, and tapping incremented turns. Reduced motion reports a `1e-06s` channel animation duration.
- Offline reload passed after service-worker installation. No live console or page errors occurred during route, input, and game-flow checks.
- Axe serious/critical findings: none on `/`, `/demo`, `/privacy`, or `/terms`.
- Mobile Lighthouse on live `/demo`: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s, LCP 1.3 s, TBT 130 ms, CLS 0.

## Required repair and re-verification

Make the hidden-tab simulation/claim assertion deterministic, then rerun all 20 commands in `.factory/claims.json` plus `npm test`. Do not treat a passing retry as a repair; the full suite must pass consistently from a clean install.

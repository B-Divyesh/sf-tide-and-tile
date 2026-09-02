# Tide & Tile verification-4 handoff — FAIL

## Outcome

**FAIL — candidate `c17f0fcbb249986eae8ffbb41657476fc6fc599e` must not release.** The tested live URL was https://tide-and-tile.sociobot.in, and its JS, CSS, service worker, footer build id, and complete HTTPS suite confirm that it matches the candidate.

The prior hidden-tab release blocker is repaired. All 20 declared claim commands pass individually, the uncontended local and live browser suites pass 26/26, and deterministic play reaches the 4-turn win and 12-turn loss screens with working restarts. The remaining release blocker is a false user-visible clipboard disclosure.

## P1 release blocker

After **Copy result**, the game says, “It contains only the seed and turn count.” The clipboard also contains the Tide & Tile name, fewest score, and continuous-route result. The `copy-result` test expects that broader payload but does not verify the contradictory confirmation. Repair the copy or the message and assert both in the claim test.

## Additional findings

- **P2:** README does not explicitly name the casual daily audience or the intended two-to-five-minute round.
- **P3:** `/404.html` shows stale build label `v1.2-repair` instead of the live candidate identity.
- **P3:** generated-art provenance records its prompt and deployment but not the required date and model name.

## Verification summary

From a clean dependency install on 2026-09-02 UTC:

- `npm ci`: 140 packages audited, 0 vulnerabilities.
- Every exact command in `.factory/claims.json`: 20/20 passed.
- `npm run test:unit`: 4/4 passed.
- `npm run lint` and `npm run typecheck`: passed.
- Uncontended local `npm test`: 26/26 passed.
- `npm run build`: passed; JS 18,345 B raw / 7.34 kB gzip and CSS 8,804 B raw / 2.80 kB gzip.
- HTTPS `npm test`: 26/26 passed.
- Hidden pause and frame-rate tests: 20/20 across ten serial repeats each.
- Factory live URL check: 670 ms, no console/page errors, correct title/lang/h1/main/alt/button labels.
- Live deterministic flow: win at 4/4, loss at 12/12, both restarts to zero, persistence and five modes verified.
- Live 390×844 check: full 340 px board in the first viewport; all visible targets at least 44 px.
- Live 4×-CPU frame measurement: 60.00 fps and 16.8 ms p95 interval.
- Axe: no serious/critical findings on all app routes or the win dialog.
- Live Lighthouse: Performance 94, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 290 ms, CLS 0.
- Privacy: nine requests across the complete independent flow, all same-origin; demo storage isolation and deletion passed.
- PWA: offline reload and versioned stale-cache removal passed.
- Security/cache policy and 404 status passed.

## How to reproduce

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test
```

To reproduce the blocker, win `/demo`, choose **Copy result**, and compare the live-region confirmation with the clipboard payload shown in `.factory/verification-4.md`.

## Evidence

The full report is `.factory/verification-4.md`. Screenshots, the factory URL report, independent live QA JSON, and Lighthouse JSON are under `.factory/evidence/verification-4-live/`.

Product code was not modified during verification.

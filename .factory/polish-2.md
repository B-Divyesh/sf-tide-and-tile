# Perfection-loop round 2 — finding closure

**Reviewed candidate:** `36e59302497581873e64fc175b1613408e47333e`  
**Review:** `.factory/review-2.md` at `ddd4a8f151a3078ba39123289824d23071c0dee9`  
**Repair commit:** `8fe7319` plus this evidence-only release commit  
**Live URL:** https://tide-and-tile.sociobot.in

Every review-2 finding and every earlier review-1 finding is mapped below. The final release is rebuilt from its exact Git revision, so its footer and standalone 404 identify the deployed checkout.

| Finding | Change made | Automated evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| F-1-1 | Rebuilt and deployed the exact repair revision. The app bundle and standalone 404 both derive their version from Git at build time. | Full local and live `npm test`: 31/31, including service-worker shell and build identity. | `.factory/evidence/polish-2-live/screenshot-mobile.png` shows the footer revision. | `/`, `/demo`, and `/404.html` load the same release; the unknown route returns the designed 404. |
| F-1-2 | Removed the unsupported 2–5-minute statement from the first screen, README, design record, manifest, and test. The first screen now says “calm puzzle break.” | Claim-manifest uniqueness test passes; `.factory/copy-audit.md` has no duration promise. | `.factory/evidence/polish-2-live/screenshot-mobile.png` | Cold `/` contains no numeric session-length statement. |
| F-1-3 | Kept the dedicated four-turn sample claim and its observable solution test. | `npm test -- --grep @claim:sample-four-turn` | `.factory/evidence/polish-2-live/demo-mobile.png` | `/demo` shows four marked tiles and “Fewest 4”; four turns reach the win dialog. |
| F-1-4 | Kept the artwork claim tied to its prompt sidecar and design provenance. | `npm test -- --grep @claim:art-provenance` | `.factory/evidence/polish-2-live/screenshot-desktop.png` | Footer disclosure remains visible and the art is served from the product origin. |
| F-1-5 | Replaced player-facing “UTC” and “Board ID” with “Board date” in the board, copied result, README, claims, and audit. | `npm test -- --grep @claim:daily-board-id` | `.factory/evidence/polish-2-live/screenshot-mobile.png` | Cold `/` shows “Board date” and the copied daily result contains the same date. |
| F-1-6 | Preserved result-naming archive actions and kept route names as secondary labels. | `npm test -- --grep @claim:archive-practice`; `@claim:advertised-modes` | `.factory/evidence/polish-2-live/demo-mobile.png` | All three archive buttons say what they open and load distinct routes. |
| F-1-7 | Preserved separate sound state and action labels with persistent `aria-pressed`. | `npm test -- --grep @claim:progress-persistence` | `.factory/evidence/polish-2-live/demo-mobile.png` | `/demo` shows “Sound: on” beside “Turn sound off”; the state survives reload. |
| F-2-1 | Added `medal-thresholds` and a real browser flow that wins fresh boards in 4, 8, and 12 turns. The instructions now explain all three bands. | `npm test -- --grep @claim:medal-thresholds` | `.factory/evidence/polish-2-live/demo-mobile.png` | Live flows display Tide, Harbor, and Dock medals at the tested totals. |
| F-2-2 | Narrowed README wording to hashed `/assets/` files with one-year immutable caching. | `npm test -- --grep @claim:response-policy` | `.factory/evidence/polish-2-live/screenshot-desktop.png` | Live hashed JS returns `public, max-age=31536000, immutable`. |
| F-2-3 | Renamed the game h2s to “Today’s board” and “Sample board”; route flavor stays outside the heading. | `@claim:daily-boundary`, `@claim:demo-sandbox`, all-route axe test | `.factory/evidence/polish-2-live/demo-mobile.png` | `/` and `/demo` expose clear headings in the accessibility tree. |
| F-2-4 | Rewrote the README instruction to “Try the isolated sample at `/demo`.” | `.factory/copy-audit.md`; claim-manifest regression | `.factory/evidence/polish-2-live/demo-mobile.png` | `/demo` opens the isolated sample directly. |
| F-2-5 | Replaced “deterministic generation” with “repeatable daily boards.” | `.factory/copy-audit.md`; `npm run test:unit` | `.factory/evidence/polish-2-live/screenshot-desktop.png` | Product behavior remains repeatable; visitor documentation uses plain words. |
| F-2-6 | Replaced “response policy” with “security headers.” | `.factory/copy-audit.md`; `@claim:response-policy` | `.factory/evidence/polish-2-live/screenshot-desktop.png` | Live CSP, referrer policy, and nosniff headers are present. |
| F-2-7 | Corrected README: Playwright checks browser claims and Vitest checks route generation. | `npm run test:unit`; full Playwright suite; claim-manifest uniqueness test | `.factory/evidence/polish-2-live/screenshot-desktop.png` | The documented commands pass against the deployed product. |

## Final evidence

- Clean clone: all 24 `.factory/claims.json` commands passed separately.
- Local: `npm run typecheck`, `npm run lint`, `npm run test:unit` (4/4), and `npm test` (31/31) passed.
- Live: `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` passed 31/31.
- `/opt/fleet/lib/verify-url.sh` reported HTTP 200, no console errors, `lang=en`, one h1, one main, no missing alt text, and no unlabeled buttons.
- Playwright axe scans found no serious or critical WCAG A/AA violations on `/`, both demo entries, `/privacy`, `/terms`, or the end dialog.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 30 ms.
- Live route crawl: `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` return 200; an unknown route returns 404.


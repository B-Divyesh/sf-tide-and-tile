# Perfection-loop round 3 — finding closure

**Reviewed release:** `cb16ecc6f861d7ca0319ae0dfa85a4c4feb59d62`  
**Review:** `.factory/review-3.md` at `2072d133f1817e588b4d77e1c3a24ed5a9d1763d`  
**Release URL:** <https://tide-and-tile.sociobot.in>

This round rechecked every finding from reviews 1–3. The final artifact is built only after the repair and evidence are committed. The browser suite compares the served hashed assets, service-worker shell, footer version, and standalone 404 with that exact checkout.

| Finding | Change made | Evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| F-1-1 / F-3-1 | Rebuilt and deployed one final committed checkout. Every app route checks the Git-derived footer version. The service-worker test compares every served hashed CSS/JS entry with local `dist/`, and the standalone 404 response must be byte-for-byte identical to `dist/404.html`. | `service worker precache matches the built hashed assets, stays below 2 MiB, and omits social preview art`; `routes load without console errors and the standalone 404 keeps shared navigation and build identity`; full live suite 31/31 | `.factory/evidence/polish-3-local/404-desktop.png` | `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, `/sw.js`, and hashed assets match the final build; an unknown route returns the designed 404 with HTTP 404. |
| F-1-2 | Kept the unsupported 2–5-minute promise removed from the first screen, README, design record, manifest, and tests. | Claim-manifest uniqueness regression; `.factory/copy-audit.md` | `.factory/evidence/polish-3-local/first-screen-desktop.png` | Cold `/` says “calm puzzle break” and contains no numeric session claim. |
| F-1-3 | Kept the dedicated four-turn sample claim and its observable four-move solution. | `@claim:sample-four-turn` | `.factory/evidence/polish-3-local/demo-mobile.png`; `.factory/evidence/polish-3-local/win-mobile.png` | `/?demo=1` shows four marked one-turn tiles, “Fewest 4,” and a four-turn Tide medal. |
| F-1-4 | Kept the artwork-origin statement tied to the checked local sidecar and design provenance. | `@claim:art-provenance` | `.factory/evidence/polish-3-local/first-screen-desktop.png` | The footer disclosure remains visible; the artwork loads only from the product origin. |
| F-1-5 | Kept player copy on “Board date” and “this browser’s storage”; no player-facing “UTC,” “seed,” or “seeded” returned. | `@claim:daily-board-id`; `@claim:privacy-local`; `.factory/copy-audit.md` | `.factory/evidence/polish-3-local/first-screen-mobile.png` | `/`, `/demo`, `/privacy`, and copied results use the same plain terms. |
| F-1-6 | Kept all three archive controls result-naming; harbor route names remain secondary. | `@claim:archive-practice`; `@claim:advertised-modes` | `.factory/evidence/polish-3-local/first-screen-desktop.png` | Each archive action names and opens its distinct practice route. |
| F-1-7 | Kept visible sound state separate from the action; `aria-pressed` and the setting persist. | `@claim:progress-persistence` | `.factory/evidence/polish-3-local/demo-mobile.png` | `/demo` shows “Sound: on” beside “Turn sound off,” then preserves the inverse state on reload. |
| F-2-1 | Kept all three medal bands explicit and covered by completed game flows. | `@claim:medal-thresholds` | `.factory/evidence/polish-3-local/win-mobile.png` | Fresh live sample runs award Tide at 4, Harbor at 8, and Dock at 12 turns. |
| F-2-2 | Kept the cache statement narrowed to hashed `/assets/` files; the exact-artifact test now compares all served and built asset names. | `@claim:response-policy`; exact service-worker artifact regression | `.factory/evidence/polish-3-local/first-screen-desktop.png` | Live hashed assets return one-year immutable caching; pages and `sw.js` do not. |
| F-2-3 | Kept the section headings “Today’s board” and “Sample board.” | `@claim:daily-boundary`; `@claim:demo-sandbox`; all-route axe regression | `.factory/evidence/polish-3-local/demo-mobile.png` | Heading-only navigation identifies both board sections plainly. |
| F-2-4 | Kept the README action as “Try the isolated sample at `/demo`.” | `.factory/copy-audit.md`; `@claim:demo-sandbox` | `.factory/evidence/polish-3-local/demo-mobile.png` | `/demo` opens the isolated sample directly. |
| F-2-5 | Kept “repeatable daily boards” in place of generation jargon. | `npm run test:unit`; `.factory/copy-audit.md` | `.factory/evidence/polish-3-local/first-screen-desktop.png` | The daily board repeats for its date and visitor copy stays plain. |
| F-2-6 | Kept “security headers” in place of “response policy.” | `@claim:response-policy`; `.factory/copy-audit.md` | `.factory/evidence/polish-3-local/404-desktop.png` | Live CSP, nosniff, referrer, permissions, and HSTS headers are present. |
| F-2-7 | Kept the README’s runner scopes accurate: Playwright checks browser claims and Vitest checks route generation. | `npm run test:unit`; claim-manifest uniqueness regression | `.factory/evidence/polish-3-local/first-screen-desktop.png` | The documented unit and browser commands pass against the release. |
| F-3-2 | Added one persistent, visually hidden `aria-live="polite"` and `aria-atomic="true"` route region outside `#app`. Client navigation and Back clear and update it with the new h1 while focus moves to that same h1. | `history navigation keeps one polite route announcement and moves focus to its heading`; all-route axe regression | `.factory/evidence/polish-3-local/privacy-route-desktop.png` | Home → Privacy announces “Privacy at Tide & Tile”; Back announces “Make today’s harbor route”; the matching h1 is focused both times. |

## Final evidence

- All 24 commands in `.factory/claims.json` pass separately from a clean clone.
- `npm run test:unit` passes 4/4; `npm run lint`, `npm run typecheck`, `npm test` (31/31), and `npm run build` pass.
- The Playwright axe integration reports no serious or critical WCAG A/AA issue on all routes and the completed dialog.
- `/opt/fleet/lib/verify-url.sh` reports HTTP 200, no console errors, `lang=en`, one h1, one main, complete alt text, and labeled buttons.
- Mobile Lighthouse scores 100 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP is 1.6 s, CLS is 0, and TBT is 20 ms. Evidence: `.factory/evidence/polish-3-local/lighthouse-mobile.json`.
- The updated catalog line is verb-first and under 120 characters: “Rotate water tiles into one continuous harbor route, then return for a new daily board.”

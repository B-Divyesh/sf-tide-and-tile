# Review 6 — Rotate tiles into today’s harbor route — PASS

**Implementation candidate:** `aac734d24fb26674464f8e1b5591a57d0d40321b`

**Documentation baseline:** `ead56718da04a6f9ec2a94ab0dfa09c3b973f317`

**Live URL:** <https://tide-and-tile.sociobot.in>

**Reviewed:** 2026-09-06 UTC

**Verdict:** **PASS**

There are zero findings of every severity and zero untested public claims. No product code was changed.

The SHAs differ because the three later commits add review reports, handoff text, and evidence only. The implementation candidate is the last product-code commit. Its public build matches the live runtime.

## Before scrolling

Fresh browser contexts opened the live home page at 1440×900 and 390×844 with `scrollY` equal to zero. Both showed the live 4×4 game, not a menu wall.

| Check | Visible result |
| --- | --- |
| Job | “Make today’s harbor route.” |
| Audience | “For casual players who want a calm puzzle break with clear rules.” |
| First action | “Try it with sample data.” The adjacent sentence says it loads a guided board and does not change daily progress. |
| Desktop board | 440×440 px at y=313.36–753.36. |
| Phone board | 340×340 px at y=466.92–806.92. |

Evidence: [desktop cold view](evidence/review-6/live-desktop-cold.png) and [phone cold view](evidence/review-6/live-mobile-cold.png).

## Complete game runs

One click on the sample action opened `/?demo=1`, titled **Demo — Tide & Tile**. It immediately showed a usable 16-tile board, four marked tiles, **Fewest 4**, and the persistent banner **“Demo — sample data, nothing is saved.”** A real-storage sentinel remained exactly `{"sentinel":"review6 real record"}` while the sample was played and after **Reset demo**. Reset returned the sample to zero turns.

Fresh desktop and touch runs both completed these deterministic paths:

- Four required turns opened **The harbor is connected** with **Tide medal. 4 turns; fewest is 4.** Focus moved to the dialog heading.
- **Play this route again** restored the route to zero turns.
- Twelve wrong turns opened **The route stayed open** with the stated 12-turn limit.
- **Try this route again** restored the route to zero turns.

The desktop run is recorded at [live-desktop-complete-run.webm](evidence/review-6/live-desktop-complete-run.webm). End-state evidence: [desktop win](evidence/review-6/live-desktop-win.png), [desktop loss](evidence/review-6/live-desktop-loss.png), [phone win](evidence/review-6/live-mobile-win.png), and [phone loss](evidence/review-6/live-mobile-loss.png). The raw run observations are in [live-manual.json](evidence/review-6/live-manual.json).

## Declared public claims

I made a clean clone at `ead5671`, ran `npm ci`, and ran every exact manifest command separately. All 24 passed. The manifest has 24 unique IDs and source inspection confirms exactly one tagged regression for each.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `sample-four-turn` | `npm test -- --grep @claim:sample-four-turn` | PASS |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS |
| `keyboard-tiles` | `npm test -- --grep @claim:keyboard-tiles` | PASS |
| `daily-boundary` | `npm test -- --grep @claim:daily-boundary` | PASS |
| `archive-practice` | `npm test -- --grep @claim:archive-practice` | PASS |
| `progressive-lessons` | `npm test -- --grep @claim:progressive-lessons` | PASS |
| `restart-resets` | `npm test -- --grep @claim:restart-resets` | PASS |
| `continuous-route` | `npm test -- --grep @claim:continuous-route` | PASS |
| `medal-thresholds` | `npm test -- --grep @claim:medal-thresholds` | PASS |
| `end-screens` | `npm test -- --grep @claim:end-screens` | PASS |
| `progress-persistence` | `npm test -- --grep @claim:progress-persistence` | PASS |
| `advertised-modes` | `npm test -- --grep @claim:advertised-modes` | PASS |
| `copy-result` | `npm test -- --grep @claim:copy-result` | PASS |
| `daily-board-id` | `npm test -- --grep @claim:daily-board-id` | PASS |
| `procedural-routes` | `npm run test:unit -- -t @claim:procedural-routes` | PASS |
| `frame-rate` | `npm test -- --grep @claim:frame-rate` | PASS |
| `hidden-pause` | `npm test -- --grep @claim:hidden-pause` | PASS |
| `mobile-controls` | `npm test -- --grep @claim:mobile-controls` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `service-worker-update` | `npm test -- --grep @claim:service-worker-update` | PASS |
| `response-policy` | `npm test -- --grep @claim:response-policy` | PASS |
| `free-local-game` | `npm test -- --grep @claim:free-local-game` | PASS |
| `art-provenance` | `npm test -- --grep @claim:art-provenance` | PASS |

I also checked the live landing, demo, privacy, terms, README, design record, and demo document for claim-like visitor text. Every public promise is covered by a listed claim or is a directly observable instruction. There are no unlisted, false, incomplete, or untested public claims.

## Clean build and live candidate

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 139 packages installed; npm reported 0 vulnerabilities. |
| `npm run test:unit` | PASS; 4/4. |
| `npm run lint` | PASS. |
| `npm run typecheck` | PASS. |
| `npm test` | PASS; 33/33 from the clean checkout. |
| `npm run build` | PASS; `dist/` created. |
| `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` at `aac734d` | PASS; 33/33. |

The candidate build is 19,137 bytes of JavaScript and 9,568 bytes of CSS before compression. It has no webfont. The first-load illustration is 58,118 bytes; the 1,999,760-byte social image is not part of the loaded shell.

I fetched and SHA-256 compared the live `index.html`, both hashed bundles, `sw.js`, `404.html`, `404.css`, harbor art, social image, icons, `robots.txt`, and `sitemap.xml` with the candidate `dist/`; every public file matched. `staticwebapp.config.json` is deployment configuration and is correctly not publicly served. The live footer is `v1.1-aac734d`.

## Inputs, boundaries, recovery, and settings

- Enter and Space turn the focused tile; arrow keys move tile focus. An invalid `Z` key has no game effect.
- Pointer and real touch input turn tiles. Every visible phone link and button measured at least 44×44 CSS px.
- The first three real visits show three different lessons. The fourth shows the keyboard tip.
- Home still opened the dated `2026-09-06` daily board after demo, archive play, and injected prior-date storage.
- Sample, daily, and all three archives have five different route signatures. Archives are available from fresh state and rise from 4 to 20 to 25 misplaced tiles.
- The Tide, Harbor, and Dock medal bands passed at 4, 8, and 12 turns. Restart resets state; completed result, best score, and sound setting survive reload.
- Malformed demo storage recovers to a playable 16-tile zero-turn sample. Copy result returns the game, board, date where applicable, turns, fewest score, and route result. Evidence: [invalid-recovery.json](evidence/review-6/invalid-recovery.json).
- The fixed-step loop paused at zero steps while hidden and resumed afterward. Under 4× CPU throttling on a 390×844 live page it measured 60.002 fps, 16.8 ms p95 frame time, and 95 steps over 90 frames. Evidence: [frame-rate-live.json](evidence/review-6/frame-rate-live.json).
- Reduced motion makes the completion animation effectively instant. No flashing, autoplay, timer, lives, leaderboard, payments, or account flow appeared.

## Accessibility, routes, privacy, and offline use

- Normal live navigation had no console or page errors. The URL verifier passed with a title, `lang=en`, one h1, a main landmark, no missing image alt text, and no unlabeled buttons: [verify.json](evidence/review-6/verify-url/verify.json).
- Keyboard tab order exposes the skip link, wordmark, navigation, and game controls. Focus has a visible signal-colour outline. The end dialog focuses its heading; History back navigation focuses and announces the new h1 through one polite live region.
- Playwright axe-core 4.10.3 found zero WCAG A/AA violations on `/`, `/demo`, `/privacy`, `/terms`, the designed 404, and the completed dialog: [axe-playwright.json](evidence/review-6/axe-playwright.json). The standalone `npx @axe-core/cli` could not start because the container has no system Chrome binary; this is an environment limitation, so the Playwright axe integration was used as the allowed equivalent. Manual token checks give text ratios from 4.87:1 to 14.64:1 and the water-channel UI ratio is 4.12:1.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200 with their own titles, descriptions, canonicals, one h1, and one main landmark. All discovered internal links returned 200: [link-crawl.json](evidence/review-6/link-crawl.json).
- A deliberately unknown route returned HTTP 404 with the designed shared header, footer, legal links, build identity, and return action: [404 capture](evidence/review-6/404-desktop.png). Its console reports the expected 404 resource status only; this is not a normal-route console error or product defect.
- The root response has self-only CSP including `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and restrictive permissions policy. Hashed assets have immutable caching; the worker has `no-cache, no-store, must-revalidate`.
- A fresh dedicated context installed the service worker, reloaded the complete 16-tile demo offline, and removed an injected stale deployment cache after worker replacement. The full demo request log had same-origin requests only: no analytics, tracker, CDN font, or third-party request.

This is a static, account-free browser game. It exposes no product backend, tenant, health, or rate-limited endpoint, so tenant isolation, restart persistence, and 429/`Retry-After` checks do not apply.

## Earlier findings

I inspected reviews 1–5 and verifications 1–10, including their minor findings. All earlier failures are currently resolved and were covered again by the clean and live checks above.

| Earlier finding group | Current disposition and proof |
| --- | --- |
| Release mismatch in reviews 1–3 | Resolved. Candidate and live public files match byte-for-byte; live suite at `aac734d` passes 33/33. |
| Unlisted time, sample, artwork, medal, cache, and game claims | Resolved. The unsupported time range is absent; the remaining promises have the 24 passing declared claims listed above. |
| Jargon, unclear archive/sound controls, non-descriptive headings, demo/test wording, and runner-scope wording | Resolved. Current player copy uses “Board date” and browser storage, controls state their action, section headings name their content, and README descriptions match the executed runners. |
| Disconnected route, impossible fewest score, missing end states, restart, persistence, or modes | Resolved. Fresh desktop and phone runs reached real four-turn win and twelve-turn loss states, replayed, persisted, and loaded five distinct modes. |
| Mobile board, touch-target, onboarding, input, date, archive-availability, or difficulty-ramp defects | Resolved. The board fits both first views, targets are at least 44 px, three lessons appear, keyboard/touch work, date and copy result agree, archives are fresh-state available, and their ramp is 4→20→25. |
| Hidden-tab flakiness, cache/update, security policy, service-worker shell, or offline defects | Resolved. The separate hidden-pause, response-policy, offline-reload, and service-worker-update commands all passed; live headers and offline recovery were also checked. |
| Clipboard disclosure, README audience/session wording, 404 stamp, art provenance, or legal-link defects | Resolved. The exact copied string/confirmation, audience copy, candidate-stamped 404, provenance record, MIT terms, and legal links all passed. |
| Missing route announcement or desktop first-frame game | Resolved. Route h1 focus/live announcement passes; the complete desktop board is visible at y=313.36–753.36. |
| Prior passing verifications 5, 7, 8, and 10 | No new issue was recorded there; their covered demo, privacy, PWA, accessibility, and deployment checks were repeated in this review. |

## Finding count

| Severity | Count |
| --- | ---: |
| Release blocker | 0 |
| Major | 0 |
| Minor | 0 |
| Untested public claims | 0 |

**Final verdict: PASS.**

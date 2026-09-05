# Review 4 — Rotate tiles into a daily route — PASS

**Implementation candidate:** `aac734d24fb26674464f8e1b5591a57d0d40321b`  
**Documentation baseline:** `38a91b29dc030a6b36c17bd0f32e9bb3a8625e62`  
**Live URL:** <https://tide-and-tile.sociobot.in>  
**Reviewed:** 2026-09-05 UTC  
**Verdict:** **PASS**

The implementation and documentation SHAs differ because `38a91b2` adds only the prior verification report, handoff, and evidence. The live product correctly remains the `aac734d` implementation. No product code was changed in this review.

There are zero release-blocking, major, or minor findings. All 24 public claims were tested; the untested claim count is zero.

## Before scrolling

Fresh browser contexts opened the live home page at 1440×900 and 390×844. Both started at scroll position zero.

| Question | Answer visible on the first screen |
| --- | --- |
| What is the job? | “Make today’s harbor route.” The 4×4 tile board is visible and playable. |
| Who is it for? | “For casual players who want a calm puzzle break with clear rules.” |
| What is the first action? | “Try it with sample data.” The adjacent text says it loads a guided board without changing daily progress. |

The desktop board measured 440×440 px at y=313.36–753.36. The phone board measured 340×340 px at y=466.92–806.92. Both complete boards fit inside the first viewport. Every visible link and button was at least 44×44 CSS px. Evidence: [desktop](evidence/review-4/cold-desktop.png) and [phone](evidence/review-4/cold-phone.png).

## Sample and complete game run

One click on **Try it with sample data** opened `/?demo=1` with title **Demo — Tide & Tile**. The active sample showed four marked tiles and **Fewest 4**. The banner **Demo — sample data, nothing is saved** remained visible during normal play, the win, and the loss.

A real-storage sentinel was added before entering the sample. Turning a sample tile created only the demo record and left the sentinel byte-for-byte unchanged. **Reset demo** restored zero turns and still left real storage unchanged. Leaving the sample deleted `demo:tide-and-tile`.

The deterministic run produced these results:

- Turning each marked tile once opened **The harbor is connected** with **Tide medal. 4 turns; fewest is 4.**
- The dialog moved focus to its heading. **Copy result** copied the game, board, turns, fewest score, and route result, and its confirmation named the same fields.
- **Play this route again** restored zero turns.
- Twelve deliberate wrong turns opened **The route stayed open** at the 12-turn limit.
- **Try this route again** restored zero turns.
- An invalid `Z` key did nothing. Enter and Space rotated; ArrowRight moved focus. The focused tile used a 4 px red outline.
- Malformed demo storage recovered to a 16-tile, zero-turn game without an error.

Evidence: [recorded run](evidence/review-4/deterministic-run.webm), [win](evidence/review-4/win-desktop.png), and [loss](evidence/review-4/loss-desktop.png).

## Claim checks

I cloned `origin/main` into a new temporary directory, confirmed `38a91b2`, ran `npm ci`, and invoked every manifest command separately in manifest order. All 24 passed.

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

The manifest has 24 unique IDs and exactly one tagged regression for each. The landing page, legal copy, README, design record, and demo documentation were cross-checked. No material public claim is missing from the manifest or its direct repository check.

## Clean checkout and live checks

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 139 packages installed, 0 vulnerabilities reported |
| `npm run test:unit` | PASS; 4/4 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS; 33/33 from documentation baseline |
| `npm run build` | PASS; `dist/` created |
| Candidate live suite | PASS; 33/33 from detached `aac734d` checkout |
| URL verifier | PASS; title, `lang=en`, one h1, main landmark, alt text, labels, and console |
| Axe WCAG 2 A/AA | PASS; zero violations on `/`, both demo URLs, `/privacy`, `/terms`, and the win dialog |

Running the live suite from `38a91b2` produces 31 passes and two expected release-identity mismatches. Those tests derive the expected footer and hashed JavaScript from the current Git SHA. The work order says a later report-only commit does not require a new product image. Running the same full suite from implementation candidate `aac734d` passes 33/33 and proves the deployed release. These two documentation-SHA mismatches are not product defects or failed claims.

The candidate build contains 19,137 bytes of JavaScript, 9,568 bytes of CSS, no webfont, and a 58,118-byte game illustration. The versioned service-worker shell is about 151 kB and omits the 1,999,760-byte social image.

## Accessibility, routes, and recovery

- `/`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles, `lang=en`, one h1, and one main landmark.
- An unknown URL returns the designed page with HTTP 404, shared navigation, legal links, build identity, and a return action. Evidence: [404 phone capture](evidence/review-4/404-phone.png).
- Every visible internal link discovered across the four application routes returned 200.
- Home → Privacy and browser Back move focus to the new h1 and update the persistent polite route announcement.
- Keyboard-only play, dialog focus, visible focus, touch input, and the skip link pass.
- At 200% root text size there is no horizontal overflow and controls remain available.
- Reduced motion shortens the route animation to `0.000001s`; there is no flashing.
- Current progress, completed results, best score, and sound setting survive reload. Daily, sample, and archive records remain separate.
- The first three real visits show three distinct lessons. Fresh-state archive practice is available with 4, 20, and 25 misplaced tiles.

The URL verifier output is [verify.json](evidence/review-4/verify-url/verify.json).

## Privacy, offline use, and deployment

The cold page and complete sample flow requested only `https://tide-and-tile.sociobot.in`. There were no analytics, trackers, CDN assets, fetch/XHR calls, console errors, or page errors. Progress and settings remain in namespaced browser storage.

Offline reload after service-worker installation and replacement of an older deployment cache both passed against the live product. The root response has a self-only CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and a restrictive permissions policy. Hashed JavaScript uses one-year immutable caching; `sw.js` uses `no-cache, no-store, must-revalidate`.

The live and candidate SHA-256 values match for `index.html`, JavaScript, CSS, `sw.js`, `404.html`, `404.css`, harbor artwork, social image, both icons, `robots.txt`, and `sitemap.xml`. The live footer reports `v1.1-aac734d`.

This product is static and has no server endpoint, account, payment, tenant, or shared database. Health, restart persistence, tenant isolation, and 429/Retry-After checks do not apply.

## Performance

Fresh mobile Lighthouse evidence is [lighthouse-mobile.json](evidence/review-4/lighthouse-mobile.json).

| Measure | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First contentful paint | 0.85 s |
| Largest contentful paint | 1.15 s |
| Cumulative layout shift | 0 |
| Total transfer | 70,568 bytes |

An independent 390×844 run under 4× CPU throttling measured 60.006 fps, 16.8 ms p95 frame time, and 95 fixed simulation steps across 90 frames. The declared hidden-tab check observed zero simulation steps while hidden and resumed afterward.

## Earlier finding disposition

Every finding in reviews 1–3 and verifications 1–9 was checked against the candidate and live product.

| Earlier issue | Current disposition and proof |
| --- | --- |
| Release identity mismatch (reviews 1–3) | Resolved. Live footer and all 12 public artifacts match implementation `aac734d`. The later `38a91b2` commit changes reports only. |
| Unsupported 2–5-minute claim (reviews 1–2; verification 4/6) | Resolved honestly. The quantitative promise is absent; current copy says “calm puzzle break.” |
| Unlisted four-turn and artwork claims (review 1) | Resolved. `sample-four-turn` and `art-provenance` are listed and pass. |
| Developer terms and inconsistent storage wording (reviews 1–2) | Resolved. Visitor copy uses “Board date” and “this browser’s storage”; no player-facing seed or UTC wording remains. |
| Archive and sound controls did not name their actions (review 1) | Resolved. Each archive control names its result; sound shows separate state and action labels. |
| Medal, cache, heading, README wording, and runner-scope issues (review 2) | Resolved. The dedicated medal test passes; cache scope is limited to hashed assets; headings and README are plain and accurate. |
| Core route was disconnected; four-turn best was impossible (verification 1) | Resolved. Unit connectivity checks and exact four-turn live completion pass. |
| No real win/loss screens or restored progress (verification 1) | Resolved. Both dialogs, both restarts, and reload persistence pass and were recorded. |
| Missing game claim coverage (verifications 1–2) | Resolved. There are 24 unique claims with one exact tagged regression each; every command passed. |
| Mobile board below fold and undersized controls (verifications 1–2) | Resolved. The phone board ends at y=806.92 in an 844px viewport; minimum visible control size is 44×44 px. |
| Missing CSP/cache headers and stale service-worker cache (verification 1) | Resolved. Live headers match policy; offline reload and cache replacement pass. |
| Reused route topology and weak difficulty amount (verification 1) | Resolved. Twenty dates exceed the 12-layout threshold; five modes are distinct; archives rise 4 → 20 → 25. |
| Unknown paths returned 200 (verification 1) | Resolved. The tested unknown path returns the designed HTTP 404. |
| Daily board displaced by archive or stale date (verification 2) | Resolved. `daily-boundary` returns home to today’s dated board and keeps archives separate. |
| Incomplete onboarding and claim assertions (verification 2) | Resolved. Three distinct visits, Enter/Space/arrows, five modes, copy output, hidden pause, and isolation from existing real data are all asserted. |
| False archive guidance and reversed ramp (verification 2) | Resolved. Fresh archives are available and show tested 4, 20, and 25 targets. |
| Terms contradicted MIT; legal Archive links were dead (verification 2) | Resolved. Terms state MIT rights and legal-page Archive links open the home archive. |
| Service-worker shell exceeded 2 MiB (verification 2) | Resolved. The shell is about 151 kB; social preview art is excluded. |
| Standalone 404 lacked shared structure (verification 2) | Resolved. Its shared navigation, footer, legal links, version, and return action are present. |
| Missing route-flow animation (verification 2) | Resolved. Completion uses the documented one-shot channel animation and reduced-motion replacement. |
| Hidden-tab claim was flaky (verification 3) | Resolved. The exact claim and full local/live suites pass; zero steps occur while hidden. |
| False copy confirmation (verification 4) | Resolved. The visible confirmation and exact clipboard payload name the same five fields. |
| Stale 404 label and incomplete art provenance (verification 4) | Resolved. The 404 is candidate-stamped; model, deployment, date, prompt, and source path are recorded and tested. |
| Archives were locked despite the brief (verification 6) | Resolved. All three controls are enabled from fresh state. |
| Daily date absent from screen/share result (verification 6) | Resolved. The 2026-09-05 board date was visible and the claim verifies the same date in copied output. |
| Missing route announcement (review 3) | Resolved. One polite live region and h1 focus pass through link and Back navigation. |
| Desktop first frame hid the game (verification 9) | Resolved. The complete live board is at y=313.36–753.36 in the 1440×900 cold viewport. |

Verifications 5, 7, 8, and 10 reported no additional defects. Their passing areas were rerun in this review.

## Missed leverage

No AI, import/export, multiplayer, or sync feature follows from this brief. The game’s useful sharing action is the tested text result. Adding a remote model or account would weaken the local, private daily-puzzle job.

## Finding count

| Severity | Count |
| --- | ---: |
| Release blocker | 0 |
| Major | 0 |
| Minor | 0 |
| Untested public claims | 0 |

**Final verdict: PASS.**

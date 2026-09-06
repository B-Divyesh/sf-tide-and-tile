# Review 5 — Rotate tiles into a daily harbor route — PASS

**Implementation candidate:** `aac734d24fb26674464f8e1b5591a57d0d40321b`

**Documentation baseline:** `29fcac128ac0b419132e6140dc5e917ea17780de`

**Live URL:** <https://tide-and-tile.sociobot.in>

**Reviewed:** 2026-09-06 UTC

**Verdict:** **PASS**

There are zero findings at every severity and zero untested public claims. No product code was changed.

The SHAs differ because the commits after `aac734d` add only reports, handoff text, and evidence. The live product remains the `aac734d` implementation. The complete production suite and byte comparison prove that identity.

## Before scrolling

Fresh browser contexts opened the live home page at 1440×900 and 390×844. Both started at scroll position zero.

| Question | Visible answer |
| --- | --- |
| What is the job? | “Make today’s harbor route.” The active 4×4 board is also visible. |
| Who is it for? | “For casual players who want a calm puzzle break with clear rules.” |
| What is the first action? | “Try it with sample data.” Adjacent text says it loads a guided board without changing daily progress. |

The desktop board measured 440×440 px at y=313.36–753.36. The phone board measured 340×340 px at y=466.92–806.92. Both complete boards fit in the first viewport. Evidence: [desktop](evidence/review-5/cold-desktop.png) and [phone](evidence/review-5/cold-phone.png).

## Complete live game runs

One click on **Try it with sample data** opened `/?demo=1` with title **Demo — Tide & Tile**. It immediately showed a playable 16-tile board, four marked tiles, and **Fewest 4**. The banner **Demo — sample data, nothing is saved** remained visible through play and both end states.

A real-storage sentinel stayed byte-for-byte unchanged while the sample was active and after **Reset demo**. Only `demo:tide-and-tile` was written. Reset restored zero turns. Leaving the sample deleted the demo record. Starting real play then created the normal dated daily record, as expected.

The deterministic desktop and touch runs produced:

- Four correct turns opened **The harbor is connected** with **Tide medal. 4 turns; fewest is 4.**
- The win dialog moved focus to its heading. **Copy result** copied the game, board, four turns, fewest score, and connected-route result.
- Reload restored the completed result, best score, and muted sound setting.
- **Play this route again** restored the same board to zero turns.
- Twelve wrong turns opened **The route stayed open** with the 12-turn limit.
- **Try this route again** restored zero turns.
- The same win, loss, and replay paths passed with real touch input at 390×844.
- An invalid `Z` key did nothing. Enter and Space turned a tile. ArrowRight moved focus.
- Malformed demo storage recovered to a 16-tile, zero-turn sample without an error.

Evidence: [recorded desktop run](evidence/review-5/desktop-complete-run.webm), [desktop win](evidence/review-5/win-desktop.png), [desktop loss](evidence/review-5/loss-desktop.png), [phone win](evidence/review-5/win-phone.png), [phone loss](evidence/review-5/loss-phone.png), and [recorded browser results](evidence/review-5/live-browser.json).

## Declared claim commands

I cloned the repository into `/tmp/tide-review5-clean.sHszs6`, confirmed clean documentation SHA `29fcac1`, ran `npm ci`, and invoked every manifest command separately in manifest order. All 24 passed.

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

The manifest has 24 unique IDs and exactly one tagged regression for each. I cross-checked the live copy, README, privacy and terms text, design record, demo instructions, and deployment statements. No claim is missing, false, incomplete, or untested.

## Clean checkout and production gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 139 packages installed and 0 vulnerabilities reported |
| `npm run test:unit` | PASS; 4/4 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS; 33/33 against the clean local production preview |
| `npm run build` | PASS; `dist/` created |
| `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` from `aac734d` | PASS; 33/33 against production |
| `/opt/fleet/lib/verify-url.sh` | PASS in 693 ms; no normal-load console errors |
| Playwright axe WCAG A/AA scan | PASS; zero violations on five app entries and the completed dialog |

The candidate build contains 19,137 bytes of JavaScript and 9,568 bytes of CSS. It loads no webfont. The first-load illustration is 58,118 bytes. The 1,999,760-byte social preview is not loaded by the page or service-worker shell.

## Modes, boundaries, and recovery

- Home opened the dated `2026-09-06` daily board. Archive, sample, and stale prior-date records did not replace it.
- Sample, daily, Dock lesson, Breakwater bend, and Harbor circuit loaded five distinct route layouts.
- Fresh archive controls were enabled and rose from 4 to 20 to 25 misplaced tiles.
- The first three real visits showed three different lessons. The fourth showed the standard keyboard tip.
- Tide, Harbor, and Dock medal thresholds passed at 4, 8, and 12 turns.
- Restart restored the starting rotations and zero turns. Refresh restored unfinished or completed progress.
- The sound action changed its state, and that choice survived reload.
- There is no multiplayer or backend. Tenant isolation, server restart persistence, health, and 429/Retry-After checks do not apply.

## Accessibility and controls

- Every app route has `lang=en`, one h1, one main landmark, ordered headings, a skip link, shared navigation, and a footer.
- The first six desktop Tab stops were Skip, wordmark, Demo, Archive, Privacy, and the sample action. Each showed a 4 px red focus outline. Activating Skip moved focus to the main heading.
- Tiles worked with Enter, Space, arrows, pointer, and touch. No keyboard trap appeared.
- The end dialog moved focus to its heading and exposed named controls.
- The persistent polite route region announced Privacy and Home after link and Back navigation.
- Axe reported zero WCAG A/AA violations. This includes automated contrast checks.
- Every visible phone link and button measured at least 44×44 CSS px. At 200% root text size, horizontal overflow remained zero.
- Water state uses channel shape and text, not colour alone.
- Reduced motion changed the completion animation to `0.000001s`. There is no flashing or autoplay.

The verifier result is [verify.json](evidence/review-5/verify-url/verify.json).

## Offline use, privacy, links, and 404

- After the first visit, a dedicated fresh context reloaded the full sample offline with all 16 tiles.
- Reinstalling the worker removed an injected stale deployment cache. Only current cache `tide-tile-2c80d50cc04f` remained.
- The complete sample flow sent requests only to `https://tide-and-tile.sociobot.in`. There were no trackers, analytics, third-party scripts, or CDN fonts.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200 with distinct titles, descriptions, canonicals, one h1, and one main landmark.
- Every discovered internal link returned 200.
- The unknown path returned the expected HTTP 404 and showed the designed page, shared navigation, legal links, build identity, and return action. Evidence: [404 capture](evidence/review-5/404-desktop.png).
- Normal routes had no console or page errors. Chromium logged the deliberate missing-resource status only when the expected 404 was requested; that is not a defect.
- Root responses use a self-only CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, a strict-origin referrer policy, and a restrictive permissions policy.
- Hashed assets use one-year immutable caching. `sw.js` uses `no-cache, no-store, must-revalidate`.

## Candidate identity and performance

The live and candidate SHA-256 values matched for `index.html`, both hashed bundles, `sw.js`, `404.html`, `404.css`, harbor artwork, social image, both icons, `robots.txt`, and `sitemap.xml`. The live footer reports `v1.1-aac734d`.

Fresh mobile Lighthouse evidence is [lighthouse-mobile.json](evidence/review-5/lighthouse-mobile.json).

| Measure | Result |
| --- | ---: |
| Performance | 97 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First contentful paint | 0.9 s |
| Largest contentful paint | 1.1 s |
| Cumulative layout shift | 0 |
| Total blocking time | 180 ms |
| Total transfer | 69 KiB |

A separate 390×844 live run under 4× CPU throttling measured 60.002 fps, 16.8 ms p95 frame time, and 91 fixed steps across 90 frames. Evidence: [frame-rate.json](evidence/review-5/frame-rate.json). The declared hidden-tab test also passed with zero fixed steps while hidden and correct resumption afterward.

## Earlier finding disposition

Every finding in reviews 1–4 and verifications 1–10 was checked against the candidate and live product.

| Earlier issue | Current disposition |
| --- | --- |
| Release identity mismatches | Resolved. The live footer, bundles, worker, 404, images, and metadata files match `aac734d`. Later commits contain reports only. |
| Unsupported 2–5-minute claim | Resolved. The quantitative promise remains absent. Current copy says “calm puzzle break.” |
| Unlisted sample and artwork claims | Resolved. `sample-four-turn` and `art-provenance` are declared and pass. |
| Player-facing jargon and inconsistent storage terms | Resolved. Live player copy uses “Board date” and “this browser’s storage.” |
| Archive and sound controls did not name actions | Resolved. Every control now names its result. |
| Missing medal coverage and broad cache wording | Resolved. The medal claim passes all three bands; cache copy is limited to hashed assets. |
| Disconnected core route and impossible four-turn best | Resolved. Exact four-turn desktop and touch wins completed one continuous route. |
| Missing win/loss screens, restart, and persistence | Resolved. Both end screens, one-action replay, reset, and reload persistence passed. |
| Missing game claims | Resolved. There are 24 unique declared claims and every exact command passed separately. |
| Mobile board below fold or controls below 44 px | Resolved. The phone board ends at y=806.92 in an 844 px viewport; all measured targets are at least 44 px. |
| Missing security/cache policy and stale offline cache | Resolved. Live headers pass; offline reload and stale-cache removal pass. |
| Reused topology and weak difficulty amount | Resolved. The procedural variety claim passes; five modes differ and archives rise 4 → 20 → 25. |
| Unknown paths returned 200 or had a weak page | Resolved. The tested path returns HTTP 404 with the designed shared structure and return action. |
| Archive or stale progress displaced today | Resolved. The daily boundary and archive separation claim passes on `2026-09-06`. |
| Incomplete onboarding, input, copy, and pause assertions | Resolved. Three lessons, all inputs, exact copied output, and hidden pause pass. |
| Terms contradicted MIT or legal Archive links failed | Resolved. Current terms list MIT rights and all legal navigation links return 200. |
| Service-worker shell included the large social image | Resolved. The shell excludes it and stays under the 2 MiB budget. |
| Missing completion animation or reduced-motion path | Resolved. The one-shot animation runs normally and becomes effectively instant with reduced motion. |
| Missing route announcement | Resolved. The polite region and heading focus update on navigation and Back. |
| Desktop cold view hid the playable board | Resolved. The complete desktop board is at y=313.36–753.36 in the 900 px viewport. |

Verifications 5, 7, 8, and 10 and review 4 reported no additional defects. Their passing areas were repeated in this review.

## Missed leverage

No AI, import, sync, or multiplayer feature follows from this local daily puzzle brief. The tested text result is the useful sharing action. A remote service or account would weaken the private, local play model.

## Finding count

| Severity | Count |
| --- | ---: |
| Release blocker | 0 |
| Major | 0 |
| Minor | 0 |
| Untested public claims | 0 |

**Final verdict: PASS.**

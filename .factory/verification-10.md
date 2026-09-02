# Independent verification 10 — PASS

**Candidate:** `aac734d24fb26674464f8e1b5591a57d0d40321b`

**Tested URL:** <https://tide-and-tile.sociobot.in>

**Verified:** 2026-09-02 UTC

**Verdict:** **PASS**

No release-blocking, major, or minor product defect was found. Product code was not modified.

## Mandatory first gates

### Claims

`.factory/claims.json` exists and contains 24 unique claims. I ran every listed command separately, in manifest order, after `npm ci`. Every invocation exited 0.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | Real progress stayed unchanged; demo data used `demo:` storage and was deleted on exit. |
| `sample-four-turn` | PASS | Four marked tiles each needed one turn; the fourth turn opened the Tide win screen. |
| `privacy-local` | PASS | The complete demo request log contained only the product origin. |
| `keyboard-tiles` | PASS | Enter and Space rotated; an arrow key moved tile focus. |
| `daily-boundary` | PASS | Home restored the UTC-dated daily board after archive and stale-record changes. |
| `archive-practice` | PASS | Fresh-state archive routes were enabled with pars 4, 20, and 25. |
| `progressive-lessons` | PASS | Visits one through three showed distinct lessons; visit four showed the standard keyboard tip. |
| `restart-resets` | PASS | Restart restored the initial tile state and zero turns. |
| `continuous-route` | PASS | The exact solution produced one connected dock-to-harbor route. |
| `medal-thresholds` | PASS | 4, 8, and 12-turn wins produced Tide, Harbor, and Dock medals. |
| `end-screens` | PASS | Both win and turn-limit loss dialogs were reached and restarted. |
| `progress-persistence` | PASS | Completed result, best score, and sound choice survived reload. |
| `advertised-modes` | PASS | Sample, daily, and three archive controls loaded five distinct routes. |
| `copy-result` | PASS | Clipboard text contained game, board, turns, fewest score, and route result. |
| `daily-board-id` | PASS | The visible UTC date matched the date in copied daily results. |
| `procedural-routes` | PASS | The unit claim test met the distinct-layout threshold across 20 seeds. |
| `frame-rate` | PASS | The claim test passed; an independent live run measured 60.006 fps under 4× CPU throttling. |
| `hidden-pause` | PASS | The fixed-step counter did not advance while simulated hidden and resumed afterward. |
| `mobile-controls` | PASS | At 390×844 the board fit and every visible link/button was at least 44×44 CSS px. |
| `offline-reload` | PASS | A dedicated browser context reloaded `/demo` offline after service-worker installation. |
| `service-worker-update` | PASS | A stale deploy cache was removed by the current versioned worker. |
| `response-policy` | PASS | CSP, immutable hashed-asset caching, and uncached worker policy were present. |
| `free-local-game` | PASS | No account/payment form, timer, lives, or leaderboard appeared; turns did not change with time. |
| `art-provenance` | PASS | The local sidecar and design record contain deployment, model, date, prompt, and source path. |

The live page and README were cross-checked against the manifest. No material unlisted product claim was found.

### Cold first-read

A fresh live load at 1440×900 says:

- What it does: **“Make today’s harbor route.”**
- Who it is for: **“For casual players who want a calm puzzle break with clear rules.”**
- What to click first: **“Try it with sample data,”** followed by what the action does.

The complete active 4×4 board is visible beside this copy at `x=756`, `y=313.36`, size `440×440`; it is usable without scrolling. At 390×844 the board is also fully visible at `x=25`, `y=466.92`, size `340×340`. The first screen therefore shows the game itself, not a menu wall. Evidence: [desktop](evidence/live-cold-1440x900.png) and [mobile](evidence/live-cold-mobile-390x844.png).

## Clean local verification

- `npm ci`: 139 packages installed; 0 vulnerabilities reported.
- `npm run test:unit`: 4/4 passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 33/33 Playwright tests passed against the local production preview.
- `npm run build`: passed and created `dist/`.
- `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test`: 33/33 passed against production.

The final build contains 19,137 bytes JS (7.59 kB gzip), 9,568 bytes CSS (3.00 kB gzip), no webfont, and a 58,118-byte WebP. The service-worker shell is 150,978 bytes and excludes the 1,999,760-byte social preview.

## Independent live game run

From a fresh home page I used keyboard-only Tab navigation to reach the sample action. The first six stops were Skip, wordmark, Demo, Archive, Privacy, and the sample action; each had a visible 4px harbor-red outline. Enter opened the isolated demo and its persistent **“Demo — sample data, nothing is saved”** banner.

On the board, `Z` left turns at zero, Enter rotated the focused tile, and ArrowRight moved focus to the next tile. Reset returned the sample to zero. Turning the four marked tiles once produced **“The harbor is connected”** and **“Tide medal. 4 turns; fewest is 4.”** The dialog moved focus to its heading. Sound-off state, the four-turn result, and best score survived reload. **Play this route again** reset to zero. Twelve deliberately wrong turns then produced **“The route stayed open”** at the 12-turn limit, and **Try this route again** reset to zero. Malformed demo storage recovered to a fresh 16-tile, zero-turn board without a page error.

Evidence: [win](evidence/live-win-desktop.png) and [loss](evidence/live-loss-desktop.png). The full live suite separately proved the exact copied result, daily date, all five modes, the three medal thresholds, archive difficulty, progressive lessons, and real/demo isolation.

## Accessibility and responsive behavior

- Axe WCAG 2 A/AA found 0 serious or critical issues—and 0 violations of any impact—on `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms`.
- The successful URL verifier recorded the expected title, `lang=en`, one `h1`, a `main`, no missing image alt text, no unlabeled buttons, and no console errors: [verify.json](evidence/verify-url/verify.json).
- The 390px board stayed inside the first viewport. Minimum visible control size was exactly 44×44 CSS px.
- At 200% root text size, horizontal overflow was 0 px and controls remained available.
- Reduced-motion completion animation duration was `0.000001s`; there is no flashing or uncontrolled loop.
- The end dialog receives focus, history navigation moves focus to the route heading, and a polite route-status region announces changes.

## Privacy, network, security, and deployment

The cold page, demo, win, loss, reload, and recovery run requested only `https://tide-and-tile.sociobot.in`. The cold request set was the document plus local hashed JS/CSS and `harbor-table.webp`; there were no analytics, trackers, CDN assets, XHR/fetch calls, or third-party origins. Progress and settings remained in namespaced local storage.

The live document returned HTTP 200 with `Cache-Control: no-cache, must-revalidate`, a self-only CSP including `frame-ancestors 'none'`, HSTS, `nosniff`, `strict-origin-when-cross-origin`, and a restrictive Permissions-Policy. Hashed JS returned `public, max-age=31536000, immutable`; `sw.js` returned `no-cache, no-store, must-revalidate`. An unknown route returned HTTP 404 with the designed 404 document.

Live and local SHA-256 values matched for `index.html`, both hashed bundles, `sw.js`, `404.html`, `404.css`, the harbor artwork, social image, icons, `robots.txt`, and `sitemap.xml`. The footer reports `v1.1-aac734d`, matching the candidate prefix.

Offline reload and service-worker update behavior passed against the live deployment in dedicated contexts. There are no server-side product endpoints, unlock calls, accounts, or sign-in, so API rate-limit/429 and Entra authority checks do not apply.

## Performance

Mobile Lighthouse evidence is [lighthouse-mobile.json](evidence/lighthouse-mobile.json):

| Category/metric | Result |
| --- | ---: |
| Performance | 93 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.94 s |
| LCP | 1.10 s |
| CLS | 0 |
| Total transfer | 11,920 bytes |

The deterministic 90-frame mobile run under 4× CPU throttling measured 60.006 fps and 99 fixed simulation steps. A separate ten-turn next-paint proxy under the same throttle measured 70.9 ms at p75 and 106.5 ms maximum, below the 200 ms interaction budget. Lighthouse had no lab INP value because the audit contains no field interaction history.

## Defect summary

| Severity | Count |
| --- | ---: |
| Release blocker | 0 |
| Major | 0 |
| Minor | 0 |

**Final result: PASS.**

# Verification 4 — FAIL

**Candidate:** `c17f0fcbb249986eae8ffbb41657476fc6fc599e`  
**Live URL:** https://tide-and-tile.sociobot.in  
**Verified:** 2026-09-02 UTC  
**Verdict:** **FAIL — do not release this candidate.**

The hidden-tab defect from verification 3 is repaired, every declared test passes, and the live game completes end to end. The candidate still fails the supplied claims contract because a user-visible clipboard disclosure is false.

## Release-blocking defect

### P1 — the copy confirmation misstates what was copied

After a live four-turn demo win, **Copy result** displays:

> Result copied. It contains only the seed and turn count.

The clipboard actually contains:

```text
Tide & Tile sample-harbor
4 turns · fewest 4
One continuous harbor route
```

The payload therefore also contains the product name, fewest score, and route result. The declared `copy-result` claim correctly describes the broader payload and its test asserts the exact text, but it does not assert the narrower confirmation shown to the player. The test passes while proving the visible “only” statement false. Under the supplied claims contract, a false/unlisted visitor claim fails review.

Required repair: make the confirmation enumerate the actual fields, or reduce the payload to the stated fields, then make `@claim:copy-result` assert both the clipboard and confirmation text.

## Other defects

### P2 — README omits required audience and session length

The README explains the mechanic and calls it a “short daily browser puzzle,” but it does not name the intended casual daily player or state the brief’s intended two-to-five-minute round. The supplied game-loop and repository documentation contracts require both.

### P3 — the standalone 404 has a stale build label

The application footer identifies `v1.1-c17f0fc`, while `/404.html` identifies `v1.2-repair`. The 404 otherwise returns a real 404 and keeps the shared navigation.

### P3 — generated-art provenance is incomplete

The prompt and `factory-image` deployment are recorded, and visual inspection found no text, watermark, logo, or obvious artifact. The required generation date and underlying model name are not recorded in `.factory/design.md` or the asset sidecar.

## Mandatory claim gate

`.factory/claims.json` exists with 20 entries. After `npm ci`, every listed command was run separately from the clean candidate and passed:

`demo-sandbox`, `privacy-local`, `keyboard-tiles`, `daily-boundary`, `archive-gate`, `progressive-lessons`, `restart-resets`, `continuous-route`, `end-screens`, `progress-persistence`, `advertised-modes`, `copy-result`, `procedural-routes`, `frame-rate`, `hidden-pause`, `mobile-controls`, `offline-reload`, `service-worker-update`, `response-policy`, and `free-local-game`.

The claim-matrix test result is 20/20, but the copy confirmation cross-check above independently blocks acceptance.

The repaired `hidden-pause` and frame-rate checks also passed 20/20 across ten serial repeats each. An exploratory run with two simultaneous 4×-CPU-throttled pages depressed the frame-rate samples; the documented single-player phone scenario, normal one-worker suite, serial repeats, and independent live measurement all passed.

## First-read gate

PASS. A cold desktop page says **“Make today’s harbor route”**, identifies casual players seeking a calm puzzle break, and places **“Try it with sample data”** beside an explanation of what it loads. The playable board itself is visible on the first screen. At 390×844, the full sample board is also visible in the first viewport. Evidence: `evidence/verification-4-live/first-read-desktop.png` and `demo-mobile.png`.

## Clean local gates

| Check | Result |
| --- | --- |
| Candidate identity | HEAD exactly `c17f0fcbb249986eae8ffbb41657476fc6fc599e` |
| Install | `npm ci`; 140 packages audited, 0 vulnerabilities |
| Unit | `npm run test:unit`; 4/4 passed |
| Lint | `npm run lint`; passed |
| Type check | `npm run typecheck`; passed |
| Browser suite | uncontended `npm test`; 26/26 passed |
| Production build | `npm run build`; produced `dist/` |
| Bundles | JS 18,345 B raw / 7.34 kB gzip; CSS 8,804 B raw / 2.80 kB gzip |
| Precache | 149,322 B; social preview excluded |

## Live deployment and identity

- The footer shows `v1.1-c17f0fc`.
- Local and live SHA-256 are identical for JS (`d38980…0813`), CSS (`3179df…affd`), and `sw.js` (`901be6…ef4c`). The deployment matches the candidate.
- The complete Playwright suite passed 26/26 against the HTTPS URL.
- `/`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles, one h1, `lang=en`, and a main landmark. Every discovered internal link returns 200; an unknown route returns 404.
- The factory URL verifier passed in 670 ms with no console/page errors, no missing image alt text, and no unlabeled buttons.
- HTML revalidates; hashed assets return `public, max-age=31536000, immutable`; `sw.js` returns `no-cache, no-store, must-revalidate`.
- Responses include a strict same-origin CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a restrictive permissions policy.

## Deterministic game run

- Sample solution rotations were `[1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0]`.
- The win screen was reached at 4/4: **“The harbor is connected.”**
- Reload restored the win screen, four turns, best score, and muted sound setting.
- **Play this route again** reset the run to zero turns.
- Twelve wrong turns reached the real loss screen: **“The route stayed open”** at 12/12.
- **Try this route again** reset the loss to zero turns.
- Enter and Space each rotated a tile; ArrowRight moved focus to the next tile. Keyboard focus used a visible 4 px red outline with at least 3:1 contrast.
- Restart restored the initial tile labels and turn count.
- Sample, daily, and three archive controls loaded five distinct routes. Archive practice unlocked only after the daily win and showed 4, 20, and 25 turn targets.
- At 390×844 the board was 340×340 px at y=416.7 and ended at y=756.7. Every visible link/button was at least 44×44 px, tapping worked, and no horizontal overflow occurred.
- The live 4×-CPU run measured 60.00 fps, 16.8 ms p95 frame interval, and 129 fixed simulation steps. Hidden-tab checks ran zero steps while hidden and resumed afterward.

## Privacy, PWA, accessibility, and performance

- The complete live flow made nine requests, all to `https://tide-and-tile.sociobot.in`; there were no third-party requests, console errors, or page errors.
- Demo play wrote only `demo:tide-and-tile`. **Start for real** deleted that key and opened the current UTC seed without changing pre-existing real progress.
- Offline `/demo` reload retained its heading and playable board. Reinstalling the service worker removed an injected stale cache and left only `tide-tile-676f2ee354af`.
- Reduced-motion mode matched and shortened the route animation to `1e-06s`.
- Axe found zero serious/critical WCAG A/AA violations on `/`, `/demo`, `/privacy`, `/terms`, and the win dialog. The repository’s 200% text test also passed.
- Mobile Lighthouse on live `/demo`: Performance 94, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 290 ms, CLS 0.
- Initial live transfer: 7,424 B JS, 2,866 B CSS, and 58,213 B hero image. There are no downloaded fonts or runtime third-party scripts.
- This is a static local-first game. Server rate limits, health endpoints, persistence concurrency, billing unlocks, and Entra sign-in are not applicable.

Machine-readable evidence is in `.factory/evidence/verification-4-live/independent-live-qa.json`; Lighthouse and screenshots are in the same directory.

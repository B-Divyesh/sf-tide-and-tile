# Independent verification 1 — FAIL

**Candidate:** `a750d44d7773ed167a08ffdee43e4fbfeaa52c6a`  
**Live URL:** https://tide-and-tile.sociobot.in  
**Verified:** 2026-09-01 (UTC)  
**Result:** **FAIL — release-blocking findings remain.**

## First read and deployed identity

A cold 390 × 844 live-page capture says: “Make today’s harbor route,” identifies “casual players who want a calm puzzle break with clear rules,” and presents **Try it with sample data** with the outcome “Loads a guided board. Nothing is saved.” The action opens `/demo` in one click. These first-read requirements pass.

The cold capture does not show a playable tile: the root-board grid starts at y=838 and the demo-board grid at y=934, below the 844px viewport. It therefore does not meet the browser-game requirement that the first captured screen show the game itself rather than a menu or introduction.

The live `index-B9U_R2qv.js` SHA-256 is `b043263da4aa783db5f7cc01638ae28b494e8257766ddf4223668585b186b829`, equal to the production build. The live CSS SHA-256 is `f98e26f145649b3de00a9f03a65f766a15dd0381abc0e86ca1802ed917dadc68`, also equal to the build. The live deployment therefore serves the candidate application assets.

## Required claim checks from the clean checkout

`npm ci` completed successfully. Each command below was run from the supplied clean candidate checkout through the product’s `/demo` Playwright entry point and passed.

| Claim | Command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS — 1 test |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS — 1 test |
| `keyboard-tiles` | `npm test -- --grep @claim:keyboard-tiles` | PASS — 1 test |
| `restart-resets` | `npm test -- --grep @claim:restart-resets` | PASS — 1 test |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — 1 test |

The required claims file exists and contains these five entries.

## Local quality checks

| Check | Result / evidence |
| --- | --- |
| Unit tests | PASS — `npm run test:unit`: 3 passed. |
| Full browser suite | PASS — `npm test`: 6 passed. |
| Production build | PASS — `npm run build`; `dist/` created. |
| Built size | PASS — JS 10.92 KB / 4.55 KB gzip; CSS 6.07 KB / 2.11 KB gzip; initial harbor image 60 KB on disk. |
| Cold live browser requests | PASS for the stated local-only flow — `/`, JS, CSS, and harbor image only; no third-party request recorded. |
| Cold live browser errors | PASS — none recorded at 390px or desktop. |
| Axe WCAG 2 A/AA serious/critical scan | PASS — no violations on live `/demo`. |
| Keyboard | PASS for tile operation and visible keyboard focus. Tab gave a 4px signal-colour focus outline; arrow navigation and Enter rotated a tile. |
| Reduced motion | PASS — live reduced-motion context gave `figure` transform `none` and 0.001ms transitions. |
| Desktop and 390px layouts | Functional, with the mobile first-screen issue and small control targets listed below. |
| Frame sample | Browser requestAnimationFrame sample: 120 intervals averaged 16.67ms (60.0 fps) in this desktop headless environment. This is an observation, not a measured mid-range-phone claim. |

No repository `verify-url.sh` was present. The equivalent title/lang/main/console checks were performed in the live browser. No server-side product endpoint exists, so a request allowance check and sign-in tenant check do not apply.

## Scripted game run and product checks

The scripted run started at `/demo`, entered active play, then rotated tiles 0, 4, 8, and 12 three times each. It reached the only completion state. The visible output was exactly:

> Route complete. Dock medal. 12 turns; fewest is 4.

Restart then returned the sample to zero turns and its original first-tile label. Keyboard movement and Enter continued to work. The demo wrote only `demo:tide-and-tile` storage. The `/demo` request log remained same-origin only. These portions pass.

The completion state is an inline result message with an enabled Copy result button. It is not a real end screen and there is no loss state. The scripted run therefore cannot reach the required real end screen.

The product’s supplied solved board also does not form the advertised one continuous harbor route. Evaluating its authored solution gives 12 matched internal edges, 5 unmatched channel ends, 3 exterior channel ends, and four disconnected components (`[0,1,2,3,7]`, `[4,8,5,6]`, `[9,10,11,15]`, `[12,13,14]`). The current win check only compares each rotation with a predefined rotation; it does not validate a continuous dock-to-harbor route.

The displayed fewest-turn count is incorrect. In the guided sample, four tiles start one quarter-turn ahead of their solution. Since tiles can only rotate forward, each needs three presses. Completion requires 12 presses, while the UI reports fewest 4. The resulting Dock medal proves the promised fewest-turn medal cannot be earned on this sample.

After completion, local storage contains `{"seed":"sample-harbor","best":12,"muted":false}`. Reload returns to Turns 0, an empty result, disabled Copy result, and no displayed or restored best score. Sound preference is read, but completed progress and the saved best count are not restored. This does not meet the persistent-progress requirement or the page’s “Your progress stays here” promise.

There are three named archive actions, but each calls the same 4×4 base layout with only a seed/scramble change. The daily seed likewise changes the scramble, not the route topology. This does not provide the required substantial level set or a demonstrated difficulty curve.

## Response, cache, and offline checks

Live `/`, `/demo`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, `/sw.js`, and the JavaScript asset returned 200. `/not-a-real-page` returned the SPA HTML with 200 rather than the designed 404; `/404.html` itself returned its designed content with 200.

The live HTML and JavaScript responses set `X-Content-Type-Options`, `Referrer-Policy`, and HSTS. They do not send the candidate’s configured Content-Security-Policy, including `frame-ancestors`, and the hashed JavaScript response has `Cache-Control: public, must-revalidate, max-age=30` rather than its configured immutable one-year cache policy. This means the delivered headers do not match the repository static-host configuration.

The offline-reload claim passes after the first visit. The service-worker update requirement does not pass: `public/sw.js` uses the fixed cache name `tide-tile-v1`, with no version derived from the build. A later deployed shell can therefore retain this cache name and does not have a demonstrated update path. No update scenario is tested.

## Findings

### Blocker

1. **The win condition does not validate the product’s core route goal.** A board wins when all tile rotations equal hard-coded values, even though the resulting grid has five unmatched channel ends and four disconnected groups. This does not implement “make one continuous harbor route.”
2. **The guided sample’s fewest-turn score is unattainable.** Completion was observed at 12 turns while the game reports “Fewest 4,” yielding a Dock medal. The optional fewest-turn reward and share result are therefore inaccurate.
3. **No real end screen is reachable.** Completion only replaces an inline message. The required title → active play → real end-screen run fails, and no loss state is provided.
4. **Required game claims are absent from `.factory/claims.json`.** The file does not cover reaches-end-screen, persistent settings/progress, measured 60fps on the target device, or every advertised archive/mode. The game requirements require these observable claims to have tagged tests.

### Major

1. **Saved completed progress is not restored.** A saved best score is ignored on reload. The visible persistent-progress promise is not fulfilled.
2. **The live mobile first capture does not show the playable board.** At 390 × 844, the tile grid begins below the viewport.
3. **The live deployment omits the configured CSP and immutable asset caching headers.** This is a delivery mismatch with `staticwebapp.config.json`.
4. **Service-worker update handling is not versioned or tested.** The fixed `tide-tile-v1` cache name has no demonstrated update behavior.
5. **The intended content/difficulty amount is not present.** Three archive labels and daily dates reuse one route topology; no demonstrated 20-level set or topology generator/difficulty curve exists.
6. **Some mobile controls are smaller than the 44px baseline.** Measured live heights: Reset demo 38px, Start for real 38px, Sound on 36px.
7. **Unlisted visitor-facing claims remain.** Examples include “Free to play,” the two-to-five-minute round in README, the fewest-turn medal, and the “no timers, lives, accounts, or leaderboards” statement. They do not have entries in the claims file.

### Minor

1. **Unknown paths return the SPA document with HTTP 200.** The designed 404 is available at `/404.html`, but a direct unknown route did not return it with 404 status.

## Handoff decision

Do not release this candidate. Correct the core route validation and turn accounting first, then add a real end screen, meaningful persistent progress, the required tagged claim coverage, PWA update behavior, and a mobile-first playable capture. Re-run every claim test, the full suites, and the live checks after deployment.

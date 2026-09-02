# Adversarial first-read review 2 — FAIL

**Product:** Tide & Tile  
**Live URL:** https://tide-and-tile.sociobot.in  
**Reviewed:** 2026-09-02 UTC  
**Revision supplied for review:** `36e59302497581873e64fc175b1613408e47333e`

## Verdict

**FAIL.** The first screen, demo, core game, privacy behavior, routes, and accessibility are usable. Acceptance still fails with three blocking regressions, two major findings, and five minor copy findings. The live release does not match this checkout, the restored 2–5-minute promise is not measured, and prior jargon has returned. A PASS requires zero findings and no untested claim.

## Cold first read

Fresh browser contexts opened `/` at 390 × 844 and 1440 × 900 before scrolling or using stored data.

| Question | First-read answer | Exact live evidence |
| --- | --- | --- |
| What does this do? | It is a daily 4×4 tile puzzle that asks me to connect a harbor route. | “Make today’s harbor route”; the board and its blue channels are visible on mobile. |
| Who is it for? | Casual players looking for a short, calm puzzle. | “For casual players who want a calm 2–5-minute puzzle break with clear rules.” |
| What should I click first? | Open the guided sample. | “Try it with sample data”; “Loads a guided board. It does not change your daily progress.” |

This gate passes at both viewports. The mobile first screen includes the complete daily board. The desktop first screen includes the product-specific harbor-table preview and the top of the board section.

## Findings

### Blocking regressions

#### F-1-1 — The live artifact again does not match the supplied revision

**Location/evidence:** The checkout is `36e5930`. The live footer on `/`, `/demo`, and `/404.html` is `v1.1-b26430f`. The current local build emits `assets/index-BP-XQfMg.js`; live serves `assets/index-1ESUAq6t.js`.

The repository's complete live suite confirms the mismatch:

```text
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test

29 passed, 2 failed
- service worker precache remains below 2 MiB: live sw.js names index-1ESUAq6t.js,
  which is absent from the current dist/
- build identity: expected v1.1-36e5930, received v1.1-b26430f
```

**Why this fails review:** The public artifact cannot be verified as the supplied release. This is the exact release-identity defect from review 1, even though the intervening commit contains documentation rather than game logic.

**Concrete fix:** Build and deploy `36e5930` or make the reviewed checkout point to the deployed commit. Then rerun the entire live suite and require 31/31, including the service-worker shell and 404 build identity.

#### F-1-2 — The 2–5-minute claim is restored, but its test only checks that the words exist

**Locations/quotes:** Landing: “For casual players who want a calm **2–5-minute** puzzle break with clear rules.” README: “A round is designed for **two to five minutes**.”

The `session-length` test contains only copy assertions:

```ts
await expect(page.locator('.intro')).toContainText('2–5-minute puzzle break');
expect(readFileSync('README.md', 'utf8')).toContain('A round is designed for two to five minutes.');
```

**Why this fails review:** The test proves that the claim is printed, not that a representative first-time session takes the stated time. Review 1 required a measured test or removal. The words were later restored with a tautological test, so this earlier finding is only half-fixed.

**Concrete fix:** Remove the number from both locations: “For casual players who want a calm puzzle break with clear rules.” and “A round is designed for a short break.” Remove `session-length`; or supply a reproducible usability measurement that actually supports the range.

#### F-1-5 — “UTC” jargon returned to player-facing copy

**Locations/quotes:** Live board: “Board ID: 2026-09-02 (**UTC**)”. README: “The daily board shows its **UTC date identifier**.” The same term also appears in copied results.

**Why this fails review:** Review 1 identified `UTC` as implementation vocabulary that does not help a casual player turn a tile. Polish 1 states that it was removed, but the current live product and source reintroduce it. Under the history rule, this regression is blocking under the original ID.

**Concrete fix:** Use “Board date: 2026-09-02” on the board and in the copied result. Rewrite the README as “The daily board shows its date. Its copied result includes the same date.” Keep UTC as an internal generation rule if needed.

### Major

#### F-2-1 — The medal promise has no claims-manifest entry

**Location/quote:** Landing, “How to play Tide & Tile”: “Finish near the fewest turns to earn a medal.”

**Why this fails review:** This is product behavior a player can rely on. `sample-four-turn` happens to assert one Tide medal, but no claim declares the medal promise or verifies the different score bands. Incidental coverage under another claim is not a listed claim.

**Concrete fix:** Add a `medal-thresholds` entry and one tagged test that reaches each advertised medal band and checks the displayed result. If medal bands are not part of the intended promise, rewrite the sentence as “Finish in as few turns as you can.”

#### F-2-2 — “Static assets use long cache headers” is broader than the implementation

**Location/quote:** README, Deploy: “Static assets use long cache headers.”

**Live evidence:** The hashed JavaScript returns `Cache-Control: public, max-age=31536000, immutable`, but `/harbor-table.webp`, `/social.png`, `/favicon.svg`, and `/apple-touch-icon.png` return `public, must-revalidate, max-age=30`.

**Why this fails review:** A deployer could rely on the sentence for every static file, while only hashed files under `/assets/` receive long-lived caching. The `response-policy` claim correctly says “Hashed assets,” so it does not cover this broader sentence.

**Concrete fix:** Rewrite it as “Hashed files under `/assets/` use one-year immutable cache headers.” Keep the existing `response-policy` test, which already checks that narrower statement.

### Minor

#### F-2-3 — Two game headings use theme names instead of naming the section

**Locations/quotes:** Daily h2: “Today’s tide.” Demo h2: “Sample harbor.”

**Why this fails review:** In a headings-only screen-reader list, neither heading says that it names the current board. “Today’s tide” also sounds like tide information rather than a tile puzzle. The nearby eyebrow labels do not repair the heading itself.

**Concrete fix:** Use “Today’s board” and “Sample board” as the h2 text. Keep “Today’s tide” and “Sample harbor” as optional secondary route names.

#### F-2-4 — The demo sentence uses unexplained SEO vocabulary

**Location/quote:** README: “Try the isolated sample at `/?demo=1` or its **canonical** `/demo` URL.”

**Why this fails review:** “Canonical” is implementation/SEO terminology and does not help someone launch the sample.

**Concrete fix:** “Try the isolated sample at `/demo`.”

#### F-2-5 — The test description uses unexplained generation jargon

**Location/quote:** README: “The unit suite checks route connectivity, the exact four-turn sample, **deterministic generation**, and different route layouts.”

**Why this fails review:** “Deterministic generation” makes the reader translate an implementation concept.

**Concrete fix:** “The unit tests confirm connected routes, the four-turn sample, repeatable daily boards, and different route layouts.”

#### F-2-6 — “Response policy” does not name what is checked

**Location/quote:** README: “It also checks the 390px layout, accessibility, offline reload, cache updates, and **response policy**.”

**Why this fails review:** “Response policy” is vague server jargon.

**Concrete fix:** “It also checks the 390px layout, accessibility, offline reloads, cache updates, and security headers.”

#### F-2-7 — The README overstates which test runner checks the claims

**Location/quote:** README: “Playwright checks every declared claim, both end screens, persistence, and all inputs.”

**Why this fails review:** `procedural-routes` is a declared claim tested by Vitest, not Playwright. The sentence is factually broader than the suite.

**Concrete fix:** “Playwright checks every browser claim, both end screens, persistence, and all inputs. Vitest checks route generation.”

## Copy audit

Words and numbers count as words; punctuation and `&` do not. No sentence exceeds 22 words. No banned marketing word appears. Flags below correspond to findings above.

### Landing page and interactive labels

| Sentence or label | Words | Audit |
| --- | ---: | --- |
| Skip to main content | 4 | Pass. |
| Tide & Tile | 2 | Product wordmark; pass. |
| Demo | 1 | Navigation link; pass. |
| Archive | 1 | Navigation link; pass. |
| Privacy | 1 | Navigation link; pass. |
| Daily harbor puzzle | 3 | Informative context label; pass. |
| Make today’s harbor route | 4 | Job headline; pass. |
| For casual players who want a calm 2–5-minute puzzle break with clear rules. | 13 | F-1-2: quantitative claim is not measured. |
| Try it with sample data | 5 | Result-naming action; pass. |
| Loads a guided board. | 4 | Clear result; pass. |
| It does not change your daily progress. | 7 | Covered by `demo-sandbox`; pass. |
| Free to play | 3 | Covered by `free-local-game`; pass. |
| Works offline after the first visit | 6 | Covered by `offline-reload`; pass. |
| Progress stays in this browser’s storage | 6 | Covered by `privacy-local`; pass. |
| Four tiles need one turn in the sample. | 8 | Covered by `sample-four-turn`; pass. |
| Today’s board | 2 | Informative eyebrow label; pass. |
| Today’s tide | 2 | F-2-3: metaphorical h2. |
| Board ID: 2026-09-02 (UTC) | 4 | F-1-5: jargon; date varies. |
| Turns 0 / 12 | 2 | Status label; pass. |
| Fewest 4 | 2 | Covered by `sample-four-turn`; pass. |
| Sound: on | 2 | State label; pass. |
| Turn sound off | 3 | Result-naming action; pass. |
| Start with the four marked tiles. | 6 | Clear instruction; pass. |
| Turn each blue channel toward the next tile. | 8 | Clear instruction; pass. |
| Restart this board | 3 | Result-naming action; pass. |
| Show the next rule | 4 | Result-naming action; pass. |
| Copy result | 2 | Result-naming action; pass. |
| Three practice routes | 3 | Informative context label; pass. |
| Archive boards | 2 | Informative section heading; pass. |
| Practice three routes at any time. | 6 | Covered by `archive-practice`; pass. |
| They rise from 4 to 25 misplaced tiles. | 8 | Covered by `archive-practice`; pass. |
| Play the 4-turn guided route | 6 | Result-naming action; pass. |
| Dock lesson | 2 | Secondary route name; pass. |
| Practice 20-turn corners | 4 | Result-naming action; pass. |
| Breakwater bend | 2 | Secondary route name; pass. |
| Play the 25-turn scramble | 5 | Result-naming action; pass. |
| Harbor circuit | 2 | Secondary route name; pass. |
| How to play Tide & Tile | 5 | Informative section heading; pass. |
| Turn a tile by tapping it or pressing Enter or Space. | 11 | Covered by `keyboard-tiles` and `mobile-controls`; pass. |
| Join every channel into one continuous route. | 7 | Covered by `continuous-route`; pass. |
| Finish near the fewest turns to earn a medal. | 9 | F-2-1: unlisted medal claim. |
| What it does not do: there are no timers, lives, accounts, or leaderboards. | 13 | Covered by `free-local-game`; pass. |
| The turn limit gives each route a clear finish. | 9 | Covered by `end-screens`; pass. |
| A daily harbor-route puzzle for short breaks. | 7 | Plain product description; pass. |
| Terms | 1 | Footer link; pass. |
| Built by Param Factory | 4 | Attribution; pass. |
| Harbor illustration is original AI-generated artwork. | 6 | Covered by `art-provenance`; pass. |
| Demo — sample data, nothing is saved | 7 | Required demo banner; pass. |
| Reset demo | 2 | Result-naming action; pass. |
| Start for real | 3 | Result-naming action; pass. |
| Sample board | 2 | Informative eyebrow label; pass. |
| Sample harbor | 2 | F-2-3: themed h2 does not name the board. |
| A harbor puzzle table with blue water tiles and a chart. | 11 | Image alternative; pass. |
| Main navigation | 2 | Navigation accessible name; pass. |
| Harbor tile board | 3 | Board accessible name; pass. |
| Row 1, column 1: corner water channel joining east and south. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 1, column 2: straight water channel joining east and west. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 1, column 3: corner water channel joining south and west. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 1, column 4: straight water channel joining north and south. Harbor tile. Press to rotate. | 16 | Tile accessible name and action; pass. |
| Row 2, column 1: corner water channel joining north and east. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 2, column 2: corner water channel joining south and west. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 2, column 3: corner water channel joining north and east. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 2, column 4: corner water channel joining west and north. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 3, column 1: corner water channel joining east and south. Dock tile. Press to rotate. | 16 | Tile accessible name and action; pass. |
| Row 3, column 2: corner water channel joining north and east. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 3, column 3: straight water channel joining east and west. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 3, column 4: corner water channel joining south and west. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 4, column 1: corner water channel joining west and north. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 4, column 2: straight water channel joining north and south. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 4, column 3: straight water channel joining north and south. Press to rotate. | 14 | Tile accessible name and action; pass. |
| Row 4, column 4: corner water channel joining west and north. Press to rotate. | 14 | Tile accessible name and action; pass. |

### README headings and prose

| Sentence or heading | Words | Audit |
| --- | ---: | --- |
| Tide & Tile | 2 | Product heading; pass. |
| Tide & Tile is a daily browser puzzle for casual players who want a calm break. | 14 | Plain description; pass. |
| A round is designed for two to five minutes. | 9 | F-1-2: quantitative claim is not measured. |
| Rotate a 4×4 grid into one continuous dock-to-harbor route. | 9 | Covered by `continuous-route`; pass. |
| A run ends with a connected route or the board’s turn limit. | 12 | Covered by `end-screens`; pass. |
| Try the isolated sample at `/?demo=1` or its canonical `/demo` URL. | 11 | F-2-4: “canonical” jargon. |
| Its four marked tiles each need one turn. | 8 | Covered by `sample-four-turn`; pass. |
| Demo progress uses a separate `demo:` key in this browser’s storage (local storage). | 13 | Technical detail follows the plain term; pass. |
| It is deleted when you leave. | 6 | Covered by `demo-sandbox`; pass. |
| Run locally | 2 | Informative heading; pass. |
| Open the printed URL. | 4 | Clear instruction; pass. |
| Use `/?demo=1` for the guided board. | 6 | Clear instruction; pass. |
| Verify and build | 3 | Informative heading; pass. |
| The unit suite checks route connectivity, the exact four-turn sample, deterministic generation, and different route layouts. | 16 | F-2-5: “deterministic generation” jargon. |
| Playwright checks every declared claim, both end screens, persistence, and all inputs. | 12 | F-2-7: not true for the Vitest claim. |
| It also checks the 390px layout, accessibility, offline reload, cache updates, and response policy. | 14 | F-2-6: “response policy” jargon. |
| The build creates `dist/` with a versioned offline cache and the deployment configuration. | 13 | Appropriate build detail; pass. |
| Modes and local data | 4 | Informative heading; pass. |
| Home always loads today’s board. | 5 | Covered by `daily-boundary`; pass. |
| The first three real visits teach turning, matching edges, and the full route. | 12 | Covered by `progressive-lessons`; pass. |
| Archive practice is available from a fresh game. | 8 | Covered by `archive-practice`; pass. |
| Its routes rise from 4 to 20 to 25 misplaced tiles. | 11 | Covered by `archive-practice`; pass. |
| Daily, archive, and demo progress use separate records. | 8 | Covered by `demo-sandbox` and `daily-boundary`; pass. |
| All five modes have distinct routes. | 6 | Covered by `advertised-modes`; pass. |
| Current rotations, completed results, best scores, and sound choice persist in this browser’s storage. | 14 | Covered by `progress-persistence`; pass. |
| Copy result includes the game, board, turn count, fewest score, and route result. | 13 | Covered by `copy-result`; pass. |
| The daily board shows its UTC date identifier. | 8 | F-1-5: jargon. |
| Its copied result includes the same identifier. | 7 | Covered by `daily-board-id`; pass after terminology fix. |
| The full board fits at 390px, and touch controls are at least 44px. | 13 | Covered by `mobile-controls`; pass. |
| Play is free. | 3 | Covered by `free-local-game`; pass. |
| There are no accounts, payments, analytics, timers, lives, or leaderboards. | 10 | Covered by `free-local-game` and `privacy-local`; pass. |
| The game targets 60 frames per second. | 7 | Covered by `frame-rate`; pass. |
| It pauses completely while its tab is hidden. | 8 | Covered by `hidden-pause`; pass. |
| Deploy | 1 | Informative heading; pass. |
| Deploy `dist/` as an Azure Static Web App using its included `staticwebapp.config.json`. | 12 | Appropriate deployment instruction; pass. |
| Static assets use long cache headers. | 6 | F-2-2: broader than live behavior and the declared claim. |
| Pages and `sw.js` check for updates. | 6 | Covered by `service-worker-update`; pass. |
| A new build replaces the old offline cache. | 8 | Covered by `service-worker-update`; pass. |
| No service, account, secret, or environment variable is required. | 9 | Concrete deployment requirement; local build confirms it. |
| The generated harbor illustration is original factory artwork. | 8 | Covered by `art-provenance`; pass. |
| Its source prompt and provenance are in `.factory/design.md`. | 8 | Verifiable repository pointer; pass. |

Terminology should remain: **tile** = one rotating piece; **channel** = the blue connection; **board** = the 4×4 grid; **route** = the completed path; **practice route** = a non-daily board; **board date** = the stable daily reference; **this browser’s storage** = stored game data; **turn limit** = maximum moves.

## Demo and sandbox verification

The demo gate passes.

- One click from the cold landing page opened `/?demo=1` and immediately showed “Sample harbor,” 16 tiles, four marked tiles, `Turns 0 / 12`, and `Fewest 4`.
- At 390 × 844, the complete board measured 340 × 340 px from y=449.89 to y=789.89 on the first demo screen.
- The persistent banner read “Demo — sample data, nothing is saved” and exposed `Reset demo` and `Start for real`.
- After one move, `Reset demo` restored turn 0 and four marked tiles.
- Four marked moves reached the real “The harbor is connected” dialog with “Tide medal. 4 turns; fewest is 4.”
- The real `tide:tide-and-tile` value was byte-for-byte unchanged before, during, and after demo play.
- `demo:tide-and-tile` changed during demo play and was deleted by `Start for real`.
- The complete live flow requested only `https://tide-and-tile.sociobot.in` resources. There were no third-party requests or console errors.

## Claims verification

All 24 commands in `.factory/claims.json` were run separately, in manifest order, from this checkout. Each command returned exit code 0.

| Claim ID | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `sample-four-turn` | PASS |
| `privacy-local` | PASS |
| `keyboard-tiles` | PASS |
| `daily-boundary` | PASS |
| `archive-practice` | PASS |
| `progressive-lessons` | PASS |
| `restart-resets` | PASS |
| `continuous-route` | PASS |
| `end-screens` | PASS |
| `progress-persistence` | PASS |
| `advertised-modes` | PASS |
| `copy-result` | PASS |
| `daily-board-id` | PASS |
| `session-length` | PASS command, inadequate assertion; F-1-2 |
| `procedural-routes` | PASS |
| `frame-rate` | PASS |
| `hidden-pause` | PASS |
| `mobile-controls` | PASS |
| `offline-reload` | PASS |
| `service-worker-update` | PASS |
| `response-policy` | PASS |
| `free-local-game` | PASS |
| `art-provenance` | PASS |

The command result does not cure an assertion that only locates its own copy. F-2-1 is an unlisted product claim. F-2-2 is broader than the narrower listed cache claim.

## Earlier finding verification

Every finding in `.factory/review-1.md` and its claimed closure in `.factory/polish-1.md` was checked in current code and on the live site.

| Earlier finding | Current result | Evidence |
| --- | --- | --- |
| F-1-1 release identity | **BLOCKING — reopened** | Live says `b26430f`; checkout and test expect `36e5930`; complete live suite fails twice. |
| F-1-2 session length | **BLOCKING — half-fixed** | Claim entry exists, but the test only finds the same words and performs no measurement. |
| F-1-3 four-turn sample | Fixed | Listed `sample-four-turn` claim passes; live sample has four one-turn tiles and wins in four. |
| F-1-4 artwork provenance | Fixed | Listed `art-provenance` test passes; sidecar and design provenance remain present. |
| F-1-5 jargon and terminology | **BLOCKING — regressed** | `seed` is absent and storage wording is consistent, but `UTC` returned on the live board, copied result, and README. |
| F-1-6 archive actions | Fixed | All three controls begin with result-naming verbs and open the named route. |
| F-1-7 sound action | Fixed | State and action are separate: “Sound: on” and “Turn sound off,” with the inverse after use. |

The current handoff's “No release-blocking gap is known” statement is contradicted by the repository's failing live release-identity checks.

## Structure, routes, accessibility, and visual identity

These checks pass except for the copy headings in F-2-3 and release mismatch in F-1-1.

- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown path returns the designed 404 with HTTP 404 and a working return action.
- Each tested page has `lang="en"`, one h1, one main landmark, a route-specific title and description, canonical, Open Graph data, Twitter card, SVG favicon, and 180 × 180 apple-touch icon.
- `social.png` is the required 1200 × 630 product-specific image. `robots.txt` and `sitemap.xml` resolve and list all public routes.
- A link/resource crawl found no dead intended link. The intentionally unknown route was the only 404.
- Client navigation to Privacy focused its h1. Browser Back restored `/` and focused “Make today’s harbor route.” Deep links loaded directly.
- `/opt/fleet/lib/verify-url.sh` returned HTTP 200 in 589 ms with no browser errors, one h1, one main, and no missing alt text or button labels.
- Independent axe WCAG A/AA scans reported zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html`.
- The local suite passes 31/31. Lint and typecheck pass. The current production build is 18.99 kB JavaScript raw / 7.54 kB gzip and creates `dist/`.
- The neo-brutalist harbor board, hard shadows, red/yellow/navy palette, original harbor-table art, and tactile tile motion are visibly specific to this game rather than a generic SaaS template.

## Missed leverage

No AI, import/export, or sync feature is implied by this local daily puzzle. Runtime AI would add cost and privacy risk without helping the tile-turning job. `Copy result` already provides the obvious lightweight sharing action. No missed-leverage finding is raised.

## What would make this perfect

Deploy the exact reviewed revision and make the complete live suite pass 31/31. Remove the unmeasured time range, replace player-facing `UTC`, list and test the medal behavior, narrow the cache sentence, and apply the proposed plain-word heading/README rewrites. Then rerun every claim command, the local suite, the full live suite, the route crawl, URL verifier, and axe scan. A later round should pass only if all findings above are absent from both code and the live site.

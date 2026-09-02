# Adversarial first-read review 3 — FAIL

**Product:** Tide & Tile  
**Live URL:** <https://tide-and-tile.sociobot.in>  
**Reviewed:** 2026-09-02 UTC  
**Checkout reviewed:** `ae4ed25461982aaa0f7016f5ed3b168c507ab41b`

## Verdict

**FAIL.** There is one blocking and one minor finding. The product is clear, tryable, private in demo mode, and its declared local claim tests pass. It cannot be accepted because the live release is not the reviewed checkout: its build identity and service-worker shell refer to a different deployment. This reopens the earlier release-identity issue.

## Cold first read

Fresh browser contexts opened `/` at 390 × 844 and 1440 × 900 without stored data, scrolling, or interaction.

| Question | First-read answer | Exact first-screen evidence |
| --- | --- | --- |
| What does this do? | Rotate water tiles into a daily harbor route. | “Make today’s harbor route”; the board is already visible at 390 px. |
| Who is it for? | Casual players seeking a calm puzzle break. | “For casual players who want a calm puzzle break with clear rules.” |
| What should I click first? | Open the guided sample. | “Try it with sample data” beside “Loads a guided board. It does not change your daily progress.” |

This gate passes. The mobile board is immediately usable; the desktop first screen shows the original harbor-table illustration and the start of the live board. No first-read blocking finding is raised.

## Findings

### Blocking

#### F-3-1 — Live release does not match the reviewed checkout (reopens F-1-1)

**Location/evidence:** This checkout is `ae4ed25`. The live footer on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` says `v1.1-cb16ecc`. The local build creates `dist/assets/index-CdIdKHad.js`, while the live service worker shell names `/assets/index-CelaLF7m.js`.

The required complete live command fails 2 of 31 tests:

```text
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test

29 passed, 2 failed
- service worker precache remains below 2 MiB and omits social preview art:
  ENOENT: dist/assets/index-CelaLF7m.js
- routes load without console errors and the standalone 404 keeps shared navigation and build identity:
  expected v1.1-ae4ed25; received v1.1-cb16ecc
```

**Why this fails review:** A visitor can receive an offline shell that is not reproducible from the reviewed release. The existing live identity test is correctly detecting that the public artifact, its cache shell, and this checkout are not one release. This is the same unfixed release-artifact finding from review 1, so it is blocking under the history rule.

**Concrete fix:** Deploy a build made from `ae4ed25` (or make the reviewed checkout exactly `cb16ecc`), including its generated service worker and standalone 404. Then run `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` and require all 31 tests to pass.

### Minor

#### F-3-2 — Client-side route changes have no screen-reader announcement

**Location/evidence:** `src/main.ts`, `renderRoute()`, updates the title and moves focus to the new h1 after `pushState`/`popstate`, but it does not update an `aria-live="polite"` route-status element. The rendered legal pages contain no such element. The only live regions, `#tip` and `#result`, are game-status text and are not updated with the new page name during navigation.

**Why this matters:** A screen-reader user who follows “Privacy” gets focus on the heading, but does not receive the required explicit route-change announcement. This is an incomplete implementation of the routing accessibility contract, and it is easy to miss in a pointer-only visit.

**Concrete fix:** Add one persistent visually-hidden `aria-live="polite"` route-status element outside the replaced application content. On each client-side route render and browser Back/Forward event, set it to the new h1 text (for example, “Privacy at Tide & Tile”). Add a Playwright accessibility regression that navigates Home → Privacy → Back and asserts the region receives each route name.

## Copy audit

Words and numbers count as tokens; punctuation does not. All landing and README sentences are at or below 22 words. No banned marketing word, unexplained player-facing implementation jargon, inconsistent player term, mood-only heading, or non-result-naming button remains. Dynamic dates and counts are shown with the values observed on 2026-09-02.

### Landing page and interactive labels

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Clear skip action. |
| TIDE & TILE | 2 | Product wordmark. |
| Demo | 1 | Clear destination. |
| Archive | 1 | Clear destination. |
| Privacy | 1 | Clear destination. |
| DAILY HARBOR PUZZLE | 3 | Context label. |
| Make today’s harbor route | 4 | Clear job headline. |
| For casual players who want a calm puzzle break with clear rules. | 12 | Names audience and situation. |
| Try it with sample data | 5 | Result-naming primary action. |
| Loads a guided board. | 4 | Clear outcome; covered by `demo-sandbox`. |
| It does not change your daily progress. | 7 | Covered by `demo-sandbox`. |
| Free to play | 3 | Covered by `free-local-game`. |
| Works offline after the first visit | 6 | Covered by `offline-reload`. |
| Progress stays in this browser’s storage | 6 | Covered by `privacy-local`. |
| Four tiles need one turn in the sample. | 8 | Covered by `sample-four-turn`. |
| DAILY PUZZLE | 2 | Context label. |
| Today’s board | 2 | Clear board heading. |
| Board date: 2026-09-02 | 3 | Covered by `daily-board-id`; date varies. |
| Turns 0 / 12 | 2 | Game state label. |
| Fewest 4 | 2 | Covered by `sample-four-turn`. |
| Sound: on | 2 | State label, not a control. |
| Turn sound off | 3 | Result-naming action. |
| Start with the four marked tiles. | 6 | Useful first instruction. |
| Turn each blue channel toward the next tile. | 8 | Useful first instruction. |
| HARBOR | 1 | Board endpoint label. |
| DOCK | 1 | Board endpoint label. |
| Restart this board | 3 | Result-naming action. |
| Show the next rule | 4 | Result-naming action. |
| Copy result | 2 | Result-naming action. |
| THREE PRACTICE ROUTES | 3 | Context label. |
| Archive boards | 2 | Clear section heading. |
| Practice three routes at any time. | 6 | Covered by `archive-practice`. |
| They rise from 4 to 25 misplaced tiles. | 8 | Covered by `archive-practice`. |
| Play the 4-turn guided route | 6 | Result-naming action. |
| Dock lesson | 2 | Secondary route name. |
| Practice 20-turn corners | 4 | Result-naming action. |
| Breakwater bend | 2 | Secondary route name. |
| Play the 25-turn scramble | 5 | Result-naming action. |
| Harbor circuit | 2 | Secondary route name. |
| How to play Tide & Tile | 5 | Clear section heading. |
| Turn a tile by tapping it or pressing Enter or Space. | 11 | Covered by `keyboard-tiles`. |
| Join every channel into one continuous route. | 7 | Covered by `continuous-route`. |
| Finish at the fewest turns for Tide, within four more for Harbor, or later for Dock. | 16 | Covered by `medal-thresholds`. |
| What it does not do: there are no timers, lives, accounts, or leaderboards. | 13 | Covered by `free-local-game`. |
| The turn limit gives each route a clear finish. | 9 | Covered by `end-screens`. |
| A daily harbor-route puzzle for short breaks. | 7 | Plain footer description. |
| Terms | 1 | Clear destination. |
| Built by Param Factory | 4 | Attribution. |
| Harbor illustration is original AI-generated artwork. | 6 | Covered by `art-provenance`. |

The demo adds “Demo — sample data, nothing is saved” (7), “Reset demo” (2), “Start for real” (3), “GUIDED SAMPLE” (2), and “Sample board” (2). These are clear, required demo labels and actions. Tile labels use the repeated concrete pattern “Row [n], column [n]: [channel description]. Press to rotate.”; each observed label is 14–16 words and names both location and action.

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Tide & Tile | 2 | Informative document heading. |
| Tide & Tile is a daily browser puzzle for casual players who want a calm break. | 14 | Plain product description. |
| Rotate a 4×4 grid into one continuous dock-to-harbor route. | 9 | Plain product explanation. |
| A run ends with a connected route or the board’s turn limit. | 12 | Covered by `end-screens`. |
| Try the isolated sample at `/demo`. | 6 | Clear demo instruction. |
| Its four marked tiles each need one turn. | 8 | Covered by `sample-four-turn`. |
| Demo progress uses a separate `demo:` key in this browser’s storage (local storage). | 13 | Technical detail follows the plain storage term; covered by `demo-sandbox`. |
| It is deleted when you leave. | 6 | Covered by `demo-sandbox`. |
| Run locally | 2 | Informative heading. |
| Open the printed URL. | 4 | Clear instruction. |
| Use `/?demo=1` for the guided board. | 6 | Clear instruction. |
| Verify and build | 3 | Informative heading. |
| The unit tests confirm connected routes, the four-turn sample, repeatable daily boards, and different route layouts. | 16 | Accurate test description. |
| Playwright checks every browser claim, both end screens, persistence, and all inputs. | 12 | Accurate runner scope. |
| Vitest checks route generation. | 4 | Accurate runner scope. |
| The browser suite also checks the 390px layout, accessibility, offline reloads, cache updates, and security headers. | 16 | Accurate test description. |
| The build creates `dist/` with a versioned offline cache and the deployment configuration. | 13 | Useful build outcome. |
| Modes and local data | 4 | Informative heading. |
| Home always loads today’s board. | 5 | Covered by `daily-boundary`. |
| The first three real visits teach turning, matching edges, and the full route. | 12 | Covered by `progressive-lessons`. |
| Archive practice is available from a fresh game. | 8 | Covered by `archive-practice`. |
| Its routes rise from 4 to 20 to 25 misplaced tiles. | 11 | Covered by `archive-practice`. |
| Daily, archive, and demo progress use separate records. | 8 | Covered by `demo-sandbox` and `daily-boundary`. |
| All five modes have distinct routes. | 6 | Covered by `advertised-modes`. |
| Current rotations, completed results, best scores, and sound choice persist in this browser’s storage. | 14 | Covered by `progress-persistence`. |
| Copy result includes the game, board, turn count, fewest score, and route result. | 13 | Covered by `copy-result`. |
| The daily board shows its date. | 6 | Covered by `daily-board-id`. |
| Its copied result includes the same date. | 7 | Covered by `daily-board-id`. |
| The full board fits at 390px, and touch controls are at least 44px. | 13 | Covered by `mobile-controls`. |
| Play is free. | 3 | Covered by `free-local-game`. |
| There are no accounts, payments, analytics, timers, lives, or leaderboards. | 10 | Covered by `free-local-game` and `privacy-local`. |
| The game targets 60 frames per second. | 7 | Covered by `frame-rate`. |
| It pauses completely while its tab is hidden. | 8 | Covered by `hidden-pause`. |
| Deploy | 1 | Informative heading. |
| Deploy `dist/` as an Azure Static Web App using its included `staticwebapp.config.json`. | 12 | Clear deployment instruction. |
| Hashed files under `/assets/` use one-year immutable cache headers. | 9 | Covered by `response-policy`. |
| Pages and `sw.js` check for updates. | 6 | Covered by `service-worker-update`. |
| A new build replaces the old offline cache. | 8 | Covered by `service-worker-update`. |
| No service, account, secret, or environment variable is required. | 9 | Useful deployment requirement. |
| The generated harbor illustration is original factory artwork. | 8 | Covered by `art-provenance`. |
| Its source prompt and provenance are in `.factory/design.md`. | 8 | Verifiable repository pointer. |

The README code blocks are commands rather than prose sentences. They are concise and match the verified commands.

## Demo, privacy, and claims

The demo gate passes.

- One cold click opened `/?demo=1` with title “Demo — Tide & Tile.” The first demo screen showed the 16-tile guided board, four marked tiles, `Turns 0 / 12`, and `Fewest 4`; at 390 × 844 its full board measured 340 × 340 px from y=449.89 to y=789.89.
- The persistent banner said “Demo — sample data, nothing is saved” and exposed `Reset demo` and `Start for real`.
- After a tile turn, `Reset demo` restored `Turns 0`. A pre-seeded real storage value remained byte-for-byte unchanged during demo play. Leaving demo removed `demo:tide-and-tile`.
- The complete live navigation/demo flow logged only product-origin requests: `/`, the same-origin JS and CSS assets, and `/harbor-table.webp`. It logged no console or page errors.

`.factory/claims.json` has 24 unique entries. Every listed command was run separately from a clean `npm ci` install and passed. This includes the dedicated browser privacy, offline, keyboard, demo-isolation, medal, mobile, and cache claims, plus the Vitest procedural-route claim. Local quality checks also passed: `npm run test:unit` (4/4), `npm run lint`, `npm run typecheck`, `npm test` (31/31), and `npm run build`. The production build emits `dist/` and its JavaScript gzip size is 7.53 kB.

No visitor-facing claim-like sentence on the landing page or README lacks a corresponding applicable claim entry or direct repository-verifiable documentation statement. The two live-suite failures are release-artifact checks, not failures of declared feature claims.

## Earlier finding verification

| Earlier finding | Current result | Evidence |
| --- | --- | --- |
| F-1-1 release identity | **BLOCKING — reopened as F-3-1** | Live `cb16ecc` differs from checkout `ae4ed25`; live worker names an absent local asset. |
| F-1-2 unmeasured session length | Fixed | The 2–5-minute statement is absent from landing and README. |
| F-1-3 four-turn sample | Fixed | `sample-four-turn` is declared and passes; live demo shows four marked tiles and fewest 4. |
| F-1-4 art provenance | Fixed | `art-provenance` passes; sidecar and design record retain deployment, model, date, prompt, and path. |
| F-1-5 jargon and terminology | Fixed | Live copy uses “Board date” and “this browser’s storage”; no player-facing `UTC`, `seed`, or `seeded` remains. |
| F-1-6 archive controls | Fixed | All three controls begin with the result-naming action and load their named practice route. |
| F-1-7 sound control | Fixed | “Sound: on” is state; “Turn sound off” is the action. |
| F-2-1 medal promise | Fixed | `medal-thresholds` is declared and passes for Tide, Harbor, and Dock. |
| F-2-2 broad cache statement | Fixed | README correctly limits immutable caching to hashed `/assets/` files. |
| F-2-3 themed board headings | Fixed | “Today’s board” and “Sample board” name their sections. |
| F-2-4 `canonical` jargon | Fixed | README says “Try the isolated sample at `/demo`.” |
| F-2-5 generation jargon | Fixed | README says “repeatable daily boards.” |
| F-2-6 vague response-policy term | Fixed | README says “security headers.” |
| F-2-7 runner overstatement | Fixed | README separates Playwright browser claims from Vitest route generation. |

## Structure, accessibility, and visual identity

Apart from F-3-1 and F-3-2, these checks pass.

- `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` return 200. An unknown route returns the designed 404 with HTTP 404 and a return link. All tested pages have exactly one h1 and one main landmark, route-specific title, description, and canonical.
- The title pattern is correct: “Tide & Tile — Make a daily harbor route,” “Demo — Tide & Tile,” “Privacy — Tide & Tile,” and “Terms — Tide & Tile.” `lang`, Open Graph image/data, Twitter card, SVG favicon, 180 px apple-touch icon, robots, and sitemap are present.
- The header/footer, skip link, internal links, and legal links are consistent. The route tests pass locally, including focus restoration and history navigation, but F-3-2 records the missing explicit live route announcement. The link/resource crawl returned 200 for every intended route and asset; the deliberate unknown route returned 404.
- Live headers include same-origin CSP with `frame-ancestors 'none'`, `nosniff`, referrer policy, HSTS, and immutable cache headers on the live hashed JavaScript. No cold-load console error occurred at either viewport.
- Local axe coverage reports no serious or critical WCAG A/AA violation across app routes and the completed-dialog state. The mobile claim test confirms the full board and all visible controls fit at 390 px with 44 px targets. Reduced motion, keyboard tile controls, and offline reload each have passing declared tests.
- The ink, paper, ochre, water-blue, harbor-red visual system, hard printed shadows, procedural tile board, and original harbor-table art are visibly specific to this game, not a generic SaaS layout.

## Missed leverage

No omitted AI, import/export, or sync feature is implied by the brief. This is a local tile-routing puzzle; an AI action would not improve the central turn-and-connect task and would weaken the local-first privacy model. `Copy result` supplies the useful lightweight share action.

## What would make this perfect

Deploy the exact reviewed release so its footer, hashed application asset, and service-worker shell all agree. Add a persistent polite route-announcement region and test it through link and Back navigation. Re-run the complete live suite until it is 31/31. With those defects closed, this review found no remaining copy, demo, privacy, claim, or product-scope work.

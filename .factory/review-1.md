# Adversarial first-read review 1 — FAIL

**Product:** Tide & Tile  
**Live URL:** https://tide-and-tile.sociobot.in  
**Reviewed:** 2026-09-02 UTC  
**Revision supplied for review:** `966ff8f51de3866a106c500f6df8dcadc4398333`

## Verdict

**FAIL.** The game is clear and playable, and all 20 declared local claim commands pass. It cannot be accepted at this revision because the live deployment identifies a different build and the supplied suite fails against the live URL. The visitor-facing copy also contains declared-fact gaps and plain-language defects listed below. There are seven findings: one blocking, two major, and four minor.

## Cold first read

Fresh 390 × 844 and 1440 × 1000 browser contexts were opened at `/`, without prior storage.

Before scrolling, the page communicates all three required facts.

| Question | What the first screen says |
| --- | --- |
| What does it do? | “Make today’s harbor route” — rotate water tiles into a route. |
| Who is it for? | “For casual players who want a calm puzzle break with clear rules.” |
| What should I click first? | “Try it with sample data”; its adjacent text says “Loads a guided board. It does not change your daily progress.” |

This first-read gate **passes**. On the 390 px cold landing screen, playable tiles are visible. Selecting the action reaches `/demo` in one click. On that fresh demo screen the visible board is 340 × 340 px from y=416.7 to y=756.7, so the complete board is already visible.

## Findings

### Blocking

#### F-1-1 — The live artifact is not the supplied revision

**Location/evidence:** The supplied branch is `966ff8f`, while the live footer on `/`, `/demo`, and `/404.html` says `v1.1-708d4e8`. The prior handoff names `708d4e8` as its candidate. Running the repository’s live identity check fails:

```text
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in \
  npx playwright test --grep 'routes load without console errors'

Expected substring: "v1.1-966ff8f"
Received string:    "... Built by Param Factory · v1.1-708d4e8"
```

**Why this fails review:** A reviewer cannot confirm that the current branch, its tests, and the public product are one release. The existing release test is specifically intended to make that mismatch visible. The difference after `708d4e8` is documentation/evidence only, but the current delivery still fails the repository’s live verification at its declared revision.

**Concrete fix:** Deploy a build made from `966ff8f` (or make the supplied revision and live build identity agree), then rerun the full suite against the live URL. Preserve the 404 footer’s build substitution in that deployment.

### Major

#### F-1-2 — The advertised session length is an unlisted quantitative claim

**Location/quote:** `README.md`, opening paragraph: “Tide & Tile is a daily browser puzzle for casual players who want a calm **two-to-five-minute** break.”

**Why this fails review:** A two-to-five-minute duration is a number a visitor can rely on. `.factory/claims.json` has no `session-length` entry and no tagged test that measures a representative sample run. The `frame-rate` test does not establish session length.

**Concrete fix:** Either remove the duration (“Tide & Tile is a daily browser puzzle for casual players who want a calm break.”), or add a `session-length` claim and a deterministic demo test that measures the documented path and asserts the stated range.

#### F-1-3 — The sample’s four-turn promise has no matching claim entry

**Location/quotes:** Landing figure caption: “**Four tiles need one turn in the sample.**” Landing board: “**Fewest 4**.” README: “Its four marked tiles each need one turn.”

**Why this fails review:** These are exact, visitor-visible sample facts. `continuous-route` happens to solve the sample in four turns, but its declared claim is only “Winning requires one continuous dock-to-harbor route,” and its `where` does not include the figure caption or displayed fewest score. `demo-sandbox` tests storage isolation, not the four-turn fact. The claims contract requires an entry for each relied-on claim, not an implicit assertion hidden under a differently named claim.

**Concrete fix:** Add a `sample-four-turn` claim with `where` covering the landing caption, board stat, and README. Its tagged test should assert the four marked tiles, a one-turn requirement for each, the visible “Fewest 4” value, and the four-turn win. Alternatively, remove the exact numbers from all copy.

### Minor

#### F-1-4 — The visible artwork-origin statement is an unlisted claim

**Location/quote:** Landing footer: “Harbor illustration is **original AI-generated artwork**.” README: “The generated harbor illustration is original factory artwork.”

**Why this fails review:** Originality and generation provenance are factual promises. The asset sidecar and design notes are good supporting records, but no `claims.json` entry declares the statement or tags the existing provenance regression check.

**Concrete fix:** Add an `art-provenance` claim and tagged unit test that checks the local asset sidecar and design record (deployment, model, date, prompt/provenance path), or remove the footer/README claim and retain the provenance record only in project documentation.

#### F-1-5 — Game copy exposes unexplained developer terms and inconsistent storage names

**Location/quotes:**

- Landing instruction: “Seed 2026-09-02.”
- Archive gate: “Complete today’s **UTC** board …” and eyebrow “THREE **SEEDED** ROUTES.”
- Landing fact: “Progress stays in this browser.” README/demo documentation: “local storage” / “local-storage keys.”

**Why this fails review:** “Seed,” “seeded,” and “UTC” are implementation terms that do not help a first-time player turn a tile. “Browser,” “local storage,” and “local-storage keys” name the same storage concept inconsistently.

**Concrete fix:** Use “Today’s route: 2026-09-02” only where the date is useful; otherwise omit it. Rewrite the archive copy as “THREE PRACTICE ROUTES” and “Complete today’s board to unlock practice.” Use “this browser’s storage” in visitor-facing copy, with “(local storage)” once in the technical privacy/README explanation if needed.

#### F-1-6 — Archive controls do not say what pressing them does

**Location/quotes:** Disabled/enabled archive buttons: “Dock lesson,” “Breakwater bend,” and “Harbor circuit.”

**Why this fails review:** These names are harbor-themed labels, not result-naming verbs. A first-time player has to read the smaller companion line and still does not get an action in the button name.

**Concrete fix:** Rename them to “Play the 4-turn guided route,” “Practice 20-turn corners,” and “Play the 25-turn scramble.” Keep the thematic route names as a small descriptive label if desired, and update the archive-control tests to use the accessible action names.

#### F-1-7 — The sound toggle labels its current state, not its result

**Location/quote:** Game toolbar button: “Sound on.”

**Why this fails review:** When sound is on, pressing “Sound on” actually turns sound off. This is ambiguous and does not meet the result-naming button rule.

**Concrete fix:** Present a state label such as “Sound: on” and make the button action “Turn sound off” (reverse both strings when muted). Retain `aria-pressed` or expose the state in the accessible name.

## Copy audit

Word counts use words/numbers as tokens; punctuation and the `&` mark are not words. No landing or README sentence exceeds 22 words. The audit still flags F-1-2 through F-1-7 above for unlisted facts, jargon, inconsistent terms, and non-result-naming controls.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| DAILY HARBOR PUZZLE | 3 | Clear context label. |
| Make today’s harbor route | 4 | Clear job headline. |
| For casual players who want a calm puzzle break with clear rules. | 12 | Clear audience. |
| Try it with sample data | 5 | Clear primary action. |
| Loads a guided board. | 4 | Clear outcome. |
| It does not change your daily progress. | 7 | Declared through `demo-sandbox`. |
| Free to play | 3 | Declared through `free-local-game`. |
| Works offline after the first visit | 6 | Declared through `offline-reload`. |
| Progress stays in this browser | 5 | Declared through `privacy-local`; terminology issue in F-1-5. |
| Four tiles need one turn in the sample. | 8 | Unlisted exact fact: F-1-3. |
| TODAY’S BOARD | 2 | Clear context label. |
| Today’s tide | 2 | Understandable board name in context. |
| Turns 0 / 12 | 2 | Game status, not a sentence. |
| Fewest 4 | 2 | Unlisted exact fact: F-1-3. |
| Sound on | 2 | Toggle wording: F-1-7. |
| Start with the four marked tiles. | 6 | Clear instruction. |
| Turn each blue channel toward the next tile. | 8 | Clear instruction. |
| Seed 2026-09-02. | 2 | Jargon: F-1-5. |
| Restart this board | 3 | Result-naming verb. |
| Show the next rule | 4 | Result-naming verb. |
| Copy result | 2 | Result-naming verb. |
| THREE SEEDED ROUTES | 3 | “Seeded” jargon: F-1-5. |
| Archive boards | 2 | Clear section heading. |
| Complete today’s UTC board (2026-09-02) to unlock archive practice. | 9 | UTC jargon: F-1-5; gate declared through `archive-gate`. |
| Dock lesson | 2 | Non-action control label: F-1-6. |
| 4-turn guided route | 3 | Difficulty declared through `archive-gate`. |
| Breakwater bend | 2 | Non-action control label: F-1-6. |
| 20-turn corner practice | 3 | Difficulty declared through `archive-gate`. |
| Harbor circuit | 2 | Non-action control label: F-1-6. |
| 25-turn full scramble | 4 | Difficulty declared through `archive-gate`. |
| How to play Tide & Tile | 5 | Clear section heading. |
| Turn a tile by tapping it or pressing Enter or Space. | 11 | Declared through `keyboard-tiles`. |
| Join every channel into one continuous route. | 8 | Declared through `continuous-route`. |
| Finish near the fewest turns to earn a medal. | 10 | Clear game instruction. |
| What it does not do: there are no timers, lives, accounts, or leaderboards. | 13 | Declared through `free-local-game`. |
| The turn limit gives each route a clear finish. | 10 | Clear rule explanation. |
| A daily harbor-route puzzle for short breaks. | 6 | Plain product description. |
| Harbor illustration is original AI-generated artwork. | 6 | Unlisted provenance fact: F-1-4. |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Tide & Tile is a daily browser puzzle for casual players who want a calm two-to-five-minute break. | 16 | Unlisted quantitative claim: F-1-2. |
| Rotate a 4×4 grid into one continuous dock-to-harbor route. | 9 | Plain product explanation. |
| A run ends with a connected route or the board’s turn limit. | 13 | Declared through `end-screens`. |
| Try the isolated sample at `/demo`. | 6 | Clear demo route. |
| Its four marked tiles each need one turn. | 8 | Unlisted exact fact: F-1-3. |
| Demo state uses only `demo:` local-storage keys and is deleted when you leave. | 13 | Declared through `demo-sandbox`; terminology issue in F-1-5. |
| The unit suite checks route connectivity, the exact four-turn sample, deterministic generation, and topology variety. | 15 | “Topology” is developer jargon; rewrite “different route layouts.” |
| Playwright checks every declared claim, both end screens, persistence, all inputs, the 390px layout, accessibility, offline reload, cache updates, and response policy. | 22 | At cap; split into two useful sentences. |
| The build creates `dist/` with a content-versioned service worker and the deployment configuration. | 13 | “Content-versioned” is developer jargon; rewrite “a versioned offline cache.” |
| Home always loads the current UTC date’s daily board. | 10 | UTC jargon; rewrite “Home always loads today’s board.” |
| The first three real visits teach turning, matching edges, and the full route. | 13 | Declared through `progressive-lessons`. |
| Archive practice unlocks after today’s win. | 7 | Declared through `archive-gate`. |
| Its routes rise from 4 to 20 to 25 misplaced tiles. | 11 | Declared through `archive-gate`. |
| Daily, archive, and demo progress use separate records. | 8 | Declared through `demo-sandbox` and `daily-boundary`. |
| All five modes have distinct routes. | 6 | Declared through `advertised-modes`. |
| Current rotations, completed results, best scores, and sound preference persist in local storage. | 13 | Declared through `progress-persistence`; terminology issue in F-1-5. |
| Copy result includes the product name, seed, turn count, fewest score, and route result. | 14 | Declared through `copy-result`; “seed” should be explained or renamed. |
| The full board fits at 390px, and touch controls are at least 44px. | 13 | Declared through `mobile-controls`. |
| Play is free. | 3 | Declared through `free-local-game`. |
| There are no accounts, payments, analytics, timers, lives, or leaderboards. | 10 | Declared through `free-local-game`. |
| The fixed-step game loop targets 60 frames per second. | 9 | Declared through `frame-rate`; engineering jargon. |
| A hidden tab runs zero simulation steps and discards elapsed time before it resumes. | 14 | Declared through `hidden-pause`; engineering detail. |
| Deploy `dist/` as an Azure Static Web App using its included `staticwebapp.config.json`. | 12 | Appropriate deployment instruction. |
| Hashed assets are immutable. | 4 | Declared through `response-policy`; technical detail. |
| Pages and `sw.js` revalidate. | 4 | Technical detail. |
| Each build gives the offline cache a content-derived version. | 9 | Declared through `service-worker-update`; rewrite “a new build replaces the old offline cache.” |
| No service, account, secret, or environment variable is required. | 9 | Plain deployment instruction. |
| The generated harbor illustration is original factory artwork. | 8 | Unlisted provenance fact: F-1-4. |
| Its source prompt and provenance are in `.factory/design.md`. | 8 | Clear developer pointer. |

**Terminology table:** route = the connected water path; board = the 4×4 tile grid; archive practice = unlocked practice routes; use “this browser’s storage” for stored game data. Do not use “seed/seeded,” “UTC,” or “local-storage keys” in player-facing copy without explanation.

## Demo, claims, privacy, and history checks

### Demo sandbox

This check **passes**.

- `/demo` loaded **Sample harbor** immediately; it showed the full 4×4 board and the persistent “Demo — sample data, nothing is saved” banner.
- `Reset demo` and `Start for real` are present. The repository claim test seeds a real record, writes demo progress, confirms the real record is unchanged, then confirms leaving removes `demo:tide-and-tile`.
- In a live fresh context, requests during `/demo` stayed on `https://tide-and-tile.sociobot.in` only.
- The exact local `@claim:demo-sandbox` test passed from the clean checkout. Its test covers reset/leave storage behavior; the full suite also covers win, loss, restart, and sample progress.

### Claims manifest

`.factory/claims.json` contains 20 unique entries. After `npm ci`, every listed command was run separately from this checkout and passed: `demo-sandbox`, `privacy-local`, `keyboard-tiles`, `daily-boundary`, `archive-gate`, `progressive-lessons`, `restart-resets`, `continuous-route`, `end-screens`, `progress-persistence`, `advertised-modes`, `copy-result`, `procedural-routes`, `frame-rate`, `hidden-pause`, `mobile-controls`, `offline-reload`, `service-worker-update`, `response-policy`, and `free-local-game`.

Local checks also passed: `npm run test:unit` (4/4), `npm run lint`, `npm run typecheck`, `npm test` (27/27), and `npm run build`. Built JavaScript is 7.35 kB gzip. There were no failing declared claim tests. Findings F-1-2 through F-1-4 are omissions from the manifest, not failures of its existing entries.

### Prior reviews and handoff

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The prior `.factory/handoff.md` reports no open findings and identifies candidate `708d4e8`; prior verification reports document repairs to game completion, persistence, mobile sizing, cache updates, and hidden-tab behavior. The current local 27-test suite and live demo exercise confirm those repaired product behaviors. The unresolved current issue is F-1-1: the supplied revision and live build are not the same release identity.

## Structure, accessibility, and leverage

These checks pass apart from F-1-1.

- Browser-rendered route titles are route-specific: landing, demo, privacy, terms, and 404 all have one h1 and a main landmark. Browser-rendered canonicals update to the active route.
- Fresh deep links to `/`, `/demo`, `/privacy`, and `/terms` work. The app uses history navigation, restores focus to the h1 after client-side route changes, and supplies a skip link. The designed unknown-path 404 returns HTTP 404.
- The checked internal links (`/`, `/demo`, `/privacy`, `/terms`, `/404.html`, metadata assets, robots, sitemap) returned 200; unknown paths returned 404.
- Live responses have strict same-origin CSP including `frame-ancestors 'none'`, HSTS, nosniff, referrer policy, and immutable hashed-asset caching. No console or page errors occurred in cold desktop/mobile loading.
- The 390 px demo has 44 px or larger visible buttons/links and 82 px tiles. The local axe coverage reports no serious or critical A/AA violations on all application routes and the end dialog. Reduced motion and offline reload have declared passing tests.
- The neo-brutalist harbor-table art, ink/paper palette, hard tile outlines, and game-board-first mobile layout are visibly product-specific rather than a generic SaaS template. The design record gives asset provenance.
- No AI feature is missing: the brief is a local puzzle game, and an AI action would not make the core turning/route task clearer. Import/export or sync is not implied; Copy result already supplies the useful lightweight share output.

## What would make this perfect

Deploy the reviewed revision and make the live identity test green. Then remove or test every exact visitor promise, replace developer vocabulary with player language, and rename the archive and sound controls to describe the action. After those changes, rerun the 20-claim matrix, local suite, and live suite; a PASS requires zero remaining findings.

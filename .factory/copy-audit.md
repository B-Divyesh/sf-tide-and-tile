# Copy audit

Words and numbers count as tokens. No sentence exceeds 22 words. No sentence contains a banned marketing word.

## Catalog description

| Sentence | Words | Status |
| --- | ---: | --- |
| Rotate water tiles into one continuous harbor route, then return for a new daily board. | 15 | pass; verb-first and under 120 characters |

## Landing page and game labels

| Sentence or label | Words | Status |
| --- | ---: | --- |
| Daily harbor puzzle | 3 | pass |
| Skip to main content | 4 | pass |
| Make today’s harbor route | 4 | pass |
| For casual players who want a calm puzzle break with clear rules. | 12 | pass |
| Try it with sample data | 5 | pass |
| Loads a guided board. | 4 | pass |
| It does not change your daily progress. | 7 | pass |
| Free to play | 3 | pass |
| Works offline after the first visit | 6 | pass |
| Progress stays in this browser’s storage | 6 | pass |
| Four tiles need one turn in the sample. | 8 | pass; `sample-four-turn` claim |
| Daily puzzle | 2 | pass |
| Today’s board | 2 | pass |
| Board date: 2026-09-02 | 3 | pass; date varies; `daily-board-id` claim |
| Turns 0 / 12 | 2 | pass |
| Fewest 4 | 2 | pass; `sample-four-turn` claim |
| Sound: on | 2 | pass; state label |
| Turn sound off | 3 | pass; action label |
| Start with the four marked tiles. | 6 | pass |
| Turn each blue channel toward the next tile. | 8 | pass |
| Use arrow keys to move, then Enter or Space to turn a tile. | 13 | pass |
| Restart this board | 3 | pass |
| Show the next rule | 4 | pass |
| Copy result | 2 | pass |
| Three practice routes | 3 | pass |
| Archive boards | 2 | pass |
| Practice three routes at any time. | 6 | pass; `archive-practice` claim |
| They rise from 4 to 25 misplaced tiles. | 8 | pass; `archive-practice` claim |
| Play the 4-turn guided route | 6 | pass; action label |
| Dock lesson | 2 | pass; route name |
| Practice 20-turn corners | 4 | pass; action label |
| Breakwater bend | 2 | pass; route name |
| Play the 25-turn scramble | 5 | pass; action label |
| Harbor circuit | 2 | pass; route name |
| How to play Tide & Tile | 5 | pass |
| Turn a tile by tapping it or pressing Enter or Space. | 11 | pass |
| Join every channel into one continuous route. | 7 | pass |
| Finish at the fewest turns for Tide, within four more for Harbor, or later for Dock. | 16 | pass; `medal-thresholds` claim |
| What it does not do: there are no timers, lives, accounts, or leaderboards. | 13 | pass |
| The turn limit gives each route a clear finish. | 9 | pass |
| A daily harbor-route puzzle for short breaks. | 7 | pass |
| Harbor illustration is original AI-generated artwork. | 6 | pass; `art-provenance` claim |

## Demo banner

| Sentence or label | Words | Status |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 7 | pass |
| Reset demo | 2 | pass |
| Start for real | 3 | pass |
| Guided sample | 2 | pass |
| Sample board | 2 | pass |

## README prose

| Sentence | Words | Status |
| --- | ---: | --- |
| Tide & Tile is a daily browser puzzle for casual players who want a calm break. | 14 | pass |
| Rotate a 4×4 grid into one continuous dock-to-harbor route. | 9 | pass |
| A run ends with a connected route or the board’s turn limit. | 12 | pass |
| Try the isolated sample at `/demo`. | 6 | pass |
| Its four marked tiles each need one turn. | 8 | pass; `sample-four-turn` claim |
| Demo progress uses a separate `demo:` key in this browser’s storage (local storage). | 13 | pass |
| It is deleted when you leave. | 6 | pass |
| Open the printed URL. | 4 | pass |
| Use `/?demo=1` for the guided board. | 6 | pass |
| The unit tests confirm connected routes, the four-turn sample, repeatable daily boards, and different route layouts. | 16 | pass |
| Playwright checks every browser claim, both end screens, persistence, and all inputs. | 12 | pass |
| Vitest checks route generation. | 4 | pass |
| The browser suite also checks the 390px layout, accessibility, offline reloads, cache updates, and security headers. | 16 | pass |
| The build creates `dist/` with a versioned offline cache and the deployment configuration. | 13 | pass |
| Home always loads today’s board. | 5 | pass |
| The first three real visits teach turning, matching edges, and the full route. | 12 | pass |
| Archive practice is available from a fresh game. | 8 | pass; `archive-practice` claim |
| Its routes rise from 4 to 20 to 25 misplaced tiles. | 11 | pass |
| Daily, archive, and demo progress use separate records. | 8 | pass |
| All five modes have distinct routes. | 6 | pass |
| Current rotations, completed results, best scores, and sound choice persist in this browser’s storage. | 14 | pass |
| Copy result includes the game, board, turn count, fewest score, and route result. | 13 | pass |
| The daily board shows its date. | 6 | pass; `daily-board-id` claim |
| Its copied result includes the same date. | 7 | pass; `daily-board-id` claim |
| The full board fits at 390px, and touch controls are at least 44px. | 13 | pass |
| Play is free. | 3 | pass |
| There are no accounts, payments, analytics, timers, lives, or leaderboards. | 10 | pass |
| The game targets 60 frames per second. | 7 | pass |
| It pauses completely while its tab is hidden. | 8 | pass |
| Hashed files under `/assets/` use one-year immutable cache headers. | 9 | pass; `response-policy` claim |
| Pages and `sw.js` check for updates. | 6 | pass |
| A new build replaces the old offline cache. | 8 | pass |
| No service, account, secret, or environment variable is required. | 9 | pass |
| The generated harbor illustration is original factory artwork. | 8 | pass; `art-provenance` claim |
| Its source prompt and provenance are in `.factory/design.md`. | 8 | pass |

## Terminology

| Concept | One term used in visitor copy |
| --- | --- |
| Rotating puzzle piece | tile |
| Connected blue line | channel |
| One play layout | board |
| Finished connection | route |
| Non-daily layout | practice route |
| Stable daily reference | board date |
| Stored game data | this browser’s storage |
| Maximum moves | turn limit |

Internal documentation and source may use `seed`, `UTC`, and `localStorage`. Player-facing copy uses the plain terms above.

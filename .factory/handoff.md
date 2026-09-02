# Tide & Tile verification handoff — round 9

## Outcome

**FAIL** for candidate `c8aaaeb923a7aadad821bffc2720267410405746` at <https://tide-and-tile.sociobot.in>.

The live artifact matches the candidate and all automated claims/gates passed, but the desktop 1440×900 cold first screen does not show the playable game. **Major:** the board and first playable tile begin at y=907.5, below the viewport, which violates the browser-game requirement that the captured first screen show the game itself. See `.factory/verification-9.md` for complete evidence.

## How verified

```sh
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm test
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test
npm run build
```

All 23 `.factory/claims.json` commands passed individually. The production build is 19.04 kB raw JavaScript (7.57 kB gzip) and 9.33 kB raw CSS (2.93 kB gzip). Independent runs confirmed demo isolation, same-origin requests only, exact win/loss/restart paths, live headers, byte-identical deployed assets, and no console/page errors.

## Required next step

Adjust the desktop initial layout so the real interactive 4×4 board, not only a static illustration or board heading, is visible in the cold 1440×900 first capture. Re-run the first-read and browser-game capture checks after the layout change.

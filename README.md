# Tide & Tile

Tide & Tile is a daily browser puzzle for casual players who want a calm break. A round is designed for two to five minutes. Rotate a 4×4 grid into one continuous dock-to-harbor route. A run ends with a connected route or the board’s turn limit.

Try the isolated sample at `/?demo=1` or its canonical `/demo` URL. Its four marked tiles each need one turn. Demo progress uses a separate `demo:` key in this browser’s storage (local storage). It is deleted when you leave.

## Run locally

```sh
npm ci
npm run dev
```

Open the printed URL. Use `/?demo=1` for the guided board.

## Verify and build

```sh
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
```

The unit suite checks route connectivity, the exact four-turn sample, deterministic generation, and different route layouts. Playwright checks every declared claim, both end screens, persistence, and all inputs. It also checks the 390px layout, accessibility, offline reload, cache updates, and response policy. The build creates `dist/` with a versioned offline cache and the deployment configuration.

## Modes and local data

- Home always loads today’s board.
- The first three real visits teach turning, matching edges, and the full route.
- Archive practice is available from a fresh game. Its routes rise from 4 to 20 to 25 misplaced tiles.
- Daily, archive, and demo progress use separate records. All five modes have distinct routes.
- Current rotations, completed results, best scores, and sound choice persist in this browser’s storage.
- Copy result includes the game, board, turn count, fewest score, and route result.
- The daily board shows its UTC date identifier. Its copied result includes the same identifier.
- The full board fits at 390px, and touch controls are at least 44px.
- Play is free. There are no accounts, payments, analytics, timers, lives, or leaderboards.
- The game targets 60 frames per second. It pauses completely while its tab is hidden.

## Deploy

Deploy `dist/` as an Azure Static Web App using its included `staticwebapp.config.json`. Static assets use long cache headers. Pages and `sw.js` check for updates. A new build replaces the old offline cache. No service, account, secret, or environment variable is required.

The generated harbor illustration is original factory artwork. Its source prompt and provenance are in `.factory/design.md`.

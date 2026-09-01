# Tide & Tile

Rotate a 4×4 grid into one continuous dock-to-harbor route. Tide & Tile is a short daily browser puzzle. A run ends with a connected route or the board’s turn limit.

Try the isolated sample at `/demo`. Its four marked tiles each need one turn. Demo state uses only `demo:` local-storage keys and is deleted when you leave.

## Run locally

```sh
npm ci
npm run dev
```

Open the printed URL. Use `/demo` for the guided board.

## Verify and build

```sh
npm run test:unit
npm test
npm run build
```

The unit suite checks route connectivity, the exact four-turn sample, deterministic generation, and topology variety. Playwright checks every declared claim, both end screens, persistence, all inputs, the 390px layout, accessibility, offline reload, cache updates, and response policy. The build creates `dist/` with a content-versioned service worker and the deployment configuration.

## Modes and local data

- Home always loads the current UTC date’s daily board.
- The first three real visits teach turning, matching edges, and the full route.
- Archive practice unlocks after today’s win. Its routes rise from 4 to 20 to 25 misplaced tiles.
- Daily, archive, and demo progress use separate records. All five modes have distinct routes.
- Current rotations, completed results, best scores, and sound preference persist in local storage.
- Copy result includes only the seed, turns, fewest score, and route result.
- The full board fits at 390px, and touch controls are at least 44px.
- Play is free. There are no accounts, payments, analytics, timers, lives, or leaderboards.
- The fixed-step game loop targets 60 frames per second and pauses in hidden tabs.

## Deploy

Deploy `dist/` as an Azure Static Web App using its included `staticwebapp.config.json`. Hashed assets are immutable. Pages and `sw.js` revalidate. Each build gives the offline cache a content-derived version. No service, account, secret, or environment variable is required.

The generated harbor illustration is original factory artwork. Its source prompt and provenance are in `.factory/design.md`.

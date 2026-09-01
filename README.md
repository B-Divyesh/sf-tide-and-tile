# Tide & Tile

Tide & Tile is a daily 4×4 water-route puzzle for casual players. A round is designed for a calm two-to-five-minute break. Rotate tiles by touch, mouse, or keyboard to connect the dock to the harbor.

Try the isolated sample board at `/demo`. It uses `demo:` local-storage keys, and leaving it discards the sample progress.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Use `/demo` for a clean sample board.

## Verify and build

```sh
npm test
npm run build
```

`npm test` builds the app and runs Playwright against the demo flow. `npm run build` produces the deployable static site in `dist/`.

## Deploy

Deploy `dist/` as a static site. `staticwebapp.config.json` supplies SPA navigation fallback, the 404 page, cache headers, and security headers. No service, account, or environment variables are required.

## Product notes

- Daily boards use the calendar date as a deterministic seed.
- Archive boards remain available from the home screen.
- Progress and sound preference are browser-local.
- The generated harbor illustration is original factory artwork. Its source prompt and provenance are in `.factory/design.md`.

# Tide & Tile handoff — independent verification 8

## Outcome

**PASS.** Candidate `cb16ecc6f861d7ca0319ae0dfa85a4c4feb59d62` was independently verified on 2026-09-02 UTC at <https://tide-and-tile.sociobot.in>. The live JavaScript, CSS, and service worker match the candidate build byte for byte. No critical, major, or minor defects remain.

The cold first screen explains the harbor-route game, names casual puzzle players, offers one-click sample play, and shows the game rather than a menu wall. The isolated sample reaches both the real win and loss screens through deterministic scripted runs and restarts cleanly.

## Verification summary

- Clean install: `npm ci` — 139 packages, zero vulnerabilities.
- Claims: all 24 commands in `.factory/claims.json` passed separately.
- Unit: `npm run test:unit` — 4/4 passed.
- Static checks: `npm run lint` and `npm run typecheck` passed.
- Local browser suite: `npm test` — 31/31 passed.
- Exact build: `npm run build` produced `dist/`.
- Live browser suite: `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` — 31/31 passed.
- Independent live run: four turns reached the Tide win screen; twelve wrong turns reached the loss screen; restart, share, settings, storage isolation, malformed-storage recovery, keyboard, touch, and persistence passed.
- Accessibility: zero axe serious/critical findings; visible 4 px keyboard focus; dialog focus; 200% text; reduced motion; 44 px targets all passed.
- Privacy: only same-origin requests; no analytics, account, payment, API, console error, or page error.
- PWA: controlled offline reload and stale-cache update passed.
- Mobile Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.2 s, TBT 140 ms, CLS 0.
- Performance: 19.01 kB raw JavaScript, 9.10 kB raw CSS, 69 KiB initial transfer, and 60.00 fps under 4× CPU slowdown.
- Routing/security: all intended routes and links pass, unknown routes return the designed HTTP 404, strict CSP and related headers are live, hashed assets are immutable, and `sw.js` is not cached.

Full evidence and finding severity are in `.factory/verification-8.md` and `.factory/verification-evidence-8/`.

## Reproduce

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test
```

## Known gaps and next steps

None. This static game has no server endpoints or authentication, so API allowance/429, backend concurrency, health identity, and Entra checks are not applicable. No product code was changed during verification.

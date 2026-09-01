# Tide & Tile repair handoff

## Outcome

The release-blocking findings from verifier commit `b6aacfc7866fffc1bb47345c515adb807e3c90fb` are repaired. The product remains a static Vite + TypeScript browser game deployed from `dist/`.

The untouched candidate was reproduced first at 390×844. Its board started at y=934; the scripted sample ended with `Route complete. Dock medal. 12 turns; fewest is 4.`; no dialog existed; reload returned to zero; and the nominal solution split into four disconnected components.

## What changed

- Replaced rotation equality with a real route validator. A win now requires matched neighboring ends, exactly the dock and harbor exterior ports, and one component containing all 16 tiles.
- Added a deterministic seeded Hamiltonian-route generator. Twenty dated seeds produce at least 12 topology signatures in regression coverage.
- Corrected rotational symmetry and minimum-turn accounting. The guided sample now needs exactly four presses and awards its Tide medal at `4 turns; fewest is 4`.
- Added focus-managed modal win and turn-limit loss screens. Each shows a run summary and restarts the same route with one action.
- Saves current rotations, run state, completed result, best score, and sound setting after every change. Reload reopens a completed end screen.
- Preserved isolated `demo:` storage. Leaving demo deletes sample state and never changes real progress.
- Kept daily, sample, and three archive modes; every named mode now has a distinct seeded route.
- Reworked the 390×844 layout. The full board measures y=417 through y=757, and demo/sound controls meet the 44px minimum.
- Replaced the fixed service-worker cache with a content-derived 12-character version. Install uses `skipWaiting`; activate removes older Tide & Tile caches; registration bypasses the HTTP cache.
- Ships `staticwebapp.config.json` inside `dist/`, with a strict CSP, immutable one-year hashed assets, a non-cached worker, explicit SPA routes, and a true styled 404 override.
- Removed CSP-incompatible inline styles and the old 404 page’s inline stylesheet.
- Expanded `.factory/claims.json` to cover end screens, persistent progress/settings, frame rate, every mode, connected routes, cache updates, response policy, offline reload, privacy, and all visitor-facing play claims.

## Verification evidence

- `npm ci`: 59 packages installed; 0 vulnerabilities.
- `npm run test:unit`: 4/4 passed, including the exact disconnected-candidate regression, four-turn sample, connectivity, determinism, and 20-seed variety.
- `npm test`: 15/15 Playwright tests passed after a production build.
- Every command in `.factory/claims.json` was executed separately: all 14 claims passed.
- `npm run build`: passed; JavaScript 16.23 KB raw / 6.68 KB gzip, CSS 8.31 KB raw / 2.63 KB gzip, illustration 60 KB on disk.
- 390×844 browser check: full 340×340 board is inside the first viewport; Reset demo, Start for real, and Sound are at least 44px high.
- Keyboard check: Tab focus is visible; Enter rotates; arrow keys move focus; native buttons support Space; the end dialog traps and restores the run through its action.
- Browser console/page-error checks: no errors on desktop or 390px demo, win, reload, or loss flows.
- `npx @axe-core/cli ... /demo --exit`: 0 violations. The in-suite WCAG A/AA axe scan also reports no serious or critical violations.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.5s, CLS 0, TBT 0ms.
- Frame claim: 90 `requestAnimationFrame` intervals at 390×844 under 4× CPU slowdown stayed at or above the tested 55 fps floor while the fixed 60 Hz step counter advanced.
- Offline/update: a dedicated context reloads `/demo` offline; a forced worker reinstall removes a seeded `tide-tile-stale-deploy` cache.
- Reduced motion remains enforced by CSS. The game loop pauses while the document is hidden and clamps resumed frame time.

## Run and deploy

```sh
npm ci
npm run test:unit
npm test
npm run build
swa deploy ./dist --app-name sf-tide-and-tile --resource-group sociobot --env production
```

Deployment is limited to the permitted `sf-tide-and-tile` Static Web App in resource group `sociobot`. No backend, database, secret, analytics, external script, font CDN, or payment service is used.

## Production evidence

- Repair artifact commit: `a96b739`; pushed to `origin/main` and deployed to the production environment of `sf-tide-and-tile`.
- Custom URL: `https://tide-and-tile.sociobot.in`; live footer reports `v1.1-a96b739`.
- Live asset identity: `/assets/index-BRpmqVSu.js`; service-worker cache: `tide-tile-1fe1a6feb8a9`.
- Live `/` returns 200 with the configured CSP and `Cache-Control: no-cache, must-revalidate`.
- Live hashed JavaScript returns 200 with `Cache-Control: public, max-age=31536000, immutable`.
- Live `/sw.js` returns 200 with `Cache-Control: no-cache, no-store, must-revalidate`.
- Live `/demo`, `/privacy`, and `/terms` return 200. `/not-a-real-page` returns the styled page with HTTP 404.
- Fresh live 390×844 browser: board x=25, y=417, 340×340; four-turn Tide medal reached; reload restored Turns 4 and the end dialog; no console or page errors.
- The live worker installed only `tide-tile-1fe1a6feb8a9` in the fresh context.

## Known gaps

None release-blocking. Automated accessibility checks do not replace testing with several real screen readers. The game uses browser-generated oscillator tones, so audio appearance varies slightly by browser.

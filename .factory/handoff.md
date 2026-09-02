# Tide & Tile perfection-loop round 1 handoff

## Outcome

All findings F-1-1 through F-1-7 are resolved. The repair keeps the browser-game artifact and the original neo-brutalist harbor-table identity. There are no known open findings, stubs, or TODOs.

The functional repair is commit `1900ebffcb016ac7f1b5c393ce0c3536710b3cbc`. The release build derives its visible `v1.1-<short revision>` identity from the final Git `HEAD`. The deployed footer and standalone 404 are verified against that same revision by the live browser suite.

## What changed

- The first-screen action opens `/?demo=1` in one click. `/demo` remains its canonical deep link.
- Both demo entry points use only `demo:tide-and-tile`, show the persistent sample-data banner, reset cleanly, preserve real progress, and delete demo data on exit.
- `.factory/claims.json` now has 22 unique claims. The exact four-turn sample and artwork provenance each have one tagged regression. The untested session-duration promise was removed.
- Player copy no longer exposes “seed,” “seeded,” or “UTC.” Storage is consistently called “this browser’s storage.”
- Archive buttons now name their actions. Sound shows a visible state and a separate result-naming action.
- Route titles, descriptions, canonical URLs, Open Graph copy, history focus, legal links, and the designed 404 are covered in browser tests. The standalone 404 now has complete metadata.
- The clearer sound control wraps safely at 200% text size without changing the normal 390 px first-screen board layout.
- `.factory/catalog-description.txt` is verb-first and 73 characters long.

## Verification

From a fresh clone at `1900ebffcb016ac7f1b5c393ce0c3536710b3cbc`:

- `npm ci`: 139 packages installed; 0 vulnerabilities.
- Every exact command in `.factory/claims.json`: 22/22 passed independently.

From the release worktree:

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run test:unit`: 4/4 passed.
- `npm test`: 29/29 Playwright tests passed.
- `npm run build`: passed and produced `dist/`.
- Initial JavaScript: 19.10 kB raw / 7.54 kB gzip.
- Initial CSS: 8.93 kB raw / 2.82 kB gzip.
- Lighthouse mobile on `/?demo=1`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.51 s, TBT 0 ms, CLS 0.
- Axe coverage: no serious or critical findings on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, or the end dialog.
- Privacy test: a complete sample run made same-origin requests only.
- Offline tests: first-visit offline reload and stale-cache replacement passed in dedicated browser contexts.
- Mobile tests: the full board fits at 390 × 844, visible targets are at least 44 px, and 200% text creates no horizontal overflow.

Evidence is under `.factory/evidence/polish-1-local/`. Finding-by-finding evidence is in `.factory/polish-1.md`.

## Run and verify

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
```

For the deployed release:

```sh
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test
/opt/fleet/lib/verify-url.sh https://tide-and-tile.sociobot.in .factory/evidence/polish-1-live
```

## Known gaps and next steps

None. The game intentionally has no accounts, backend, payments, analytics, or AI play feature.

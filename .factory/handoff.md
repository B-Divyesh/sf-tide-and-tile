# Tide & Tile repair handoff

## Outcome

Release-blocking findings from independent verification commit `a5643ddff14426fe542fb40b6d3843162c0dfb76` have been repaired without changing the static browser-game deployment class. The failure was reproduced before implementation: the focused regression run failed daily/archive isolation, the UTC archive gate, three-stage onboarding, MIT terms, legal archive navigation, and the precache budget.

## Repairs

- Daily games are stored by UTC date, archive games by seed, and demos under the separate `demo:` key. `/` always selects the current UTC date. Legacy current-board data is restored only when its seed matches the requested board.
- Archive practice requires `completedDailyUtc` to exactly equal today’s UTC seed. Finishing a demo cannot set it. A visible action returns from an archive to today.
- The first three real visits teach marked tiles, matching shared edges, and the full dock-to-harbor goal. Later visits show the standard keyboard instruction.
- Archive guidance now reports the board’s actual misplaced-tile count. Difficulty rises from 4 to 20 to 25 turns.
- Claims now cover the daily boundary, UTC gate, onboarding, clipboard result, hidden-tab pause, mobile controls, all five route signatures, Space input, and protection of pre-existing real data. A manifest test requires exactly one tagged regression per claim.
- Every visible mobile link and control is at least 44×44 CSS pixels. The complete board remains in the first 390×844 demo viewport and works with touch.
- Terms now state the MIT rights accurately. Archive links on Privacy and Terms lead to `/#archive`.
- `social.png` remains available for social cards but is no longer precached. The install shell fell from 2,145,482 bytes to 149,011 bytes.
- The shared 404 now includes navigation, legal links, the product description, and a build identity.
- Completed channels draw once over 420 ms. Reduced-motion mode makes the draw effectively instant.
- ESLint and a separate TypeScript check are now first-class package scripts.

## Regression coverage

The exact verifier failure paths live in `tests/game.spec.ts`:

- `@claim:daily-boundary`: archive progress survives independently, reload returns to today, and a prior-date legacy record cannot replace today.
- `@claim:archive-gate`: archives start disabled, unlock only after today’s win, show accurate 4/20/25 guidance, and relock for a stale marker.
- `@claim:progressive-lessons`: four visits produce three distinct lessons and then the standard instruction.
- `@claim:demo-sandbox`: seeded real data is unchanged and demo data is removed on exit.
- `@claim:keyboard-tiles`, `@claim:advertised-modes`, and `@claim:copy-result`: Space, all five route signatures, and exact clipboard output are asserted.
- Additional checks cover 44 px mobile targets, 200% text, MIT text and legal links, sub-2 MiB precache, all routes plus the end dialog in axe, console errors, shared 404 structure, and the 420 ms/reduced-motion route draw.

## Verification evidence

Run from a clean dependency install on 2026-09-01 UTC:

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
```

Results:

- `npm ci`: 140 packages audited, 0 vulnerabilities.
- Unit: 4/4 passed.
- Lint: passed with ESLint 10.9.1 and typescript-eslint 8.69.0.
- TypeScript: passed with `tsc --noEmit`.
- Browser integration: 26/26 passed on desktop and a 390×844 touch context.
- Every command in `.factory/claims.json` was run separately: 20/20 passed.
- Axe: no serious or critical WCAG A/AA findings on `/`, `/demo`, `/privacy`, `/terms`, or the completed-run dialog.
- Local factory URL check: correct title, language, one h1, main landmark, alt text, and zero console errors.
- Mobile Lighthouse on `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.6 s, TBT 0 ms, CLS 0.
- Production sizes: JS 18,034 bytes raw / 7.26 kB gzip; CSS 8,804 bytes raw / 2.80 kB gzip; hero WebP 58,118 bytes; service-worker precache 149,011 bytes.
- Visual evidence: `.factory/evidence/repair-2/demo-desktop.png`, `demo-mobile.png`, and `win-desktop.png`. Lighthouse and factory URL reports are in the same directory.

## Deployment and live checks

The production build was deployed through `/opt/fleet/lib/deploy-static.sh tide-and-tile /work/repo/dist`, which reused only `sf-tide-and-tile` in resource group `sociobot` and the `tide-and-tile.sociobot.in` DNS record. Azure deployment ID: `5b28daf1-86e3-48a1-8c21-f60fe122e44d`.

`https://tide-and-tile.sociobot.in` returned 200 over managed TLS. The live factory URL check reported a 696 ms load, no console errors, correct title/lang/main/h1/alt/button labels, and the unknown-route check returned HTTP 404. Live responses include the strict CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`; HTML is uncached, the worker is no-store, and hashed assets are immutable. Local and live SHA-256 hashes matched for JS, CSS, `sw.js`, and `harbor-table.webp` after deployment.

## Known gaps

No release-blocking gaps are known. Lighthouse did not produce an INP value because the lab run had no measured interaction; the scripted 4× CPU run still met the 60 fps claim. This product has no backend, account, payment, analytics, multiplayer, or runtime AI dependency, so backend health, rate limiting, Entra, billing, and model-gateway checks do not apply.

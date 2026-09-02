# Tide & Tile repair-4 handoff — PASS

## Outcome

All release-blocking findings from `.factory/verification-4.md` are repaired. The functional repair is commit `8da497496c05f97858f04f542d334e2d4c3d57e4`; this handoff and its evidence are recorded in the following documentation commit. The verified static product is deployed at https://tide-and-tile.sociobot.in.

## Repairs

- **Clipboard disclosure:** after **Copy result**, the live region now says exactly which fields were copied: product name, seed, turn count, fewest score, and route result. The `@claim:copy-result` regression asserts both this confirmation and the exact clipboard payload.
- **README session shape:** the first paragraph now names casual players and the intended two-to-five-minute puzzle break.
- **404 identity:** `public/404.html` uses a build-version placeholder. `scripts/build-sw.mjs` resolves it from the same Git revision used by the application, so a static 404 cannot carry a stale version label.
- **Artwork provenance:** the asset sidecar and design contract now record the generation date (`2026-09-01`), model (`gpt-image-1`), deployment (`factory-image`), prompt, dimensions, and quality. A regression test checks the documentation and provenance record.

## How to run and verify

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test
```

The isolated demo is at `/demo`. Rotate the four marked sample tiles once each, then choose **Copy result** on the win dialog. The confirmation and clipboard payload list the same fields.

## Exact verification evidence

Run on 2026-09-02 UTC from a clean dependency install:

- `npm ci`: 139 packages added; 140 audited; 0 vulnerabilities.
- `npm run test:unit`: 4/4 passed.
- `npm run lint` and `npm run typecheck`: passed.
- `npm test`: 27/27 passed after the repair commit. Coverage includes desktop, 390×844 touch, keyboard, end screens, 200% text, reduced motion, privacy requests, offline reload, service-worker update, response policy, local data isolation, and Playwright axe checks across every route and the win dialog.
- Every exact command listed in `.factory/claims.json`: 20/20 passed independently after the clean install, including the repaired `copy-result` contract.
- `npm run build`: produced `dist/`; initial JS is 18.37 KB raw / 7.35 KB gzip and CSS is 8.80 KB raw / 2.80 KB gzip.
- `/opt/fleet/lib/verify-url.sh` passed locally and live: 200, zero console/page errors, correct title, `lang=en`, one h1, a main landmark, image alt text, and labeled buttons. Local evidence is in `.factory/evidence/repair-4-local/`; live evidence is in `.factory/evidence/repair-4-live/`.
- The Playwright axe integration reported no serious or critical WCAG A/AA violations on `/`, `/demo`, `/privacy`, `/terms`, or the win dialog.
- Live mobile Lighthouse on `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.2 s, LCP 0.2 s, TBT 0 ms, CLS 0. Full JSON: `.factory/evidence/repair-4-live/lighthouse-mobile.json`.
- Live checks: an unknown route returned 404; the 404 footer and app build identity were `v1.1-8da4974`; CSP, HSTS, `Referrer-Policy`, and `X-Content-Type-Options` were present. The deployed JS, CSS, and service worker each matched local SHA-256 values.
- Deployment: `/opt/fleet/lib/deploy-static.sh tide-and-tile /work/repo/dist` completed successfully against the existing product-owned static app and custom domain.

## Known gaps

None. This static, local-first game has no backend, accounts, payments, analytics, third-party runtime dependencies, or server-held user data.

# Tide & Tile verification handoff — work order tide-and-tile-verify-10

## Outcome

**PASS** for candidate `aac734d24fb26674464f8e1b5591a57d0d40321b` at <https://tide-and-tile.sociobot.in>, verified 2026-09-02 UTC. No product defect was found, and no product code was changed.

The earlier desktop first-frame blocker is resolved: the complete playable 4×4 board is inside the cold 1440×900 viewport. The page also passes the plain-language and one-click demo gates.

## Verification summary

- All 24 `.factory/claims.json` tests passed when invoked separately from a clean install.
- `npm run test:unit` passed 4/4; lint and typecheck passed.
- `npm test` passed 33/33 locally and 33/33 against the live deployment.
- The production build succeeded with 7.59 kB gzip JS and 3.00 kB gzip CSS.
- Deterministic live play reached the four-turn Tide win and the 12-turn loss, then restarted cleanly from both.
- Keyboard, touch, invalid input, persistence, demo isolation, malformed-storage recovery, all five modes, daily boundaries, copy result, offline reload, and service-worker update passed.
- The live request log was same-origin only. Security and cache headers matched policy.
- Axe reported no violations on the five application routes. Mobile Lighthouse scored 93/100/100/100 for performance/accessibility/best practices/SEO; LCP was 1.10s and CLS was 0.
- Live and local deployment artifacts matched byte-for-byte; the live footer reports `v1.1-aac734d`.

Full evidence and exact measurements are in [verification-10.md](verification-10.md). Key captures are under `.factory/evidence/`.

## Reproduce

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test
mkdir -p .factory/evidence/verify-url
/opt/fleet/lib/verify-url.sh https://tide-and-tile.sociobot.in .factory/evidence/verify-url
```

## Known gaps and next steps

No known release gap remains. This static, account-free game has no server API, so rate-limit and identity-provider checks are not applicable. Deployment remains factory-owned; no infrastructure, DNS, billing, or unrelated resource was accessed or changed during verification.

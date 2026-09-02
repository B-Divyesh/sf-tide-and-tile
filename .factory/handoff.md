# Tide & Tile handoff — independent verification 7

## Outcome

**PASS.** Candidate `b26430f461cbeb069711b3c3527478b8d44eec11` was independently verified at <https://tide-and-tile.sociobot.in> on 2026-09-02 UTC. No Critical, Major, or Minor defects remain.

The live hashed JavaScript and service worker byte-match the candidate build. The full local suite and the full live suite pass (unit 4/4; Playwright 31/31 in each), as do all 24 separately executed claim commands. The cold screen names the game, audience, and first action; the one-click demo opens a playable 16-tile sample with isolated storage. An independent live script reached both actual end dialogs, restarted from each, and rechecked keyboard tile control, mobile layout, privacy request capture, headers, axe, offline reload, and route behavior. Fresh live mobile Lighthouse measured Performance 99 and Accessibility 100 (FCP 1.0 s, LCP 1.2 s, CLS 0, 69 KiB transfer).

Complete evidence and exact commands are in `.factory/verification-7.md` and `.factory/verification-evidence-7/`.

## Previous repair context

## Repairs

- Archive practice is available with empty storage. The daily-completion gate and its stored `completedDailyUtc` state were removed. A legacy marker cannot disable practice.
- The three practice routes still have distinct layouts and rise from 4 to 20 to 25 misplaced tiles.
- The daily heading now shows `Board ID: YYYY-MM-DD (UTC)`. A daily copied result includes the identical identifier.
- The first screen and README state the intended 2–5 minute round. This is design intent, not a claim that every player finishes within that time.
- Claims, README, demo notes, visual contract, copy audit, and privacy-facing storage behavior now agree with the repaired product.

Exact acceptance regressions are `@claim:archive-practice`, `@claim:daily-board-id`, and `@claim:session-length`. The existing sample copy regression remains exact.

## Reproduction of the rejected behavior

From the verifier candidate, a clean `npm ci && npm test -- --grep @claim:archive-gate` passed because the test expected archive controls to be disabled before a daily win and disabled again for a prior-date marker. That reproduced F6-1 and identified the inverted acceptance contract. The same source omitted the internal `2026-09-02` seed from visible daily text and from the clipboard result.

## Local verification

Run from a clean install after the repair commit:

```sh
npm ci
npm run test:unit
npm run lint
npm run typecheck
npm test
npm run build
```

Results:

- `npm ci`: 139 packages; 0 vulnerabilities.
- Unit: 4/4; Playwright: 31/31; lint and typecheck: pass.
- Production output: JS 18.99 kB raw / 7.54 kB gzip; CSS 9.10 kB raw / 2.86 kB gzip.
- Fleet URL check: correct title/lang, one h1/main, complete alt/button labels, and no console errors.
- Playwright axe integration: zero serious or critical WCAG A/AA violations on `/`, `/demo`, `/?demo=1`, `/privacy`, `/terms`, and the end dialog.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.5 s, TBT 10 ms, CLS 0; 69 KiB transferred.
- At 390×844, the daily board measured 340×340 at y=446.92–786.92. The smallest visible target was 44×44.
- At 390×844 under 4× CPU slowdown, 120 animation frames measured 60.001 fps, 16.666 ms mean, 16.7 ms p95, and 170 fixed steps.

Evidence: `.factory/evidence/repair-5-local/`.

## Live verification

- `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test`: 31/31 pass.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, no console errors, and all basic accessibility checks pass.
- Fresh live storage: all three archive controls enabled; UTC board ID visible; intended 2–5 minute copy visible.
- Complete browser flows remained same-origin. No analytics, third-party scripts, accounts, payments, or product API are present.
- Offline reload, versioned cache replacement, hidden-tab pause, keyboard, touch, win/loss, replay, persistence, clipboard, reduced motion, and response-policy checks pass.
- Live mobile Lighthouse: 100/100/100/100; FCP 0.8 s, LCP 1.1 s, TBT 30 ms, CLS 0; 69 KiB transferred.
- Root CSP includes `frame-ancestors 'none'`; pages revalidate; `sw.js` returns `no-cache, no-store, must-revalidate`; hashed assets are immutable.
- Ten public production files matched local `dist/` byte-for-byte. GitHub `main` matched the deployed implementation commit before the final evidence-only commit.

Evidence: `.factory/evidence/repair-5-live/`.

## Deployment

The build was deployed with:

```sh
/opt/fleet/lib/deploy-static.sh tide-and-tile /work/repo/dist
```

Only the existing `sf-tide-and-tile` Static Web App and `tide-and-tile.sociobot.in` DNS record were addressed. The app remained in its original static browser-game class. No backend, package-consumer, API allowance/429, Entra, payment, database, or shared resource check applies.

## Known gaps and next step

No release-blocking gap is known. The 2–5 minute duration is an intended session shape; player skill naturally changes completion time. The next step is an independent verification of the final deployed commit.

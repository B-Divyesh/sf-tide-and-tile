# Tide & Tile verification 6 handoff

## Outcome

**FAIL — candidate `12be0a849604e8f82f371f89ab750dc284694e11` is deployed at https://tide-and-tile.sociobot.in, but it does not meet the supplied acceptance contract.**

No product code was changed. This verification adds only the report and its evidence.

## Release blockers

1. **Major:** Fresh users cannot use archive boards. All three controls are disabled until today’s daily board is completed, while the researched brief explicitly requires archive boards to be always available. The passing `archive-gate` claim asserts the wrong product behavior.
2. **Major:** The daily seed/date is hidden and absent from the copied result. The live internal seed was `2026-09-02`, while the result said only `Board: Today’s tide`; it cannot identify the daily puzzle after the date changes.
3. **Minor:** The README does not state the intended two-to-five-minute session length required by the game contract.

Full evidence and required corrections are in `.factory/verification-6.md`.

## What passed

- Mandatory claim commands: 22/22.
- Unit: 4/4; lint and typecheck: pass.
- Local Playwright: 29/29; live Playwright: 29/29.
- Exact production build: pass; `dist/` produced.
- Local/live deployment comparison: 12/12 public build files byte-identical.
- Cold first-read and one-click isolated demo: pass.
- Independent win, loss, restart, persistence, keyboard, touch, malformed-storage recovery, and demo isolation: pass.
- Offline reload and stale-cache replacement: pass.
- Axe: no serious/critical findings; fleet URL verifier: pass.
- Mobile Lighthouse: Performance 91, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s; CLS 0.
- Frame pacing at 390×844 under 4× CPU slowdown: 60.004 fps, 16.8 ms p95.
- Full independent run: same-origin requests only; no console or page errors.

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

Evidence is under `.factory/verification-evidence-6/`. The verifier-authored scripts were temporary and were not added to the repository.

## Next steps

Enable archive practice for a fresh player, expose the daily board date/identifier in both the UI and copied result, add acceptance-level regressions for both, and state/test the intended session duration. Re-run all claims and verification after redeployment.

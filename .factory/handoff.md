# Tide & Tile repair handoff — work order tide-and-tile-repair-6

## Outcome

The release-blocking desktop first-frame defect from verification 9 is repaired. The cold 1440×900 home screen now contains the complete, enabled 4×4 board; it is the live game, not an illustration or a board heading. The first-read headline, audience sentence, sample action, and three facts remain beside it. The decorative harbor illustration now follows the playable launch area.

## Reproduction and repair evidence

- Reproduced the candidate failure before editing: at 1440×900, `#board` and its first tile both began at `y=907.5`; the game panel began at `y=680.0625`. Screenshot: `.factory/verification-evidence-9-reproduced-before.png`.
- Repaired geometry: the cold 1440×900 board is `440×440` at `x=756`, `y=313.359375–753.359375`; all 16 enabled tiles fit in the viewport. The illustration begins at `y=995.359375`. Screenshot: `.factory/verification-evidence-9-repaired-desktop.png`.
- The 390×844 demo board remains completely visible at `x=25`, `y=469.890625–809.890625`. Screenshot: `.factory/verification-evidence-9-repaired-mobile.png`.
- Local URL-verifier output and its desktop/mobile captures are in `.factory/verification-evidence-repair/`; it loaded in 602 ms with the expected title, `lang=en`, one h1, a main landmark, no missing image alt text, no unlabeled buttons, and no console errors.

## Regression coverage

`tests/game.spec.ts` now has two precise browser regressions:

1. A cold 1440×900 home route starts at scroll position zero, exposes 16 live tiles, keeps every tile inside the viewport, and proves interaction by incrementing turns.
2. The deterministic sample reaches its four-turn Tide win, restarts, reaches the 12-turn loss, and restarts again at both 1440×900 and touch-enabled 390×844.

The keyboard tile claim now waits for the rerendered tile to regain focus after Enter before sending Space, removing a test-timing race while retaining the same product behavior.

## Verification run

```sh
npm ci                         # 139 packages, 0 vulnerabilities
npm run lint                   # pass
npm run typecheck              # pass
npm run test:unit              # 4/4 pass
npm test                       # 33/33 Playwright tests pass
npm run build                  # dist/ created
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/verification-evidence-repair
```

The browser suite exercises the 23 declared claims: demo isolation, privacy request logging, keyboard and touch play, daily/archive modes, deterministic win/loss/restart, persistence, offline reload, service-worker cache replacement, response policy, local-only/free play, and art provenance. Its axe integration checks WCAG A/AA serious and critical violations on home, both demo URLs, privacy, terms, and the end dialog; all pass. The standalone `@axe-core/cli` could not start against the supplied Playwright Chromium because the CLI package brought ChromeDriver 152 for Chromium 145; the in-repository Playwright axe integration is the equivalent supported verification path and passed.

The final build is 19.14 kB raw / 7.59 kB gzip JavaScript and 9.57 kB raw / 3.00 kB gzip CSS. No product gaps remain. Deployment uses `/opt/fleet/lib/deploy-static.sh tide-and-tile dist` after the final commit so the footer, service-worker cache, and deployed assets all carry the released Git identity.

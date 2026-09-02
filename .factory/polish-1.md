# Perfection-loop round 1 — finding closure

**Reviewed candidate:** `966ff8f51de3866a106c500f6df8dcadc4398333`  
**Review:** `.factory/review-1.md` at `f497e8edd08a474ca707769b99fface2a45edbc1`  
**Functional repair:** `1900ebffcb016ac7f1b5c393ce0c3536710b3cbc`  
**Live URL:** https://tide-and-tile.sociobot.in

| Finding | Change made | Automated evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| F-1-1 | Build and 404 identities are generated from the final Git revision. The exact final revision is built only after the handoff commit and deployed from `dist/`. | `routes load without console errors and the standalone 404 keeps shared navigation and build identity` | `.factory/evidence/polish-1-local/first-screen-mobile.png` | Live `npm test` asserts the footer is `v1.1-$(git rev-parse --short HEAD)` on the deployed `/404.html`; `/`, `/?demo=1`, and `/demo` use the same bundle identity. |
| F-1-2 | Removed “two-to-five-minute” from README instead of retaining an unmeasured duration promise. | `@claim:art-provenance` also asserts the removed phrase stays absent; claim-manifest uniqueness test passed. | `.factory/evidence/polish-1-local/first-screen-mobile.png` | Cold `/` and README inspection contain no session-duration promise. |
| F-1-3 | Added `sample-four-turn` to the manifest. Its test checks four marked tiles, one required turn each, visible “Fewest 4,” and the four-turn win. | `npm test -- --grep @claim:sample-four-turn` | `.factory/evidence/polish-1-local/demo-mobile.png` | Cold `/?demo=1` shows “Fewest 4”; scripted live play reaches the four-turn Tide medal screen. |
| F-1-4 | Added `art-provenance` to the manifest. The regression reads the sidecar and design record for deployment, model, date, prompt, and provenance path. | `npm test -- --grep @claim:art-provenance` | `.factory/evidence/polish-1-local/first-screen-mobile.png` | Live footer retains the tested original-art statement; all artwork requests are same-origin. |
| F-1-5 | Removed player-facing “seed,” “seeded,” and “UTC”; changed the shared storage term to “this browser’s storage”; rewrote README jargon and the copied result. | `@claim:copy-result`, `@claim:daily-boundary`, `@claim:privacy-local`, and `.factory/copy-audit.md` | `.factory/evidence/polish-1-local/demo-mobile.png` | Cold `/`, `/?demo=1`, `/privacy`, and copied-result checks contain the revised terms and no developer vocabulary. |
| F-1-6 | Replaced themed-only archive controls with “Play the 4-turn guided route,” “Practice 20-turn corners,” and “Play the 25-turn scramble.” Route names remain secondary descriptions. | `@claim:archive-gate` and `@claim:advertised-modes` select the exact accessible action names and load each board. | `.factory/evidence/polish-1-local/archive-actions-desktop.png` | After today’s live win, all three action labels are visible and each opens its named practice route. |
| F-1-7 | Split sound into a visible “Sound: on/off” state and “Turn sound off/on” action. Preserved the muted setting and `aria-pressed` state across reload. | `npm test -- --grep @claim:progress-persistence`; 200% text and 390 px mobile tests | `.factory/evidence/polish-1-local/sound-focus-desktop.png` | Live `/?demo=1` toggles the action/state pair, reloads muted, and keeps a visible focus ring. |

## Additional acceptance work

- The primary first-screen action now opens `/?demo=1` with one click. `@claim:demo-sandbox` proves reset, deletion, and real/demo storage isolation.
- Route metadata now updates with route-specific titles, descriptions, Open Graph text, and canonicals. History navigation focuses the new h1.
- The standalone 404 includes title, description, canonical, social metadata, icons, shared navigation, legal links, and final build identity.
- The first screen, complete sample board, banner, and 44 px controls remain usable at 390 × 844. The toolbar also has no overflow at 200% text size.
- All 22 claim commands passed separately from a fresh clone. Full local browser coverage passed 29/29.

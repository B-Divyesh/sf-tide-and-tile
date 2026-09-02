# Independent verification 9 — FAIL

**Candidate:** `c8aaaeb923a7aadad821bffc2720267410405746`  
**Tested URL:** <https://tide-and-tile.sociobot.in>  
**Verified:** 2026-09-02 UTC  
**Verdict:** **FAIL**

## Release-blocking finding

### Major — the desktop cold first screen does not show the playable game

The browser-game acceptance contract requires the captured first screen to show the game itself, rather than a menu or landing wall. In a cold 1440×900 live context, the page shows a marketing hero and a static harbor illustration. The real board starts at y=907.5, below the viewport; its first playable tile is entirely outside the viewport (y=907.5–1047.25). The screenshot therefore does not show a playable tile or active play.

This is not a first-read-copy failure: the same screen plainly says what the game is, who it is for, and provides the one-click **Try it with sample data** action. It is specifically the browser-game first-frame requirement that fails. At 390×844 the board is visible (y=449.89–789.89), so the defect is desktop capture/layout specific.

## Mandatory gates

- Clean checkout was at the specified SHA; `npm ci` installed 139 packages with 0 reported vulnerabilities.
- `.factory/claims.json` exists and declares **23** claims. I ran every declared command separately in manifest order from the clean checkout. All passed. This includes demo isolation, exact four-turn sample, privacy request logging, keyboard tiles, daily/archive boundaries, progressive lessons, restart, both end screens, persistence, modes, copy result, route generation, 60 fps, hidden-tab pause, mobile controls, offline reload, service-worker update, response policy, free/local play, and art provenance.
- Local gates passed: `npm run lint`, `npm run typecheck`, `npm run test:unit` (4/4), `npm test` (31/31), and `npm run build`.
- `PLAYWRIGHT_BASE_URL=https://tide-and-tile.sociobot.in npm test` passed 31/31 against the live site.

## Independent live exercise

- Cold first-read: title `Tide & Tile — Make a daily harbor route`; h1 `Make today’s harbor route`; audience copy names casual players seeking a calm puzzle break; one visible sample action explains it loads a guided board without changing daily progress.
- In a fresh 390×844 touch context, the sample action opened `/?demo=1`, showed the persistent **Demo — sample data, nothing is saved** banner, and fit all 16 tiles in the viewport.
- A deterministic exact four-turn sample run reached **The harbor is connected** with `Tide medal. 4 turns; fewest is 4.` The end dialog offered **Play this route again**. Twelve deliberate wrong turns reached **The route stayed open** with the turn-limit loss dialog and **Try this route again** recovery.
- Invalid key `Z` left the counter unchanged; after malformed demo local storage, reload recovered to a fresh 16-tile board at zero turns with no page error. Enter rotates a focused tile and ArrowRight moves tile focus in the dedicated keyboard claim test.
- A request log for landing, demo, win and loss contained only same-origin requests: the document, local JS/CSS, and `harbor-table.webp`. There are no server-side product endpoints or sign-in, so 429 allowance and Entra checks do not apply.

## Deployment, security, accessibility, and budget evidence

- Exact artifact match: live and local SHA-256 values matched for `index-DeVIdvcv.js`, `index-CRpd8AM9.css`, `sw.js`, and `404.html`. The live footer is `v1.1-c8aaaeb`.
- Live response headers include same-origin CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy and restrictive Permissions-Policy. HTML revalidates; the hashed JS has `public, max-age=31536000, immutable`; `sw.js` has `no-cache, no-store, must-revalidate`; an unknown URL returned HTTP 404.
- `/opt/fleet/lib/verify-url.sh https://tide-and-tile.sociobot.in <evidence-dir>` passed: 641 ms load, correct title/lang, one h1, main landmark, no missing image alt text or button labels, and no console errors.
- The repository's live Playwright suite ran axe WCAG A/AA checks for `/`, demo, privacy, terms, and the end dialog with no serious/critical violations. It also covers reduced motion, 200% text, dialog focus, touch target size, and offline/service-worker behavior.
- Build output is 19.04 kB raw / 7.57 kB gzip JavaScript and 9.33 kB raw / 2.93 kB gzip CSS, within the static budgets. A standalone Lighthouse invocation could not complete because the container's Lighthouse/Chrome launcher closed its browser connection; this did not affect the browser-based accessibility or live suite results.
- Crawled visible internal links from home, demo, privacy, terms, and 404; all returned 200. No console or page errors were observed in independent live runs.

## Defect summary

| Severity | Count | Defect |
| --- | ---: | --- |
| Major | 1 | Desktop cold capture hides the active playable board below the viewport, violating the browser-game first-screen requirement. |
| Minor | 0 | — |

No product code was modified during verification.

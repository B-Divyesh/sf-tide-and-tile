# Tide & Tile visual contract

## Direction

**Neo-brutalist utility for a small harbor workshop.** The game should feel like turning sturdy painted dock tiles on a map table: strong ink outlines, square corners, printed labels, and one confident signal colour. This makes the rule visible before it becomes a puzzle, which supports the first-time teaching goal.

## Tokens

| Use | Token | Colour |
| --- | --- | --- |
| Night board | `--ink` | `#102A43` |
| Paper background | `--paper` | `#FFF9E9` |
| Tile face | `--tile` | `#F4C95D` |
| Deep water | `--water` | `#1261A0` |
| Open water | `--foam` | `#D7F1F5` |
| Harbor red / alert | `--signal` | `#C4473D` |
| Seaweed success | `--safe` | `#287A57` |

The light treatment is intentional: it reads like a printed puzzle sheet under bright work lights. Ink on paper and ink on tile provide high contrast.

## Type, rhythm, and interaction

Use the local system sans stack, headed by `Arial Black`, so the interface has a compact printed-sign feel without a network font. Body copy uses `Arial`. Spacing follows an 8px scale. Tiles are square with 4px ink borders and hard 6px shadows. Buttons depress toward their shadows. A selected tile turns 90° in 180ms. The completed harbor channels draw once in 420ms. Reduced-motion users see both states immediately. There are no loops or flashes.

The board stays 4×4 so it fits completely within the first 390×844 screen. On desktop, the cold launch places the live board beside the first-read copy; the harbor illustration follows below it, so the first captured screen is playable rather than a menu or static preview. The guided sample has four marked tiles and a true four-turn minimum. Archive practice is always available, then rises from 4 to 20 to 25 misplaced tiles. Daily and archive seeds create distinct Hamiltonian paths through all 16 tiles. The daily heading and copied result show the same board date. The internal generator uses the UTC date and prefers low-degree neighbors, which produces bends and straights without breaking the continuous dock-to-harbor solution. Twenty dated seeds must produce at least 12 topology signatures in the unit suite. A run ends when the route connects or its turn limit is reached. A round is intended for a short break.

Win and loss use a centered paper-sheet dialog over the dark board. This is the run summary, not a toast: it names the result, reports turns, and offers a one-action replay. Browser storage keeps daily boards by date, archives by seed, and demos in a separate namespace. Archive controls never depend on a completion marker, so a fresh player can open the four-turn lesson immediately.

## Original asset plan and provenance

One generated editorial illustration appears in the landing/explanation area: a top-down harbour map table with chunky water-channel tiles, no lettering. It sets the tactile world but never carries required information. It was generated with the factory image deployment, reviewed for artifacts, converted to WebP under 300 KB, and is disclosed in the footer. Board tiles, icons, and water strokes are authored procedurally in Canvas/SVG code.

Generated 2026-09-01 with the `gpt-image-1` model through the `factory-image` Azure AI Foundry deployment. The original product artwork is recorded in `assets/src/harbor-table.png.json`; the image was reviewed for text, watermarks, logos, seams, and unintended symbols before use.

Prompt sheet: *top-down editorial illustration of a small harbor puzzle table, four by four chunky square ceramic tiles with blue water channels, a paper chart and brass compass nearby, neo-brutalist screen-print style, flat cream, navy, bright blue, ochre and harbor red palette, crisp offset ink outlines, soft directional work light, no words, no logo, no watermark, no people.*

## Accessibility and performance

Tiles expose textual channel descriptions and row/column labels. Water uses connection shape plus colour. Dock and harbor have text labels as well as separate outlines. Controls are at least 44px. Game code is plain DOM/SVG and TypeScript; the illustration remains under 300 KB. The fixed 60 Hz loop pauses in hidden tabs: it cancels its queued frame and runs zero steps until the tab is visible again, then clamps stalls. Local-only settings and progress are namespaced by real/demo mode.

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

Use the local system sans stack, headed by `Arial Black`, so the interface has a compact printed-sign feel without a network font. Body copy uses `Arial`. Spacing follows an 8px scale. Tiles are square with 4px ink borders and hard 6px shadows. Buttons depress toward their shadows. A selected/changed tile turns 90° in 180ms; harbor flow draws in 420ms. Reduced-motion users see the new state immediately. There are no loops or flashes.

The board starts at 4×4 for daily play. Tutorial visits introduce one rule at a time: rotate, connect, then spend fewer turns. Archive boards grow from a gentle 3×3 lesson to a denser 5×5 route.

## Original asset plan and provenance

One generated editorial illustration appears in the landing/explanation area: a top-down harbour map table with chunky water-channel tiles, no lettering. It sets the tactile world but never carries required information. It will be generated with the factory image deployment, reviewed for artifacts, converted to WebP under 300 KB, and disclosed in the footer. Board tiles, icons, and water strokes are authored procedurally in Canvas/SVG code.

Prompt sheet: *top-down editorial illustration of a small harbor puzzle table, four by four chunky square ceramic tiles with blue water channels, a paper chart and brass compass nearby, neo-brutalist screen-print style, flat cream, navy, bright blue, ochre and harbor red palette, crisp offset ink outlines, soft directional work light, no words, no logo, no watermark, no people.*

## Accessibility and performance

Tiles expose textual channel descriptions and row/column labels. Water uses connection shape plus colour. Controls are at least 44px. Game code is plain Canvas 2D and TypeScript; art is lazy-loaded and intended to remain under 300 KB. Local-only settings and progress are namespaced by real/demo mode.

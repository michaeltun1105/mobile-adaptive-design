# iOS system (Apple HIG)

Verify values against Apple's Human Interface Guidelines (Color, Typography) when exact numbers matter; the values below are Apple's defaults, not product values.

## Colour
Collection `<Product> · iOS Colors`, modes Light / Dark. Keep the team's semantic collection if it exists and only add what is missing.
| Role | Light | Dark |
|---|---|---|
| Brand / Tint | brand hex (person's answer) | brand lightened for dark (MCU tone ≈ 70–80 of the brand hue: use `theme-generate.mjs` Dark `Primary`) |
| Brand / Tint (accessible) | closest tone passing 4.5:1 with white (`theme-generate.mjs` → `accessibleHex`) — for text links and labels on light backgrounds | Dark `Primary` |
| Label / Primary | #000000 | #FFFFFF |
| Label / Secondary | #3C3C43 @ 60% | #EBEBF5 @ 60% |
| Label / Tertiary | #3C3C43 @ 30% | #EBEBF5 @ 30% |
| Background / Primary | #FFFFFF | #000000 |
| Background / Secondary | #F2F2F7 | #1C1C1E |
| Background / Tertiary | #FFFFFF | #2C2C2E |
| Background / Grouped | #F2F2F7 | #000000 |
| Separator | #3C3C43 @ 29% | #545458 @ 60% |
| System / Red · Green · Orange | #FF3B30 · #34C759 · #FF9500 | #FF453A · #30D158 · #FF9F0A |

## Type (Dynamic Type)
`scripts/type-scale.js` PLATFORM `ios`, PREFIX `<Product>/iOS`. Styles at the default size (Large): Large Title 34/41 · Title 1 28/34 · Title 2 22/28 · Title 3 20/25 · Headline 17/22 (semibold) · Body 17/22 · Callout 16/21 · Subheadline 15/20 · Footnote 13/18 · Caption 1 12/16 · Caption 2 11/13. Modes: Default, xxxLarge (largest standard size) and AX5 (largest accessibility size). Titles use the title font, the rest the body font (SF Pro unless the team chose a brand font).

## Icons
SF Symbols by default (rendered with the SF Symbols font or Apple's Figma library). If the team uses its own set, keep it and record the component set in the saved system.

## Layout reminders
Touch targets ≥ 44 × 44 pt; respect safe areas (status bar, Dynamic Island, home indicator); support Dynamic Type up to AX sizes (text wraps, rows reflow vertically).

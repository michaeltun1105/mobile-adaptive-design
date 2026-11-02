# Sources (tags used across the skill)


Android mobile design guides (base `https://developer.android.com/design/ui/mobile/guides/`):
| Tag | Page | Path |
|---|---|---|
| A11Y | Accessibility | `foundations/accessibility` |
| SYS | System bars | `foundations/system-bars` |
| TR | Translate iOS designs to Android (10 steps) | `foundations/translate-designs` |
| LB | Layout basics | `layout-and-content/layout-basics` |
| ANAT | Parts of an app | `layout-and-content/app-anatomy` |
| GRID | Grids and units | `layout-and-content/grids-and-units` |
| CS | Content structure | `layout-and-content/content-structure` |
| NAV | Layout and navigation patterns | `layout-and-content/layout-and-nav-patterns` |
| CL | Common layouts | `layout-and-content/common-layouts` |
| ADP | Adapt your layout | `layout-and-content/adapt-layout` |
| POS | Postures and orientation | `layout-and-content/postures-and-orientation` |
| IMM | Immersive content | `layout-and-content/immersive-content` |
| E2E | Edge-to-edge design | `layout-and-content/edge-to-edge` |
| IMG | Images and graphics | `layout-and-content/images-graphics` |

Other sources:
| Tag | Source | Where |
|---|---|---|
| WSC | Use window size classes | https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes |
| LABC | Codelab — Design an Adaptive Layout with Material Design | https://developer.android.com/codelabs/adaptive-material-guidance |
| KIT | Figma — Material 3 Design Kit (team copy). Page "Examples" (`Examples/Layout grid`, `Examples/*-Mobile`, `*-Web`); pages "Navigation", "App bars", "Sheets", "Utilities" | fileKey `SuUWyeGte7QXUqJsl6nhbZ` |
| LAB | Figma — Design an Adaptive Layout with Material Design (team copy). Pages "🎨 Lab", "🎉 Completed" (nodes `1462:19138`, `633:2775`) | fileKey `GhWFbR0QJtYmDF6jjB2vHa` |
| NIA | Figma — Now in Android Case Study (team copy). Page "Layout Examples": mobile, 905–1239dp, 1440+dp, light/dark | fileKey `ReBKRoCMXMpp8SFzY0QabH` |
| M3 | m3.material.io — renders only with JavaScript; WebFetch returns an empty shell. Read it in the browser pane: open the page, list `performance.getEntriesByType('resource')`, fetch the `/_dsm/content/m3/…json` file it loaded and pull the strings out. Otherwise ask the person to paste a section | https://m3.material.io/foundations/layout/layout-overview/adaptive-design |
| M3X | Material blog — "Start building with Material 3 Expressive" | https://m3.material.io/blog/building-with-m3-expressive |
| IO26 | Material blog — "What's new at Google I/O 2026" (Expressive layout system, spacing system, expressive lists & menus, Compose-first) | https://m3.material.io/blog/whats-new-at-io26 |
| BP | M3 — Breakpoints (overview, compact, medium, expanded, large & extra-large) | https://m3.material.io/foundations/layout/breakpoints/overview |
| SCF | M3 — Scaffold (bars, rails, panes) | https://m3.material.io/foundations/layout/scaffold/overview |
| GS | M3 — Grids & spacing (grids, rulers, spacing, density) | https://m3.material.io/foundations/layout/grids-spacing/overview |
| SP | M3 — Spacing system & tokens | https://m3.material.io/styles/spacing/overview |
| CE | M3 — Canonical examples (overview, feed, list-detail, supporting pane) | https://m3.material.io/foundations/layout/canonical-examples/overview |
| LO | M3 — Layout overview (overview & terms, parts of layout, adaptive design) | https://m3.material.io/foundations/layout/layout-overview/overview |
| RTL | M3 — Bidirectionality & RTL | https://m3.material.io/foundations/layout/bidirectionality-rtl |
| ST | M3 — Styles: Color (system, roles, choosing a scheme, static, dynamic, advanced, resources), Elevation, Icons, Motion (physics, easing & duration, transitions), Shape, Spacing, Typography — summarised in `m3-styles.md` | https://m3.material.io/styles |
| CMP | M3 — Components: all 38 pages (overview, specs, guidelines, accessibility tabs) — summarised in `m3-components.md` | https://m3.material.io/components |
| DT | M3 — Design tokens (overview, how to use tokens) | https://m3.material.io/foundations/design-tokens |
| MS | Material Symbols (Google Fonts) — the only icon source; SVGs via npm `@material-symbols/svg-<weight>` (svg-400 = M3 default) | https://fonts.google.com/icons |
| MTB | Material Theme Builder (web app is Flutter/canvas — WebFetch returns only metadata; read the GitHub README instead). Figma plugin "Material Theme Builder" creates M3 tokens and Swaps kit components; Color Match keeps input colours for Container roles; JSON import/export | https://material-foundation.github.io/material-theme-builder/ · https://github.com/material-foundation/material-theme-builder |
| MCU | `@material/material-color-utilities` (npm, the algorithm inside MTB) — `SchemeTonalSpot` (MTB default), `SchemeFidelity` (≈ Color Match), `MaterialDynamicColors.<role>.getArgb(scheme)`, contrast level 0 / 0.5 / 1, `Hct`, `Contrast.ratioOfTones` | https://www.npmjs.com/package/@material/material-color-utilities |
| CCA | Codelab — Designing with accessible colors (WCAG ratios, tone-based pairing, editing a generated colour breaks guaranteed contrast → re-check) | https://codelabs.developers.google.com/color-contrast-accessibility |
| FS | Android 14 — Non-linear font scaling to 200% (sp only for text, lineHeight in sp, no sp for padding/heights, `TypedValue.applyDimension()`, test at 200%) | https://developer.android.com/about/versions/14/features |

**Precedence:** where an M3 component page and a layout page disagree (e.g. toolbar above a navigation bar), follow the component page. The M3 layout pages updated in May 2026 (IO26, BP, SCF, GS, SP, CE) are the newest source. Where they disagree with older Android guides, the kit's `Examples/Layout grid`, LAB or NIA (e.g. Medium margin 32, rail 80, fixed widths), follow the M3 pages.

Read 2026-11-02: M3 Design tokens (2 tabs) → `m3-styles.md` § Design tokens; corner values checked against androidx `ShapeTokens.kt`, spring values against `ExpressiveMotionTokens.kt` / `StandardMotionTokens.kt`.
Read 2026-11-02: **every M3 component page** (38 pages, ~150 tabs) → `m3-components.md`. Measurements shown only in images were not captured — use kit instances.
Read 2026-11-02: **every page and tab of M3 Styles** (16 pages, 38 tabs) → `m3-styles.md`.
Read 2026-11-02: **every tab of M3 Foundations → Layout** (Layout overview 3 tabs, Scaffold 4, Grids & spacing 4, Breakpoints 5, Bidirectionality & RTL, Canonical examples 4 — 23 pages) via the `_dsm` JSON. Column counts per breakpoint are only in images (4 / 8 / 12, matching the kit).
Read 2026-10-29/31: MTB (GitHub README), MCU, CCA codelab. Not yet read: Glossary; expressive Lists, Menus, Search pages not yet read.

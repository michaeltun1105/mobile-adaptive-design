---
name: setup-system
description: "This skill should be used the first time a product or Figma file is worked on with this plugin, or when the user asks to \"setup system\", \"tạo theme\", \"dựng design system\", \"đổi màu brand\", \"đổi font\", \"theme hoá\", \"tạo bản dark mode\", \"thang chữ\". Asks platform, theme (brand colour + fonts) and icon set, builds the colour theme (Light/Dark), type scale with text-scaling modes and icon decision in Figma, and saves the decisions so every later session reuses them without asking."
---

# Design system setup (ask once, then reuse)

Reply in the person's language (mostly Vietnamese), plain words. Start with one sentence saying what you will do. Load `figma-use` (and `figma-generate-design` before visible changes) before any `use_figma` call; `create_session` for the file.

## 1. Look before asking
Run `scripts/load-system.js`. If a system is saved and the request doesn't change it, say which system is in use and stop — the other skills read it themselves. If the person asks to change one decision (brand, font, icons), change only that, re-run the affected step, and save again.

Also inspect what the file already has (the script lists it): a team colour collection (e.g. semantic variables), an old Material Theme Builder `material-theme` collection (Primary `#65558F` = still Google's baseline — offer to update it rather than add a second theme), existing text styles, an icon frame.

## 2. Ask (one AskUserQuestion call, recommended option first; the person can type their own answer)
1. **Platform:** iOS · Android · Cả hai.
2. **Theme:** "Đã có theme chưa?" — *Đã có* → which collection/link (reuse it, map roles, don't rebuild) · *Chưa có* → **brand colour** (hex) and **fonts for titles and body**. With both platforms, ask whether fonts are shared or per platform (e.g. SF Pro on iOS, Roboto on Android, or the brand font on both).
3. **Icons**, per chosen platform: Android — *Đổi sang Material Symbols (Recommended)* (weight 600, Outlined, filled for selected) · *Giữ icon hiện tại*. iOS — *Giữ SF Symbols (Recommended)* · *Bộ icon riêng của team*.

**Language height** (no question): read the file's text — Vietnamese diacritics, Thai, CJK, Arabic, Hindi → `LANGUAGE_HEIGHT:'medium'` (M3: line height ≈ +7%); Burmese/Telugu → `large`; plain Latin (English…) → `small`. Mixed or unclear → ask in one line. Save it with the system.

Unattended run: use the recommended options and the brand colour found in the file (most-used primary/brand variable or filled-button colour); say so at the top of the report.

## 3. Build (only what the platform needs)
| | Android | iOS |
|---|---|---|
| Colour | `references/android-system.md` → M3 scheme from the brand (`scripts/theme-generate.mjs` → `scripts/apply-theme.js`), collection `M3 Theme · <Product> (<#brand> · Tonal Spot)`, Light/Dark, `Source/Brand` | `references/ios-system.md` → collection `<Product> · iOS Colors`, Light/Dark: brand tint (+ accessible variant) and Apple system label/background/separator roles |
| Type | `scripts/type-scale.js` PLATFORM android: 15 baseline + 15 emphasized M3 styles `<Product>/M3/<role>` and `<Product>/M3/emphasized/<role>`, M3 weights and tracking, language height, modes 100% / 200% | `scripts/type-scale.js` PLATFORM ios: 11 Apple text styles `<Product>/iOS/<style>`, modes Default / xxxLarge / AX5 |
| Icons | Material Symbols frame `_Icons · Material Symbols (…)` (`scripts/svg-to-24.py`) or keep team icons | SF Symbols / team icons — nothing to build unless the team set needs a component set |

Both platforms: one brand source, separate type and icons.

Static colours for meaning (success, warning, info) or a second brand accent: `theme-generate.mjs --static "Success=#…"` → `Static/<Role>` (4 roles, Light/Dark, harmonized unless `:exact`); keep Error for red. Role rules, type, shape, elevation, icon and motion guidance: `references/m3-styles.md`.

Rules: colours as variables, text as styles, sizes bound to the type-scale collection — **no hard-coded values**; never copy hex, fonts or ids from another product or from examples in the references. Brand override on buttons (exact brand hex) only if the person asks; then check the tone and offer the closest passing colour (`references/theming-contrast.md`). Generate Light/Dark only; contrast modes only on request.

## 4. Theme existing screens (when asked, or when kit purple is visible)
`scripts/apply-theme.js` on the section: kit `Schemes/*` and `M3/sys/*` styles → the theme; optional team-semantic map (table in `references/theming-contrast.md`) to get a full Dark mode. Build copies `M3 Light · …` / `M3 Dark · …` next to the original so the team can compare. Then run the **check-accessibility** skill.

## 5. Save
`scripts/save-system.js` with everything decided (platforms, brand, variant, modes, collection names, text-style prefixes, fonts, language height, static colours, icons, overrides). It stores it in the file and draws `_Design system · <Product>` (swatches bound to the variables, decisions, date) on the chosen page.

## Report
Platform(s), theme source/variant/modes, overrides and their contrast, text styles and modes created, icon decision, where the system frame is, what the other skills will now reuse. Offer to export `Color.kt` / `Theme.kt` (Android) or a colour asset list (iOS) for developers.

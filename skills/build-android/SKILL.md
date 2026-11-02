---
name: build-android
description: "This skill should be used when the user shares a Figma screen and asks to adapt it for Android — \"làm bản Android\", \"bản tablet\", \"bản gập\", \"foldable\", \"build tablet/foldable\", \"Compact Medium Expanded\", \"adaptive layout\", \"bản 600/905\". Reviews the screen against Material 3 adaptive and M3 Expressive guidance and builds Compact, Medium and Expanded versions with M3 Design Kit components, following the product's saved design system."
---

# Android adaptive design: review, then build (phone, foldable, tablet)

The person pastes a link to a phone design (Android 412 wide, or iPhone 402 × 874). Order: **Setup (incl. design system check) → Phase 1 Review → (decisions) → Phase 2 Build → Verify → Report**. Never edit the original frame.

Default breakpoints: **Compact 412 × 915, Medium 600 × 800, Expanded 905 × 680**. Build Compact first (for an iPhone original it is the iOS → Android translation; for an Android original a review-and-fix pass), then Medium and Expanded from it. If the person asks for one breakpoint only ("chỉ mobile", "chỉ tablet"), build just that one.

Reply in the person's language (the team mostly writes Vietnamese), plain words — many readers are not technical. Start with one sentence saying what you are about to do. This is the Android counterpart of `build-iphone-duo`; don't mix the two.

## Read only what the task needs (saves tokens)
| File | Read when |
|---|---|
| `references/layout.md` | Any review or build: grids, margins, panes, navigation, canonical layouts (feed, list-detail, supporting pane, 3 panes), Large/Extra-large, RTL, Expressive, Compact specifics, **layout patterns table** |
| `references/components.md` | Importing kit components (keys), text styles, **icon policy** |
| `references/m3-components.md` | Choosing or configuring any M3 component: what replaces deprecated ones, counts and limits (actions, destinations, tabs, chips), placement per breakpoint, required labels, accessibility rules |
| `references/m3-styles.md` | Colour-role choice for custom parts, emphasized type, shape scale, elevation levels, icon sizes/targets, motion/transition notes for handoff |
| `references/pitfalls.md` | Before the first `use_figma` write of a session, and whenever something renders wrong |
| `references/sources.md` | When a rule is questioned or a case isn't covered — re-read the Google source |
| `scripts/…` | Reuse instead of rewriting (see *Scripts*) |

Related skills in this plugin: **setup-system** (theme, type scale, icons — run it when no system is saved), **convert-ios-to-android** (iPhone → Android phone translation and SF Symbol mapping), **check-accessibility** (contrast, 200% text, touch targets, hard-coded values).

For a small follow-up ("fix spacing", "đổi icon") read only the file that covers it. Keep screenshots small (scale 0.3–0.5) and only of what changed; batch edits into one `use_figma` call per step.

## Setup (every run)
1. Load `figma-use` before any `use_figma` call and `figma-generate-design` before visible changes; pass both in `skillNames` on every mutating call.
2. Parse the link (`node-id=A-B` → `A:B`), `create_session` for that fileKey, reuse the session id.
3. `get_libraries`: the **Material 3 Design Kit** must be added (keys fail with "not found" otherwise) — if missing, ask the person to add it; the review can still run. If an import fails, re-find it with `search_design_system` and report the new key.
4. **Design system:** run `scripts/load-system.js`. If a system is saved, follow it silently (colour collection and modes, text styles, icon decision, overrides) and say in one line which system you follow; ask only if the request contradicts it. If nothing is saved, run the **setup-system** skill first (it asks platform → theme/brand/fonts → icons, builds and saves the system), then continue here.
5. **Google's sources are the truth, not this skill** (`references/sources.md`). If a source disagrees with the skill, follow the source and say so.

**No hard-coded values.** Every colour bound to a variable, every text on a text style, every icon an instance from the icon frame, spacing on the 8dp scale. Never paste hex, font names or variable/component ids from another product or from examples in this skill — look them up by name in the saved system or ask. Raw values only for guides/labels and third-party logos/photos.

## Phase 1 — Review (read-only)
**Gather:** screenshot; a read-only walk (name, type, x/y/w/h, layoutMode, sizing, instance main components, image fills); list navigation, content blocks and every CTA with the block it acts on; for iPhone originals list each iOS-only part and its Android equivalent (skill **convert-ios-to-android**, `references/ios-to-android.md`).

**Check (measure, don't guess)** — details in `references/layout.md`:
- Compact: iOS parts mapped; margins 16; fits at 360 without truncation; FAB/toolbar above the navigation bar; gesture inset clear.
- Stretch risk at 600/905 (buttons, inputs, single cards, lines > 60 characters) → max width, column span or reflow.
- Canonical fit (list-detail, feed, supporting pane, single column) and why; keep the phone hierarchy. Build Compact, Medium, Expanded by default; Large/Extra-large only if asked (desktop/web). Ask about RTL only if the product ships an RTL language.
- Navigation: bar → rail at Medium single-pane / Expanded; panes per breakpoint; bottom sheet → menu and full-screen dialog → basic dialog at Medium+; reachability (top 25%); CTAs in their content's pane; hinge clear.
- Edge-to-edge; accessibility (targets ≥ 48, body ≥ 12sp, contrast 4.5:1 / 3:1); **text scaling** risks (skill **check-accessibility**, `references/text-scaling.md`); images (crop, upscale, subject, scrim); icons are Material Symbols if the system says so; auto layout; Expressive fit (Toolbar, Button group, Split button / FAB, Loading indicator; 1–2 hero moments max).

**Report:** one-line verdict · **Lỗi nghiêm trọng** (numbered, with numbers, fix, source tag) · **Cần chỉnh** · **Đã ổn**. If something blocks the build, ask at most 2 questions (recommended option first) and wait; "làm thử" → take the recommended option and say which.

## Phase 2 — Build (M3 kit components, auto layout)
Keep M3 instances linked; never hand-draw a bar, rail, button or sheet; clone the team's own content so styles and variables stay linked; no device bezel. Read `references/components.md` (keys, icon policy) and `references/pitfalls.md` first.

1. **Section** below the original: `<original name> · Android adaptive`, dark fill; rows Compact / Medium / Expanded with row titles; screens in the original's order, columns aligned (Figma shows frame names — no extra labels).
2. **Frames** at kit sizes, `clipsContent`, original's fill and variable modes; kit layout grid for the class. Compact root VERTICAL (App bar, Body, Navigation bar on top-level screens); Medium/Expanded root HORIZONTAL (rail + body). Status bar and gesture bar absolute, transparent (edge-to-edge).
3. **Navigation:** Compact navigation bar / Medium–Expanded rail with the same destinations and selection, icons per the saved system; App bar title left-aligned, up arrow on child screens; actions with the pane they affect.
4. **Body:** apply the layout pattern (`references/layout.md`). Margins 16 / 24, spacer 24 (wider at the hinge), contained panes = surface container, radius 24, padding 16.
5. **Max widths and targets:** buttons/inputs max width, text ≤ 60 characters per line, targets ≥ 48; text containers HUG with a min height, text wraps; dialogs centred with Scrim.
6. **Images:** crop rule per size, scrim under overlaid text, no hard crops (fade the edge), no phone hero filling a landscape screen.
7. **Expressive pass:** mapped Expressive swaps, emphasized key headline/number, brightest surface for the main pane; list every Expressive change in the report.
8. **Theme pass** (kit purple still visible, or asked): apply the saved theme (`scripts/apply-theme.js`); never hand-paint kit surfaces when a theme exists.
9. **Contrast audit** (always after theming or brand overrides): `scripts/contrast-audit.js` (rules in the **check-accessibility** skill); fix by role, report checked / fixed / exempt / needs decision.
10. **Fold guide** on two-pane screens: 1-wide red line at the centre, opacity 0.35, locked, `_Guide · Fold (hide before export)`, hidden when done.

## Verify
Screenshot each new screen once (small). Compact: nav bar only on top-level screens, up arrow on child screens, margins 16, bottom sheets for supplemental selection, nothing truncated at 360. Medium/Expanded: rail linked with the same selection; margins/spacers 24; split spacer centred; nothing essential in the top 25%; nothing stretched; CTAs in their pane; nothing on the hinge; system bars present; targets ≥ 48; contrast audit passed or reported; **200% text check** on the key Compact screens (`scripts/text-scale-check.js`); nothing clipped, truncated or mirrored (`scripts/helpers.js` → `mirrorCheck`); fold guide hidden. Fix with targeted edits; re-screenshot only what changed.

## Final report
Where the Section is (original untouched) · per screen: layout and why, navigation mapping, what reflowed/revealed/changed, image crop rule · issues with numbers and decisions to confirm · system used or created (theme source/variant/modes/overrides, type scale, icons) · contrast audit and 200% text results · Expressive changes · icons created and the icon frame · kit keys used · developer handoff (switch by breakpoint not device; Compose list-detail / supporting-pane / navigation-suite scaffolds; edge-to-edge `WindowInsets`; max widths; hinge-aware split; never portrait-locked; sp for text and line height, `heightIn(min)`; generated `Color.kt`/`Theme.kt` if asked) · hidden fold guide · one next-step offer.

## Scripts (reuse; edit only the PARAMS block — copies of the plugin's `shared/scripts`)
| Script | Does |
|---|---|
| `scripts/load-system.js` | Reads the saved design system (and lists collections / text-style prefixes) |
| `scripts/apply-scales.js` | Bind padding, gaps and corner radii of new frames to the saved spacing & shape collection (`BIND_ROOT_IDS`); creates the collection if the system has none yet |
| `scripts/apply-prototype.js` | After building: prototype links between the new screens with M3 transition patterns + spring from the saved motion scheme, and `Motion:` annotations for handoff (Figma Motion timelines only if asked) |
| `scripts/helpers.js` | `loadFonts`, `widen`, `copyModes`, `mirrorCheck` |
| `scripts/android-helpers.js` | `addSystemBars` (Android status + gesture bar), `createIconComponent` (Material Symbol from a checked 24-dp path) |
| `scripts/svg-to-24.py` | Material Symbol SVG → 24-dp path + checksum |
| `scripts/apply-theme.js` | Rebind kit `Schemes/*` colours / M3 styles of new components to the saved theme |
| `scripts/contrast-audit.js` · `scripts/text-scale-check.js` | Verify: WCAG contrast; 200% text copies with clipping/overflow report |

Paste only the functions a step needs into `use_figma` (script text costs tokens on every call).

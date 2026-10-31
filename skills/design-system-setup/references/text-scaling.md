# Text scaling (Android's dynamic type)

Read for the review check, type-scale variables and the 200% verify.

### Text scaling — Android's "dynamic type" [FS, A11Y, SP]
- Android lets the user scale text up to **200%** (Settings → Accessibility → Display size and text → Font size). Since Android 14 scaling is **non-linear**: small text grows a lot, large text grows little, so the hierarchy survives. Display size (dp scaling) is a separate setting and changes the breakpoint, not the text.
- **Text sizes and line heights in sp; everything else in dp.** Padding, gaps, icon sizes and component heights never use sp (`4sp + 20sp ≠ 24sp` under non-linear scaling). Icons don't grow with the font.
- **Approximate sizes at 200%** (Android `FontScaleConverter` table, verify in the source when exact numbers matter): 8→16 · 10→20 · 12→24 · 14→26 · 18→30 · 20→34 · 24→36 · 30→38 · ≥100 unchanged; line heights keep their ratio to the size. At 130% text grows ≈ 1.3× for small sizes and less for large ones.
- **Layout rules so nothing breaks at 200%:**
  - No fixed heights on anything that contains text (rows, chips, buttons, cards, app-bar titles): use auto layout HUG with a **min height** (48 for touch targets, list rows 56/72) so the row grows.
  - Text wraps instead of truncating; allow 2+ lines for titles, button labels and list items. Use ellipsis only for genuinely secondary text (file names, addresses) and keep the full text reachable (detail screen, tooltip).
  - Horizontal rows of label + value / icon + text **reflow to a vertical stack** when they no longer fit (e.g. stats "192 km · 3:30 · 55 km/h" become 3 rows; side-by-side buttons stack full width).
  - Keep spacing the same when text scales (M3 spacing system); don't shrink margins to make text fit. [SP]
  - Navigation bar / rail labels stay short (one word); if they can't fit at 200% they may truncate but the icon must stay understandable — never rely on the label alone.
  - Top app bar titles: Small app bar keeps one line → long titles use Medium/Large flexible app bars, which wrap.
  - Never put text in images; text over images needs room to grow without leaving its scrim.
- **Handoff:** sp for `fontSize` and `lineHeight` (Compose `TextUnit.sp`; XML `textSize`/`lineHeight` in sp); `Modifier.heightIn(min = …)` instead of fixed `height`; no maths on `fontScale`/`scaledDensity` — convert with `TypedValue.applyDimension()`; test every screen at 200% and with the largest Display size.

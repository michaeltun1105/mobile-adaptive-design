---
name: convert-ios-to-android
description: "This skill should be used when the user shares an iPhone Figma screen and asks for only the Android phone version — \"chuyển iOS sang Android\", \"bản Android điện thoại\", \"Android hoá màn này\", \"translate iOS to Android\", \"đổi SF Symbols sang Material\". Translates iOS-only parts (status bar, tab bar, nav bar, sheets, alerts, segmented controls, SF Symbols) into Material 3 on a 412 × 915 Compact frame; for tablet/foldable sizes use build-android."
---

# iOS → Android phone (Compact only)

Reply in the person's language (mostly Vietnamese), plain words; one sentence first saying what you will do. Load `figma-use` / `figma-generate-design`; `create_session`. Never edit the original.

1. **System:** `scripts/load-system.js`. None saved → run the **setup-system** skill first (platform Android). Follow its icon decision (Material Symbols or keep).
2. **Review** the iPhone screen: list every iOS-only part and its Android equivalent from `references/ios-to-android.md` (10 steps + SF glyph table). Report: verdict · Lỗi nghiêm trọng · Cần chỉnh · Đã ổn.
3. **Build** a Compact frame 412 × 915 next to the original (`… · Android`): clone the content, set constraints, resize, remove the iOS status bar / home indicator and add Android bars (`scripts/android-helpers.js` → `addSystemBars`); tab bar → Navigation bar; nav bar / large title → App bar (+ title block in the team's text styles); sheets → bottom sheet or full-screen dialog; alerts → basic dialog; segmented → tabs / button group; iOS lists → M3 list rows (no chevrons); checkmarks → checkbox / radio; wheel pickers → keep a picker only if the person wants it, otherwise radio list or menu; CTAs → M3 filled buttons bound to the theme. Margins 16. SF glyphs → Material Symbols per the decision.
4. **Components & styles:** check each Android replacement against `references/m3-components.md` (no deprecated components; limits such as 2 app-bar actions, 3–5 nav destinations, no toolbar together with a navigation bar); map iOS colours to M3 roles, pick text styles (emphasized for selected/primary), corner steps, elevation and the transition pattern from `references/m3-styles.md`.
5. **Rules:** no hard-coded values (variables, text styles, icon instances); keep M3 instances linked; read `references/pitfalls.md` before the first write.
6. **Verify:** screenshot small; nothing truncated at 360 wide; targets ≥ 48; `scripts/helpers.js` → `mirrorCheck`. Offer the **check-accessibility** skill and **build-android** for Medium/Expanded.

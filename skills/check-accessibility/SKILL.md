---
name: check-accessibility
description: "This skill should be used when the user asks to check or fix accessibility in Figma — \"check accessibility\", \"kiểm tra accessibility\", \"audit contrast\", \"kiểm tra tương phản\", \"check màu có đạt chưa\", \"test chữ to 200%\", \"dynamic type\", \"nút có đủ lớn không\", \"check hardcode\". Audits colour contrast, text scaling, touch targets and hard-coded values on iOS or Android screens, fixes by colour role, and reports what needs a decision. Also runs as the verify step of the other skills in this plugin."
---

# Accessibility check (contrast · text scaling · touch targets · hard-coded values)

Reply in the person's language (mostly Vietnamese), plain words; explain terms (e.g. "tương phản 4,5:1"). Load `figma-use`; `create_session`. Read-only until fixing is requested or approved ("fix luôn" counts).

1. **Platform and system:** `scripts/load-system.js` → platform (Android: targets 48dp, text scaling 200%; iOS: 44pt, Dynamic Type xxxLarge/AX5), colour collection, type-scale collection. No system → still audit, and recommend the **setup-system** skill for fixes.
2. **Contrast** — `scripts/contrast-audit.js` (rules: `references/theming-contrast.md`): text 4.5:1, large text and icons 3:1; exempt disabled UI, logos/brand marks, decorative images. Fix by role, never by hex: brand Primary text/icons on surfaces → `Custom/Primary Text`; inside Primary Container → `On Primary Container`; light secondary text → a stronger role. A label on a colour the person chose on purpose (brand override) → report the trade-off and the closest passing colour; don't change it silently. Re-run and report counts.
3. **Text scaling** — `scripts/text-scale-check.js` on each key screen type (rules: `references/text-scaling.md`): copies at 200% (Android) or xxxLarge/AX5 (iOS) next to the originals; fix originals (HUG + min height, wrapping, reflow rows to stacks, Medium/Large app bars for long titles). If the text styles aren't bound to a type-scale collection yet, say so and offer setup-system.
4. **Touch targets** — `scripts/touch-target-check.js` (48 / 44 minimum; a small visual with a large enough tap area is fine).
5. **Hard-coded values** — `scripts/hardcode-check.js`: paints without a variable, texts without a style; bind them to the saved system's variables/styles by matching the closest role (ask when unclear).
6. **Report:** per check — checked / fixed / exempt / needs decision, with numbers (ratios, sizes) and links to the layers; one next step.

Keep screenshots small and only of changed screens; return grouped results, not full node dumps.

---
name: build-carplay
description: "This skill should be used when the user wants an iPhone app on the car screen through Apple CarPlay — \"CarPlay\", \"bản CarPlay\", \"đưa app lên CarPlay\", \"CarPlay widget\", \"widget trên xe\", \"CarPlay Ultra\", \"build-carplay\". Checks which CarPlay category (entitlement) the features fit, plans flows within that category's template-depth limit, and builds light and dark reference screens and CarPlay widgets in Figma with the product's colours and content."
---

# CarPlay: category → flows → reference screens (+ widgets)

CarPlay screens are **drawn by iOS from system templates**; the app supplies content, images and a small colour palette. Figma screens are reference mock-ups for the team and developers, not pixel specs. Order: **Setup → Phase 1 Category → Phase 2 Flows (approve) → Phase 3 Build → Verify → Report**.

Reply in the person's language (mostly Vietnamese), plain words; one sentence first saying what you'll do. Rules: `references/carplay-rules.md` (read 2026-11-16). For Android Auto use `build-android-car`; when both are wanted, run Phase 1 for both and show where the category differs.

## Setup (every run)
1. Load `figma-use`. `create_session` for the **product file** (iPhone design).
2. Run `scripts/load-system.js` → brand colours (light + dark), fonts, icon set (SF Symbols on iOS). None saved → run **setup-system** or ask for the brand colour.
3. **Kit**: Apple has no official CarPlay Figma kit. Ask which kit the team uses (team file, ApplyPixels, Bonum…) and use its components by key. No kit → build from the Apple iOS 26 UI kit components laid out as CarPlay templates, and label every frame "reference — iOS draws the real template".
4. Freshness: CarPlay changes every WWDC. If the note in `carplay-rules.md` is older than ~6 months or the person asks for "latest", re-read the CarPlay Developer Guide and the WWDC "What's new" session first.

## Phase 1 — Category (read-only, report first)
- Map each phone feature to a CarPlay category: Audio · Video (parked) · Communication · Navigation · EV charging · Fueling · Parking · Public safety · Quick food ordering · **Driving task** · Voice-based conversational. Say clearly what can't go on CarPlay (games, social, reading text, lyrics, detailed settings, account setup) and why.
- One app ships **one entitlement** per category request — pick the category that fits the core feature; note the depth limit and the templates it unlocks (e.g. Driving task: List/Grid/Tab/Alert/Info, depth 3, refresh ≥ 10 s, no map).
- Widgets: if the iPhone app has widgets, list which will appear automatically (systemSmall, Live Activities) and which should be marked **not optimized for CarPlay**.
- **Stop and wait** for the person to confirm category and tasks.

## Phase 2 — Flows (approve before building)
- Per task: template sequence and depth with `scripts/carplay-depth.mjs` (spec format in the file). Stay within the category limit; aim for 2–3 levels for common tasks; shortcuts (recents, favourites, defaults) on the root.
- Root is usually a **Tab bar** (≤ 4 tabs audio, ≤ 5 others) or a **List/Grid**; confirmations as **Alert/Action sheet**; voice as **Voice control** (overlay when on a map).
- Write all strings now: short, front-loaded, verb-first buttons; for navigation provide **variants longest → shortest**. No message/email/lyrics text. Errors are shown in CarPlay and never ask to use the phone.
- Table per flow: step · template · content · actions · depth · driving/parked (video, keyboard). Wait for approval.

## Phase 3 — Build
1. New page `<Product> · CarPlay`. One SECTION per flow, screens left → right, labelled with depth.
2. Frame size: **800 × 480** by default (smallest common screen); add 1920 × 720 (wide) when the layout changes meaningfully. Include the CarPlay status/dock strip from the kit so the app area is realistic.
3. Build **light and dark** for every screen (set the variable mode on the section/frame, never duplicate hex). Colour only where apps control it (images, icons, tint/accent); interactive and non-interactive elements never share a colour.
4. Content from the product: titles, rows, images (@2x/@3x, ≤ template sizes: grid icon 40 pt, tab icon 24 pt, list images from `maximumImageSize`), SF Symbols for icons.
5. Widgets: one frame per widget at systemSmall in the CarPlay Dashboard context (light + dark); flag widgets that need many taps or unlocked data.
6. Don't invent template features — anything outside the template list goes in an annotation for developers.

## Verify
- `carplay-depth.mjs` on final flows; Grid ≤ 8, List ≤ 12 handled, Tab within limit, nav: ≤ 4 map buttons, alerts ≤ 2 buttons.
- `scripts/contrast-audit.js` in **both** modes (4.5:1), plus "interactive vs non-interactive colour" check; no text from messages/lyrics; nothing asks for the phone.
- One small screenshot per section and mode.

## Report
- Category decision and why (with the Android Auto comparison if relevant), entitlement to request, depth per flow, screens and widgets built (links), what can't go on CarPlay, developer notes per screen (template class `CPListTemplate`…, `limitedUserInterfaces`, locked-phone behaviour, refresh limits). Release notes for the entitlement request.

---
name: build-android-car
description: "This skill should be used when the user wants an app on a car screen — \"Android Auto\", \"Android Automotive\", \"bản cho xe\", \"màn hình xe\", \"car app\", \"đưa app lên xe\", \"build-android-car\". Checks which Android for Cars category the features fit, plans task flows within the driving limits (≤ 5 steps, 120 characters), and builds the screens from Google's Car App Templates Design Kit in Figma with the product's accent colours and content."
---

# Android for Cars: category → flows → build from templates

Car screens are **assembled from Google's templates**, not drawn freely: Google and car makers own layout, sizes, fonts and most colours; the app supplies content, icons, images and up to 2 accent colours. Order: **Setup → Phase 1 Category & tasks → Phase 2 Flows (approve) → Phase 3 Build → Verify → Report**.

Reply in the person's language (mostly Vietnamese), plain words; one sentence first saying what you'll do. Rules: `references/car-rules.md` (all 81 Android for Cars design pages, read 2026-11-12). Kit facts, sizes and keys: `references/car-kit.md`. Never edit the kit's own components or templates.

## Setup (every run)
1. Load `figma-use`. `create_session` for the **product file** (the phone design) and for the **car kit file** (team copy of "Car App Templates Design Kit"; default `I7uLEhgf2EOxTsRmEtg3oz` — ask if the team has another copy or a published library).
2. In the product file run `scripts/load-system.js` → brand accent(s) and icon set. None saved → ask for 1–2 accent colours (or run **setup-system**). Accents need **light and dark variants**: from `theme-generate.mjs` take Light `Primary` and Dark `Primary` (tone ≈ 80; Android Auto is dark by default). Check each against its background (4.5:1).
3. Freshness: the car guides are dated per page; if the task touches a template or rule, re-fetch that page when the person asks for "latest" or the note is older than ~3 months.

## Phase 1 — Category and tasks (read-only, report first)
- List the product's phone features and map each to an **approved category**: Navigation · POI (parking, charging, fuel) · **IoT** (control devices at home while on the road) · Weather · Media · Communication (beta) · parked-only (AAOS video/games/browser). Say clearly which features **don't fit any category** (for a car-companion app, e.g. remote lock/unlock, diagnostics, trip history, likely none — confirm against the car app-quality checklists/Play policy before promising) and propose the ones that do.
- Pick **essential, driving-relevant tasks** only (1–4), saved/recent items first, defaults pre-selected, voice where it helps; decide what is **parked-only**.
- **Stop and wait** for the person to confirm the category and tasks — this decides whether there is anything to build.

## Phase 2 — Task flows (approve before building)
- For each task write the template sequence and count steps with `scripts/flow-steps.mjs` (node; spec format in the file). Limits: **≤ 5 steps MUST** (app crashes), aim **2–3** (≤ 4 with purchase); step 5 = Navigation/Message/Pane; no 5 list/grid in a row; refresh vs new step; parked-only templates (Sign-in, Long Message) don't count; landing/another app = new task.
- Choose templates from the table in `car-rules.md` (Sectioned Item for new browsing screens; Pane for details + ≤ 2 actions; Message for errors/permissions; Tab for 2–4 top-level views; Map + Content / Place List only for POI). Add the standard flows the app needs: permissions (Message + toast to phone), sign-in (parked only, guest option while driving), settings only if essential.
- Write all on-screen text now: ≤ 120 characters per message, ≤ 80 per line, header titles 1 line, buttons verb-first ≤ 3 words, benefit first, reassuring tone, confirmation after each completed task, error + recovery. Vietnamese strings are longer — check the 120-character limit in the shipped language.
- Present a table per flow: step · template · content · actions · step count · driving/parked. Wait for approval.

## Phase 3 — Build (in the car kit file)
1. New page `<Product> · Car` (never on the kit pages). One SECTION per flow, screens left → right in step order, labelled with step count.
2. Per screen: `scripts/car-helpers.js` → `carScreen(name, 'Standard Canonical')` (800 × 400 app space) and `carInstance('<Template>', {variant})` from the kit; fill text through component properties (`carProp`) or text layers (`carText`); rows/grid items from `List/list item` / `Grid/grid item`; icons = Material Icons ligature text in the kit styles (`auto/icon-button/*`) or the product's Material Symbols; images in the kit's image slots only.
3. **Colour**: only where apps may customise (primary button, button text/background outside action strips, list secondary text, markers, routing card). Bind them to accent variables you create in the kit file (`Car/Accent 1`, `Car/Accent 2`, modes Light/Dark from step 2 of Setup) — no hex. Leave everything else on the kit styles.
4. Don't fake missing components (Chips, Banner, Spotlight, Condensed items, Section header, Toast/HUN are not in this kit): use the nearest template and add an annotation naming the intended CAL 1.9 component.
5. **Sizes**: Standard Canonical by default; add Portrait (766 × 594) and Wide (1020 × 456) by switching the `Apps` variable mode on a copy; Coolwalk (460 × 388) only for map templates. Optional: place one key screen inside the Dashboard page frame (800 × 480) for presentation.
6. Driving vs parked: build the driving state; where text/keyboard/sign-in differ, add the parked variant next to it (ListTemplate `CarState`, Sign-in/Long Message are parked-only → show what the driver sees instead).

## Verify
- `scripts/car-check.js` on every screen (text > 120 chars, placeholder text left, > 2 buttons on Pane/Message, Pane > 4 rows, Tab 2–4) and `scripts/contrast-audit.js` (4.5:1, including accent buttons in light and dark).
- Re-run `flow-steps.mjs` on the final flows. One screenshot per flow section, small.
- Checklist: every list row/grid item has an action; Pane has ≥ 1 row; Message has text; Tab items have icon + title; no action strip together with a FAB; back/exit on screens without actions; content shown ≥ 8 s before any auto-transition.

## Report
- Category decision (what fits / what can't go on the car screen), flows with step counts, screens built (links), accents used, parked vs driving differences, missing-kit components noted for developers, open questions (Adaptive task limits needed? AAOS OEM styling?). Handoff notes per screen: CAL template class (`PaneTemplate`, `ListTemplate`…), item limits come from `ConstraintManager`, text that truncates while driving.

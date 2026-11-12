# Android for Cars — design rules (all 81 pages of developer.android.com/design/ui/cars read 2026-11-12; "Widgets" page was 404)

Tags: [CAR] design guides · [UX] UX requirements · [TPL] templates · [CMP] components · [WR] writing. MUST = required (enforced in the API or app quality review), SHOULD = recommended, MAY = optional.

## Platforms
- **Android Auto**: projected from the phone; Google's styling, identical in every car. **Android Automotive OS (Google built-in)**: installed in the car; the **car maker can change fonts, theming, shapes, button width and the primary button's side** (left/right for right-hand drive). Same design process for both; developers ship two APKs. [CAR]
- Partner roles — the Car App Library handles: input (touch, rotary, touchpad), voice recording, screen sizing, transitions, consistent driving UI, light/dark, driving-state restrictions (keyboard off, shorter text), POI maps. **The app handles**: task flows, metadata (rows, places), icons and images, **up to 2 accent colours with light and dark variants**. [CAR]

## App categories (gate before designing)
- Car App Library categories: **Navigation · Point of interest (parking, charging, fuel) · IoT ("communicating with home devices while on the road") · Weather · Media**; Communication (calling, templated messaging) and templated media are **beta** (internal/closed testing only, early-access programme). Parked-only video, games and browser: **AAOS only**, adapted tablet apps. [CAR]
- A feature that fits no category can't ship on the car screen — say so plainly and suggest the parts that do fit. Final word: the app-quality checklists and Play policy for car apps (developer.android.com/docs/quality-guidelines/car-app-quality) — read them before promising a category.

## Principles and distraction limits [CAR, UX, WR]
- Only driving-relevant, essential content; saved/recent items first (shortcuts); pre-selected defaults; voice where possible; tasks can pause and resume without losing progress.
- **Task flows ≤ 5 steps (MUST — the app crashes otherwise)**, SHOULD 2–3 (≤ 4 with a purchase), common tasks ≤ 3 taps; shortcuts back when > 3 screens. Longer only with **Adaptive task limits** (OEM/region dependent, not on JAMA Android Auto cars; driving pauses after step 5).
- **Step counting**: +1 for a new template or new content; **refresh** (same title/tabs/section names; Navigation, Sign-in, Long Message any update) = 0; back to the same content = −1; parked-only templates and steps on the phone don't add; landing template, opening another app or the Navigation template starts a new task.
- Step 5 must be **Navigation, Message or Pane** (not list/grid); never 5 list/grid templates in a row. Content ≥ **8 s** before an auto-transition; no back-to-back auto-transitions; always a back/exit where no other action exists; open on useful content, not an empty state.
- **Text**: one message ≤ **120 characters / 24 words** (Japanese 30 characters), a line ≤ 80 characters, ≤ 3 lines (legal/privacy text exempt). Front-load (F-pattern), plain words, consistent terms and capitalisation, lead with the benefit ("To connect your phone, turn on Bluetooth"), reassuring tone — exclamation only for real danger ("Brake now!"). Buttons start with a verb, ≤ 3 words. Always confirm completed tasks; errors say what happened and how to recover.
- **Contrast 4.5:1** foreground/background. Map text ≥ 24dp; images, icons and map markers ≥ 36 × 36dp (navigation, weather).
- Stateful buttons (toggles) only inside list rows. Permissions asked on first open; mic permission before voice input.
- **Purchases**: no adding payment methods, no recurring payments, no multiple items in one flow; offer "book again".

## Customisation [CAR]
- App provides: all images/icons (Material icons), large vs small images, tabs, colours of: list secondary text (4 standard colours or the 2 accents), button text and background (not on action strips), place-list markers, routing card, turn-by-turn notification background. The library decides layout, sizes, shapes, fonts and default colours on Android Auto.
- **Primary button** = app accent colour (OEM may substitute on AAOS). Provide 2 accents so one works on dark and one on light backgrounds.

## Templates [TPL]
| Template | Contents & limits | Notes |
|---|---|---|
| **Sectioned Item** (replaces List and Grid for new work) | Mixed sections: lists, grids, chips, banner, condensed items, spotlight; expanded header | CAL 1.9 |
| List | Rows (count = vehicle limit, ConstraintManager); sections need headers; secondary text 2 lines driving, more parked; optional FAB | No radio rows mixed with others; default selection; every row has an action; toggles OK |
| Grid | ≥ 6 items (vehicle limit); icon or large image, title, secondary text, badge; optional FABs | Action per item; state by image/icon/text; spinner while loading; never action strip + FAB |
| **Pane** | Header, **1–4 non-actionable rows**, **≤ 2 buttons** (one primary), optional large image (hidden inside Map + Content) | Navigate = primary when present; icons on all actions |
| **Message** | ≤ 2 lines of text, image/icon/spinner, ≤ 2 buttons | Errors, permission prompts; primary button **closest to the driver** |
| Long Message | Scrollable text, ≤ 2 buttons — **parked only** | Legal text; offer an alternative while driving |
| Search | Search bar, results list; **keyboard only when parked** (voice/past results while driving) | Update list while typing; spinner > 1 s |
| Sign-in | Provider (Google), username/password (single field), PIN (≤ 12 chars), QR code — **parked only** | Shortest + most popular first; guest/skip while driving |
| **Tab** | App icon + **2–4 tabs, each icon + title**; embeds List, Grid, Search, Pane, Message, Navigation, Sectioned | Embedded headers ignored; FAB instead of action strip |
| Map + Content | Map + List/Grid/Pane/Message | Navigation, POI, Weather; marker per location, marker text ≥ 24dp |
| Place List (map) | List over a library-drawn map, markers (≤ 3 letters, icon or image), refresh button | POI only; MUST distance/duration and action per row |
| Navigation | App-drawn map, routing card, travel estimate, action strip ≤ 4, map action strip ≤ 4, cluster map (dark, non-interactive) | Navigation apps only |
| Media Playback | Header buttons, playback controls via MediaSession | Media only |

## Components [CMP]
- **Header**: ≥ 1 of title (1 line), app icon, back button. **Action strip**: ≤ 2 buttons (≤ 4 on map templates), one label button max, secondary/tertiary actions only, hides after 10 s on map templates, never together with a FAB. **FAB**: icon only + background colour, List/Grid only, ≤ 2, bottom-right. **Button**: icon / label / icon + label, custom colours (OEM may override), one primary, **timed button** for a default action. **Row**: title ≤ 2 lines, secondary ≤ 2 lines (custom colour), inline icon, numeric decoration, image, ≤ 2 actions, browsable, progress bar, toggle *or* radio, disabled state.
- CAL 1.9, Sectioned Item only: **Spotlight** (hero image without readable text + ≥ 1, ideally 3 condensed items), **Condensed items** (1-line texts; not images on both sides), **Chips** (≤ 7 per row; icon and/or label; distinct state style; key chips first), **Banner** (one per dedicated section, custom fill and corners, not adjacent), **Section header** (icon, 1-line title/overline, trailing action), **Minimized control panel** (media, required).
- Communication: **Message** (errors) · **Long Message** (legal, parked) · **Toast** (one at a time, 8 s, no action — e.g. "continue on your phone") · **HUN** (important updates, ≤ 3 actions) · navigation alerts (nav apps) · **voice input** (mic in the action strip, permission first, branded as the app's assistant, stop when the user stops).

## Standard flows [CAR]
- **Permissions**: Message template with 2 buttons → toast "continue on your phone" (Android Auto) or system dialog on the car screen (AAOS) → back to landing (new task).
- **Sign-in** (parked only): Google first, else phone sign-in (PIN ≤ 8 digits), username and password as **2 separate steps**, visible label, show-password, forgot/create account; Long Message for terms.
- **Settings** (optional on Android Auto): one List screen, essentials only, dialogs only for simple confirmation.
- **Purchase**: list of nearby/recent → Pane (reserve) → Message (confirmation + Navigate) = 4 steps.
- **IoT pattern** (official sample): Tab "Home devices" → Grid of devices → tap toggles → toast confirms (refresh, still 1 step).
- Media: ≤ 4 tabs with label + white monochrome vector icon, browse ≤ 3 levels deep, subheaders for subcategories, ≤ 6 custom playback actions (8 without next/previous), queue shows the current item, 10 recommendations, vector app icon in full colour and monochrome + accent colour.
- Navigation apps: 1-tap saved places, Map + Content for details, add stop without losing the route, arrival message ≥ 8 s, incident report via grid, resume after a stop, search with past results, timed alerts, dark cluster map.

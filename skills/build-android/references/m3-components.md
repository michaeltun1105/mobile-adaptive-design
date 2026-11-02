# M3 Components — usage rules (all 38 component pages, read 2026-11-02)

Read when choosing, placing or configuring a component. Tag [CMP]. Measurements live in the kit — use kit instances; these notes are the rules the kit can't enforce. Values are Material defaults, never product values.

## Not recommended any more (M3 Expressive) → use instead
- Medium / Large app bar → **Medium flexible / Large flexible** app bar · Center-aligned app bar → Small app bar, centred-text configuration.
- Segmented button → **connected button group**.
- Bottom app bar → **docked toolbar**.
- Navigation drawer → **expanded navigation rail** (modal on compact/medium, standard on expanded+) · baseline navigation rail → **collapsed navigation rail**.
- Small FAB → FAB, **medium FAB (most recommended)** or large FAB · baseline extended FAB → **small extended FAB** · Surface-colour FABs → primary/secondary/tertiary (container) styles · speed dial / stacked small FABs → **FAB menu**.
- Baseline list → **expressive list** (standard or segmented style) · baseline menu → **vertical menu** (standard or vibrant).
- Baseline navigation bar → **flexible navigation bar** (shorter; vertical items on compact, horizontal items on medium).
- Indeterminate circular progress for short waits → **loading indicator**.

## App bars
- Variants: **Search app bar** (home pages where search is key) · **Small** (dense, scrolled) · **Medium flexible** (larger headline, collapses to small on scroll) · **Large flexible** (emphasised headline). Flexible bars: shorter height, subtitle, leading or centred text, headline wraps to 2 lines (**never truncate**), image/logo, filled icon button.
- Contents: leading button = navigation (menu → modal expanded rail, or back); headline = page/section/product; optional subtitle; **max 2 trailing icon buttons** (most-used nearest the leading edge); primary page action (Send, Save, Edit) may be one **filled or tonal (optionally wide) icon button** — only one. More actions → **toolbar**, avoid an overflow menu.
- Search app bar: text always contains "Search" ("Search inbox"); up to 2 trailing icons + avatar on mobile, up to 4 on large screens; leading slot may hold the product logo (not to open the rail); container Surface Container (Surface Bright on darker backgrounds, ≥ 3:1); search container fills the space up to 312dp, then 50% of it; tapping opens **search view**.
- Always default height and **100% window width**. Colour: same as background at rest, **Surface Container when scrolled** (no shadow). Can hide on scroll or go transparent with filled icon buttons floating. Flexible bars shrink to small on scroll and stay small until back at top; never turn into a search app bar. Trailing actions may collapse into overflow on small breakpoints. Mirrors in RTL. Focus starts on the leading button.

## Badges
- **Small** (6dp dot, unread) and **large** (16dp high, count/status, max **4 characters incl. "+"**, e.g. 999+). Anchored inside the icon bounds at the upper trailing corner; used on nav bar, rail, app bar, tabs. Keep default colours (Error). Hidden after the destination is opened (notification). Screen reader reads the destination then the count or "New notification".

## Buttons — choosing (10 types)
| Emphasis | Use | Examples |
|---|---|---|
| High | **FAB / extended FAB / FAB menu** — the page's primary action (extended FAB best on large screens) | Create, Compose |
| High | **Filled button** — final or unblocking action in a flow | Save, Confirm, Done |
| High | **Split button** — key action with options | Send ▾ |
| High | **Standard button group** — several key actions | Back, Pause, Next |
| Medium | **Tonal** — final/unblocking or supporting; **Elevated** — only on patterned backgrounds; **Outlined** — needs attention but not primary, or "change mind / escape" | Reply, View all, Add to cart |
| Low | **Connected button group** (switch visible content), **Text button** (non-essential), **Icon button** (optional supplementary) | Walk/Bike/Drive · Learn more · Star |
- **One high-emphasis button per screen**; use styles to show hierarchy among the rest.

## Button groups
- **Standard**: invisible container with padding; pressing/selecting changes width and shape of the button and its neighbours; selected toggle switches shape round ↔ square and colour. Same size (XS–XL) and shape for all buttons; mixed sizes only for hero moments. Hugs content.
- **Connected** (replaces segmented button): 2dp gaps, only the pressed button changes shape; for **single/multi-select toggles** (view switch, sort) — don't use if nothing can be selected; don't mix colour styles; spans the page/surface width (max width on large windows).
- Use filled/tonal/outlined (not standard icon or text buttons — no container). Never wrap to a second line; stack groups instead; trailing buttons may collapse into an overflow menu at the end. Fixed or flexible widths per breakpoint; keep the primary the most prominent at every size.
- Targets ≥ 48 (XS/S get extra padding — don't reduce). Tab to the group, arrows between buttons.

## Buttons (common)
- Variants **default** and **toggle**; colours elevated / filled (default) / tonal / outlined / text; sizes **XS, S (default), M, L, XL**; shapes **round (default)** or square (square corners 12/12/16/28/28 for XS–XL; pressed morph 8/8/12/16/16). Small button padding **16** (24 no longer recommended). Leading/trailing icons **20dp**, icon and label share the colour.
- Colours: filled Primary/On Primary · tonal Secondary Container/On Secondary Container · elevated Surface Container Low + Primary (level 1, 0 disabled) · outlined Outline Variant stroke + On Surface Variant · text Primary. Other roles only with ≥ 3:1 container/label contrast. Toggle selected: filled/elevated → Primary, tonal → Secondary, outlined → Inverse Surface.
- **Filled** = important final action, ideally **one per page** (may use tertiary) · **tonal** = lower priority with a bit more emphasis (e.g. Next in onboarding) · **elevated** only when separation from a busy background is needed · **outlined** pairs with filled as the alternative; simple backgrounds only · **text** = lowest priority, in cards/dialogs/snackbars; never underlined (use hyperlinked body text for links). Dialog text buttons align to the **trailing edge**.
- Labels **1–3 words, sentence case**, never truncated or wrapped at 100% — on Android they must still fit **2 lines at 200% text**; icon on the **leading** side. Toggle: outlined icon unselected, filled icon selected (or heavier weight); round → square when selected; avoid big label changes.
- Don't overuse buttons (use rail, chips, links, icon buttons). Constrain width on large screens (no very long buttons); keep the same order on small and large screens. Enabled buttons need 3:1 with the background (container for filled/tonal/elevated, label for outlined/text). Targets ≥ 48 for XS/S.

## FAB
- Sizes **FAB · medium FAB (most recommended; compact/medium) · large FAB (expanded+, or one clear primary action anywhere)**. Colour styles: Primary/Secondary/Tertiary **Container** (former defaults) or Primary/Secondary/Tertiary; state layer = icon colour.
- For the most important **constructive** action (Create, Favorite, Share, Start). Not for minor/destructive actions, alerts, or toolbar-type controls. **Filled icon**, clear meaning; no badges on it; never disabled — hide it if unavailable. Icon ≥ 3:1 with the container.
- Placement: compact/medium **lower trailing corner** (above the navigation bar or nested in it; may be centred); expanded+ **upper leading area, in the navigation rail**. Stays in place on scroll; disappears/reappears on screen transitions and tab changes (not attached to a tab); expands with container transform or opens a **FAB menu**. Focus order: app bar → navigation → FAB.

## Extended FAB
- Sizes **small 56 · medium 80 · large 96** (title-medium+ type). For long scrolling screens needing a persistent action, or when a label is needed to understand it; **one per screen**; not one of a set of actions (use filled buttons). Label 1–2 words (allow for translation growth); container hugs content.
- Compact/medium: bottom, centred or trailing; expanded+: bottom-right (LTR and RTL) or **inside the navigation rail** (FAB in collapsed rail ↔ extended FAB in expanded rail). Collapses to a FAB on scroll down, expands on scroll up. Don't combine with a floating toolbar. Accessibility label starts with the visible label's first word; no tooltip needed.

## FAB menu
- Opens from a FAB (never from an extended FAB or other components) with **2–6 closely related actions**, each with icon + label, hugging content, all rounded; the FAB becomes a **56dp close button**; items are medium-button size; colour set matches the FAB (primary / secondary / tertiary). Trailing-edge aligned (left in RTL); margins 16 → 24 on large/extra-large. Not together with a floating toolbar or navigation rail. Items scroll behind the close button when height is short. Close button label "Toggle menu", state expanded/collapsed.

## Icon buttons
- Variants default / **toggle**; colours (high → low) **filled (default) · tonal · outlined · standard**; sizes **XS 32 · S 40 (default) · M 56 · L 96 · XL 136**; widths narrow / default / wide; round or square (same corner table as buttons). Same colour roles as buttons; standard = On Surface Variant (selected Primary).
- Filled sparingly for key actions; tonal for secondary actions next to a high-emphasis one; outlined when not the main focus; **standard on colourful surfaces** or low emphasis. Similar importance → same size; the main action (play/pause) more prominent by colour or size.
- Default icon buttons use **filled icons**; toggles outlined → filled when selected (no filled version → semibold, then bold) so selection uses ≥ 2 cues. Only a few at once; many actions → toolbar or button group. Tooltip on hover describes the **action**, not the icon. Icon ≥ 3:1; target ≥ 48 even when nested; no default density.

## Segmented buttons (no longer recommended → connected button group)
- If still used: 2–5 segments, 40 high, 1dp outline, single- or multi-select, checkmark replaces the icon when selected, max padding on large screens; for more or complex choices use chips.

## Split button
- Leading button (1–2 words + matching icon) + trailing menu button (expand icon, rotates 180° with the **standard** motion scheme), 2dp gap, inner corners morph; sizes XS–XL; elevated / filled / tonal / outlined; colour doesn't change when selected (state layer only). Opens a menu (or card) aligned to the trailing button, 4dp away. Can be larger than nearby buttons; scale up on large screens. Each part ≥ 48 target; trailing label like "More watch options" + expanded/collapsed state.

## Cards
- **Elevated / filled / outlined** (style only — same function); corner **12**, side padding **16**, ≤ 8 between cards; label start-aligned. Only the container is required; content blocks (thumbnail, media, headline, subhead, supporting text, buttons, icon buttons, selection controls, overflow menu top/bottom-right, dividers).
- Avoid text/icons on images; if needed add a scrim or shape for contrast.
- Either a **directly actionable card** (one big target, ripple, no nested actions) or a **non-actionable container** with buttons/links — never actions on an actionable surface.
- Collections: grid (also staggered/mosaic), vertical list, carousel; coplanar; filter/sort controls outside the collection and applied to all cards. Swipe (dismiss, flag) and pick-up-and-move need a single-pointer alternative (menu).
- Adaptive: compact may swap cards for **lists**; larger screens use columns, rows or carousels instead of stretching; horizontal card on compact can become a larger vertical card on expanded. Expand with container transform (hero) or navigate with forward/backward. Content taller than the card is truncated and revealed by expanding.

## Carousel
- Layouts: **multi-browse** (many visual items, ≥ 1 large + medium + small; snap) · **uncontained** (traditional, items flow past the edge, same size; more text OK; default or snap scroll) · **uncontained multi-aspect** (widths 9:16 → 16:9) · **hero** (one large + small peek; snap; spotlight media) · **center-aligned hero** · **full-screen** (one edge-to-edge item, vertical feeds, **portrait compact/medium only**, snap only).
- Specs: padding 16 sides, 8 top/bottom, **8 between items**, item corner **28**; small items 40–56 wide; large item max width adjustable. Items change size and have parallax while scrolling; all items fully visible except uncontained.
- Compact: up to **3 items** if they have text; more items on larger breakpoints. Text brief, adapts to item size — lots of text → uncontained or cards.
- **Accessibility requirement:** on vertically scrolling pages provide a way to see all items without horizontal scroll — a **"Show all" button below**, or an **arrow icon button next to the header**; don't add arrows inside/beside the carousel. Reduced motion: no parallax, equal sizes.

## Checkbox
- Multiple selection in a list, sub-selections (parent → children, **indeterminate** when some children selected), on/off on desktop. Box 18 (corner 2), state layer 40, target 48. Label On Surface; the label is tappable too. Checkbox = many options · radio = one option · switch = standalone/verbose settings. Toggling applies immediately.

## Chips
- **Assist** (smart/contextual action, verb first, e.g. "Add to calendar"; shown after primary content) · **Filter** (nouns, checkmark when selected, multi- or single-select — same behaviour for all sets on a page; can open a menu; alternative to segmented buttons/checkboxes) · **Input** (user-entered items like contacts; trailing remove icon required; editable, reorderable) · **Suggestion** (dynamic suggestions, e.g. replies).
- Height **32**, corner **8**, icon 18 (avatar 24), padding 16 (8 with icon), **gap ≥ 8**, target ≥ 48; label ≤ **20 characters**, button type style; elevation 0 (elevated only on images/busy backgrounds). Stroke **Outline Variant** — but chips need a second interactivity cue: a label before the group ("Select type"), page context ("Filter results"), **Outline** stroke for 3:1, or an action label/leading icon.
- Chips are not buttons: dynamic, appear in sets (buttons ≤ 3 in one arrangement, persistent, linear steps). Rows inline (not vertical lists); overflow wraps or scrolls horizontally — then offer a way to show all (leading filter chip that reflows, or a leading button opening a menu). Trailing icon on compact only if the whole chip does the action; with a separate remove target the chip needs min width 88 (label 42).

## Date pickers
- **Docked** (input field + dropdown calendar below it; near and distant dates; best on **medium/expanded**) · **Modal** (dialog; swipe months, scroll years; ranges for flights/hotels) · **Modal input** (typing; switch via edit/calendar icon). Compact: **full-screen modal picker** (close ×, Save).
- **Don't use the modal calendar picker for distant dates such as date of birth** → modal input or docked picker. Sizes don't scale with breakpoints.
- Always allow typing the date; format after Enter/blur (no input masks); accept many separators; helper text shows the format (e.g. DD/MM/YYYY). Today and selected dates clearly marked; ranges = start/end selected + connected highlight. Dates ≥ 4.5:1. OK / Cancel; tapping outside dismisses.

## Time pickers
- Modal (above a scrim), variants **dial** and **input** (keyboard icon toggles; input must always be reachable). Hours/minutes separate inputs; AM/PM selector only for 12-hour (24-hour set by system). Dial 256, handle 48, targets 48. Landscape puts input and dial side by side; switch orientation or fall back to input rather than scrolling or cropping; no density on the dial. OK / Cancel, tap outside dismisses. Not for granular values (milliseconds).

## Dialogs
- **Basic** (alerts, quick selection, confirmation; corner **28**, width **280–560**, padding 24, title→body 16, body→actions 24, buttons 8 apart; icon centred with centred title) · **Full-screen** (multi-step tasks with keyboard input or unsaved changes; **compact only** — medium/expanded use a basic dialog; header 56 with **close × as the only navigation**, Save trailing; FAB → full-screen dialog with container transform).
- Use sparingly (blocking). Low-importance message with optional action → **snackbar**; options without interrupting → **menu**.
- Headline: brief statement/question; no "Sorry", "Warning!", "Are you sure?"; may wrap; on Android fit **4 lines at 200%**. **Max 2 actions**: one = acknowledgement; two = confirm + dismiss; no third "Learn more". Buttons trailing, **confirm closest to the edge** (mirrors in RTL). Confirm label says what happens (Send, Create — not OK/Done/Close); never disabled.
- Closing a full-screen dialog with unsaved changes → basic "discard?" dialog. Field errors inline, all at once; general errors (network) in a basic dialog after the confirm fails.
- Medium: centred by default (position may move for ergonomics); expanded+: anywhere respecting margins. Content rarely scrolls; if it does, title pinned top, buttons pinned bottom. Focus lands on the first interactive element.

## Divider
- Only when open space can't group items; groups, not every item. **Full-width** between unrelated sections or interactive vs non-interactive areas · **inset** (16 leading) inside a section · vertical for large-screen arrangements. Repetitive list rows may need no divider. Decorative (no contrast minimum).

## Lists
- **Expressive list** recommended (standard or **segmented** style; selected item highlighted with shape morph: unselected corners 4 inner / 16 outer, selected 16). Slots: leading (avatar, icon, image, video, checkbox/radio/switch), content (largest; label + supporting text), trailing (icon, icon button, trailing text like price/count, control). Baseline heights **56 / 72 / 88** (tallest element decides; ≥ 88 or 3 lines → top-aligned), padding 16 leading, 24 trailing, targets 48.
- Same element positions in every item; order logically (alphabetical, numerical); supporting text 1–3 lines; circular/expressive avatars for people, square images for content. **Gaps for contained lists, dividers only for uncontained/complex lists.**
- Selection modes (one per list): single-action (whole row navigates; no nested actions) · multi-action (primary area large, extras trailing) · single-select (radio) · multi-select (checkbox/switch) · non-interactive. Selection shown by more than colour. Swipe actions need an alternative (more icon, long press); the primary swipe action is the final end-aligned one.
- Adaptive: compact edge-to-edge, tap opens a detail page; medium/expanded list + detail side by side, or swap to cards/carousel, reveal more content; line length 40–60 (≤ 120 on large screens with more line height).

## Loading indicator
- For waits **200 ms – 5 s** when progress is unknown (< 200 ms: nothing; > 5 s: progress indicator). Looping shape morph of 7 shapes; never decorative; don't turn it into a progress indicator.
- **Contained** version (On Primary Container on its container) when placed over content and for **pull-to-refresh** (Compose; needs a refresh button alternative); uncontained Primary on plain surfaces. Default **48**, range 24–240 (very large only on large windows). Centred on the loading element; "load more" in the empty space where content will appear; can sit inside a button. Label e.g. "Loading news article", role progress bar.

## Progress indicators
- **Linear** (edge of a container, or top of the page for a group) and **circular** (centred on the element); **determinate** (must be accurate) or **indeterminate**, switching to determinate when known; one indicator per group, same variant for the same process across the product. Flat (default) or **wavy** (expressive, longer processes; not in tiny sizes); track thickness configurable (4 default).
- Linear: **4dp stop indicator** at the end when the track has < 3:1 with its surroundings; ≥ 40 wide, 4 end padding; mirrors in RTL (circular doesn't). Circular 24–240. In a button: flat, colour = label/icon colour, no track. Active indicator ≥ 3:1. Label includes process + content.

## Menus
- Temporary set of actions (persistent actions → **toolbar**). Opens from icon buttons, buttons, split buttons, text fields (dropdown/select), filter chips, selected text, or right-click / long-press (**context menu**). Takes less space than radios or chips.
- **Vertical menus** (expressive): rounded, **standard** (surface) or **vibrant** (tertiary — sparingly), groups via **gap** (1–2 gaps, not in scrollable menus) or divider (scrollable menus, text-field dropdowns). Baseline: width 112–280, items 48 high, padding 12, icons 24.
- Items: label, leading/trailing icon, keyboard shortcut; **disable unavailable items instead of removing them**. Slots for simple content (images, swatches); never buttons/switches inside items. Selected = shape + colour + checkmark; single-select closes, multi-select stays open.
- Placement relative to the trigger (below/next to/in front), repositions to avoid clipping, expands downward from the top of the screen; trigger shows pressed state. Submenus beside the parent on large screens (not on Compose). **Compact: consider a bottom sheet instead** (more items, longer labels). Long lists can include a filter text field (autocomplete); scrollable menus show a scrollbar. Focus starts on the first item; Esc/outside/back closes.

## Navigation bar
- **Flexible navigation bar** for **compact and medium** only; **3–5 equal destinations**, the same on every screen; bottom, full window width, filled container; not for single tasks; more than 5 → tabs within a page or a modal expanded rail behind a menu icon.
- Items: icon + **label (required, 1–2 words)** + active indicator; **vertical items on compact**, **horizontal items on medium** (fixed width, centred, extra space at the ends). Active: **filled icon + bold label**, inactive outlined icon + medium label (no filled version → heavier weight); active label Secondary; icons ≥ 3:1 with the container; badges top-right of the icon.
- FAB sits **above** the bar. May be temporarily covered (dialog, sheet, keyboard), never permanently. Expanded+ → navigation rail. Medium: bar or rail depending on whether horizontal or vertical space matters more.
- Tapping a destination: **top-level fade** transition; preserve state (frequent switching) or reset; re-tapping the active destination scrolls to top. **No swiping between destinations.** May hide on scroll, but not while a screen reader is on. At 200% text the bar grows taller, labels may wrap and must stay fully visible.

## Navigation drawer (no longer recommended → expanded navigation rail)
- If an existing product still uses one: standard (expanded+; permanent or toggled) or modal (compact/medium, with scrim; dismiss by item, scrim tap or swipe to its edge); 360 wide, active indicator 56 high / 336 wide / full corners, padding 28; start edge (right in RTL); never together with a navigation bar.

## Navigation rail
- **Collapsed rail** (replaces baseline rail): leading edge, **3–7 destinations** + optional menu button and FAB at the top; for **medium → extra-large**; never on compact (use the bar); never hidden; never horizontal; never at the same time as a navigation bar. Medium with few destinations → a navigation bar may be better.
- **Expanded rail** (replaces drawer): opened from the menu icon (icon changes to collapse), may show secondary destinations; **standard** beside content (large windows) or **modal** over content (dense layouts, many items; predictive back); can hide completely in immersive views. When it expands the page adjusts and the **FAB becomes an extended FAB**.
- Items: icon + **one-word label (required)**; no shrinking the type to fit; break or hyphenate rather than wrap. Selected: filled icon + active indicator (hugs the label in the expanded rail; target spans full width). Badges: top-right of the icon (collapsed) or next to the label (expanded). FAB in the rail has elevation 0. Logo at the top only if it can't be mistaken for a button (never as the menu button).
- Items aligned to the **top or centre** (centre on tablets for reach); menu and FAB always top. Container fill optional (then items ≥ 3:1); optional vertical divider on the content side. Placed **outside all panes**; tabs can add a second level. Destinations stay fixed on vertical scroll. Top-level fade on selection. At 200% text items grow taller; labels fully visible.

## Radio button
- One choice from **≤ 5 visible options** (more or space-saving → dropdown menu); stacked vertically, each with its own label (label tappable); icon 20, state layer 40, target 48; label On Surface. Once selected the group can't be cleared → add "None/Not applicable" or a Clear action. No nesting.

## Search
- Entry points: **search bar** (search within a view, "Search your messages") · **search app bar** (search is the primary global function) · **search icon button** (secondary). Focused search shows history/suggestions/results in a **list** (leading icons, category labels like Recent, avatars, filter chips, gaps between groups).
- **Contained style** (recommended; divided style is baseline): bar **56 high, 360–720 wide**, margins **24 unfocused → 12 focused** (bar widens on focus), colour **Surface Container High** (use roles more than one step apart from the background). Leading: navigation icon button or non-functional search icon; trailing: 1–2 icons (voice, location/profile, overflow, avatar 30). Hint text describes what can be searched.
- Layouts: **full-screen** on compact (default), **docked** (list below the bar, 240 → ⅔ screen height, scrim) on medium/expanded. Back releases focus. Results scroll under the bar; query text stays visible; show a status cue (Results label). Bar may scroll away and return on scroll up, or stay fixed. Screen reader announces suggestions.

## Bottom sheets
- For **compact and medium**; supplementary content only. **Standard** (no scrim, coexists with main content, e.g. audio player, details over a map; full height → collapse icon in an app bar) · **Modal** (scrim, blocks the app; mobile only; alternative to menus/simple dialogs for long action lists or items with icons/descriptions).
- Top corners **28**, full width up to **640** (wider windows: 56 top and side margins), top margin 72 on compact, optional **drag handle** (48 target; tap cycles preset heights or closes). Modal initial height **≤ 50%** of the screen, then pull to full screen and scroll; full-screen modal sheet needs a close button. Dismiss: item, scrim, swipe down, close. Every drag needs a single-pointer alternative. Expanded+ may swap to a **side sheet**. Predictive back detaches the sheet from the edges.

## Side sheets
- **Standard** (medium/expanded; beside content, body shrinks; filters, supplemental info) · **Modal** (compact, or when it must be dismissed; corner 16). Max width **400**, padding 24, bottom action area 72 (actions left-aligned), 16 margins when detached. **Close button always present** (required); optional back button, divider between actions and content. Scrolls vertically on its own, never horizontally. On the left in RTL. Role Dialog.

## Sliders
- **Standard** (from zero), **centered** (±, default in the middle), **range** (min–max; not vertical). Sizes **XS (default 16 track) · S 24 · M 40 · L 56 · XL 96** (XL only for hero moments); horizontal or vertical; inset icon only on standard M/L/XL (swap icon at zero, e.g. mute). Stops snap (don't crowd); end stop ensures 3:1; value label on drag (or a linked text field next to it, tab order slider → field).
- Value applies **immediately**; show the full range. Handle shrinks and value appears while pressed. Tap the track to jump; arrows step.

## Snackbar
- Brief, low-priority message about a process, bottom of the screen, **one at a time**, **max one action** (text button) + optional close; never the only way to a core feature. Compact: 48–64 high, up to 2 lines, fixed side/bottom margins; larger: grows horizontally, one line preferred, left- or centre-aligned consistently.
- Appears **above FABs and docked toolbars** (nudged up), not over navigation or frequent targets; full width only when there's no persistent navigation. No action → auto-dismiss 4–10 s; with action → stays until acted on. Announce politely, don't move or trap focus. Colour: Inverse Surface / Inverse On Surface / Inverse Primary action.

## Switch
- Standalone binary settings that **apply immediately** (no Save); not for opposing options (list vs map → connected button group). Track **52 × 32**, handle 16 → 24 selected → 28 pressed, optional icon 16 in the handle, target 48; inline label always (On Surface). Checkbox = multiple related options, radio = one option, switch = standalone/verbose settings.

## Tabs
- **Primary** (under the app bar, main content destinations) · **secondary** (inside content, a second level, always below primary). Related content at the same level, not sequential steps. Height 48 (text) / 64 (icon + text), indicator 3dp primary / 2dp secondary, min 24 long, divider at the bottom; content may scroll under.
- **Fixed tabs**: full width, equal sections (width = widest tab), **≤ 4 tabs**, swipe content or tap; careful with swipeable content (maps, swipe rows) inside. **Scrollable tabs** for more/longer labels, first tab offset 52, no infinite loop. Labels short (second line truncated); icon-only tabs only if clear. Badges ≤ 4 characters, cleared after viewing. Tabs stay pinned or scroll away and return on scroll up.

## Text fields
- **Filled** or **outlined** (same function; pick by style and distinctness; don't mix within one section — outlined suits forms with many fields). Height **56**, padding 16 (12 with icons), icon↔text 16, supporting text 4 below.
- **Label always present and visible**, short, never truncated or multi-line (or an adjacent label aligned to the leading edge). Required fields: asterisk + explanation (supporting text or one note at the top), on every required field. Prefix/suffix (currency, unit, domain). Supporting text 1 line (counter when limited).
- Errors: **replace supporting text with error text** (no layout jump), say how to fix it, show an error icon. Icons: signifier (calendar → date picker, dropdown arrow → menu), clear (only with input), voice, valid/error; images 24 high. Read-only fields look the same and are labelled read-only. Don't stretch fields across large screens (min/max widths). No default density. Password eye icon labelled Show/Hide password.

## Toolbars
- **Docked toolbar** (replaces bottom app bar): full width, bottom only, **no rounded corners** on mobile, global actions shared across pages; evenly spaced on compact, centred or key action centred on medium+. **Floating toolbar**: contextual actions for the page, elevated (remove if the content beneath is distinct), fully rounded (no square icon buttons), horizontal (≥ 16 margin) or vertical on larger breakpoints (≥ 24 margin, opposite the navigation rail; rail then centred; not on compact unless very simple), can pair with a **FAB**. All toolbars **64 high**, ≥ 16 outer padding, default 32 between items, targets 48.
- **Never show a toolbar at the same time as a navigation bar**: navigation bar on primary pages, toolbar on subsequent pages with actions. A floating toolbar may act as local tabs between related subpages.
- **Standard** colours (low emphasis) or **vibrant** (draws attention, e.g. edit mode). Emphasise **one** action (filled icon button, wide button, own colour, or a FAB). Overflow menu in the trailing slot when actions don't fit; one toolbar on compact (several on large screens, e.g. undo/redo vs edit tools). On scroll: stay, hide, or collapse into one key action/FAB (not both at once). Mirror icons and, when order matters, the action order in RTL.

## Tooltips
- **Plain** (label for icon-only elements; 24 high, padding 8; above the element, 4 from a container or 8 from text; below it inside an app bar) · **rich** (explanations; optional subhead, up to 2 text buttons, links; bottom-right of the element; never covers it). Show on hover (desktop) or long-press (mobile); disappear 1.5 s after leaving; one at a time. **Persistent rich** tooltips appear on click or on page load to introduce a feature, and stay until another interaction — not on icon buttons. Don't trap focus.

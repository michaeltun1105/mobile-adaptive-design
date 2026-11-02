---
name: build-iphone-duo
description: "This skill should be used when the user shares an iPhone Figma screen and asks for the iPhone Duo (foldable iPhone) version — \"làm bản Duo\", \"iPhone gập\", \"iPhone Duo\", \"màn ngoài màn trong\", \"ready for Duo\". Reviews the design against Apple's iPhone Duo guidelines, builds outer/inner Duo versions from Apple's iOS 27 templates mapped to the team's design system, and optionally (only with permission) has an independent critic sub-agent score them."
---

# iPhone Duo design: review, then build

The person pastes a link to a normal iPhone design (usually 402 × 874). Work in this order: **Setup → Phase 1 Review → (decisions) → Phase 2 Build → Verify → Report → (optional) Phase 3 Critique loop**. Phase 3 is opt-in: never start it without the person's explicit permission. If the person only asks for a critique of existing Duo screens, that request is the permission — run Setup and Phase 3 alone. Never edit the original frame.

Reply in the language the person writes in (the team mostly writes Vietnamese). Keep wording plain; many readers are not technical. Start with one sentence saying what you are about to do.

## Setup (every run)
0. **Design system (plugin):** run `scripts/load-system.js` first. If a system is saved for iOS, follow its colour collection, text styles (`<Product>/iOS/…`) and icon decision without asking; if none is saved and the build needs one, run the **setup-system** skill (platform iOS). After building, verify with `scripts/contrast-audit.js` and `scripts/text-scale-check.js` (Dynamic Type xxxLarge/AX5) — rules in the **check-accessibility** skill. No hard-coded values: colours as variables, texts on styles, icons as instances.

1. Load the Figma skills the Figma MCP server requires: `figma-use` before any `use_figma` call, and `figma-generate-design` before visible changes. Pass both names in `skillNames` on every mutating `use_figma` call.
2. Parse the link: `figma.com/design/<fileKey>/...?node-id=A-B` → nodeId `A:B`. Call `create_session` for that fileKey and reuse the session id.
3. Call `get_libraries`. The Apple library **"iOS and iPadOS 27"** (community) must be added to the file. If it is missing, say so and ask the person to add it in Figma (Assets → Libraries) before building; the review can still run. Never claim Apple components are unavailable without checking.
4. **Map the team's design system — never hardcode.** If `get_libraries` lists a team library (e.g. "KeyConnect - Design system"), everything the build adds **inside a screen** must use it:
   - **Inventory first** (one read-only `use_figma` pass over the original frame): component keys, bound variables (colors, spacing, radii), text styles and effect styles, plus the fonts actually used. Then `search_design_system` scoped to the team library key for anything the build needs that the screen doesn't already show (`entity: "variable"` for e.g. "background", "label", "separator", "fill"; `entity: "style"` for text styles such as "title", "body", "caption"; `entity: "component"` for buttons, cards, rows).
   - **Colors:** bind every new fill/stroke with `setBoundVariableForPaint` to the team variable (or to Apple's "Colors" variables for system surfaces such as sheet backgrounds, overlays, separators). Copy the original's bound fill for screen backgrounds instead of a hex.
   - **Type:** apply the team's text style (`textStyleId`) to any new or edited text; if only a font is known, use the exact family/style the original uses (never Inter or a guessed font). Load the original's fonts before editing.
   - **Spacing/radius:** bind padding, gap and corner radius to team variables when they exist; otherwise reuse the original's values and say so.
   - **Components:** reuse the team's components (clone or instance) for content; Apple components only for system parts (status bar, bars, sheets, tab bar, camera lens).
   - **When nothing matches** (e.g. a fade or filler the original never needed), pick the closest team token, bind it, and list it in the report as "cần team xác nhận". A raw hex or hand-typed font is allowed only for presentation layers outside the screens (section fill, row/screen labels, the `_Guide · Fold` layer).
5. **Apple's sources are the truth, not this skill.** The knowledge base below was condensed from them (last read 2026-10-27). Re-read the relevant source whenever the person questions a rule or a case isn't covered, quote it when you explain a decision, and if a source and this skill disagree, follow the source and say so in the report.

### Sources (fetch these URLs exactly)
| Tag | Source | URL |
|---|---|---|
| HIG | Designing for iPhone Duo (HIG). Fetch the **`.md`** version — the plain URL returns a JavaScript-only shell | https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo.md |
| T461 | Tech Talk: Prepare your app for iPhone Duo | https://developer.apple.com/videos/play/tech-talks/111461/ |
| T462 | Tech Talk: Raise the bar with iPhone Duo (vertical bars, toolbars) | https://developer.apple.com/videos/play/tech-talks/111462/ |
| T463 | Tech Talk: Strike a pose with adaptive layouts on iPhone Duo (fold, reserved regions, arrangements) | https://developer.apple.com/videos/play/tech-talks/111463/ |
| T464 | Tech Talk: Leverage multiple displays and scenes on iPhone Duo (hinge API, multitasking, scene accessories) | https://developer.apple.com/videos/play/tech-talks/111464/ |
| T466 | Tech Talk: Design for iPhone Duo (design principles) | https://developer.apple.com/videos/play/tech-talks/111466/ |
| X-RES | Apple Xcode agent skill **app-resizability** (+ `references/safe-area-task.md`, `orientation-task.md`, `idiom-task.md`) — what developers change to make an app resize for iPhone Duo | team folder `Dropbox/Working/Figma/xcode-skills/app-resizability/` |
| X-TB | Apple Xcode agent skill **swiftui-whats-new-27** › `references/toolbar.md` — iOS 27 toolbar overflow, pinning, minimize, status-bar visibility | team folder `Dropbox/Working/Figma/xcode-skills/swiftui-whats-new-27/` |
| W278 | WWDC26 session 278 "Modernize your UIKit app" (resizable iPhone apps on iPad and in iPhone Mirroring, sidebar for iPhone apps, bar minimization, menus, Device Hub resize mode) | https://developer.apple.com/videos/play/wwdc2026/278/ |
| TN3192 | Migrating from the deprecated UIRequiresFullScreen key (updated 2026-10-09) | https://developer.apple.com/tutorials/data/documentation/technotes/tn3192-migrating-your-app-from-the-deprecated-uirequiresfullscreen-key.md |
| TN3208 | Launch screen requirement for App Store (iOS 27) | https://developer.apple.com/documentation/technotes/tn3208-preparing-your-apps-launch-screen-to-meet-app-store-requirements.md |
| TN3210 | Optimizing your app for iPhone Mirroring | https://developer.apple.com/documentation/technotes/tn3210-optimizing-your-app-for-iphone-mirroring.md |
| W24-147 | WWDC24 "Elevate your tab and sidebar experience in iPadOS" (tab bar vs sidebar design rules) | https://developer.apple.com/videos/play/wwdc2024/10147/ |
The X- sources are Apple's own Xcode skills (developer-facing, read 2026-10-26). Use them to check that a design can be built the way developers will build it; when a person questions an X- rule, read the file from the team folder if it is reachable.
Not yet read: "Build a great camera experience for iPhone Duo" (only needed for camera apps). The developer documentation pages (`developer.apple.com/documentation/...`) are blocked from the sandbox; use the talks instead.

---

## Apple knowledge base (condensed, with source tags)

### Device, displays, poses
- Two displays, each with its own front camera; a centre hinge. Poses: closed, open flat, partially folded like a book, seated like a laptop (inner display facing you), standing on its edges. [HIG, T466]
- **Outer display:** wider and shorter than other iPhones. Size classes: portrait = compact width / regular height; landscape = compact / compact. [T461, T466]
- **Inner display:** regular width / regular height; it ignores the app's supported orientations — decide layout by size class, never by orientation or device idiom. [T461]
- Design for **two size classes** (compact outer, regular inner), not a custom layout per pose. Avoid fixed widths, breakpoints, or metrics tied to a specific screen; use layout margins and safe-area insets. [HIG, T461, T466]
- The Figma sizes in this skill (outer 466 × 678, inner 951 × 669, fold at x ≈ 475, bar 84 pt, margin 20 pt) come from **Apple's Figma template**, not the HIG — treat them as the template's reference frame.

### Consistency across displays and poses
- Keep functionality and element state the same between displays; keep the information hierarchy. The inner display may show **one additional level of hierarchy** (Mail: list + message side by side). Don't limit functionality to one pose. "Apps should feel like a single experience adapting to the different display sizes and poses." [HIG, T466]
- Inner display is **not a stretched iPhone app**: use split views / two-column layouts that rearrange from a stacked layout when there is more width; an information-dense app may present its tab bar as a **sidebar** on the inner display. [T466, T461]
- **Keep controls' relative positions as similar as possible across poses** so people don't relearn where actions live. [HIG, T462]
- **Avoid extreme layout changes; favor small adjustments over rearrangement.** "Don't reinvent your app when it resizes; allow the existing layout to expand." [HIG]
- Optional seated (laptop) layout: media/visible content at the top, tappable controls on a stable base at the bottom — with the same controls and hierarchy as other poses. [T466, T463]

### Safe areas, margins, full-bleed
- Foreground/interactive content inside the safe area; **background art may extend behind bars** (full-bleed). [T461]
- Outer display: most content needs an offset so it isn't hidden behind the side controls (automatic with horizontal safe-area insets). **Exception:** immersive, highly visual layouts that don't scroll may centre on the full display, as long as no interactive element is blocked by the controls (e.g. Calculator). You can mix: full-width background/header + inset scrollable foreground; every interactive element must live inside the inset area. [HIG, T466]
- Safe areas and layout margins are **asymmetric** — foreground may sit closer to the vertical bar while the opposite margin is preserved; never assume equal insets on both sides. [HIG, T461]

### Reserved regions and the fold
- Reserved regions: **outer camera** (always present, top-trailing, expands into the Dynamic Island; side controls account for it automatically); **inner camera** (only while active — UI moves aside); **folding region** (only when partially folded; when flat it is inactive with zero width). [HIG, T463]
- When partially folded, content moves away from the centre: text and images shift away from the curve; **buttons and interactive elements move to the sides**. "Buttons are tough to tap when they land right in the fold." **Scrollable content doesn't need to avoid this region** — continuous scrolling content (articles, feeds, lists) does not displace. [T466, T463]
- System components avoid the fold automatically (sheets, alerts, menus, popovers, toolbar buttons, split views → even 50/50). Custom elements use the `ReservedRegion` API (SwiftUI) / `UIViewReservedRegion` (UIKit). [HIG, T461, T463]
- **Displacement rules:** choose the scope (a button → a whole container); elements that work together **move together** to preserve their relationship; don't move an element far from its source; keep things contextual (e.g. a search field stays over the view it searches). When folded, alerts go to the trailing side; in the propped pose the top region suits content seen at a distance, the bottom region suits interactive controls. [T463]
- **Grids:** prefer an even number of columns; keep outer margins and increase spacing around the hinge so each container stays in its region. [HIG, T463]
- **Audit centred layouts:** turn them into two columns or choose a displacement pattern. [T463]

### Split and arrangement layouts (what developers will use)
- Split views expand on the inner display and collapse to one pane on the outer display; they adapt their column widths to the fold. [HIG, T461]
- **ArrangementView** (iOS 27.1): holds a primary and a secondary view. **Split** arrangement = side by side when wider than tall, stacked when taller — use for a **main–detail** relationship (HStack/VStack-like). **Overlay** arrangement = one view over the other, side by side when folded — use for a **foreground/background** relationship (ZStack-like). Keep navigation containers outside arrangements; don't put arrangements inside List/ScrollView. [HIG, T463]

### Vertical bar (toolbars, tab bars, navigation)
- Toolbars, tab bars and navigation controls move to the **trailing side** on the outer display and on the inner display in landscape; the **inner display in portrait keeps horizontal bars**. The side region holds the Dynamic Island, status bar, toolbar (incl. navigation buttons) and tab bar, all sharing one vertical space. [HIG, T462, T466]
- Top-bar items go to the **top** of the vertical space, bottom-bar items to the **bottom**; the tab bar stays bottom-aligned. **Order at the top: primary navigation (Back / Close), then prominent actions (Done)**; remaining items keep their original groupings with a vertical spacer between top and bottom groups. [HIG, T462, T466]
- The bar is aligned with the hardware: same side in right-to-left languages. In Split View multitasking each app places controls along its **outer** edge (left app → controls on the left). [HIG, T462, T466]
- In split views only the **detail column** gets the vertical bar; controls that belong to another pane stay horizontal above that pane (HIG: "Locate controls near the content they affect"). Inspectors don't get their own vertical bar. [HIG, T462]
- Vertical bars have a **fixed width** and flexible item height → suited to **symbol-only** items. **Items with an icon go vertical; text-only items stay horizontal** (system Edit stays horizontal). Custom/complex views stay horizontal unless opted in with `axisBehavior(.verticalPreferred)`; force horizontal with `.horizontalOnly`. Items too wide for the side (a text button, a segmented control) stay in the nav bar. [HIG, T462, T466]
- **Keep text-based buttons to a minimum; prefer a symbol wherever one works.** Provide **both a title and a symbol** for each non-text item (the title is used in overflow/expanded forms). Test: does the text just reinforce the symbol, or carry standalone information? **Meaningful text (e.g. a cart price) → keep the control in the horizontal bar.** Replace inline counts with **badges** so the item can be symbol-only. [HIG, T462]
- A vertical bar has **no scroll-edge effect** by default (it gets a background only with Reduce Transparency) — keep custom content legible. Don't add manual spacing between items; group them. [HIG, T462]
- **Overflow:** items collapse into the system overflow menu (ellipsis) when space runs out — most often on the outer display in landscape, or with the keyboard / PiP. Items overflow bottom-to-top by default; assign visibility priority (groups first, then items); keep frequent actions (Compose, New Note) and status items (badges) visible longest. Navigation-focused views compress the toolbar first (keep tabs); task-oriented views minimise the tab bar first (keep toolbar actions). Move any custom overflow menu into the system one; reserve the ellipsis for overflow. [HIG, T462]
- Keyboard accessory bars stay attached to the keyboard. [T462]
- **Opting out** of the vertical bar (rare; "in general, don't override the default bar placement"): single-page bottom-heavy layouts like Calculator, or control-heavy sheets with a single item (e.g. only Close). [HIG, T462]

### Sheets and presentations
- Outer display: a sheet's toolbar is shown vertically; a sheet with a single toolbar button may disable its vertical bar — it then stops just short of the front camera and the status bar repositions. Inner display (landscape and portrait): sheets are **centred with horizontal bars**; sheets placed on the left get no vertical bar, on the right they get one. When folded, sheets slide off the fold. Popovers, context menus and alerts adapt to each pose. [T461, T462, T466]

### What developers will do (Apple Xcode skills) — design implications
- **The vertical bar is a lasting horizontal safe-area inset**, not a landscape condition: one side edge carries the whole inset, the other carries zero, and which edge changes with orientation and display. It can appear or disappear **without any change in screen size**. → Designs must not mirror the bar's inset onto the opposite edge, and specs say "inside the safe area", never "104 pt from the right". [X-RES safe-area]
- **No hard-coded bar sizes.** Developers delete literals such as 20 (status bar), 44 (nav bar), 64/88, 34 (home indicator), 49/83 (tab bar) and pin content to the safe area instead. → Redlines must not depend on those numbers; the Figma template values (84 bar, 20 margin) are references, not specs. [X-RES safe-area]
- **Layout switches by size class, never by device, model or orientation.** Two columns = horizontal size class **regular**; single column = **compact**. iPhone Duo inner display in 50/50 Split View multitasking reports **compact** width → it shows the outer (single-column) layout. Tight height = vertical size class compact. [X-RES orientation/idiom]
- **Full-bleed background and its content are separate layers**: background may run under the bar; text, controls and lists pin to the safe area. A design that puts content in the same layer as a full-bleed image can't be built cleanly. [X-RES safe-area]
- **Every screen must resize.** From iOS/iPadOS 27 (iOS 27 SDK), `UIRequiresFullScreen` **no longer opts an app out of resizing**: the system resizes the scene *discretely* (it waits until the person finishes dragging, then jumps to the new size) and still honours the declared orientations. So no screen can be designed as "full-screen only". (The X-RES skill says the key is "ignored"; TN3192 and W278 are the newer, exact wording — follow them.) The app also needs a **launch screen** (missing one → App Store upload rejected, ITMS-90870). [TN3192, W278, TN3208, X-RES]
- **Toolbar controls in iOS 27 SwiftUI** (developers can set these per item, so the design should say which): `visibilityPriority` high / low (what overflows first), `ToolbarOverflowMenu` (always in the ellipsis menu), `.topBarPinnedTrailing` (never overflows), `toolbarMinimizeBehavior` (bar minimizes on scroll down/up/never), `toolbarVisibility(.hidden, for: .statusBar)` (hide status bar, e.g. splash). [X-TB]

### Other resizable environments: iPad and iPhone Mirroring (optional scope — ask first)
- From iOS 27 an **iPhone app is fully resizable** when it runs **on iPad** and in **iPhone Mirroring on Mac**; it must adapt to any scene size at runtime. On iPad it stays in the **phone idiom**, so layout must follow size class and available space, not device type, and should use the extra space meaningfully. [W278]
- **Supported orientations are only a preference** and are ignored in these environments; iPhone Mirroring always reports portrait whatever the window's shape. Layout by size class, never by orientation. [W278]
- iPhone Mirroring input is trackpad/mouse: custom sheets and popovers must dismiss with a trackpad or scroll-wheel scroll (prefer system sheets); custom gestures need pointer equivalents; Face ID/Touch ID is unavailable from the Mac, so auth flows must allow approval on the Mac or a paired Apple Watch; support drag and drop between iPhone and Mac. [TN3210]
- Testing: Xcode 27's **Device Hub** (and Xcode Previews) has a **resize mode** — drag the device edges to try any size on a build. Apple still asks for testing on real iPad and iPhone Mirroring (macOS 27) before shipping. [W278]

### Tab bar → sidebar (iPhone apps, iOS 27)
- An iPhone app can opt its tab bar into a **sidebar** (`tabBarController.sidebar.preferredPlacement = .sidebar`). It's an app decision — people can't toggle it. The system shows the sidebar only when there is enough room (regular width: iPhone Duo inner display, iPhone app on iPad). [W278]
- **When the sidebar isn't available** (compact width: Duo outer display, Split View), any nested destinations it shows must be reachable somewhere else in the app. [W278]
- `prominentTabIdentifier` keeps one tab visible when the tab bar collapses during scroll — mark which tab that is in the design. [W278]
- Use a sidebar for **content-rich apps with deep hierarchies**; keep tabs consistent between iPhone and iPad; avoid too many tabs; tab groups/sections appear only in the sidebar; sidebar icons use **outline** SF Symbols, the tab bar uses **filled** (the system swaps automatically). [W24-147]
- **List → detail** screens (inbox, trips, garage, settings) suit the Mail pattern: list column + detail column, the vertical bar only on the detail column; linear flows (onboarding, step pickers, checkout) and single-focus screens don't. [HIG, T462, W278]

### Bars and menus (iOS 27)
- Navigation bars can **minimize on scroll**; the system decides by default, apps can choose always / never / on scroll down (`navigationBarMinimization`). Note the intended behaviour per screen. [W278]
- The **automatic scroll-edge effect** has new visuals and no longer switches between soft and hard; screens with a hand-made edge fade should be re-checked against it. [W278]
- **Menu item images are hidden by default** on iPadOS 27 and macOS 27 menus unless developers set `preferredImageVisibility`; don't design menus whose meaning depends only on icons. [W278]

### Multitasking, scenes, hinge (mostly developer-facing)
- All apps take part in Split View multitasking (50/50) on the inner display; PiP video can pin to the top and the app resizes vertically. New windows can be created only on the inner display. `CameraCaptureAccessory` can show extra UI on the outer display while the camera UI is on the inner display. Hinge status/angle (`onHingeChange`, `UIHingeInteraction`) is for interactions and effects, not for layout. [T464, T466]

---

## Phase 1 — Review (read-only)

### Gather
- `get_screenshot` of the node (use `enableBase64Response: true`; screenshot URLs are often not downloadable from the sandbox).
- A read-only `use_figma` walk of the node: name, type, x/y/w/h, layoutMode, sizing, instance main-component names, image fills. `get_metadata` can return an empty frame for absolute-positioned designs, so prefer the walk. If the node is a Section holding several states (e.g. a sheet state and a full-scroll state), review them together as one screen.
- List the screen's **bar items**: top toolbar (back/close, title, trailing actions — for each, whether it is symbol-only, text-only, or text + image, and whether the text carries information), bottom toolbar, tab bar (number of tabs, search tab).
- List the screen's **content actions** (CTAs inside the content) and the content block each one acts on.

### Check (measure, don't guess)
- **Height (outer, 678):** sum the stacked content from the first content element to the last action. Anything that must stay visible — primary CTA, purchase options, legal links, login link — must fit or be pinned to the bottom with the rest scrolling.
- **Width (outer):** content area ≈ 346–362 after the 84-pt bar and 20-pt margin. Flag fixed widths above that (common: 370-pt buttons and cards).
- **Fold (inner landscape, x ≈ 475):** flag **interactive elements and non-scrolling key content** (CTAs, cards, a centred hero subject) that would sit on it; a single centred column almost always does → propose two columns (or a displacement). Scrolling lists/feeds may cross it.
- **Bars:** map each bar item with the vertical-bar rules above — symbol items to the vertical bar in HIG order; text-only / text + image items stay in the **horizontal top bar** (Toolbar `Trailing`/`Leading` slot). Never silently strip text to make an item vertical; note that the HIG prefers a symbol where one works and leave "keep text vs symbol-only" to the team when the text carries meaning (upsell, price, count → or a badge). Keep original groupings.
- **Controls near their content:** on the inner display each CTA stays in the same column as the content it acts on, in the same order as on the outer display; related elements move together.
- **Hierarchy:** the inner layout must keep the outer's hierarchy; it may add one level (secondary column).
- **Reserved regions:** outer camera in the top-trailing corner (84 × 169 in the template); inner camera only while active (flag only for camera-centred screens).
- **Centering:** elements centred on the full screen width will look off-centre once the bar takes 84 pt — centre on the content area, unless the screen is an immersive, non-scrolling layout with nothing interactive under the bar.
- **Images:** source width vs. target (466 outer, 475 inner left half) → upscale factor and horizontal headroom; can the subject stay clear of the bar and the fold; is overlaid text still legible.
- **Structure:** `layoutMode: NONE` (absolute positioning) or GROUPs mean manual re-layout for every size — recommend auto layout (Apple: avoid fixed widths).
- **Decorative layers** anchored to the old 874-pt height (gradients, glows, edge effects) need re-anchoring. Remember the vertical bar itself has no scroll-edge effect.
- **Grids:** odd column counts on the inner display → recommend even.
- **Dev-readiness (Apple Xcode skills):** flag a layout that only works with equal side margins or that mirrors the bar's inset on the other side [X-RES]; content baked into a full-bleed image layer [X-RES]; spacing that relies on fixed bar heights (20/44/49/34…) [X-RES]; an inner layout that breaks when shown at half width (Split View → compact = outer layout) [X-RES]; a screen designed as "full-screen only" [X-RES]; no launch screen design in the flow [X-RES]. For every bar item, note its overflow behaviour — pinned, high, normal, low, or always in the overflow menu — and whether the bar minimizes on scroll or the status bar is hidden [X-TB].

### Report, then continue
Send the review (use `SendUserMessage` if available, so it shows verbatim before building starts):
1. One-line verdict.
2. **Lỗi nghiêm trọng** — numbered, with measured numbers, the fix, and the Apple source tag.
3. **Cần chỉnh** — numbered.
4. **Đã ổn** — short bullets.

**Ask about extra environments (always, once per run, before building):** "Bạn có muốn kiểm tra thêm cho môi trường iPad (app iPhone chạy trên iPad) và iPhone Mirroring (điều khiển iPhone từ Mac) không?" Put it in the same AskUserQuestion as any blocking decisions (option "Chỉ iPhone Duo (mặc định)" first). Only if the person says yes: add the checks from "Other resizable environments" and "Tab bar → sidebar" to the review, add an "iPad / iPhone Mirroring" section to the report, and include those points in the developer handoff note. Build extra frames for these environments only if the person asks and gives the sizes. If the person doesn't answer or the run is unattended, stay iPhone-Duo-only and mention the option in the report.

Then decide whether anything **blocks** the build — typically: how to crop a hero photo on the outer display, whether to drop a secondary section on the outer display, whether merging a sheet state into one screen on the inner display is acceptable, or whether a text bar button (e.g. Upgrade) keeps its text. If something blocks, ask at most 2 questions (AskUserQuestion when available, recommended option first) and wait. If nothing blocks, or the person said "just try" / "làm thử", take the recommended option, say which, and go straight to Phase 2. Default for text bar buttons when not asked: keep the text, place it in the Toolbar `Trailing` slot.

---

## Phase 2 — Build (Apple template first, content last)

Default variants: **outer-portrait and inner-landscape** only; build others only when asked (inner portrait uses horizontal bars). Everything structural comes from Apple's library and keeps Apple's auto layout — never hand-draw a frame, bar, status bar, toolbar, button group, tab bar or camera.

### Apple components (library "iOS and iPadOS 27")
| Use | Component | Import | Key |
|---|---|---|---|
| Screen template, outer | iPhone Duo/Standard/Outer - Portrait | component | `90917f6fad609a6f4743f64a9de49354e9bb503b` |
| Screen template, inner | iPhone Duo/Standard/Inner - Landscape | component | `28f968a8b6483d552ccf90cce38925300f61ad54` |
| Inner, folded check | iPhone Duo/Standard/Inner - Landscape - Folded | component | `2903b58d6eef6029138aacaf7eda364b03ad3fa0` |
| Modal sheet screens | iPhone Duo/Sheets/Outer - Portrait · Sheets/Inner - Landscape | component | `0c4ac45edaa058df19a28c6923c455b7dbeb63bc` · `9acfd7b65736830d9416c502938ab6ab7b7a2620` |
| Title bar | Toolbar - Top - iPhone Duo (Style: Title / Compact Large / Large Title / Title 2 Line; Sheet: True/False; booleans Show Title/Subtitle/Leading/Trailing/Status Bar/Reserved Region; slots Leading/Trailing) | set | `a91d71509492f6288f3018b69d9bd1c02d24c021` |
| Bar buttons | _Buttons - 48pt (Type: Symbol / Symbol - Prominent / Text / Text - Prominent / Button Group; Preferred Axis: Horizontal / Vertical; slot "Buttons") — **not importable by key** (private); use the template's nested `Button Group` and `swapComponent()` to a sibling variant from `mainComponent.parent` | set | `c00871386d373ca1acf93d5f6418ac3f9dc7f2fe` |
| Tab bar | Tab Bar - iPhone Duo (Tabs 2–5; Minimized; Type Default / Search Role / Prominent Tab). The template default is Tabs=5, Type=Search Role (4 tabs + search) | set | `b7c1d56972c8b30931710183e6d7583ca1d4e00f` |
| Status bar | Status bar - iPhone Duo (Type=Vertical) — already inside the templates | set | `4d9a643c0a0c3a00bc4a752f784b5d09fa102c53` |
| Camera | iPhone Duo/Outer Display Lens — already inside the outer template | component | `5e0583eccb0352930cc83ad080321f89e3f3b0ea` |

If an import fails, re-find the asset with `search_design_system` scoped to the iOS and iPadOS 27 library key (Apple republishes; keys can change).

What the Standard templates contain (all auto layout, keep it):
```
iPhone Duo/Standard/… (466×678 or 951×669)
├─ Vertical Bar          VERTICAL, gap 8, padding T24 R24 B24 L12, at x W−84
│  ├─ Camera Punchout    48×42 (outer only)
│  ├─ Top                VERTICAL gap 6 → Frame (VERTICAL gap 12) → Status bar - iPhone Duo, Button Group (_Buttons - 48pt, Type=Button Group, Vertical)
│  └─ Bottom             VERTICAL gap 12, aligned to bottom → Tab Bar - iPhone Duo
├─ Toolbar - Top - iPhone Duo   84 high (126–146 with Large Title)
│  ├─ Controls           HORIZONTAL row y 24, h 48 → Leading (SLOT) · Spacer · Trailing (SLOT) · Reserved Region - Camera - Right (44)
│  └─ Title and Subtitle
├─ Outer Display Lens          (outer only)
├─ Layout Guides and Safe Areas  20-pt margin, 84-pt safe-area inset, reserved region
└─ iPhone Duo                  device bezel (presentation only)
```

### Build steps, in order
1. **Section.** Find clear canvas space below the original (scan page children for overlaps) and create a Section named `<original name> · iPhone Duo` with a dark fill (≈ 0.17 gray) so the white labels read.
   - One screen: outer at (100, 100), inner at (706, 100), a label above each at y 56.
   - A whole flow or several screens: **one Section, outer screens in one row, inner screens in a second row**, in the same left-to-right order as the original, columns aligned (step = 951 + 140). Row titles "Outer · Portrait — 466 × 678 pt" / "Inner · Landscape — 951 × 669 pt" (SF Pro Bold 32, white) and the original screen name above each screen (SF Pro Semibold 20, light gray).
2. **Template.** Import the Standard template (or the Sheets template for modal sheets), `createInstance()`, append to the Section, then `detachInstance()` on that top-level instance only. Its nested Apple instances (status bar, button group, tab bar, toolbar, lens) stay linked — never detach those. Then, on the detached frame:
   - **remove the device mockup** (`iPhone Duo` instance) — screens are delivered without a bezel;
   - hide `Layout Guides and Safe Areas`;
   - set `clipsContent = true` (the template comes unclipped, so glows and art spill out);
   - rename to `<screen> · Duo · outer-portrait` / `· inner-landscape`.
3. **Bars — map the original's bar items onto Apple's components:**
   - **Title:** `Toolbar - Top - iPhone Duo` → `setProperties({ Style: "Large Title" (or match the original), "Show Title#12884:2": true, "Show Subtitle#5561:8": true/false })`. Set the title through the nested `Title` instance's TEXT property (`"Title#5827:0"`), then try to set that nested instance to FIXED width = title text width + 12 (its text has a STRETCH constraint and can render mirrored/off-screen). The resize may not stick inside the instance — check the screenshot; if the title reads correctly, leave it. If the original has no title bar (hero/onboarding/paywall/splash, or only a Back button), remove the toolbar.
   - **Symbol bar actions** (Back/Close first, then prominent actions such as Done, then the rest) → the template's vertical `Button Group`. For one action, swap it to `Type=Symbol, Preferred Axis=Vertical` (or `Symbol - Prominent` for a single prominent action); for several, keep `Button Group` with one Symbol per action in its `Buttons` slot (remove extras). Set each glyph (Back = U+100BF6; copy others from the original's SF Symbol text, loading SF Pro Medium first) and rename each to the action. Remove the Button Group if no symbol actions remain.
   - **Text or text + image bar actions** (e.g. an Upgrade pill, "Missed questions") → keep them horizontal: `tb.setProperties({"Show Trailing#12886:17": true})` (or Leading), find the `SLOT` named `Trailing` inside `Controls`, remove its default children, and append a **clone of the team's original button** so it stays linked and keeps its text and icon. Then make sure it clears the vertical bar: if its right edge (`Controls.x + slot.x + slot.width`) is beyond **bar x − 20** (outer 362, inner 847), add the overflow to `Controls.paddingRight`. Keep `Show Reserved Region` on.
   - **Bottom-bar actions / tab bar** → the `Bottom` group: for a tab bar, set `Tab Bar - iPhone Duo` `Type` (usually `Default`) and `Tabs` to match the original; for toolbar actions without tabs (e.g. Play, Share), replace the tab bar with `_Buttons - 48pt` symbol buttons (Preferred Axis Vertical), keeping the original grouping and order; otherwise remove the tab bar.
   - **Non-SF icons:** tab glyphs accept a font override (set the `Symbol#5735:8` property, then set the nested TEXT `fontName`, e.g. Font Awesome 6 Pro — check `listAvailableFontsAsync` first). The `_Buttons` Symbol glyph does **not** accept a font override (it stays SF Pro). For a team icon there, prefer the Trailing-slot route; otherwise blank the glyph and overlay a clone of the team's icon with `layoutPositioning = "ABSOLUTE"` inside `Vertical Bar › Top › Frame`, centred on the button, and call it out in the report.
   - **Status bar:** keep, unless the original has none (e.g. a splash) — then hide it.
4. **Content.** Insert content **below** the bars in layer order (index 0, 1, 2 … so Vertical Bar / Toolbar / Lens stay on top), then clone the original's content sections into it so the team's own components, styles and variables stay linked. Set the screen fill by copying the original's fill **with its variable binding** (not a hex). Any new frame, fade, filler or text inside the screen follows Setup step 4 (team variables, text styles, components). Use the layout patterns below.
5. **Fold guide** (inner only): a 1 × 669 rectangle at x 475, red (1, 0.23, 0.19), opacity 0.35, locked, named `_Guide · Fold (hide before export)`, inserted just under the Vertical Bar, and **set to hidden (`visible = false`) when the build is finished** — the layer stays in the file so designers can toggle it on to check the fold, but screens are delivered clean. During Verify, check against the fold position (x 475) by coordinates or by temporarily showing the guide, then hide it again.

### Layout patterns (content only)
**Outer portrait 466 × 678** — content column x 20, width ≈ 346 (the template's margin to the 84-pt safe-area inset).
- Pin must-see items to the bottom (20 pt from the edge) only when they would otherwise fall below 678; everything above scrolls in a clipping auto-layout frame, with a ~32-pt fade in the screen's background color (a gradient whose stops are bound to the same background variable) where it meets the pinned block.
- Hero photos and backgrounds may go full-bleed under the bar; crop to the subject, keep it clear of the bar and camera corner, fade the photo out behind overlaid text. Interactive elements stay in the inset area.
- Sheet-over-hero screens (non-modal detents): hero on top; white sheet from ~y 296 with 38-pt top radius and a grabber; scrolling content inside; extend the hero ~60 pt under the sheet so the rounded corners show the photo.

**Inner landscape 951 × 669** — split at the fold: left x 20…451 (or 0…475 for full-bleed media), right x 500…847. Apple's `Standard/Inner - Landscape - Folded` template marks the **Fold Avoidance Region at x 456…496** (40 pt) — buttons, cards and key content must stay outside it.
- **Primary content left, one additional level of hierarchy right** (Mail pattern). The left column carries the screen's main content **in the same order as the outer display**; the right column carries the secondary block (summary, stats, related list, detail).
- **Every CTA stays with the content it acts on** and related elements move together; never split a title/description from its buttons into different columns. Keep relative positions as on the outer display.
- Centre each column vertically when neither scrolls; otherwise top-align both at the same y. Scrolling lists may run under the fold region; buttons and cards may not.
- Sheet-over-hero screens usually lose the sheet on the inner display: show the detail content directly in the right column, and call this out in the report because it changes behaviour.
- Developer note for the report: the two-column split maps to an `ArrangementView` **split** (main–detail) or **overlay** (foreground/background) arrangement, which also stacks the same blocks on the outer display; custom elements that must avoid the fold use `ReservedRegion`.

**Recipes by screen type.** Content top under a Large Title toolbar = y 162 on both displays.
| Screen type | Outer portrait | Inner landscape |
|---|---|---|
| Hero onboarding (photo/illustration + title + page dots + CTA) | Hero art cropped to the top; text + dots + CTA pinned to the bottom; original edge-fade behind the text | Hero art fills the left half (0…475); text + dots + CTA together, centred vertically in the right column |
| Detail screen (hero image + title + description + CTAs + secondary section such as a study summary) | Same order as the original; CTAs right under the description; secondary section scrolls below | **Left:** image, title, description, CTAs (same order as outer). **Right:** the secondary section. Both columns centred vertically |
| Tab root with a header summary + long path/list (e.g. a learning path) | Header summary on top, list scrolls; tab bar in the vertical bar | Header summary (progress, level card) left; the path/list scrolls in the right column |
| List of options / cards | One column, scrolls; CTA pinned | Split the items into **2 columns** either side of the fold (left 20…451, right 500…847), extra spacing around the hinge; CTA bottom-right |
| Step in a selection flow (make / model / year…) | Summary (if any), then list or picker (scrolls); CTA pinned | Context on the left (title + selected-item summary, or empty if nothing is selected yet); the list or picker scrolls in the **right** column with its CTA bottom-right (the CTA confirms the picker, so it stays with it) |
| Small centred message with an animated icon (intro, loader) | Centred in the content area | Icon/animation centred in the **left** column; text (title, progress, checklist) centred in the **right** column |
| Custom alert / pre-prompt over content | Content top, alert below it, note at bottom; dim overlay full screen | **Aligned like the outer display:** explanatory content (title + description) at the outer's top y (24) in the left column; the alert top-aligned at the same y in the right column; its related note (e.g. privacy assurance) pinned to the bottom of the right column with the outer's bottom gap (20). Apple moves alerts to the trailing side when folded; overlay full screen |
| Long scrolling summary + sticky CTA | Content scrolls, edge fade + CTA pinned | Hero/heading left; cards scroll on the right with CTA pinned bottom-right; bottom edge fade spans the full width (no hard edge) |
| Full-bleed splash | Art scaled to cover width (×1.16), centred on the full width (no bar visible) | **Full screen, subject centred on the whole display** (immersive, non-interactive, brief — the accepted exception); fill the sides with **horizontally mirrored copies of the background layers only** (no subject) so there are no seams |
Overlays (dim layers, alerts) go below the Vertical Bar.

**Hero art technique:** create a frame "Hero" (clipping, target size) → inside it a frame "Hero Art" 402 × 874 (no clip, no fill) → clone the original's visual layers into it at their original x/y → `rescale(s)` → position. Cover for photos (s ≥ target width ÷ photo width), contain for illustrations. Pull overlay UI cards (notifications, badges) out of the scaled art and place them at 1× so they are not cut or enlarged. Check that the subject stays clear of the bar and the camera corner and that overlaid text still sits on the faded part of the image.

### Known pitfalls (seen in real runs)
- **Load fonts first:** collect every `fontName` from the original's text (`getStyledTextSegments(["fontName"])`) and `loadFontAsync` all of them before resizing text-holding frames or setting `textAutoResize`.
- **After `resize()` on an auto-layout frame** the primary axis becomes FIXED — set `primaryAxisSizingMode = "AUTO"` where it should hug.
- **Don't blanket-FILL children when widening a cloned block.** Resize the block, then only switch children that were full-width to FILL; restore every other child's original `layoutSizingHorizontal`/`layoutGrow` (e.g. icon containers must stay HUG, or the label drifts to the middle of a summary card).
- **Texts with FIXED width inside auto layout** (e.g. "Section heading" 370 wide) stay centred/overflowing after resizing — set them to FILL.
- **Free-floating texts** (not in auto layout) that were centred: set `textAutoResize = "HEIGHT"`, resize to the column width and keep `textAlignHorizontal`.
- **Non-auto-layout frames** (e.g. a progress block with a right-aligned count and a full-width bar): `resizeWithoutConstraints`, then move the right-aligned child to `width − childW − oldRightGap` and resize the bar to the new width.
- **Non-auto-layout rows with SCALE constraints** (e.g. year picker rows) squash their text on resize ("2025" wraps to "202 / 5"): set the text to `WIDTH_AND_HEIGHT` and re-centre it; refit background shapes to the new width.
- **Row labels that were HUG next to a FILL sibling** render centred in wider rows: set the label column and its inner frame to FILL/grow 1. Long labels that truncate in a narrower column: turn truncation off and let them wrap (`textAutoResize = "HEIGHT"`).
- **Centred hug blocks turn into stretched FILL when cloned** (e.g. a benefits list drifting left): reset `layoutAlign = "INHERIT"`, `layoutSizingHorizontal = "HUG"`.
- **Cloned FILL frames can collapse to 1 pt high:** set `layoutSizingVertical = "HUG"`.
- **Badges overflowing a card ("BEST OFFER") get clipped:** set `clipsContent = false` on every new ancestor and add ~10 pt top padding.
- **Fixed-width carousel cards:** resize each card to column − 32 and its header/body to card − 32; body text `textAutoResize = "HEIGHT"`.
- **Absolute GROUPs** (e.g. a zig-zag learning path 361 wide): move them as a whole; on the outer display place them so the right edge stays left of the bar (x ≤ 382 − group width), and flag the tight margin.
- **Hero crops:** IMAGE fills with `scaleMode: FILL` re-crop on `resize()`. For subject-focused crops, put the image in a clipping frame and clamp its position so it covers the frame: `x = min(0, max(frameW − imgW, x))`, same for y. If the original fades the photo with an alpha-gradient mask, clone that mask into the frame at index 0 (`isMask = true`), make it taller than the frame and shift it up so only the bottom fades.
- **Trailing slot on the inner template** still reserves the 44-pt camera region at the right of `Controls` (the inner camera only exists while active), which pushes a 100-pt pill ~4 pt into the vertical bar — always apply the `paddingRight` fix from step 3.
- **Sheet frames** taken from a sheet instance may have no fill — bind the fill to the background variable (team background, or Apple's system background variable), never a raw white.
- **Extending art or filling gaps** (e.g. widening a banner whose photo can't stretch): use a team color variable for the filler and bind gradient stops to it; flag it in the report.
- **Cloned layers keep their bindings** — don't overwrite a cloned node's fills/text with raw values when resizing; only change size and position.
- **Dark-mode screens:** copy the original frame's `explicitVariableModes` onto the new Duo frame (e.g. the team's semantic color collection → Dark) **and** set Apple's "Colors" collection (iOS and iPadOS 27 library — the one the Duo status bar text is bound to) to its Dark mode; otherwise the status bar stays black on a dark background.
- **Status bar blur:** Apple's vertical status bar has its own "Blur" layer; over photos it shows as a soft pill. It is Apple's design — leave it unless asked.
- **Screenshots:** only after the write call has returned; never in parallel with edits.

### Verify
Screenshot **every** new screen individually (a whole-section screenshot is too small to judge). Check: Apple bars present and linked (status bar, button group / tab bar, lens on outer); symbol items vertical in HIG order, text items in the horizontal bar and 20 pt clear of the vertical bar; titles readable and not mirrored; nothing clipped, overlapping, squashed or truncated; centred items still centred; badges visible; every CTA in the same column as the content it acts on, same order as outer; no button or card inside the fold avoidance region (x 456…496); fades and glows re-anchored; no device mockup. **Token check:** run one read-only pass over each new screen and list every fill/stroke without a bound variable or paint style, every text without a text style (or with a font family different from the original's), and every padding/gap/radius that has a matching team variable but isn't bound — presentation layers excepted. Fix them, or report the ones with no matching token. Fix with targeted edits, then re-screenshot only the screens you changed.

---

## Phase 3 — Critique loop (independent critic sub-agent) — OPTIONAL

**Only with permission.** Do not run this phase automatically. After the build and the Final report, offer it in one line (e.g. "Bạn có muốn chạy thêm vòng critic độc lập để chấm điểm và gợi ý cải thiện không? Mất thêm vài phút.") and wait. Run it only when the person says yes, or when they asked for a critique in their request. In unattended runs, skip it and mention it as an option in the report.

Method from Anshu Chimala's guest post on Lenny's Newsletter (https://www.lennysnewsletter.com/p/how-to-turn-your-ai-into-a-world), Technique 3 "Design critic": the agent that built the screens is biased by its own decisions, so a **separate critic in a fresh context, given only screenshots**, judges the result; the builder revises; repeat. Adapted here for iPhone Duo.

### Rules of the loop
- **Fresh context, screenshots only.** The critic never sees the Figma scripts, layer names, this skill's build steps, earlier iterations or earlier critiques. Spawn a **new** sub-agent every round (Agent tool, `general-purpose`, `run_in_background: false`, no `model`/`effort` overrides unless the person asks) — never continue a previous critic with SendMessage.
- **Same prompt every round** (the template below, filled in; nothing else added).
- **The stopping score is never told to the critic.** Stop when the critic scores **every Duo screen ≥ 9/10**, or after **2 rounds**, or earlier if two rounds in a row don't raise the score — tell the person the score instead of chasing it.
- **Team decisions win over the critic.** Before applying a finding, check it against decisions the person made in this conversation or recorded in this skill (e.g. full-screen splash on the inner display, ATT alignment, CTA placement). Don't apply findings that undo them; list them in the report as "critic disagrees with team decision" so the team can reconsider.
- **Apple sources win over taste.** Reject findings that would break an HIG/Tech Talk rule (e.g. moving a button onto the fold, putting text buttons in the vertical bar).
- Give the critic outer and inner screens in the **same state** (e.g. both with the same items selected); a mismatched pair gets scored as a bug.
- In the report, separate low scores caused by team decisions from real issues.
- The builder (you) applies the accepted findings with targeted edits, re-screenshots only the changed screens, and runs the next round on the **full set** again.

### What to give the critic
1. Screenshots saved as image files (the `[Image: source: …png]` paths that `get_screenshot` returns with `enableBase64Response: true`):
   - the **original iPhone screen** (reference for intent, brand and content — not a target to copy);
   - each **outer-portrait** screen;
   - each **inner-landscape** screen, plus one copy with the `_Guide · Fold` layer temporarily visible (hide it again right after);
   - **baseline references** from Apple's Figma kit "iOS and iPadOS 27 (Community)" (fileKey `PtEpwPRO5wtY8BlBqerjai`, page "Examples", section "iPhone Duo": the Tab Bars and Toolbars examples, outer portrait + inner landscape) so the critic calibrates against Apple's own Duo layouts. They are a baseline, not a target.
2. A one-line description of each image (which screen, which display, its size in pt). Nothing about how it was built.

### Critic prompt (use verbatim, fill the {…})
```
You are a principal product designer on Apple's design team, reviewing screens adapted for iPhone Duo, Apple's foldable iPhone. Read every image file listed below with the Read tool before answering.

Images:
{numbered list: path — what it is (e.g. "Original iPhone screen, 402×874 pt" / "Duo outer display, portrait, 466×678 pt" / "Duo inner display, landscape, 951×669 pt" / "same, with a red line marking the hinge" / "Apple reference: …")}

Context you need: the outer display is compact width; the inner display is regular width and folds down the middle (the hinge band is x 456–496 pt on the inner display). On both, toolbars, tab bars and the status bar sit in a vertical bar on the right edge (84 pt). When half-folded, buttons and cards must not sit on the hinge; scrolling lists may. The inner display may add one level of hierarchy (e.g. two columns) but must keep the same content, controls and order as the outer display. The Apple references show how Apple itself lays out Duo screens; use them as a baseline, not a target.

Do this:
1. In one sentence, name the visual language and intent of the original screen.
2. Imagine how Apple's own design team would ship this exact screen on iPhone Duo, outer and inner. Keep it in mind as the bar.
3. Judge each Duo screen at two levels: (a) structure and composition — hierarchy, column balance, use of the wide inner display (no stretched iPhone layout, no dead half, no crammed column), what sits on the hinge, consistency between outer and inner; (b) fine details — alignment, spacing rhythm, margins near the vertical bar, type scale and line breaks, contrast and legibility over images, image crop and scale, truncation, clipped or overlapping elements, touch targets.
4. Penalize anything that looks generic, overdone, inconsistent with the original's brand, or obviously machine-made (stray gradients, glows, extra containers, awkward seams).
5. Be bold and opinionated, not safe. Be tight and specific: no vague prose.

Answer in exactly this format:
INTENT: <one sentence>
SCORES: <screen name> — <0–10> (one line per Duo screen; 10 = Apple studio quality)
FINDINGS (most important first, max 10):
- [severity: critical | major | minor] <screen> · <element> — <what is wrong, with approximate pt values> → <specific fix>
KEEP: <up to 3 things that already work and must not change>
```

### Report the loop
In the final report add: the critic's last scores per screen, the number of rounds, the findings you applied, the findings you rejected and why (team decision / Apple rule), and any remaining critical or major findings the team should look at.

## Final report
- Where the new Section is; the original is untouched.
- What changed on each screen (short bullets), including how each original bar item was mapped (vertical vs horizontal, and the source tag behind it).
- Issues found while building, with numbers (e.g. subject reaches ~20 pt under the bar, image upscale ×1.12), and decisions the team must confirm (e.g. keep text on an upsell button vs symbol-only or a badge).
- A short developer handoff note per screen: size class behind each layout (outer = compact width, inner = regular width; inner in Split View = compact → outer layout); ArrangementView split/overlay; which custom elements need `ReservedRegion`; for each bar item `axisBehavior` and its iOS 27 toolbar setting (`visibilityPriority` / `.topBarPinnedTrailing` / `ToolbarOverflowMenu`); `toolbarMinimizeBehavior` if the bar minimizes; status bar hidden via `toolbarVisibility(.hidden, for: .statusBar)` where the design hides it; navigation bar minimization per screen; sidebar opt-in (`sidebar.preferredPlacement = .sidebar`) and `prominentTabIdentifier` when the app has a tab bar; menu items that need `preferredImageVisibility = .visible`; a launch screen exists. Remind that content is pinned to the safe area, not to fixed numbers. [X-RES, X-TB, W278, TN3208]
- If the person opted into iPad / iPhone Mirroring: a short section with those findings (resizing, orientation, sheets and gestures with trackpad/mouse, biometric auth, drag and drop) and a reminder to test in Device Hub resize mode and on real devices. [W278, TN3210]
- Critique loop result (only if Phase 3 was run): critic scores per screen, rounds run, findings applied / rejected (with reason). If it was not run, end with the one-line offer to run it.
- Design-system mapping: which team library was used, and any value that couldn't be mapped to a team token (with what was used instead) for the team to confirm.
- Note that each inner screen has a hidden `_Guide · Fold` layer they can turn on to see the fold.
- One concrete next-step offer.
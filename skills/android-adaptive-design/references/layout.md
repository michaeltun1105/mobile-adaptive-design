# Layout knowledge (condensed, with source tags)

Read for Phase 1 checks and Phase 2 layout decisions.

### Units and grids
- Specs in **dp**, fonts in **sp** (sp follows the user's font-size setting). Never px. [GRID]
- Baseline grid: **8dp** for layout, components and spacing; **4dp** for icons, type and small elements. [GRID, TR]
- Grid types: hierarchical (clear importance, e.g. detail/editorial), modular (equal items, e.g. gallery), column (flexible one-direction). Whatever the type, the grid adapts per size. Don't make the layout grid too fine — use the baseline grid for spacing. [GRID, CS]
- Recommended aspect ratios for images/surfaces: **16:9, 3:2, 4:3, 1:1, 3:4, 2:3**; keep them consistent. [GRID]

### Window size classes (decide by width first, then height)
- Width: **Compact < 600dp** · **Medium 600–839dp** (tablet portrait, unfolded inner display portrait) · **Expanded 840–1199dp** (tablet landscape, unfolded inner display landscape) · **Large 1200–1599dp** · **Extra-large ≥ 1600dp**. Height: Compact < 480 · Medium 480–899 · Expanded ≥ 900. [WSC]
- Classes come from the **window**, not the device; split-screen, windowing and folding change them. Layouts still flex between breakpoints. [WSC, LABC]
- **Never lock to portrait** (looks like a bug, letterboxing in multitasking). [ADP, POS]

### Grid per size class (KIT `Examples/Layout grid`)
| Class | Kit frame | Columns | Gutter | Margin | Notes |
|---|---|---|---|---|---|
| Compact | 360 × 640 | 4 | 16 | 16 | Phone screens in KIT/NIA are 412 wide; TR says design at 412, test at 360 |
| Medium | 600 × 800 | 8 | 16 | **24** (kit says 32 — outdated) | With navigation region: grid right of the rail |
| Expanded | 905 × 680 | 12 | 24 | 24 | With navigation region: kit says gutter 12, margin 32 — use 24 / 24 |
| Large | 1280 × 720 | 12 | 24 | **24** (kit says 200 — outdated) | |
| Extra-large | 1600 × 900 | 12 | 24 | 24 | |
- **Margins and spacers per M3 (May 2026):** Compact margin 16; Medium, Expanded, Large, Extra-large margins **24** and spacer between panes **24**. [BP]
- Content stays inside the margins. Keep text at **40–60 characters per line** at every breakpoint (adjust margins and type). [BP, CS, TR]

### Regions, safe areas, edge-to-edge
- Screen = **system bars + navigation region + body**; the body continues under navigation and system bars. Always put system bars in designs as the top layer. [ANAT, LB, SYS]
- Honor safe areas: display cutouts, edge-to-edge insets, edge displays, keyboard, system bars. [LB]
- **Edge-to-edge**: backgrounds, scrolling content, dividers and solid app-bar backgrounds draw under system bars and into the cutout; text, buttons and critical UI are inset. Horizontal carousels scroll through the cutout. [E2E]
- **No tap or drag targets under system gesture insets** (screen edges / bottom). [E2E, SYS]
- Status bar: transparent when nothing scrolls under it or an image is behind; **translucent when content scrolls under it**. Each pane with a different background gets its own matching gradient protection; the navigation drawer gets its own; never stack two protections. [SYS, E2E]
- Gesture navigation bar: **always transparent, no background, no extra scrim**. 3-button bar: transparent when there is a bottom bar or nothing scrolls under; translucent for scrolling content; add a scrim when a bottom app bar animates away. [SYS, E2E]
- Top app bars collapse on scroll (small → status-bar height or off screen; medium/large → small). Bottom app bars collapse on scroll. [E2E]
- Keyboard: move the focused input up or attach it to the keyboard; never hide inputs behind it. [LB, CS]
- Immersive (hiding system bars) only for video, games, images, books; always a tap to bring UI back; never permanent; scrim behind overlaid text and controls. [IMM, SYS]

### Layout basics and content structure
- Keep primary navigation and key actions in reachable areas; a FAB is the prominent reachable action — one per screen, pinned (stays visible on scroll). [LB, NAV]
- Containment: implicit (white space) or explicit (cards, dividers, surface fills). Consistent spacing between like elements. Don't overload a view with actions. [LB, CS]
- Notate how content sits in its container (alignment, constraints) and **how each image scales and crops**. [LB, CS, IMG]
- Content may be 1-D (rows/columns, flex wrap for chips/filters) or 2-D grids; combinations are fine (carousel + vertical cards). [CS]
- Fixed (pinned) elements for focus: FAB, input attached to keyboard. [CS]

### Adapting
- Three methods: **reflow**, **reveal**, **presentation change** (bottom sheet → side sheet). [ADP]
- **Max width** on content and components; buttons and inputs never stretch; text lines ≤ ~60 characters. [ADP, LABC]
- Panes: Compact 1 · Medium 1–2 · Large+ multiple. Think in panes even without splitting. [ADP, POS]
- Scale type, icons and grid items with the screen (a phone grid of thumbnails becomes cramped on a tablet). Codelab: title → Display large, body → Body large / 24sp, small icons → 40dp. [ADP, LABC]
- Adapt at component / pane level, not by redrawing whole screens per size, input or posture. [ADP]

### Canonical layouts
- **List-detail**: compact shows list *or* detail; larger shows both. For messaging, contacts, files, any list that reveals detail. NIA 905 × 724: rail 80, list 399 at x 96, detail 362 at x 519 (24 apart). LAB 1280 × 800: content from x 172, left pane 552, detail 457 (24 apart). [CL, NIA, LAB]
- **Feed**: equivalent items in a grid (list or grid on compact); rigid or staggered, but consistent spacing. LAB 840 wide: content 700 from x 116; featured card full width, then 2 × 334 with 24 gap. [CL, LAB]
- **Supporting pane**: on compact, supporting content is a sheet or dialog; on larger screens the supporting sheet opens as a pane. LAB "Today": cards 552 left, wishlist pane 457 right, full-width tip card above. [CL, LAB]
- Contained pane: surface-container fill, **corner radius 24, padding 16**; spacer between panes **24**. [LAB, NIA]
- WebViews: prefer opening the browser. [CL]

### Navigation
- Primary: **navigation bar** (3–5 destinations, same level) or modal **navigation drawer** (more than 5, less ideal — top reach on compact). Secondary: tabs, bottom app bar. [NAV]
- Navigation bar → **navigation rail** on large screens. **Don't use the bottom navigation bar on large screens.** Medium (incl. landscape) may use the rail or a horizontal navigation bar. [NAV, POS]
- Measured: rail **80** wide; drawer **256** wide around 1440; content max **1080** at 1440 (NIA body at x 308). [LAB, NIA]
- Actions: highest-importance → FAB (one); secondary → top bar or inline near related content; rare → overflow menu. [NAV]
- Primary navigation always shows on parent views; child views use the up arrow (not the same as system back); full-screen modals use close. [TR]

### Postures, orientation, cover screens
- **Landscape**: edge-to-edge; choose rail or horizontal nav bar; reflow or change density; landscape can use medium-width UI. Letterbox fixed-ratio content in a container; **if content didn't scroll in portrait, don't make it scroll in landscape**. Containers can rotate in place; a hero image can take the prominent space and stick. Filter sheet → side sheet, or stays full-screen with 2 columns. [POS]
- Postures: **flat** (unfolded, usually medium/large), **folded** (outer screen, usually compact), **tabletop** (half-folded horizontally — large controls, landscape video). The app doesn't need a layout per posture, but can use one (e.g. media player tabletop + cover UI). [POS]
- **Hinge**: make the app hinge-aware so content isn't lost in the hinge. Single-pane layouts may not need it, but check that **controls and text avoid the hinge**. In two-pane layouts **use a wider gutter at the hinge** (e.g. list-detail). Trifolds have several hinges. [POS]
- **Cover screens** (square-ish, flip phones): edge-to-edge, nothing under camera cutouts, focused use cases; hero art can become the background; with the keyboard up, the message is the focus; filter sheet full-screen with adapted buttons; a small **rail can be more ergonomic** on a cover screen and avoids system UI/cutouts. Do continue UI under system UI; don't stop UI before the system bars. [POS, NAV]

### Images and graphics
- No text baked into images; vectors first; raster exports for mdpi ×1, hdpi ×1.5, xhdpi ×2, xxhdpi ×3, xxxhdpi ×4; lowercase asset names, no resolution suffix, icons `ic_…`; small icons include intrinsic padding (24dp icons). [IMG, GRID]
- Sufficient scrim between background images and text. [IMG]
- Scaling modes: Fit, Crop, FillHeight, FillWidth, FillBounds, Inside, None. **Responsive cropping** per breakpoint: keep one ratio, change ratio (e.g. 1:1 → 16:9), or keep a fixed height with fluid width. A full-width hero on a phone fills the whole landscape screen — avoid; constrain portrait-only media and balance the white space. [IMG, CS]
- Blur only on Android 12+ and costly; tint one asset instead of many colored copies. [IMG]


### M3 Expressive (read 2026-10-27)
- What it is: an **evolution of M3, not "M4"** — M3 is not deprecated. New/updated components, motion physics, emphasized type, more shapes, richer color, plus design tactics for emotionally engaging UX. Backed by 46 studies / 18,000+ people: expressive screens are preferred across ages and key UI elements are spotted up to **4× faster**. [M3X]
- **14 expressive components** — new: **Button groups, FAB menu, Loading indicator, Split button, Toolbars**; updated: App bars, Common buttons, Extended FAB, FABs, Icon buttons, Navigation bar, Navigation rail, Progress indicators, Sliders. More configurations, shape options, emphasized text. [M3X]
- **Motion springs**: spatial springs for movement (mirror real physics), effects springs for color/opacity. Note them in the prototype/handoff; Figma frames stay static. [M3X]
- **Emphasized typography**: extra type styles (`…-emphasized` in the kit) to reinforce hierarchy and draw attention to key actions or info (e.g. "begin recording", unread counts); supports bold editorial layouts. [M3X]
- **Shape library**: 35 shapes for decorative detail (image crops, avatars) with **shape morph** (e.g. square → circle on press/select). Mix round and square corners for tension/contrast. [M3X]
- **Vibrant color**: contrast between primary / secondary / tertiary roles and surface tones to sharpen hierarchy and clarify key actions. [M3X]
- **7 tactics** (each is one axis; combine sparingly): 1 use a variety of shapes — break from the surrounding shape to draw attention; smaller shapes make essential actions look less important · 2 rich, nuanced color — contrast for the main takeaway; without contrast elements blend · 3 guide attention with type — heavier weight, larger size, color, spacing for headlines and actions · 4 contain content for emphasis — logical groups/containers; the most important content gets the most space and the brightest surface · 5 fluid, natural motion — shape morph, surface effects, springs · 6 component flexibility — shift controls to the context; adapt to foldables and large screens with canonical layouts · 7 **hero moments** — combine tactics on the 1–2 most critical, emotionally impactful interactions only; too many overwhelm. Ask: is it emotionally impactful? is it a key interaction? [M3X]
- How this skill applies it: **keep the team's brand** (colors, fonts, imagery) and use Expressive *structure* — toolbar instead of an iOS action bar, button group instead of segmented/chip filters, FAB / extended FAB / split button for the one primary action, emphasized type for the key number or headline, contained panes with the brightest surface for the main content, the Expanded nav rail on Expanded screens. Propose at most 1–2 hero moments per flow and name them in the report. Don't add decorative shapes or new colors without asking.

### Expressive layout system (Google I/O 2026; M3 pages updated May 2026)
- **Naming:** "window size classes" are now **breakpoints** (Compact < 600, Medium 600–839, Expanded 840–1199, Large 1200–1599, Extra-large ≥ 1600; height breakpoints exist on Android but are rarely needed). Design for breakpoints, not devices; rotating or unfolding changes the breakpoint. [BP]
- **Scaffold = bars + rails + panes**, next to **safety regions** (system UI; no primary content there). [SCF]
  - **Bars** frame the screen: app bar on top (title + 1–2 essential actions), navigation bar at the bottom (3–5 views, compact/medium only). Bars can span one pane or the full window.
  - **Rails** fill the perimeter around panes or float above them: on compact the top/bottom rail region holds toolbars, chat inputs, FABs (a toolbar floats above the navigation bar); on larger screens the **leading rail** holds the navigation rail and the **trailing rail** can hold a vertical toolbar or supporting controls. In XR rails become orbiters.
  - **Panes** hold content; 1–3 visible. **Fixed** (width doesn't change) or **flexible** (grows/shrinks); every layout needs ≥ 1 flexible pane. Permanent or temporary (dismissible).
- **Recommended panes:** Compact 1 · Medium **1** (2 allowed) · Expanded **2** (1 for dense content / video) · Large 2 · Extra-large 2 (1 or 3; third = standard side sheet, max 400 wide; never more than 3). [SCF, BP]
- **Two-pane types:** [SCF, BP]
  - **Split-pane**: two flexible panes, **spacer visually centred** — best for foldables. With a rail or drawer, rail + first pane = 50% of the window, second pane = 50%. With a navigation bar or no navigation, each pane 50%.
  - **Fixed-and-flexible**: fixed pane **360dp** at Expanded, **412dp** at Large/Extra-large; either order; the fixed pane is often temporary (side sheet, light list).
  - Resizing with a **drag handle**: snap widths 360, 412, or centred split. Persistent resizing (remember width, even across breakpoints) for most layouts; temporary resizing (reset on close) for supporting panes.
- **Medium specifics:** single pane recommended. Two panes only for **low-density** content (e.g. settings); then **50/50** and use a **navigation bar** (not a rail) so panes get full width. Single pane → navigation rail at the leading edge. Rail may hide on secondary destinations if back reaches the primary. [BP]
- **Expanded specifics:** two panes usually best; navigation rail collapsed or expanded; sorting/filtering/secondary nav as tabs or components **inside the pane**. [BP]
- **Reachability (Medium landscape / unfolded):** the **top 25%** of the screen is hard to reach — keep essential interactions out of it; also avoid the very bottom edge. [BP]
- **Component swaps across breakpoints** (only functionally equivalent ones): navigation bar (compact) → **collapsed navigation rail** (medium/expanded) → **expanded navigation rail** (large/extra-large; or standard expanded rail at expanded); modal expanded rail allowed at compact/medium. Full-screen dialog (compact) → **basic dialog** (medium+). Supplemental selection: **bottom sheet** (compact) → **menu** (medium+). Never swap a button for a chip or a menu. [BP]
- **Adapt by asking 5 questions:** what to **reveal**, how to **divide**, what to **resize**, what to **reposition** (e.g. actions from the bottom to the leading edge), what to **swap**. [BP]
- **How panes adapt:** show/hide; **levitate** (float above content — default on large screens, scrim optional; docked panes like bottom sheets become floating or co-planar at medium/expanded, prefer co-planar on large); **reflow** (supporting pane moves below in portrait). Displays: co-planar, floating, docked. Focus order follows the visual order; modal floating panes trap focus and return it to the trigger. [SCF]
- **Canonical examples:** [CE]
  - Feed: compact stacks cards full width; medium adds columns (e.g. 4 equal); expanded+ more/wider columns; items reflow by position.
  - List-detail: Compact 1 pane; Medium 1 (2 for quick browsing — then navigation bar or modal rail); Expanded+ 2. Back button only in single-pane; **selected state only in two-pane**; no selection → detail pane shows an **empty state**; unfolding with a selection shows that detail; folding shows the detail view; keep scroll positions.
  - Supporting pane: primary ≈ two-thirds. Compact/Medium: supporting content **below** the primary (or a bottom sheet on compact); Expanded: **beside** it, **fixed 360dp**. Use only when the secondary content is meaningful relative to the primary; parent-child content → list-detail.
  - Custom layouts: layer panes with levitate for focused tasks (basket, comments, new event).
- **Grids & rulers:** columns grow with breakpoints (4 compact, 8 on an unfolded foldable). Fill the scaffold from the edges in: bars & rails first, then panes. **Rulers** = global alignment lines: margin, bar/safety, **title** (aligns the app bar title), **content** (first = hero/headline/primary component; secondary = supplementary text/actions). Margin rulers can narrow or widen for expressive moments (e.g. full-bleed photo grid with wide-margin search). [GS]
- **Spacing system:** 8dp scale, **space100 = 8dp** (range 0×–9×; nested 0.25×/0.5×/0.75×/1.25× = 2/4/6/10dp). Spacing = **padding** (inside), **gap** (between), **margin** (outside; rarely inside components). Use leading/trailing (RTL-safe). Keep the same spacing when text scales to 200%. Tokens exist in Jetpack Compose only; in Figma use 8dp multiples. [SP]
- **Spacing as expression:** group by proximity, rhythm, similarity (same-size thumbnails/leading elements, aligned), continuity (rows of chips); give key content generous negative space and the brightest surface; keep focal points in consistent places across screens. [GS]
- **Density:** opt-in only, never automatic across breakpoints; density −1/−2/−3 removes 4dp of vertical padding each; targets stay ≥ 48×48; no extra density in menus, snackbars, dialogs. [GS]
- **Also new:** expressive **lists** and **menus** (vibrant styles, flexible configurations), expressive **search** and **search app bar** (contained style with a persistent filled container), watch and XR guidance; Material Android is **Compose-first** (stable Compose Material 3 with the 14 expressive components). [IO26]

### Compact (Android phone) specifics [BP, SCF, NAV, TR, E2E]
- Frame **412 × 915** (Pixel-class phone; test layouts at 360 wide). One pane, margins **16**, content in a single column.
- **Bars:** status bar (52) on top, top **App bar** (Small; title left-aligned; up arrow on child screens; 1–2 actions + overflow), bottom **Navigation bar** (3–5 destinations, Vertical items, 80 high) above the gesture bar (24). The navigation bar shows only on top-level destinations; child screens hide it and use the up arrow.
- **Rail region on compact:** a floating **Toolbar**, chat input or **FAB** sits just above the navigation bar (or above the gesture bar on child screens), 16 from the edges; keep it out of the gesture inset.
- **Communication:** full-screen dialog for complex tasks (forms such as Edit drive: close icon at leading edge, title, Save text button trailing) or basic dialog for short confirmations; **supplemental selection → bottom sheet** (modal, drag handle, top corners 28) — e.g. Filter & sort, Select month, context actions.
- **Navigation drawer** only when there are more than 5 destinations (modal). Tabs sit under the app bar.
- Reachability: primary actions in the bottom half (FAB, toolbar, bottom sheet buttons); nothing tappable under the gesture inset; targets ≥ 48.
- Edge-to-edge: content scrolls under a translucent status bar and under the transparent gesture bar; the navigation bar background extends under the gesture bar.


### Layout patterns
| Screen type | Compact 412 × 915 | Medium 600 × 800 | Expanded 905 × 680 |
|---|---|---|---|
| List + detail (e.g. trips → trip details) | List screen with navigation bar; tapping opens the detail screen (up arrow, no navigation bar) | One pane: the list; detail opens as its own screen (back button). Two panes only for quick browsing — then 50/50 with a navigation bar | **List-detail, split-pane**: rail + list = 50%, spacer centred on the hinge, detail 50%; selected state on the list item; empty state in the detail pane when nothing is selected |
| Detail (hero, title, description, CTAs, secondary section) | One column, margins 16; primary CTA as FAB / extended FAB or a floating toolbar above the gesture bar | One column on the grid (6–8 cols), CTAs under the description; supporting content **below** | **Supporting pane**: primary ≈ ⅔ (hero, title, description, CTAs — phone order) + supporting pane **fixed 360** beside it |
| Feed / cards | 1 column of full-width cards (2 for small tiles) | 2–4 columns, optional full-width featured card | More/wider columns; featured card spans the row |
| Form / settings / one-task step | Full-screen dialog (close, title, Save) or a child screen; inputs full width | One column, max ~6 cols, CTA with the form (settings may use 2 panes 50/50) | Context left, form right with its CTA; or one centred column |
| Onboarding / paywall / hero | Art top, text + full-width CTA at the bottom | Art top, text + CTA below, CTA max width | Art left half, text + CTA right half, centred vertically; nothing interactive on the hinge |
| Filters / options sheet | Modal bottom sheet (drag handle; Save/Cancel at the bottom) | Menu for short option lists; side sheet or full-screen with 2 columns for long filters | Side sheet (fixed 360) or filters inside the pane |
| Dialog / alert | Basic dialog (280–312 wide) + Scrim | Basic dialog centred + Scrim (full-screen dialog only on compact) | Basic dialog centred + Scrim |
| Supplemental selection (pickers, small choices) | Bottom sheet (or menu for 2–5 short items anchored to the trigger) | **Menu** (bottom sheet only on compact) | Menu |
| Media / video | Full width 16:9; immersive in landscape | Letterbox in a container; don't add scrolling that portrait didn't have | Same; tabletop variant only if asked (video top, large controls bottom) |

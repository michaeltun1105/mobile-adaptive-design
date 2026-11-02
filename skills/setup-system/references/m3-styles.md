# M3 Styles — colour, type, shape, elevation, icons, motion, spacing

Read when setting up a system, mapping colours/text to components, choosing shapes or icons, or writing motion notes in a handoff. Source: every page and tab of m3.material.io → Styles (read 2026-11-02). Tag [ST]. Values are Material defaults, never product values — product values come from the saved system.

## Colour
**How it works.** One **source colour** (wallpaper, in-app content, or hand-picked brand) → MCU algorithm → 5 key colours (primary, secondary, tertiary, neutral, neutral variant) → tonal palettes (tones 0–100) → tones assigned to **26+ colour roles** for Light and Dark. Tone sets contrast: tones ~40 apart ≈ 3:1, far apart (e.g. 30 vs 98) ≈ 7:1. **HCT ≠ HSL** — never compare HSL lightness to HCT tone.
- **Three contrast levels** (standard, medium, high) are tokenised; custom components get them free by using roles (e.g. Primary Container + On Primary Container). Build only Light/Dark unless asked.
- Light-theme On-container roles (On Primary/Secondary/Tertiary/Error Container) are now more colourful (Aug 2024). Surfaces are tone-based roles, not "+1…+5 elevation" (surface tint is deprecated).

**Choosing a scheme.**
| | Static (baseline or custom brand) | Dynamic (user wallpaper / content) |
|---|---|---|
| Use when | Brand must look the same everywhere; enterprise; **iOS**; migrating from M2 | Personalisation, user-controlled contrast |
| You don't get | personal colours, user contrast | identical colours on every device |
- **Custom brand scheme** (our default): brand → Primary; optionally own inputs for secondary, tertiary, neutral, neutral variant (keep the conventions: tertiary = complementary hue; secondary / neutral variant / neutral = primary hue, progressively less chroma). In MTB **"Match color" (fidelity) is on by default** for a custom baseline — our scripts default to Tonal Spot; offer `fidelity` when the person wants roles closer to the brand.
- Even for dynamic colour, **design with the roles**, not hex values; test across several source colours.
- **Content-based colour**: only in contained areas next to the source image (media player, album); keep the source visible; max **2 schemes per screen**; never replace semantic colours (error red, success green).

**Role rules.**
- Accent: **Primary** = most prominent (FAB, filled button, active states) · **Secondary** = less prominent (filter chips, tonal buttons, selected nav indicator) · **Tertiary** = contrasting accents (badges, special input), designer's discretion.
- **Container roles are fills, never text/icons.** "On X" = text/icons on X; only On-pairs guarantee contrast. "Variant" = lower emphasis.
- **Error** is static by default (doesn't follow dynamic colour) but has Light/Dark.
- Surfaces: **Surface** = background; **Surface Container** (default) / Lowest / Low / High / Highest for cards, sheets, dialogs, nested containers; text/icons **On Surface**, lower emphasis **On Surface Variant**. Common pair: Surface for the body, **Surface Container for the navigation area** — and keep the same mapping in every breakpoint.
- Default kit mapping (remap only on purpose): Surface Container Low → elevated button/card · Surface Container → top/bottom bars · Surface Container High → FAB menu/basic dialog · Surface Container Highest → filled input, switch off track.
- **Inverse** Surface / On Surface / Primary → snackbar and other reversed elements.
- **Outline** = important boundaries (text-field outline); **Outline Variant** = decorative (dividers). Don't use Outline for dividers/cards, or Outline Variant for inputs/chips.
- Add-ons (most products don't need them): **Fixed / Fixed Dim** (same tone in Light and Dark; don't use for buttons on Surface), **On Fixed / On Fixed Variant**, **Surface Dim / Surface Bright** (keep relative brightness in both themes; e.g. Dim rail + Bright chat pane on large screens).
- Text default **On Surface** (alt On Surface Variant); **links = Primary** (Tertiary for less prominent) **and underlined**.

**Advanced customisations.**
- **Remap** a component's role only to a role that keeps the pair (On-roles); always roles, never tonal-palette values or hex.
- **Static colours** (formerly custom colours) for semantic meaning (success, warning, info) or brand accents: input one colour → 4 roles (X, On X, X Container, On X Container), Light/Dark. Optional **harmonize** (hue shifts slightly toward Primary, meaning kept) — **never harmonize brand colours**. Don't define your own red: use Error. → `theme-generate.mjs --static "Success=#…,Warning=#…"`, `apply-theme.js` creates `Static/<Role>`.
- **Custom colour roles** (palette + reference tone per theme + pairs + contrast) only when nothing else works; needs MCU in code.

## Typography
- **30 styles = 15 baseline + 15 emphasized**, roles **display / headline / title / body / label** × large/medium/small. Display = short, large-screen text or numerals; headline = short high-emphasis on small screens; title = medium-emphasis (careful with expressive fonts); body = long text (no decorative fonts); label = text in components, captions (buttons use **Label Large**).
- **Two typefaces:** *brand* for display, headline, title large; *plain* for title medium/small, body, label. Roboto default; replacing it with the brand font is encouraged. Fallback order for variable fonts: Roboto Flex → Roboto → Noto Sans.
- Baseline weights: Regular for display/headline/title large/body; **Medium** for title medium/small and labels. **Emphasized** = heavier (≈ Medium for display/headline/title large/body, Bold for title medium/small/labels) — for **selected / unread / primary action / headlines / badges / extended FAB**. Components use baseline by default; swap the token to emphasized on purpose. → `type-scale.js` builds both (`<PREFIX>/emphasized/<role>`).
- Customise: change typefaces, line height, letter spacing; **don't change sizes** (components reflow). Scale = Major Second around **14**; avoid tiny size differences. Android sp = web rem × 16; letter spacing em = tracking px / size.
- **Language height (Aug 2026):** line height adapts by script — small (Latin **except Vietnamese**, Cyrillic, Greek, Hebrew) · **medium ≈ +7% (Vietnamese**, Thai, Chinese, Japanese, Korean, Arabic, Hindi, most others) · large ≈ +30% (Burmese, Telugu) · extra large ≈ +100% (Nastaliq). Components with vertical padding grow; **fixed-height components may overlap** → for a Vietnamese-first product build the type scale with `LANGUAGE_HEIGHT:'medium'` and never fix the height of text containers.
- Android specs measure to the **baseline**; web/iOS use bounding boxes. **Tabular (monospaced) numbers** for tables, clocks, changing values. Contrast 4.5:1 small text, 3:1 large.
- **Editorial treatments**: type-driven hero moments (custom large sizes, variable axes weight/grade/width/optical size) to celebrate content, show the user's voice or bespoke features; consistent across similar moments, never in labels or plain information.

## Shape
- Corner scale (10 steps): **None 0 · Extra small 4 · Small 8 · Medium 12 · Large 16 · Large increased 20 · Extra large 28 · Extra large increased 32 · Extra extra large 48 · Full** (fully rounded; buttons default Full). Symmetric or asymmetric (inner corners in menus, split buttons, button groups).
- Customise at style level (e.g. Medium = 16 for all) or component level (remap a component to another step); rounded ↔ cut family (cut clips more — add padding).
- **Optical roundness:** nested corners = outer radius − padding (48 − 14 = 34). Never the same radius inside and outside.
- Shape library (35 shapes) + **shape morph** for state changes, progress, environment; use sparingly, mostly decorative (image crops, avatars), not on text-heavy containers; shapes are not semantic. Tension (square vs round) draws attention. Morph uses the expressive motion scheme.

## Elevation
- Levels 0–5 = **0 / 1 / 3 / 6 / 8 / 12 dp**. Tokens have no shadow or colour; M3 shows elevation mainly by **tonal surface difference**; shadows only to protect elements on busy backgrounds or to invite interaction (lift on drag/focus). Overlapping areas must use different surface roles.
- Resting levels: **3** dialog, date/time pickers, FAB/extended FAB, search, FAB menu close · **2** scrolled app bar, menu, navigation bar, rich tooltip, toolbar · **1** banner, modal bottom/side sheet, elevated button/card/chip, modal drawer · **0** unscrolled app bar, filled/tonal/outlined buttons, button groups, filled/outlined cards, carousel, chips, full-screen dialog, FAB in rail, icon buttons, lists, navigation rail, segmented button, docked side sheet, slider, split button, tabs. Don't change defaults; hover/focus raises one level.
- **Scrim = Scrim role at 32% opacity** under modals and expanded/modal navigation.

## Icons (Material Symbols)
- Styles **Outlined** (dense UIs; default), **Rounded** (heavy type, curved logos), **Sharp** (crisp at small sizes). Axes: **weight 100–700 (400 = regular, 2dp stroke — the M3 default)**, **fill 0–1** (filled = selected/active state), **grade** (−25 for light icons on dark backgrounds, 0 for dark on light, positive for emphasis), **optical size 20–48**.
- Sizes: **24dp standard**; 20 (dense/desktop), 40 and 48 (with display/headline type, large screens). Corners 2dp; outlined interior corners square.
- Target **48dp for a 24dp icon** (40 for a 20dp icon only with mouse/keyboard). Abstract icons and navigation need **labels**; complex or key-action icons smaller than 20dp need a text label. Test meaning across cultures (colour and symbols differ).
- Plugin default = **400** (M3); a heavier weight (500/600) only if the person chose it during setup — it's saved in the system.

## Motion
- **Physics system (springs)** replaces easing + duration for components. Schemes: **Expressive** (default, slight bounce — hero moments, key interactions) and **Standard** (functional, minimal bounce — utilitarian products); a product picks one, may swap per element.
- Tokens: **spatial** (position, size, rotation, corners — may overshoot) and **effects** (colour, opacity — no overshoot) × **fast** (small: switches, buttons) / **default** (partial-screen: bottom sheet, expanded rail) / **slow** (full-screen). Web curves: expressive fast/default/slow spatial 350 / 500 / 650 ms (`0.42,1.67,0.21,0.90` · `0.38,1.21,0.22,1.00` · `0.39,1.29,0.35,0.98`), effects 150 / 200 / 300 ms; standard spatial `0.27,1.06,0.18,1.00` at 350 / 500 / 750 ms.
- **Transitions** still use easing + duration: Emphasized 500 ms (start and end on screen) · Emphasized decelerate 400 ms (enter) · Emphasized accelerate 200 ms (exit) · Standard 300 / 250 / 200 ms for small utility transitions (and iOS/web fallback).
- Six patterns: **container transform** (card → detail; hero moments, shallow hierarchies) · **forward/backward** (platform default: Android slide + fade) · **lateral** (peer tabs/carousels; never for hierarchy) · **top level** (navigation bar/rail/drawer: quick fade out → fade in; no slide) · **enter/exit** (Android components expand along x/y from their edge — menus down, snackbars up; no scale/z) · **skeleton loaders** (pulse top-left → bottom-right, content fades in).
- Good transitions: honour **reduce motion** (fades only, no parallax/shape morph), consistent, stable layouts, no jump cuts by default, unified direction, clean fades (fade out fully before fading in). In Figma: note the pattern and spring/easing token in the handoff; prototypes may use Smart Animate approximations.
- **In this plugin:** the scheme (expressive default / standard) is chosen once in setup-system and saved (`system.motion`). `scripts/apply-prototype.js` wires prototype links per pattern with a Figma custom spring converted from the M3 token (mass 1, stiffness k, damping = 2·ζ·√k; e.g. expressive default spatial 380 / ζ 0.8 → damping 31.2) and writes a `Motion:` annotation with the token and the reduce-motion note. Figma can't bind variables to transitions, so the spring table lives in that script (Material values, not product values). **Figma Motion timelines are optional** — only when the person asks or `system.motion.figmaMotion` is true, and only for 1–2 hero moments (load the `figma-use-motion` skill; stop if motion APIs aren't enabled).

## Spacing (tokens)
- **space100 = 8dp**; multiplier names (space150 = 12, space225 = 18); nested 2 / 4 / 6 / 10. **Padding** (inside) and **gaps** (between) first; **margins** (outside) rarely in components, mainly in layouts. Positions: vertical, horizontal, top, bottom, **leading, trailing** (swap in RTL). Example: search container 8 vertical padding, 8 horizontal gaps, 24 horizontal margins (12 when focused).
- Keep spacing unchanged when text scales to 200%. Customise by remapping a component attribute (e.g. button top padding space125 → space200), adding product tokens (e.g. surface content horizontal padding), or mapping per device type / density setting. Tokens exist only in Jetpack Compose; in Figma this plugin creates them as variables (`scripts/apply-scales.js`: `Spacing/space*`, `Shape/corner-*`) and binds padding, gaps and corners to them; off-scale values are reported, not silently rounded.

## Design tokens [DT]
- Token = code-like name + value (colour, font, measurement or another token); named by **use**, so the name stays when the value changes. Format `md.<class>.<…>`: **ref** (all available values, e.g. `md.ref.palette.secondary90`; no context) → **sys** (decisions/roles; where theming happens; point to ref tokens, e.g. `md.sys.color.secondary-container`) → **comp** (component parts, e.g. `md.comp.fab.primary.container.color`; point to sys/ref, never hex).
- **Contexts** = conditions that switch a token's value (dark theme, density, form factor, RTL, contrast) → in Figma these are **variable modes**.
- In this plugin: `Schemes/<Role>` = sys colour tokens (modes Light/Dark), type-scale variables = sys typescale (modes 100%/200%), `Spacing/*` and `Shape/*` = sys measurement/shape tokens; components keep the kit's comp tokens. Designers apply variables/styles, never raw values, so handoff names match the code.

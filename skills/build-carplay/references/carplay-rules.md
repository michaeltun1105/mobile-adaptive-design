# CarPlay — design rules (read 2026-11-16)

Sources: [CPG] CarPlay Developer Guide PDF (dated 2026-10-13) · [HIG] Human Interface Guidelines › CarPlay (change log: May 2, 2023) · [CPD] developer.apple.com/carplay · [W26] WWDC26 session 212 "Rev up your CarPlay app" · [W25] WWDC25 session 216. MUST = Apple requirement (runtime exception, App Review or entitlement), SHOULD = guidance.

## How CarPlay works
- People install the iPhone app; when the phone connects, CarPlay apps appear on the car's Home screen. **The UI is built only from system templates** — the app supplies content, iOS draws it in the car and handles screen sizes and input (touch, knob, touch pad). Using a template the category doesn't allow throws a runtime exception. [HIG, CPG]
- Light **and** dark: CarPlay switches automatically with lighting conditions — design and check both. [HIG]
- Common screens (px): 800 × 480 (5:3), 960 × 540 (16:9), 1280 × 720 (16:9), 1920 × 720 (8:3); portrait displays exist; @2x and @3x. Sizes scale so items look about the same physical size. [HIG]
- **CarPlay Ultra** (automaker, covers the instrument cluster too) needs nothing extra from third-party apps; widgets are supported there. [CPD]
- Audio and video apps also run on **Apple HomeView** without changes. [HIG]

## App categories (gate before designing — each needs an Apple-approved entitlement)
| Category | Meaning / guideline | Depth limit (incl. root) |
|---|---|---|
| Audio | Audio playback (or audio + video). **Never show song lyrics.** Don't start an audio session at launch (it silences the car radio); recording not supported | 5 |
| **Video** (iOS 27) | Browse + watch **when parked**, in cars that support video; must support AirPlay video streaming; hidden in cars without video. Add the audio entitlement too if content works as audio, so the app always appears | — |
| Communication | Messaging / VoIP via SiriKit; never show message text | 5 |
| Navigation | Turn-by-turn with upcoming maneuvers (MUST) | 5 (hierarchical selections ≤ 5 levels) |
| EV charging · Parking | Meaningful driving function — "can't just be a list of chargers" | 5 |
| Fueling | Same rule | 3 |
| Public safety | | 5 |
| Quick food ordering | Favourites / recents ≤ 12 each, **no full menus** | 2 (iOS ≤ 26.3) · 3 (iOS 26.4+) |
| **Driving task** | "Services essential to the driving experience" — tasks must help with the drive, not just be done while driving. Not allowed: account setup, detailed settings, POI apps focused on finding places on a map. Refresh UI data ≤ once / 10 s (no real-time engine data); POI data ≤ once / 60 s | 2 (≤ 26.3) · 3 (26.4+) |
| Voice-based conversational (iOS 26.4) | Voice is the primary mode at launch; audio session open only while voice is active; **no text or imagery in answers** | 3 |
- A feature that fits no category can't appear in CarPlay. Automakers also ship their own apps. [CPD]
- The same product can fit a **different category on CarPlay than on Android Auto** (e.g. trip logging + road alerts → Driving task on CarPlay, while Android Auto only offers Navigation/POI/IoT…). Compare both before planning.

## General rules (all apps) [CPG, HIG]
- Designed primarily for the category's feature; every flow meaningful while driving; no games or social networking.
- **Every flow works without touching the iPhone**, including when it's locked (data-protection Complete files and some Keychain items are unreadable) and when the app launches only on the car screen. Setup on the phone happens before driving.
- Never tell people to pick up the iPhone — report errors in CarPlay; error text must not ask them to use the phone. Report errors only when necessary.
- Never show the content of messages, texts or emails. Use templates only for their intended purpose and information types.
- Can't show or hide CarPlay for some users only. Launch other apps with a URL so they open on the car screen.
- Layout: high-value info, clean and scannable; similar functions look the same; **important content and controls in the upper half**; large = important and easier to tap.
- Colour: small palette tied to the app logo; **never the same colour for interactive and non-interactive elements**; test in sunlight and at night in a real car; inclusive colour.
- App icon: mirror the iPhone icon, **no black background** (lighten it or add a border); 120 × 120 px @2x, 180 × 180 px @3x. All artwork @2x and @3x.
- Audio etiquette: let people start playback (no auto-play unless single-source or resuming); show Now Playing as soon as audio is ready; resume after temporary interruptions only; adjust relative levels, never overall volume.

## Templates [CPG, W26]
Available to **every** category: **List, Grid, Tab bar, Alert, Action sheet** (audio from iOS 17), **Voice control** (all categories from iOS 27). Map = navigation only. Now Playing = audio/video (only a List may be pushed on top of it). Contact = communication. Point of interest + Information = EV charging, fueling, parking, quick food ordering (check the guide's table for driving task). Search = navigation (more categories from iOS 27 — check the table).

| Template | Limits & notes |
|---|---|
| List | Some cars cap lists at **12 items** — always handle 12; read `maximumImageSize` for images; iOS 27: portrait/landscape images, thumbnails with overlays (badges like "Live"/"New", sports scores) and playback progress; **Details header** (thumbnail, title, body, playback, action buttons) above a list; pinned elements (iOS 26) |
| Grid | ≤ **8** buttons, icon ≤ 40 × 40 pt |
| Tab bar | Read the max from iOS — currently **4 for audio, 5 for others**; tab icon ≤ 24 × 24 pt |
| Point of interest | ≤ **12** locations |
| Information | Short facts + actions (no hard numbers given) |
| Alert / Action sheet | Short confirmations |
| Voice control | Optional prompt + animated status icon, ≤ 2 action buttons, leading/trailing bar buttons; can overlay another template (e.g. the Map) — use shorter text variants; image ≤ 150 × 150 pt; play waiting/processing sounds |
| Now Playing | Must be fillable at all times; custom buttons ≤ 20 × 20 pt; **MiniPlayer** (iOS 27) shows automatically (`allowsMiniPlayer = false` to opt out); sports layout (iOS 18.4) |
| Contact | Action buttons ≤ 50 × 50 pt |
| Search | Secondary input — the keyboard may be off while driving |
| Map (navigation) | App draws the map in the base view **only** (no alerts/overlays/UI there); ≤ **4 map buttons**; nav bar ≤ 2 leading + 2 trailing; pan button if panning; trip preview ≤ 12 trips × 3 routes; navigation alert ≤ 2 buttons; maneuver symbol ≤ 50 × 50 pt (2-line 120 × 50); **Panels** (iOS 27, ≤ 12 items: trips, grids, route choices, details, waypoints + Go/End buttons); **route sharing** with the car (iOS 26.4, driver approves; car can suggest EV stops); Dashboard needs 2 `CPDashboardButton`s; cluster map minimal, heading-up, upcoming route detail; stop guidance immediately when cancelled |
- Text variants are arrays **longest first** — CarPlay shows the longest that fits. No fixed character limits in Apple's docs: keep labels short and front-loaded. Cars may limit lists and the keyboard while driving (`limitedUserInterfaces`).

## Widgets & Live Activities (iOS 26+) [CPD, CPG, W25]
- Widgets sit to the **left of the CarPlay Dashboard**, touch-interactive; Live Activities show in the Dashboard or as a notification. **systemSmall** widgets and Live Activities appear automatically — no work needed.
- Mark a widget **not optimized for CarPlay** (`.disfavoredLocations([.carPlay], for: [.systemSmall])`) when it is a game or needs a lot of interaction (e.g. > 6 refreshes per tap), doesn't work in the car (data protection A/B unavailable while locked), or mainly launches an app that has no CarPlay app. People can still add it, but interaction is off.
- A widget can open its app in CarPlay only if the app is also a CarPlay app.
- Design check for widgets in the car: glanceable at arm's length, no tiny text, no dense lists, works locked, sensible in light and dark.

## What's new
- **iOS 27** (WWDC26): Video category · Voice control for all categories + overlay style · list image orientations, thumbnail overlays, playback progress, Details header · MiniPlayer · navigation Panels · CarPlay Simulator in Device Hub (screen sizes, video-capable cars, route-sharing diagnostics) · Siri AI in CarPlay (iPhone 15 Pro+) · audio scrubbing.
- **iOS 26.4**: Voice-based conversational and Driving task depth 3, route sharing (`CPRouteSegment`, `CPNavigationWaypoint`), `CPSportsOverlay`.
- **iOS 26**: widgets and Live Activities in CarPlay, pinned list elements, Liquid Glass look in the system UI.

## Design resources
- **Apple publishes no official CarPlay Figma kit.** Ask the team for theirs; community/paid kits exist (e.g. ApplyPixels "Apple CarPlay UI", Bonum Design). Otherwise build from the Apple **iOS 26 UI kit** components arranged as CarPlay templates and say the screens are reference mock-ups (iOS draws the real ones).

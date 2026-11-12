# Car App Templates Design Kit (Figma) — checked 2026-11-12

Team copy: `https://www.figma.com/design/I7uLEhgf2EOxTsRmEtg3oz/Car-App-Templates-Design-Kit--Community-` (pages: Cover · **Components** · **Car App Templates** · **Android Auto Dashboard**). It's a community file copied into drafts — **not a published library**, so its keys can't be imported into other files. Build inside this file (a page per product), or ask an owner to publish it as a team library and then import by key.

## Screen sizes — variable collection `Apps` (template width/height are bound to it)
| Mode | App space (w × h) | Use |
|---|---|---|
| **Standard Canonical** | 800 × 400 | Default; inside the most common Android Auto dashboard 800 × 480 |
| Wide | 1020 × 456 | Widescreen cars |
| Portrait | 766 × 594 | Portrait screens |
| Coolwalk | 460 × 388 | Split-screen card (map templates) |
| Absolute Min | 724 × 358 | Smallest supported |
| Coolwalk-Absolute-Min | 408 × 358 | Smallest split card |
Dashboard page frames (whole car UI incl. rail): Sub-canonical 748 × 450 (minimum) · **Canonical 800 × 480** · Short widescreen 880 × 480 · Min widescreen with full map 1120 × 480 · Widescreen 1280 × 480 · Short portrait 790 × 686 · Portrait 800 × 880 · BMW iX 1920 × 584.

## Tokens in the kit
- Variables `AAP System`: padding P0 4 · P2 8 · P1 12 · P3 16 · P4 24 · P5 32 · P6 48 · P7 64 · P8 88; shape none 0 · x-small 8 · small 16 · medium 24 · large 32 · full 100; size xs 24 · s 32 · m 56 · l 64 · xl 96 · xxl 128 · xxxl 256. Bind custom spacing to these.
- Text styles `auto/*` (Roboto): display 56/44/36 · headline 32/28/24 · title large 28 (Medium; `large-unread` Bold) · title small 24 · body large 28 · body small 24 · button 24 (Medium). **Icons are the Material Icons font** (`auto/icon-button/*` 28–42) — set an icon by typing its ligature name, e.g. `lock`, `directions_car`.
- 214 paint styles `auto-system/ref/<colour>/<tone>` + system roles; effect styles app-shadow, fab-elevation, toast-shadow, badge-shadow. Android Auto UI is dark by default.

## Templates (page "Car App Templates") — set name · variant axes · key
| Set | Variants | Key |
|---|---|---|
| ListTemplate | Type Unsectioned/Sectioned/Empty · FABs No/Yes · App Category All/Comms · CarState Driving/Parked | `27362b2fe3c870b2322998aaf8f2c9df06cd5f89` |
| GridTemplate | Type Default/Media · Header Yes/No · FABs No/Yes | `b822cdb3927bb70cef4049d2676029c9b5e67d01` |
| SectionedItemTemplate | FAB No/Yes (766 × 594) | `e7bb9f1d68daadef33d936947633496d6ad12c84` |
| PaneTemplate | Size Standard/Portrait/Wide | `022c9fa250867faff1a5dd9938a2c2392c92c75e` |
| MessageTemplate | Default | `16f7368bfdd1e252d1d4c59cd9de5608671de3dc` |
| LongMessageTemplate (Parked-only) | Default | `7398e19302d1cecee7181706d92dac74477c3813` |
| SearchTemplate | Default | `dd3999be288834d879475e0fc6c15a0adbe7ee9d` |
| SignInTemplate | Size Standard/Portrait/Wide · Type QR-code/PIN/Email/Email - keyboard/App-provided | `04649a1149ff6c1abf638ecb1c903930b7f2fca5` |
| TabsTemplate | Default (Header + embedded ListTemplate) | `612834b9367355a13dcd9ba95d0a176c1b2e8207` |
| MapWithContentTemplate | Template List/Grid/Pane/Message/Coolwalk… · State Roaming…/Navigating | `e415b28012b109d70a7ac70c416eef1831126186` |
| NavigationTemplate | State FullApp/FullApp - alert/FullApp-Map+X/Coolwalk | `2cfd27d26eb6f2590111a88164ea400415df3aeb` |
| MediaPlaybackTemplate | State Default/Overflow · Size Canonical/Portrait | `e7c48fc9083b254c039ed5a94b9c3bad9651ae78` |

## Building blocks (page "Components")
| Set | Variants / properties | Key |
|---|---|---|
| Header/Header | type default/default-noleadingaction/search/tabs/tabs-noicons/media-NowPlaying · state Enabled/Parked/Disabled/Driving/Rotary · leading/trailing | `18adf48aec620cc592439e23d56a9c1c559f5190` |
| Header/header-leading · header-trailing | App icon / Back · first/second action | `87f6d12c57206a59a6030faa62b4138fd99df70b` · `908adef083a24160397ae4583b84eabe7a61fc43` |
| List/list item | type all apps/navigation · size full/half · condition 1-line/2-line+/3-line+ (parked) · state · Primary/Secondary text, leading, trailing, row-actions, divider | `a305e50e373930bb578d6ebb3908de6a5774dfd3` |
| List/row-leading · row-trailing | icon, album art, avatars, accessory · icon button, text button, accessory, badge, counter | `e1fa1569933de8c2335d358c1df22d83b9a21d70` · `550798412a36b98089ba34dc55952a9c4e2dc890` |
| Grid/grid item | img size small/medium/large · state enabled/loading/disabled/pressed/rotary · title, secondary text | `cc3a4f160a46e26f1a2a71ab598132fc1fe7db17` |
| Actions/row-actions | btn-height 56/64 | `7a816aee6ea8d671eb70049307fe492c56f7e91d` |
| Actions/mapContentActions | 1–2 actions · horizontal/vertical · icon+label/icon/label | `cbbafc865ca166f1ba30f764f81c07670d8fbca5` |
| Alert | Default / Timed button | `06acd4e77edbc06b3dd5c8555348cdad42de3838` |
| Signin · Signin/input · Signin/app-provided | variations · Email/PIN × states | `80a6c0c5d1d4507f945d467573c28fb45c791841` · `ea04d6ea78d7923f0d58941ea27a4c2eacc2ea33` · `32c731b8929410a32a48f43fb15e1a21140ef4b7` |
| switch · radio-button · checkbox · list/accessory | selected/disabled · checked · switch/radio/check/icon | `401a1a247d4201f35bc185d15690c71e16630db7` · `1da2f81d9f6fa57fed3a9d995f281acf59434b86` · `65a9a240bc260930dd711a7a47f0106d50f953c8` · `f0af5f6f0aa968ec7cdf207b97afb5e3ac64b42f` |
| alphajump - entry · cell | alphajump / inertial scrolling · Alphajump/Dialer | `d20e2440256678f2245c7458dbe16cf30df455af` · `d2be5d73824113f6101d8f420f25e6b24a7e676c` |
| Navigation/turncard · etaCard · tripinfo · ETA-only · map tile | Full/Minimized × states · FullApp/Coolwalk · Light/Dark | `5fec6de3cfd4684dd6edae531f44ecbd1a08acb0` · `8e1dde01e7a4a67b9942740b55545923115cfba0` · `0ea8ce45a0b4a51936f6bef4fe4ca68c36c8a8bf` · `5e40e13146c3acbfaf2d55d136200b06bad7295a` · `ba5f50ab674733438739bbd6c1dd0a9a93357627` |
| MapContentHeader | default / no leading action | `2e71dc00571b169db814bb9932e51216fc24f065` |

**Not in the kit (2026-11-12):** CAL 1.9 components — Spotlight, Condensed items, Chips, Banner, Section header, Minimized control panel — and Toast/HUN components. Don't draw look-alikes; use the closest kit template and note the intended 1.9 component for developers (or ask the person whether a newer kit exists).

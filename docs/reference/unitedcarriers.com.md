# Design Map

Source: https://unitedcarriers.com/ (single page, 1440×900, 28 228px tall). Reference for NOIR X1 only; nothing here is copied into the build.

## Spacing Scale
- vw-locked unit: 1.6667px at 1440px (root ≈ 1.157vw)
- Observed: 3.33, 5, 6.67, 13.33, 16.67, 20, 25, 50px
- Gap-driven grid: column gap 16.67px

## Font Hierarchy
- h1 — 80px / 84px, 700, BT Steinhart
- h2 — 60px / 63px, 700, BT Steinhart
- lead — 26.67px, 500, Helvetica Neue
- h3 — 24px / 30px, 700, BT Steinhart
- body — 23.33px / 28px, 500, Helvetica Neue
- UI — 13.33px, 400, Helvetica Neue
- HUD — 7.5–10px, BT Steinhart Mono

## Color Palette
- #FFFFFF — background, 82.6% of area
- #111111 — dark scenes 9.2%, primary text
- #000000 — void scenes 5.8%
- rgba(17,17,17,0.16) — ghosted headline words
- rgba(17,17,17,0.72) — secondary text
- rgba(255,255,255,0.6) — secondary text on dark
- #FF5500 and #012FFF — hero globe glow only

## Image Ratios
- vehicle cut-out (side) — 2.04:1
- hero scene — 1.13:1
- wide frame — 1.78:1
- mobile hero — 0.46:1

## Component Tokens
- Radius: 99% pills (149 nodes), 50% icons
- Shadows: none on UI; hero globe carries a 4-layer orange and 2-layer blue inset glow
- Grid: 22 columns, full-bleed, 16.67px gutters
- Buttons: 13.33px, padding 12.5px / 33.33px, white or #111 pills
- Motion: transitions on opacity/transform 0.35–0.45s, some on width/height; focus-visible not present; no reduced-motion handling detected

---

# Taste DNA

### One vehicle narrates every scene
- **Trigger**: When a freight company had to explain road, air and ocean services on one long page
- **Decision**: A single cut-out product object re-enters each scene from a new camera angle (side-on truck, top-down on a road, underside of a plane), over per-service illustrations, icons or photo cards
- **Reason**: A visitor follows an object more readily than a list; the same truck changing viewpoint turns scrolling into travelling, so the services read as legs of one trip
- **Evidence**: vehicle cut-out at 2.04:1 on #FFFFFF; top-down truck on a #111111 road strip at 50% scroll; plane from below at 75%; 0 card components

### Colour is spent once, in the first viewport
- **Trigger**: When choosing where the brand's energy should show
- **Decision**: Chromatic colour is confined to the hero globe's inset glows (#FF5500, #012FFF) and the remaining 28 000px run in #FFFFFF / #111111 / #000000, over a brand accent repeated on buttons, links and icons
- **Reason**: One burst of colour at the door reads as an event; after it the neutral field leaves the vehicles' own metal and paint as the only things with presence
- **Evidence**: white 82.6% + #111 9.2% + black 5.8% of background area; 2 chromatic shadow declarations, both on the hero; buttons are white or #111 pills

### Telemetry voice for small print
- **Trigger**: When setting labels, nav and status text around 60–80px headlines
- **Decision**: A monospaced companion (BT Steinhart Mono, 92 nodes at 7.5–10px) for HUD readouts like "00 KM/H", over small UI text in the body sans
- **Reason**: Numbers and labels in a mono cut read as instruments, so the page feels measured and in motion rather than decorated
- **Evidence**: 92 mono nodes; "00 KM/H" readout top-left of each vehicle scene; 8.33px and 10px each used 30 times

### Ghosted first word instead of an eyebrow
- **Trigger**: When a section headline needed a lead-in
- **Decision**: The first word is set at rgba(17,17,17,0.16) and the rest at #111111 ("RELIABILITY / AT EVERY MILESTONE"), over a small coloured eyebrow or an accent-coloured keyword
- **Reason**: The reader still reads one continuous statement, but the eye lands on the second half first; emphasis comes from value contrast, not an extra element
- **Evidence**: rgba(17,17,17,0.16) in 24 text nodes; h2 60px/63px 700; no eyebrow labels above h2s

---

## What NOIR X1 takes from this (principles, not surfaces)

| Reference principle | NOIR X1 translation |
| --- | --- |
| One vehicle narrates every scene | One real-time 3D watch persists across all 12 scenes; each scene is a new test position, not a new illustration |
| Colour spent once | Signal `#FF5A1F` exists only on the seconds hand and live measurement marks; everything else is an 11-step graphite→bone ramp |
| Telemetry voice | Geist Mono only for measured values (position readout, 28 800 vph, 11.4 mm, 10 bar) |
| Ghosted first word | Two-tone display lines (z10 + z5/z6) instead of eyebrow labels |

Where NOIR deliberately diverges: real WebGL instead of pre-rendered cut-outs; a dark studio ground instead of white; transform-only motion with `:focus-visible` and a reduced-motion path, both absent from the reference.

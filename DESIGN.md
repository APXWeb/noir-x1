---
name: NOIR X1
description: A watch launch staged as a chronometer's certification run; silence calibrated to one signal.
colors:
  z0-graphite: "#0c0c0d"
  z1: "#131315"
  z2: "#1b1b1e"
  z3: "#252528"
  z4: "#333337"
  z5: "#48484c"
  z6: "#6c6a67"
  z7: "#8f8c87"
  z8: "#b2aea7"
  z9: "#d3cfc8"
  z10-bone: "#ece8e1"
  signal: "#ff5a1f"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 0.6rem + 10.4vw, 12.5rem)"
    fontWeight: 560
    lineHeight: 0.86
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 125"
  display-mega:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(5rem, -1rem + 26vw, 30rem)"
    fontWeight: 560
    lineHeight: 0.8
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.2rem + 5.2vw, 7rem)"
    fontWeight: 540
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2.5rem)"
    fontWeight: 480
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  lead:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.95rem + 0.45vw, 1.3125rem)"
    fontWeight: 360
    lineHeight: 1.45
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(0.9375rem, 0.88rem + 0.2vw, 1.0625rem)"
    fontWeight: 380
    lineHeight: 1.55
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.16em"
    fontVariation: "'wdth' 118"
  measure:
    fontFamily: "Geist Mono Variable, Geist Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 450
    lineHeight: 1.4
    letterSpacing: "0.08em"
    fontFeature: "'tnum', 'zero'"
rounded:
  none: "0px"
  pill: "999px"
  round: "50%"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "4rem"
  s-9: "6rem"
  s-10: "8rem"
  s-11: "12rem"
  gutter: "clamp(1rem, 0.4rem + 3vw, 3.5rem)"
  header-h: "clamp(3.5rem, 3rem + 1.5vw, 4.75rem)"
components:
  cta-primary:
    textColor: "{colors.z10-bone}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 0"
    height: "48px"
  cta-quiet:
    textColor: "{colors.z8}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 0"
    height: "48px"
  material-option:
    textColor: "{colors.z8}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 16px 8px 12px"
    height: "44px"
  material-option-selected:
    textColor: "{colors.z10-bone}"
    rounded: "{rounded.pill}"
  explore-control:
    textColor: "{colors.z9}"
    rounded: "{rounded.pill}"
    width: "44px"
    height: "44px"
  callout-chip:
    backgroundColor: "{colors.z0-graphite}"
    textColor: "{colors.z10-bone}"
    typography: "{typography.measure}"
    rounded: "{rounded.none}"
    padding: "5px 8px 6px"
---

# Design System: NOIR X1

## Overview

**Creative North Star: "Silêncio calibrado"**

NOIR is a dark studio where a single object is carried through calibrated test positions, and every scene reads like one line of a chronometer certification bulletin. The interface recedes to a graphite ground, bone ink and hairlines; the real 3D watch is the only thing allowed to be loud, and even it speaks through one orange seconds hand. Density is deliberately low: one expanded-caps statement, one sentence, one measured reading per scene.

Three borrowed instruments shape the world. A darkroom zone ramp supplies the only tonal scale. An oscilloscope graticule supplies the hairline rules and leader lines that lock onto parts of the watch with a measured value. A multiplane camera supplies depth: display type sits on planes behind and in front of the WebGL watch, so the object crosses the words.

**Key Characteristics:**
- One 11-step neutral ramp (z0 to z10) carries every surface, ink and rule.
- One chromatic signal, reserved for the seconds hand and live measurement marks.
- Archivo expanded capitals for statements; Geist Mono only for things that were measured.
- Hairlines (1px) instead of fills, boxes or shadows.
- Type on depth planes behind and in front of the 3D object.
- Scroll-scrubbed scenes; UI motion is transform and opacity only.

## Colors

A strict graphite-to-bone zone ramp with a single orange signal; there is no secondary or tertiary hue.

### Primary
- **Signal Orange** (signal): the seconds hand and its counterweight in the 3D model, and live measurement marks in the DOM: the callout reticle and chip edge, the selected-swatch index notch, the pressed hotspot pin, the unit on a hero figure (the "mm" of 11.4), and the focus-visible outline. Nothing decorative, nothing that is not either time passing or a reading being taken.

### Neutral
- **Graphite Zone 0** (z0-graphite): the page ground on `<html>`; ink in the light scene; the translucent base of reading chips (82% mix).
- **Zones 1 to 5** (z1..z5): ghosted background display words (Materials name in z3, Collection numerals in z2), dark-on-bone secondary ink in the light scene (z4, z5), scrollbar thumb (z4).
- **Zone 6** (z6): the stepped, receding line in two-tone display statements on dark (the "WITHOUT" of the hero, the final "REFINED.").
- **Zones 7 to 9** (z7..z9): tertiary ink for labels and measurement names (z7), secondary ink for body (z8), readouts on the stage (z9).
- **Bone Zone 10** (z10-bone): primary ink on dark; the ground of the light scene.
- **Rules**: hairlines are the ink colour mixed toward transparent in oklab, 16% for the standard rule and 34% for the strong rule on dark (14% and 32% on light). They are roles, not new colours.

### Named Rules
**The Zone Ramp Rule.** Every surface, ink and rule resolves to a zone step or a transparent mix of one. No new neutrals, no tinted greys, no gradients between hues.

**The One Signal Rule.** Signal Orange marks time passing or a value being read. If an element is neither the seconds hand nor a live measurement (or the focus ring), it is not orange.

**The Role Flip Rule.** The light scene (Story) sets `data-theme='light'`, which flips the semantic roles (ground to z10, ink to z0, ink-2 to z4, ink-3 to z5); the ramp itself never changes. Light is one scene, not a second theme.

## Typography

**Display Font:** Archivo Variable at width 125 (with Archivo, system-ui)
**Body Font:** Archivo Variable at width 100
**Label Font:** Archivo Variable at width 118
**Mono Font:** Geist Mono Variable (with ui-monospace)

**Character:** One family stretched across three widths, so statements, prose and UI words share a skeleton; the monospace is a separate instrument that only prints readings.

### Hierarchy
- **Display** (560, fluid 52 to 200px, 0.86): all-caps scene statements. Per-scene sizes are overridden from the measured em width of the longest word (for example "COMPROMISE." at 8.94em) so the line clears the watch; that measurement is written in a CSS comment beside the value. Mega variant (0.8 leading, -0.04em) for the finale.
- **Headline** (540, fluid 40 to 112px, 0.9): all-caps section statements, including the Story quote.
- **Title** (480, width 112, fluid 24 to 40px, 1.02): sentence-case sub-heads such as spec names and "Four finishes. One object."
- **Lead** (360, fluid 17 to 21px, 1.45, max 34ch) and **Body** (380, fluid 15 to 17px, 1.55, max 44ch) in ink-2.
- **Label** (600, 11px, 0.16em, uppercase): UI words that are not measurements: nav links, CTA text, spec terms, table captions, figcaptions, hints, footer notes.
- **Measure** (Geist Mono 450, 11px, 0.08em, uppercase, tabular and slashed-zero numerals): measured values, positions and years only.

### Named Rules
**The Measured Mono Rule.** Geist Mono prints only what an instrument could read: millimetres, bar, Hz, vph, positions, rates, years. A word that is not a value is a label, set in Archivo.

**The Measured Width Rule.** Display sizes are chosen from the longest word's em width against the space it must clear, and the measurement is recorded next to the value. Never size a statement by eye.

**The Two-Tone Step Rule.** A multi-line statement may step its second line inward (0.9em, 0.6em on phones) and drop it to z6 (z5 on bone). One step per statement.

## Layout

A scene is a tall scroll track (`--len`, typically 200 to 220svh) holding a sticky 100svh frame padded by header height plus s-5 at top, the fluid gutter at the sides and s-8 at the bottom. Content is placed on the frame's grid by alignment (statement start or end, copy lower-left, reading lower-right) rather than in columns; the long-form Story scene alone uses a 12-column grid with s-5 column gap and s-9 row gap. Spacing follows the 4px-based s-1..s-11 scale. The only breakpoint is 767px: below it, copy moves to the lower frame, the position rail moves to the top edge without ticks, the nav collapses into a full-screen sheet of display-size links, and frame bottoms grow to s-9 + s-2 for thumb clearance.

## Elevation & Depth

There are no drop shadows. Depth is optical: planes, not elevation. A back plane (a second sticky frame at z-index -1, or a relatively positioned block at z-index -1 outside sticky frames) sits beneath the transparent WebGL canvas, so the watch crosses in front of display type; the front plane (z-index 2) holds copy and controls above it. The page ground lives on `<html>` and `<body>` stays transparent so back-plane type can sit between them. Separation from the stage uses translucent graphite (the header at 82% ground with 14px backdrop blur once scrolled; reading chips at 72 to 82% z0), never a lifted card.

### Named Rules
**The Multiplane Rule.** Display type lives on a plane behind or in front of the object, never in a box beside it. On phones a statement may move to the front plane so it crosses the strap instead.

**The No-Lift Rule.** Nothing casts a shadow. The only inset shadow in the system is the 1px bone ring that outlines a material swatch.

## Shapes

Square by default: rules, chips, panels, the mobile sheet button and spec rows have no radius. Round forms are reserved for things that are round in a watch or are touch controls: full pills (999px) for the material radiogroup and explore controls, circles (50%) for swatches, reticles, hotspot pins and the cursor. The recurring geometry is the hairline: header rule, spec row dividers, panel tops, the CTA rule, rail ticks and graticule leaders, all 1px.

## Components

### Buttons (CTA)
The single call-to-action form: an expanded-caps label followed by a hairline and an open arrowhead. No filled slab, no pill.
- **Shape:** no container; 48px minimum height, s-4 gap between label and rule.
- **Primary:** label at width 120, 600, 13px, 0.14em, in ink; the rule rests at 56 of 88px.
- **Hover / Focus:** the rule scales to full reach and the arrowhead translates to meet it (520ms ease-out); both via transform, never width. Active scales to 0.97 over 140ms.
- **Quiet:** ink-2, a shorter resting rule (28px) that extends halfway on hover while the label brightens to ink.

### Chips (Material radiogroup)
- **Style:** 1px rule-colour border, full pill, 44px minimum height, a 14px swatch circle and a label-style name in ink-2.
- **State:** hover lifts border to rule-strong and text to ink; checked sets the border to bone and raises a 1.5 by 4px signal notch above the swatch (the same index notch as the logo ring). The large ghosted material name behind the watch re-sets with a blur and tracking release on change.

### Callout (graticule)
A reticle, a leader line and a reading chip that lock onto a part of the 3D watch.
- **Reticle:** 11px signal ring with a signal centre dot, scales 0.4 to 1 on activation.
- **Leader:** 1px bone stroke at 85% opacity, drawn in by dash offset over 900ms.
- **Chip:** z0 at 82% with a 1px signal left edge, Measure type: name in z7, value in bone at 13px. Fades with the part's facing so it never reads through metal.

### Position Rail
The certification readout, fixed lower-right: "POS. 04 / 12" and the pose name in Measure on a translucent z0 chip, beside a column of hairline ticks. Each tick is a 24px-tall target (WCAG 2.5.8); the current tick extends to full width in bone, others rest at 38% width in z7. On phones it moves to the top edge as a single row without ticks.

### Navigation
Fixed header, three columns: wordmark, centred label-style links in ink-2 with a hairline underline that wipes in on hover, and a bracketed EXPLORE entry at right. The header gains its translucent ground and a scaling hairline only once content scrolls under it, and hides on scroll-down. Mobile: a 44px two-bar toggle opening a full-screen z0 sheet of display-width links divided by rules, staggered 55ms each.

### Explore Controls
44px circular or pill hairline buttons in z9 (hover to bone and rule-strong), a hotspot pin of a 13px bone ring with a pulse (pressed turns it signal), and a detail panel topped by a rule-strong hairline that rises with a short blur release.

### Motion
Ease-out cubic-bezier(0.23, 1, 0.32, 1) for arrivals and UI response; ease-in-out cubic-bezier(0.77, 0, 0.175, 1) for loops and scene handoffs. Durations: 140ms press, 220ms UI, 900ms scene. UI transitions animate transform and opacity (colour and border fades aside). Scenes are scroll-scrubbed; the 3D rig damps toward each pose. Reduced motion snaps poses and keeps content static, with plain fades where anything moves at all.

## Do's and Don'ts

### Do:
- **Do** take every neutral from the z0..z10 ramp or a transparent oklab mix of it.
- **Do** keep Signal Orange to the seconds hand and live measurement marks (reticle, chip edge, selected index notch, pressed pin, measured unit), plus the focus ring.
- **Do** set statements in Archivo width 125 capitals, sized from the measured em width of the longest word, with the measurement noted beside the value.
- **Do** use Geist Mono only for measured values, positions and years; use the Archivo width-118 label for every other UI word.
- **Do** put display type on a depth plane relative to the watch rather than beside it in a container.
- **Do** make every CTA the label-plus-extending-hairline form, animated by transform only.
- **Do** keep touch targets at 44px (24px for rail ticks) and honour reduced motion by snapping poses.

### Don't:
- **Don't** introduce a second accent hue or use signal for emphasis, headings, backgrounds or decoration.
- **Don't** add drop shadows or raised cards; separate with hairlines and translucent graphite.
- **Don't** set non-measured words in mono, or measured values in the label face.
- **Don't** use filled button slabs or pill-shaped CTAs; pills belong to selection chips and explore controls only.
- **Don't** make light a site-wide theme; the Story scene is the one role flip.
- **Don't** animate width, height or layout properties for UI state.

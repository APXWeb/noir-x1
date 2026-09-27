# NOIR X1 — Launch experience design

Date: 2026-09-27 · Status: approved in chat ("sim pode continuar desse jeito") · Owner: APX portfolio

## 1. Intent

An experimental launch site for a fictional premium watch brand, NOIR, and its first product, the NOIR X1. Built for the APX portfolio: the first impression must be "this is not an ordinary website". Success criteria:

- A real, real-time 3D watch (GLB) is the protagonist in every scene, not a PNG.
- Scroll drives a 9-scene narrative; each motion has narrative function.
- Material switching changes the actual 3D object.
- Free explore mode with drag / zoom and accessible hotspots.
- Purpose-built mobile composition; reduced-motion and no-WebGL paths.
- Clean, modular architecture.

Assumptions (inferred, user delegated): English site copy (international luxury launch); code-led build (no image generation); dark stage world; all specs are fictional and labelled "concept specifications".

## 2. Direction ("Silêncio calibrado" × chronometer certification)

Contract lives in `.impeccable/surfaces/index-html.md`. Summary:

- **Ritual:** the watch passes through calibrated test positions (DIAL UP, CROWN UP, DIAL DOWN…). A position readout shows the current position; the right-edge rail navigates scenes.
- **Palette:** graphite `#0C0C0D`, bone `#ECE8E1`, 11-step neutral ramp as the only tonal tokens; signal `#FF5A1F` only on the seconds hand and live measurement marks.
- **Type:** Archivo variable — expanded caps for display, normal width for body. Geist Mono only for measurements.
- **Graticule:** hairline leader lines tracking projected 3D anchor points (crown, seconds tip, crystal edge, caseback), labelled with measured values.
- **Depth planes:** display type sits both behind and in front of the watch.
- **Logo:** NOIR wordmark in expanded caps; the "O" is a bezel ring with a 12 o'clock index. Same ring is the loader and cursor.

## 3. Architecture

Vite + React 19 + TS. R3F 9 + drei 10. GSAP 3 + ScrollTrigger, Lenis. zustand.

```
src/
  app/          App shell, providers (Lenis ↔ ScrollTrigger bridge)
  components/   Header, Wordmark, Loader, Cursor, PositionRail, Cta, SplitReveal, Callout
  sections/     Hero, Approach, Rotate, Detail, Profile, Engineering, Materials,
                Reveal, Explore, Collection, Story, Finale, Footer
  three/        Stage (Canvas, lights, env, perf), watch/ (procedural build,
                canvas textures, WatchModel from GLB), CameraRig, Hotspots,
                ExploreControls, anchors (3D→screen projection)
  animation/    easings, poseTrack (DOM anchors → interpolated pose), reveals
  data/         poses (desktop/mobile), scenes copy, specs, materials, collection, story, hotspots
  hooks/        useReducedMotion, useMedia, useQualityTier, useWebGL
  state/        store (material, variant, mode, quality, loaded, activeHotspot)
  styles/       tokens, base, typography
scripts/        export-glb (procedural → GLB via Playwright + GLTFExporter),
                optimize (gltf-transform meshopt + webp), capture-stills
public/models/  noir-x1.glb
public/stills/  renders of our own model (Story imagery + no-WebGL fallback)
```

### 3.1 3D model

The X1 is modelled procedurally in Three.js (units: 1 = 10 mm; 41 mm case). Named nodes, which are the contract any replacement GLB must follow:

`Case, Lugs, Bezel, BezelInsert, Crystal, Dial, Rehaut, Indices, IndexLume, HourHand, MinuteHand, SecondHand, HandCap, Crown, CrownTube, PusherTop, PusherBottom, Caseback, CasebackGlass, Movement, Rotor, Balance, StrapTop, StrapBottom, Buckle`.

Materials by name: `M_Metal, M_MetalPolished, M_Ceramic, M_Dial, M_Lume, M_Signal, M_Sapphire, M_Strap, M_Movement`.

The procedural source is exported to `public/models/noir-x1.glb` (meshopt + webp). The runtime loads only the GLB and re-binds live material parameters by material name. Hands show the visitor's local time; the seconds hand steps at 8 Hz (28,800 vph). The rotor turns and the balance oscillates.

Materials: Titanium, Obsidian (black DLC), Carbon (forged carbon texture), Steel. Switching damps colour/roughness/metalness per frame, with a moving key-light sweep.

Collection variants (same GLB, re-parameterised): X1 Calibre (graphite dial), X2 Meridian (bone dial, 24-h bezel), X3 Abyss (black dive bezel, signal accents).

### 3.2 Scroll → pose

Every element carrying `data-pose="<name>"` is an anchor. `poseTrack` measures each anchor's centre in document space on refresh. For the viewport centre it finds the two surrounding anchors and interpolates their poses with a plateau ease, so poses hold while text is read. The result is written to a mutable singleton, and `CameraRig` damps toward it in `useFrame`, so there are no React renders on scroll. Pose tables exist for desktop (≥768 px) and mobile. Pose = watch position/rotation, camera position/target, key-light angle, variant, visibility.

Reduced motion: no interpolation. The rig snaps to the nearest anchor's pose behind a 200 ms canvas fade. Lenis is disabled.

### 3.3 Explore mode

A dialog state (`mode: 'explore'`). Lenis stops, the canvas takes pointer events, and OrbitControls run with damping, distance and polar limits, and touch pinch. Hotspots are `<button>`s projected from 3D anchors and hidden when back-facing. Selecting one opens a detail panel with the name and a line. Esc/close returns to the scroll pose. Keyboard: Tab through hotspots, arrow keys rotate, +/- zoom. Focus is trapped while in the mode.

### 3.4 Loading

A loader (wordmark, bezel ring whose 60 ticks fill with real `useProgress`, "LOADING EXPERIENCE"). On completion the ring expands as an iris (clip-path circle) revealing the stage. The watch dollies in and settles in about 1.8 s, then the hero lines reveal via masks.

### 3.5 Performance

- Canvas and GLB lazy-loaded; explore controls are a split chunk.
- DPR 1–2 driven by `PerformanceMonitor`.
- Three tiers:
  - **high:** transmission sapphire, shadows, 256 env.
  - **mid:** no transmission, DPR ≤1.5.
  - **low:** DPR 1, no shadows, reduced strap segments.
- Environment built from Lightformers once (`frames=1`).
- Indices are instanced.
- Canvas rendering pauses (`frameloop="demand"` equivalent) when fully covered (Story) or when the tab is hidden.
- No WebGL: the stage shows pose-matched stills.

### 3.6 Accessibility

- Semantic landmarks, one `h1`, and all copy in the DOM.
- Visible focus rings in the signal colour.
- Skip link.
- Material switch is a `radiogroup`.
- Header links are real anchors; the position rail is buttons with labels.
- Custom cursor only for `(hover: hover) and (pointer: fine)` and without reduced motion; the native cursor stays available on text.
- Contrast ≥ AA.

## 4. Testing

Playwright e2e:

- The page loads, the loader resolves, and the canvas exists.
- Each nav link scrolls to its section.
- Material radio changes the store and the aria state.
- Explore opens, Esc closes, and a hotspot opens its panel.
- The reduced-motion emulation path works.
- The mobile viewport shows the mobile menu.
- No console errors.

Screenshot review at 1440 and 390, then the Impeccable detector, the finish reviewer and the accessibility review.

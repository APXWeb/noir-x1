# NOIR X1 — launch experience

An experimental launch site for **NOIR**, a fictional premium watch brand, and its first reference, the **NOIR X1**. Built for the APX portfolio.

NOIR is fictional; every specification on the site is a concept specification.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build to dist/
npm run preview      # serve dist/ at http://localhost:4173
npm run test:e2e     # Playwright, desktop + mobile projects
```

Useful query params:

| Param | Effect |
| --- | --- |
| `?quality=high\|mid\|low` | Force a render tier (otherwise detected, then adapted by `PerformanceMonitor`) |
| `?nowebgl` | Force the no-WebGL path (pre-rendered stills) |
| `?still=<pose>` | Render one pose with no UI (used to produce stills) |

## How it works

**One persistent stage.** A single R3F `<Canvas>` is fixed behind the DOM (`src/three/Stage.tsx`). The narrative is ordinary semantic HTML.

**Scroll → pose.** Every element with `data-pose="<name>"` is an anchor (`src/animation/poseTrack.ts`).
- For the viewport centre, the two surrounding anchors' poses are blended with a plateau, so each composition holds while its text is read.
- `CameraRig` damps the watch and camera toward that pose every frame. Nothing re-renders React on scroll.
- Poses live in `src/data/poses.ts`, in a desktop table with mobile overrides. An aspect-ratio "fit" keeps compositions intact on portrait screens.

**Depth planes.** Display type sits in front of or behind the watch.
- Back-plane words live in a second sticky layer, `.scene__frame--back { z-index: -1 }`, beneath the transparent canvas.
- It must be a separate layer because a sticky element always forms a stacking context.

**Motion.**
- GSAP ScrollTrigger scrubs each scene's type (`useScene`), and Lenis smooths the scroll.
- Micro-interactions are CSS transitions on `transform` and `opacity` only.
- `prefers-reduced-motion` disables Lenis, snaps poses instead of blending them, and leaves content static and visible.

## The 3D model

`public/models/noir-x1.glb` is authored procedurally in `src/three/watch/buildWatch.ts`: lathe case, extruded lugs, knurled bezel and crown, domed sapphire, sunray dial with anisotropy, applied indices, hands, pushers, exhibition caseback with rotor and balance, and a swept rubber strap. Canvas textures (dial print, bezel, rehaut, caseback engraving, Côtes de Genève, forged carbon) are drawn in `textures.ts`. No third-party models, images or HDRIs are used; the studio lighting is built from virtual softboxes (`Lighting.tsx`).

```bash
npm run export:glb      # procedural source → GLB (Playwright + GLTFExporter) → gltf-transform (meshopt + webp)
npm run capture:stills  # renders public/stills/* from the real model (Story imagery + no-WebGL fallback)
```

### Replacing the model

Any artist-made `.glb` can replace `public/models/noir-x1.glb` if it follows the names in `src/three/watch/names.ts`:

- **Nodes:** `Head`, `Case`, `Lugs`, `Bezel`, `BezelInsert`, `Crystal`, `Dial`, `HourHand`, `MinuteHand`, `SecondHand`, `Crown`, `Caseback`, `Rotor`, `Balance`, `StrapTop`, `StrapBottom`, `Buckle`, …
- **Materials:** `M_Metal`, `M_MetalPolished`, `M_Ceramic`, `M_Dial`, `M_Lume`, `M_Signal`, `M_Sapphire`, `M_Strap`, `M_Movement`

`bindWatch.ts` finds these at runtime and uses them to:
- drive the hands (local time, 8 Hz sweep), rotor and balance;
- switch finishes and collection variants;
- fade the strap;
- anchor the callouts and hotspots.

The anchor points are in `src/three/points.ts`; adjust them if the new geometry differs.

## Structure

```
src/
  app/         App shell, still-render route
  components/  Header, Loader, PositionRail, Cursor, Cta, Callout, ExploreOverlay, FallbackStage, Wordmark
  sections/    Hero, Approach, Angles, Sweep, Profile, Engineering, Materials, Complete,
               ExploreIntro, Collection, Story, Finale, Footer
  three/       Stage, Lighting, CameraRig, WatchModel, ExploreControls, anchors/points, watch/*
  animation/   poseTrack, smoothScroll, useScene, exploreBus, easings
  data/        poses, scenes, specs, materials, collection, hotspots, story
  hooks/ state/ styles/ utils/
scripts/       export-glb, capture-stills, shoot (QA contact sheets)
tests/e2e/     Playwright suite
docs/          design spec, implementation plan, reference research (Taste)
```

## Performance

- The critical path is app, React and GSAP/Lenis, about 136 KB gzip.
- three, R3F and drei (285 KB gzip) and the GLB (≈620 KB) load lazily, in parallel with the loader.
- DPR is capped per tier.
- The sapphire uses real transmission only on the high tier.
- The environment map is rendered once.
- Rendering pauses while a DOM-led scene covers the stage or the tab is hidden.
- WebGL failure or context loss falls back to rendered stills.

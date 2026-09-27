# Product

<!-- impeccable:product-schema 1 -->

> Inferred from the user's written brief (2026-09-27). The user explicitly asked not to be interviewed on details; facts below marked *(inferred)* were not separately confirmed.

## Platform

web

## Stack

delegated: Vite + React + TypeScript, React Three Fiber + drei for the 3D product, GSAP + ScrollTrigger + Lenis for scroll choreography, zustand for shared UI/3D state. Chosen because the experience is one persistent WebGL scene choreographed by DOM scroll.

## Users

Primary: people viewing the APX studio portfolio — prospective clients, art directors and product teams judging whether APX can build a flagship launch experience *(inferred)*. Secondary (in-fiction): a buyer of premium watches exploring a new launch.

## Product Purpose

An experimental launch site for NOIR, a fictional premium watch brand, and its first watch, the NOIR X1. Success: within one viewport a visitor feels "this is not an ordinary website"; by the end they have explored the watch in real 3D and understand its engineering and materials.

## Positioning

NOIR's thesis: precision does not need to be loud. The site proves this by letting a real, rotatable 3D object carry the story, with very little text per scene.

## Capabilities and Constraints

- Real-time 3D watch model (GLB) integrated into the page; must accept a replacement `.glb` later.
- Scroll-driven 9-scene narrative, engineering specs, material switching (Titanium, Obsidian, Carbon, Steel), free-explore mode with hotspots, collection (X1, X2, X3), brand story, final CTA.
- Must work on desktop, notebook, tablet and a purpose-built mobile experience.
- Must degrade on weak hardware / no WebGL and honour reduced motion.
- No third-party models, photos or HDRIs with unclear licensing.

## Brand Commitments

- Name: NOIR (user allowed renaming; kept). Product: NOIR X1.
- Hero line: "Precision without compromise." CTA "Discover X1". Final: "Time, refined." CTA "Explore NOIR X1". Section: "Engineered to endure".
- Brand story seed: "NOIR was born from the idea that precision does not need to be loud."

## Evidence on Hand

None real. All specifications (Titanium Grade 5, sapphire crystal, automatic movement, 100 m) are conceptual and must be presented as such. No prices, retailers, testimonials or press may be invented.

## Product Principles

1. The product is the protagonist; interface recedes.
2. Every motion carries narrative function.
3. Little content per screen, maximum consequence.
4. Nothing essential lives only in animation or only in WebGL.

## Accessibility & Inclusion

Keyboard navigation, visible focus, WCAG AA contrast, reduced-motion alternative, labelled controls.

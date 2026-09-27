import type { VariantId } from './collection'

export type V3 = [number, number, number]

/**
 * A pose is a camera + object arrangement the scroll interpolates between.
 * Rotations are Euler degrees (XYZ) and are lerped per component, which lets a
 * pose ask for a full turn (e.g. 360°) between scenes.
 */
export interface Pose {
  /** Position readout shown in the rail: the calibrated test position. */
  label: string
  watch: { pos: V3; rot: V3; scale?: number }
  cam: { pos: V3; target: V3; fov?: number }
  /** Key light azimuth in degrees around the watch (0 = front-right). */
  key?: number
  /** Canvas presence 0..1 (fades the stage for DOM-led scenes). */
  stage?: number
  /** Weight 0..1 of a slow presentation sway layered on top (materials, finale). */
  spin?: number
  /** Strap presence 0..1 — faded out to show the caseback. */
  strap?: number
  variant?: VariantId
}

type PoseTable = Record<string, Pose>

const desktop: PoseTable = {
  hero: {
    label: 'Dial up',
    watch: { pos: [3.15, -0.2, 0], rot: [-12, -28, 7] },
    cam: { pos: [0, 0, 13], target: [0, 0, 0] },
    key: 20,
  },
  approach: {
    label: 'Dial up · close',
    watch: { pos: [0, -0.1, 0], rot: [-4, 6, 0] },
    cam: { pos: [0, 0, 7.4], target: [0, 0, 0] },
    key: 40,
  },
  rotate: {
    label: 'Crown up',
    watch: { pos: [-2.1, 0, 0], rot: [-6, -72, 0] },
    cam: { pos: [0, 0, 11.5], target: [0, 0, 0] },
    key: -30,
  },
  detail: {
    label: 'Dial up · seconds',
    watch: { pos: [0.4, 0, 0], rot: [-10, 12, 0] },
    cam: { pos: [1.6, 1.2, 4.6], target: [0.9, 0.55, 0.2] },
    key: 60,
  },
  profile: {
    label: 'Crown right · edge',
    watch: { pos: [-1.7, -0.1, 0], rot: [-84, 0, -6] },
    cam: { pos: [0, 0.3, 9.4], target: [0, 0, 0] },
    key: 10,
    strap: 0,
  },
  'eng-case': {
    label: 'Case · lugs',
    watch: { pos: [2.1, 0.1, 0], rot: [-24, -48, 10] },
    cam: { pos: [0, 0, 9.6], target: [0, 0, 0] },
    key: -20,
  },
  'eng-sapphire': {
    label: 'Crystal · grazing',
    watch: { pos: [1.55, -0.5, 0], rot: [-66, -14, 0] },
    cam: { pos: [0, 0.8, 9.2], target: [0, 0, 0] },
    key: 80,
  },
  'eng-movement': {
    label: 'Dial down',
    watch: { pos: [2.0, 0, 0], rot: [4, 198, -6] },
    cam: { pos: [0, 0, 8.8], target: [0, 0, 0] },
    key: 150,
    strap: 0,
  },
  'eng-water': {
    label: 'Crown up · seal',
    watch: { pos: [1.3, 0, 0], rot: [-8, -96, 0] },
    cam: { pos: [0, 0, 7.6], target: [0, 0, 0] },
    key: -40,
  },
  materials: {
    label: 'Dial up · finish',
    watch: { pos: [1.9, 0, 0], rot: [-14, -30, 4] },
    cam: { pos: [0, 0, 12], target: [0, 0, 0] },
    key: 30,
    spin: 1,
  },
  reveal: {
    label: 'Complete',
    watch: { pos: [0, 0.7, 1.9], rot: [22, -34, 0] },
    cam: { pos: [0, 0, 16.5], target: [0, 0, 0] },
    key: 45,
  },
  explore: {
    label: 'Invitation',
    watch: { pos: [2.3, 0, 0], rot: [-16, -40, 6] },
    cam: { pos: [0, 0, 12.5], target: [0, 0, 0] },
    key: 30,
    spin: 0.5,
  },
  'explore-mode': {
    label: 'Free',
    watch: { pos: [0, 0, 0], rot: [-10, -22, 0] },
    cam: { pos: [0, 0, 13], target: [0, 0, 0] },
    key: 30,
  },
  /* Studio stills: rendered once for the Story and the no-WebGL fallback. */
  'still-crown': {
    label: 'Still',
    watch: { pos: [-1.2, 0.3, 0], rot: [-6, -64, 8] },
    cam: { pos: [0, 0, 6.2], target: [0, 0, 0] },
    key: -50,
  },
  'still-caseback': {
    label: 'Still',
    watch: { pos: [0, 0, 0], rot: [8, 204, -12] },
    cam: { pos: [0, 0, 7.4], target: [0, 0, 0] },
    key: 160,
    strap: 0,
  },
  'still-dial': {
    label: 'Still',
    watch: { pos: [0, -0.3, 0], rot: [-58, 0, -30] },
    cam: { pos: [0, 0, 6.8], target: [0, 0, 0] },
    key: 100,
    strap: 0,
  },
  x1: {
    label: 'X1 Calibre',
    watch: { pos: [-2.5, 0, 0], rot: [-10, 24, -4] },
    cam: { pos: [0, 0, 12.5], target: [0, 0, 0] },
    key: 20,
    variant: 'x1',
  },
  x2: {
    label: 'X2 Meridian',
    watch: { pos: [-2.5, 0, 0], rot: [-10, 24 + 360, -4] },
    cam: { pos: [0, 0, 12.5], target: [0, 0, 0] },
    key: 20,
    variant: 'x2',
  },
  x3: {
    label: 'X3 Abyss',
    watch: { pos: [-2.5, 0, 0], rot: [-10, 24 + 720, -4] },
    cam: { pos: [0, 0, 12.5], target: [0, 0, 0] },
    key: 20,
    variant: 'x3',
  },
  story: {
    label: 'At rest',
    watch: { pos: [0, -1.5, -4], rot: [-60, 20 + 720, 0] },
    cam: { pos: [0, 0, 14], target: [0, 0, 0] },
    stage: 0,
  },
  finale: {
    label: 'Dial up · final',
    watch: { pos: [0, -0.35, 0], rot: [-20, -16 + 720, 0] },
    cam: { pos: [0, -1.4, 10.5], target: [0, -0.1, 0] },
    key: 90,
    spin: 0.6,
  },
}

/** Mobile overrides: the watch leads from the upper half, text lives below. */
const mobileOverrides: Partial<Record<string, Partial<Pose>>> = {
  hero: { watch: { pos: [0, 1.15, 0], rot: [-12, -24, 6] }, cam: { pos: [0, 0, 16.5], target: [0, 0, 0] } },
  approach: { watch: { pos: [0, 0.8, 0], rot: [-4, 6, 0] }, cam: { pos: [0, 0, 12], target: [0, 0, 0] } },
  rotate: { watch: { pos: [0, 1.1, 0], rot: [-6, -72, 0] }, cam: { pos: [0, 0, 15], target: [0, 0, 0] } },
  detail: { watch: { pos: [0, 0.6, 0], rot: [-10, 12, 0] }, cam: { pos: [0.9, 1.6, 6.4], target: [0.6, 1.0, 0.2] } },
  profile: { watch: { pos: [0, 1.3, 0], rot: [-84, 0, -6] }, cam: { pos: [0, 0.3, 13], target: [0, 0, 0] } },
  'eng-case': { watch: { pos: [0, 1.5, 0], rot: [-24, -48, 10] }, cam: { pos: [0, 0, 14], target: [0, 0, 0] } },
  'eng-sapphire': { watch: { pos: [0, 1.2, 0], rot: [-66, -14, 0] }, cam: { pos: [0, 0.8, 13], target: [0, 0, 0] } },
  'eng-movement': { watch: { pos: [0, 1.5, 0], rot: [4, 198, -6] }, cam: { pos: [0, 0, 14], target: [0, 0, 0] } },
  'eng-water': { watch: { pos: [-0.4, 1.5, 0], rot: [-8, -96, 0] }, cam: { pos: [0, 0, 13], target: [0, 0, 0] } },
  materials: { watch: { pos: [0, 1.3, 0], rot: [-14, -30, 4] }, cam: { pos: [0, 0, 15.5], target: [0, 0, 0] } },
  reveal: { watch: { pos: [0, 1.6, 1.9], rot: [22, -34, 0] }, cam: { pos: [0, 0, 27], target: [0, 0, 0] } },
  explore: { watch: { pos: [0, 1.2, 0], rot: [-16, -40, 6] }, cam: { pos: [0, 0, 16], target: [0, 0, 0] } },
  'explore-mode': { watch: { pos: [0, 0.3, 0], rot: [-10, -22, 0] }, cam: { pos: [0, 0, 17], target: [0, 0, 0] } },
  x1: { watch: { pos: [0, 1.4, 0], rot: [-10, 24, -4] }, cam: { pos: [0, 0, 16], target: [0, 0, 0] } },
  x2: { watch: { pos: [0, 1.4, 0], rot: [-10, 24 + 360, -4] }, cam: { pos: [0, 0, 16], target: [0, 0, 0] } },
  x3: { watch: { pos: [0, 1.4, 0], rot: [-10, 24 + 720, -4] }, cam: { pos: [0, 0, 16], target: [0, 0, 0] } },
  finale: { watch: { pos: [0, 0.9, 0], rot: [-20, -16 + 720, 0] }, cam: { pos: [0, -1.4, 15], target: [0, -0.1, 0] } },
}

const mobile: PoseTable = Object.fromEntries(
  Object.entries(desktop).map(([k, p]) => [k, { ...p, ...mobileOverrides[k] } as Pose]),
)

/** Where the watch sits before the intro brings it into the hero. */
export const INTRO_FROM = {
  desktop: { pos: [2.6, -0.9, -6] as V3, rot: [-50, -120, 24] as V3 },
  mobile: { pos: [0, 0.4, -7] as V3, rot: [-50, -120, 24] as V3 },
}

export const POSES = { desktop, mobile }
export type PoseName = keyof typeof desktop

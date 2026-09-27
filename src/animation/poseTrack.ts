import { POSES, type Pose, type V3 } from '../data/poses'
import { smootherstep, clamp01, lerp } from '../utils/math'

/**
 * Scroll → pose. Any element with `data-pose="<name>"` is an anchor; its
 * vertical centre in document space is where that pose is fully reached.
 * Between two anchors the pose blends with a plateau, so each composition
 * holds while its text is being read.
 *
 * The resolved pose lives in a mutable singleton read inside useFrame; the
 * scroll path never triggers React renders.
 */

export interface Resolved {
  watchPos: V3
  watchRot: V3
  scale: number
  camPos: V3
  camTarget: V3
  fov: number
  key: number
  stage: number
  spin: number
  strap: number
}

interface Anchor {
  el: HTMLElement
  name: string
  center: number
}

const blank = (): Resolved => ({
  watchPos: [0, 0, 0],
  watchRot: [0, 0, 0],
  scale: 1,
  camPos: [0, 0, 13],
  camTarget: [0, 0, 0],
  fov: 30,
  key: 0,
  stage: 1,
  spin: 0,
  strap: 1,
})

export const track = {
  anchors: [] as Anchor[],
  resolved: blank(),
  /** Index of the anchor whose pose dominates (for the rail + discrete state). */
  nearest: 0,
  /** Name of the dominant pose. */
  nearestName: 'hero',
  /** When true the rig jumps between poses instead of blending. */
  reduced: false,
  mobile: false,
}

const listeners = new Set<() => void>()
export const onTrackChange = (fn: () => void) => {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function table() {
  return track.mobile ? POSES.mobile : POSES.desktop
}

export function poseOf(name: string): Pose {
  const t = table()
  return t[name] ?? t.hero
}

export function measureAnchors() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-pose]'))
  const sy = window.scrollY
  track.anchors = els.map((el) => {
    const r = el.getBoundingClientRect()
    return { el, name: el.dataset.pose!, center: r.top + sy + r.height / 2 }
  })
}

const lerp3 = (a: V3, b: V3, t: number, out: V3) => {
  out[0] = lerp(a[0], b[0], t)
  out[1] = lerp(a[1], b[1], t)
  out[2] = lerp(a[2], b[2], t)
}

export function blendPoses(a: Pose, b: Pose, t: number, out: Resolved) {
  lerp3(a.watch.pos, b.watch.pos, t, out.watchPos)
  lerp3(a.watch.rot, b.watch.rot, t, out.watchRot)
  lerp3(a.cam.pos, b.cam.pos, t, out.camPos)
  lerp3(a.cam.target, b.cam.target, t, out.camTarget)
  out.scale = lerp(a.watch.scale ?? 1, b.watch.scale ?? 1, t)
  out.fov = lerp(a.cam.fov ?? 30, b.cam.fov ?? 30, t)
  out.key = lerp(a.key ?? 0, b.key ?? 0, t)
  out.stage = lerp(a.stage ?? 1, b.stage ?? 1, t)
  out.spin = lerp(a.spin ?? 0, b.spin ?? 0, t)
  out.strap = lerp(a.strap ?? 1, b.strap ?? 1, t)
  return out
}

/** Resolve the pose for the current scroll position. */
export function updateTrack(scrollY: number, viewport: number) {
  const list = track.anchors
  if (!list.length) return
  const y = scrollY + viewport / 2
  let i = 0
  while (i < list.length - 1 && list[i + 1].center <= y) i++
  const a = list[i]
  const b = list[Math.min(i + 1, list.length - 1)]
  const span = b.center - a.center
  const raw = span > 0 ? clamp01((y - a.center) / span) : 0
  // Plateau: hold the first 18% and last 18% of the span.
  const t = track.reduced ? (raw < 0.5 ? 0 : 1) : smootherstep(clamp01((raw - 0.18) / 0.64))
  blendPoses(poseOf(a.name), poseOf(b.name), t, track.resolved)

  const nearest = raw < 0.5 ? i : Math.min(i + 1, list.length - 1)
  if (nearest !== track.nearest || list[nearest].name !== track.nearestName) {
    track.nearest = nearest
    track.nearestName = list[nearest].name
    listeners.forEach((fn) => fn())
  }
}

if (import.meta.env.DEV) (window as unknown as { __track: typeof track }).__track = track

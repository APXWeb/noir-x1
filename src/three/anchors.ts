import * as THREE from 'three'

/**
 * 3D points on the watch projected to screen space each frame. DOM callouts
 * and hotspots read `projected` without touching React state.
 */
export interface ScreenPoint {
  x: number
  y: number
  /** 1 when the point's surface faces the camera, fading to 0 when it turns away. */
  facing: number
}

export interface AnchorDef {
  /** Node the point is attached to (moves with it, e.g. the seconds hand). */
  node: string
  local: [number, number, number]
  /** Surface normal in node-local space for facing checks. */
  normal: [number, number, number]
}

export const ANCHORS: Record<string, AnchorDef> = {
  crown: { node: 'Head', local: [2.46, 0, -0.1], normal: [1, 0, 0] },
  secondsTip: { node: 'SecondHand', local: [0, 1.5, 0.01], normal: [0, 0, 1] },
  lug: { node: 'Head', local: [1.22, 2.45, 0.02], normal: [0.2, 0.6, 0.77] },
  crystal: { node: 'Head', local: [-0.9, 0.9, 0.46], normal: [0, 0, 1] },
  caseback: { node: 'Head', local: [0.2, -0.3, -0.62], normal: [0, 0, -1] },
  bezel: { node: 'Head', local: [1.35, 1.35, 0.41], normal: [0, 0, 1] },
  dial: { node: 'Head', local: [0, -0.9, 0.12], normal: [0, 0, 1] },
  pusher: { node: 'Head', local: [2.3, 1.2, -0.1], normal: [0.87, 0.5, 0] },
  strap: { node: 'StrapBottom', local: [0, -3.05, -2.7], normal: [0, -0.6, 0.8] },
  edgeTop: { node: 'Head', local: [-2.05, 0, 0.41], normal: [-1, 0, 0] },
  edgeBottom: { node: 'Head', local: [-2.05, 0, -0.6], normal: [-1, 0, 0] },
}

export const projected: Record<string, ScreenPoint> = Object.fromEntries(
  Object.keys(ANCHORS).map((k) => [k, { x: -9999, y: -9999, facing: 0 }]),
)

const v = new THREE.Vector3()
const n = new THREE.Vector3()
const toCam = new THREE.Vector3()
const nm = new THREE.Matrix3()

export function projectAnchors(nodes: Record<string, THREE.Object3D | undefined>, camera: THREE.Camera, width: number, height: number) {
  for (const key in ANCHORS) {
    const def = ANCHORS[key]
    const node = nodes[def.node]
    if (!node) continue
    v.set(...def.local)
    node.localToWorld(v)
    toCam.copy(camera.position).sub(v).normalize()
    nm.getNormalMatrix(node.matrixWorld)
    n.set(...def.normal).applyMatrix3(nm).normalize()
    const facing = THREE.MathUtils.smoothstep(n.dot(toCam), -0.05, 0.3)
    v.project(camera)
    const p = projected[key]
    p.x = (v.x * 0.5 + 0.5) * width
    p.y = (-v.y * 0.5 + 0.5) * height
    p.facing = v.z < 1 ? facing : 0
  }
}

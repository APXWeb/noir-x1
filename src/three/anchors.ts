import * as THREE from 'three'
import { ANCHORS, projected } from './points'

/** Projects the named anchor points to screen space (called from the render loop). */
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

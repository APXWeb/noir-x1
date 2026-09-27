import * as THREE from 'three'
import { MAT, NODE } from './names'
import { createBezelTexture, createDialTexture, createForgedCarbon, type BezelStyle, type DialStyle } from './textures'
import { finishById, type MaterialId } from '../../data/materials'
import type { Quality } from '../../state/store'

/**
 * Binds a loaded GLB (ours, or any replacement following names.ts) to the
 * runtime: finds animated nodes, upgrades metals to physical materials and
 * exposes a target-based material system the frame loop damps toward.
 */

export interface BoundWatch {
  root: THREE.Object3D
  nodes: Record<string, THREE.Object3D | undefined>
  mats: Partial<Record<string, THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial>>
  /** Current look targets. */
  target: {
    metal: THREE.Color
    metalRough: number
    metalMetalness: number
    metalClearcoat: number
    carbon: boolean
    polished: THREE.Color
    polishedRough: number
    strap: THREE.Color
  }
  dialStyle: DialStyle
  bezelStyle: BezelStyle
}

function toPhysical(src: THREE.MeshStandardMaterial) {
  if ((src as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial) return src as THREE.MeshPhysicalMaterial
  const p = new THREE.MeshPhysicalMaterial()
  THREE.MeshStandardMaterial.prototype.copy.call(p, src)
  p.defines = { STANDARD: '', PHYSICAL: '' }
  p.name = src.name
  return p
}

export function bindWatch(scene: THREE.Object3D): BoundWatch {
  const nodes: BoundWatch['nodes'] = {}
  const mats: BoundWatch['mats'] = {}
  const upgrade = new Set<string>([MAT.metal, MAT.metalPolished])
  const upgraded = new Map<THREE.Material, THREE.MeshPhysicalMaterial>()

  scene.traverse((o) => {
    if (o.name) nodes[o.name] = o
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = true
    mesh.receiveShadow = true
    const m = mesh.material as THREE.MeshStandardMaterial
    if (upgrade.has(m.name)) {
      let p = upgraded.get(m)
      if (!p) {
        p = toPhysical(m)
        upgraded.set(m, p)
      }
      mesh.material = p
      mats[m.name] = p
    } else if (m.name) {
      mats[m.name] = m
    }
    if (m.name === MAT.sapphire) {
      mesh.castShadow = false
      mesh.renderOrder = 2
    }
  })

  // The buckle gets its own copy of the polished metal so it can fade with the strap.
  const buckle = nodes[NODE.buckle] as THREE.Mesh | undefined
  if (buckle && mats[MAT.metalPolished]) {
    const bm = (mats[MAT.metalPolished] as THREE.MeshPhysicalMaterial).clone()
    bm.name = 'M_Buckle'
    buckle.material = bm
    mats['M_Buckle'] = bm
  }

  const dial = mats[MAT.dial]
  if (dial?.map) dial.map.anisotropy = 8

  return {
    root: scene,
    nodes,
    mats,
    target: {
      metal: new THREE.Color(),
      metalRough: 0.34,
      metalMetalness: 1,
      metalClearcoat: 0,
      carbon: false,
      polished: new THREE.Color(),
      polishedRough: 0.12,
      strap: new THREE.Color(),
    },
    dialStyle: 'calibre',
    bezelStyle: 'calibre',
  }
}

/* ------------------------------------------------------ look + variants */

const textureCache = new Map<string, THREE.Texture>()
const cached = (key: string, make: () => THREE.Texture) => {
  let t = textureCache.get(key)
  if (!t) {
    t = make()
    textureCache.set(key, t)
  }
  return t
}

let originalDial: THREE.Texture | null = null
let originalBezel: THREE.Texture | null = null

export function setFinish(w: BoundWatch, id: MaterialId) {
  const f = finishById(id)
  w.target.metal.set(f.metal.color)
  w.target.metalRough = f.metal.roughness
  w.target.metalMetalness = f.metal.metalness
  w.target.metalClearcoat = f.metal.clearcoat
  w.target.polished.set(f.polished.color)
  w.target.polishedRough = f.polished.roughness
  w.target.strap.set(f.strap)

  const metal = w.mats[MAT.metal] as THREE.MeshPhysicalMaterial | undefined
  if (metal && w.target.carbon !== !!f.metal.carbon) {
    w.target.carbon = !!f.metal.carbon
    metal.map = w.target.carbon ? cached('carbon', createForgedCarbon) : null
    metal.needsUpdate = true
  }
}

export function setDialAndBezel(w: BoundWatch, dial: DialStyle, bezel: BezelStyle) {
  const dm = w.mats[MAT.dial]
  const bm = w.mats[MAT.ceramic]
  if (dm && dial !== w.dialStyle) {
    originalDial ??= dm.map
    dm.map = dial === 'calibre' && originalDial ? originalDial : cached(`dial-${dial}`, () => createDialTexture(dial))
    // A bone dial reads better slightly less metallic.
    dm.metalness = dial === 'meridian' ? 0.35 : 0.65
    dm.needsUpdate = true
    w.dialStyle = dial
  }
  if (bm && bezel !== w.bezelStyle) {
    originalBezel ??= bm.map
    bm.map = bezel === 'calibre' && originalBezel ? originalBezel : cached(`bezel-${bezel}`, () => createBezelTexture(bezel))
    bm.needsUpdate = true
    w.bezelStyle = bezel
  }
}

export function applyQuality(w: BoundWatch, q: Quality) {
  const s = w.mats[MAT.sapphire] as THREE.MeshPhysicalMaterial | undefined
  if (!s) return
  const cheap = q !== 'high'
  s.transmission = cheap ? 0 : 1
  s.transparent = cheap
  s.opacity = cheap ? 0.16 : 1
  s.depthWrite = !cheap
  s.needsUpdate = true
}

/** Per-frame damping toward the current look. */
export function stepLook(w: BoundWatch, dt: number) {
  const k = 1 - Math.exp(-5 * dt)
  const metal = w.mats[MAT.metal] as THREE.MeshPhysicalMaterial | undefined
  const pol = w.mats[MAT.metalPolished] as THREE.MeshPhysicalMaterial | undefined
  const strap = w.mats[MAT.strap]
  if (metal) {
    metal.color.lerp(w.target.metal, k)
    metal.roughness += (w.target.metalRough - metal.roughness) * k
    metal.metalness += (w.target.metalMetalness - metal.metalness) * k
    metal.clearcoat += (w.target.metalClearcoat - metal.clearcoat) * k
  }
  for (const m of [pol, w.mats['M_Buckle']]) {
    if (!m) continue
    m.color.lerp(w.target.polished, k)
    m.roughness += (w.target.polishedRough - m.roughness) * k
  }
  strap?.color.lerp(w.target.strap, k)
}

/** Local time on the hands; the seconds hand steps at 8 Hz like a 28 800 vph movement. */
export function stepMovement(w: BoundWatch, elapsed: number, dt: number) {
  const now = new Date()
  const s = now.getSeconds() + Math.floor(now.getMilliseconds() / 125) / 8
  const m = now.getMinutes() + s / 60
  const h = (now.getHours() % 12) + m / 60
  const TAU = Math.PI * 2
  const { nodes } = w
  if (nodes[NODE.secondHand]) nodes[NODE.secondHand]!.rotation.z = -(s / 60) * TAU
  if (nodes[NODE.minuteHand]) nodes[NODE.minuteHand]!.rotation.z = -(m / 60) * TAU
  if (nodes[NODE.hourHand]) nodes[NODE.hourHand]!.rotation.z = -(h / 12) * TAU
  if (nodes[NODE.rotor]) nodes[NODE.rotor]!.rotation.z += dt * (0.35 + 0.25 * Math.sin(elapsed * 0.4))
  if (nodes[NODE.balance]) nodes[NODE.balance]!.rotation.z = Math.sin(elapsed * TAU * 4) * 1.4
}

/** Fades the strap and buckle (0 = gone) so the caseback can be shown. */
export function setStrapPresence(w: BoundWatch, v: number) {
  const opaque = v > 0.995
  for (const name of [MAT.strap, 'M_Buckle']) {
    const m = w.mats[name]
    if (!m) continue
    if (m.transparent === opaque) {
      m.transparent = !opaque
      m.needsUpdate = true
    }
    m.opacity = v
    m.depthWrite = v > 0.6
  }
  for (const n of [NODE.strapTop, NODE.strapBottom, NODE.buckle]) {
    const o = w.nodes[n]
    if (o) o.visible = v > 0.01
  }
}

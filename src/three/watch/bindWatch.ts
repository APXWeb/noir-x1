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

  // Lugs share the case finish but have world-scale UVs: give them their own
  // material so a patterned finish (forged carbon) can be scaled to them.
  const lugs = nodes[NODE.lugs] as THREE.Mesh | undefined
  // Idempotent: React may bind the same cached scene more than once.
  if (lugs && mats[MAT.metal]) {
    let lm = lugs.material as THREE.MeshPhysicalMaterial
    if (lm.name !== 'M_Lugs') {
      lm = (mats[MAT.metal] as THREE.MeshPhysicalMaterial).clone()
      lm.name = 'M_Lugs'
      lugs.material = lm
    }
    mats['M_Lugs'] = lm
  }

  // The buckle gets its own copy of the polished metal so it can fade with the strap.
  const buckle = nodes[NODE.buckle] as THREE.Mesh | undefined
  if (buckle && mats[MAT.metalPolished]) {
    let bm = buckle.material as THREE.MeshPhysicalMaterial
    if (bm.name !== 'M_Buckle') {
      bm = (mats[MAT.metalPolished] as THREE.MeshPhysicalMaterial).clone()
      bm.name = 'M_Buckle'
      buckle.material = bm
    }
    mats['M_Buckle'] = bm
    const tang = nodes[NODE.tang] as THREE.Mesh | undefined
    if (tang) tang.material = bm
  }

  // Rest positions for the exploded view.
  for (const name in EXPLODE) {
    const o = nodes[name]
    if (o && !o.userData.rest) o.userData.rest = o.position.clone()
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

  // Circular brushing on the case flank and lugs; forged carbon has none.
  for (const name of [MAT.metal, 'M_Lugs']) {
    const m = w.mats[name] as THREE.MeshPhysicalMaterial | undefined
    const aniso = f.metal.carbon ? 0 : 0.6
    if (m && m.anisotropy !== aniso) {
      m.anisotropy = aniso
      m.needsUpdate = true
    }
  }
  if (w.target.carbon !== !!f.metal.carbon) {
    w.target.carbon = !!f.metal.carbon
    const pairs: [string, () => THREE.Texture][] = [
      [MAT.metal, () => cached('carbon', () => createForgedCarbon([3, 0.5]))],
      ['M_Lugs', () => cached('carbon-lugs', () => createForgedCarbon([0.9, 0.9]))],
    ]
    for (const [name, tex] of pairs) {
      const m = w.mats[name] as THREE.MeshPhysicalMaterial | undefined
      if (!m) continue
      const carbon = w.target.carbon ? tex() : null
      // Fibre pattern in the albedo; the resin's gloss comes from the clearcoat above it.
      m.map = carbon
      m.needsUpdate = true
    }
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

/**
 * Transmissive materials render without blending, so whatever alpha they
 * compute lands in the canvas. On a transparent canvas that lets the DOM's
 * back-plane type show through the watch; clamp it to fully opaque. (The
 * cheaper tiers use an ordinary blended crystal and are unaffected.)
 */
function forceOpaqueAlpha(m: THREE.Material) {
  if (m.userData.opaqueAlpha) return
  m.userData.opaqueAlpha = true
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      ['#include <dithering_fragment>', '#ifdef USE_TRANSMISSION', '  gl_FragColor.a = 1.0;', '#endif'].join('\n'),
    )
  }
  m.customProgramCacheKey = () => 'opaque-alpha'
}

export function applyQuality(w: BoundWatch, q: Quality) {
  const s = w.mats[MAT.sapphire] as THREE.MeshPhysicalMaterial | undefined
  if (!s) return
  forceOpaqueAlpha(s)
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
  for (const m of [metal, w.mats['M_Lugs'] as THREE.MeshPhysicalMaterial | undefined]) {
    if (!m) continue
    m.color.lerp(w.target.metal, k)
    m.roughness += (w.target.metalRough - m.roughness) * k
    m.metalness += (w.target.metalMetalness - m.metalness) * k
    m.clearcoat += (w.target.metalClearcoat - m.clearcoat) * k
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
  for (const n of [NODE.strapTop, NODE.strapBottom, NODE.buckle, NODE.tang, NODE.keepers]) {
    const o = w.nodes[n]
    if (o) o.visible = v > 0.01
  }
}

/**
 * Exploded view: each layer's offset from rest, in head units (1 = 10 mm).
 * Along Z for the stack; the crown and pushers pull out radially.
 */
export const EXPLODE: Record<string, [number, number, number]> = {
  [NODE.crystal]: [0, 0, 1.6],
  [NODE.bezel]: [0, 0, 1.1],
  [NODE.bezelInsert]: [0, 0, 1.1],
  [NODE.handCap]: [0, 0, 0.8],
  [NODE.secondHand]: [0, 0, 0.74],
  [NODE.minuteHand]: [0, 0, 0.6],
  [NODE.hourHand]: [0, 0, 0.46],
  [NODE.indices]: [0, 0, 0.3],
  [NODE.indexLume]: [0, 0, 0.3],
  [NODE.dial]: [0, 0, 0.2],
  [NODE.rehaut]: [0, 0, 0.2],
  [NODE.movement]: [0, 0, -0.4],
  Jewels: [0, 0, -0.75],
  [NODE.wheels]: [0, 0, -0.6],
  [NODE.bridges]: [0, 0, -0.8],
  [NODE.screws]: [0, 0, -0.9],
  [NODE.balance]: [0, 0, -0.85],
  [NODE.rotor]: [0, 0, -1.2],
  [NODE.caseback]: [0, 0, -1.6],
  CasebackEngraving: [0, 0, -1.6],
  [NODE.casebackGlass]: [0, 0, -1.6],
  [NODE.crown]: [0.7, 0, 0],
  [NODE.crownTube]: [0.35, 0, 0],
  [NODE.pusherTop]: [0.5 * Math.cos(Math.PI / 5.2), 0.5 * Math.sin(Math.PI / 5.2), 0],
  [NODE.pusherBottom]: [0.5 * Math.cos(Math.PI / 5.2), -0.5 * Math.sin(Math.PI / 5.2), 0],
}

export function stepExplode(w: BoundWatch, t: number) {
  for (const name in EXPLODE) {
    const o = w.nodes[name]
    const rest = o?.userData.rest as THREE.Vector3 | undefined
    if (!o || !rest) continue
    const [x, y, z] = EXPLODE[name]
    o.position.set(rest.x + x * t, rest.y + y * t, rest.z + z * t)
  }
}

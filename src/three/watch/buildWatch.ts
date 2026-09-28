import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MAT, NODE } from './names'
import { createStrapGeometry } from './strap'
import {
  createBezelTexture,
  createCasebackTexture,
  createDialTexture,
  createMovementTexture,
  createRehautTexture,
  createRotorTexture,
  createStrapNormal,
  createSunrayAnisotropy,
} from './textures'

/**
 * NOIR X1 — procedural source model. 1 unit = 10 mm.
 * Dial faces +Z, 12 o'clock is +Y, the crown sits at 3 o'clock (+X).
 * This is the authoring source for public/models/noir-x1.glb.
 */

const V2 = (x: number, y: number) => new THREE.Vector2(x, y)

/** Lathe around Y, then turn Y → Z so the axis runs through the dial. */
function latheZ(points: THREE.Vector2[], segments = 128) {
  const g = new THREE.LatheGeometry(points, segments)
  g.rotateX(Math.PI / 2)
  return g
}

/** Adds a knurled (coin-edge) ridge to vertices beyond `minR` around the Z axis. */
function knurl(g: THREE.BufferGeometry, minR: number, teeth: number, depth: number) {
  const pos = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const r = Math.hypot(x, y)
    if (r < minR) continue
    const a = Math.atan2(y, x)
    const k = 1 - depth * (0.5 + 0.5 * Math.sign(Math.sin(a * teeth)))
    pos.setXY(i, x * k, y * k)
  }
  g.computeVertexNormals()
}

function extrude(shape: THREE.Shape, depth: number, bevel = 0.006, segs = 2) {
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: segs,
    curveSegments: 24,
  })
}

function mesh(name: string, geo: THREE.BufferGeometry, mat: THREE.Material) {
  const m = new THREE.Mesh(geo, mat)
  m.name = name
  m.castShadow = true
  m.receiveShadow = true
  return m
}

export interface WatchMaterials {
  metal: THREE.MeshPhysicalMaterial
  metalPolished: THREE.MeshPhysicalMaterial
  ceramic: THREE.MeshPhysicalMaterial
  dial: THREE.MeshPhysicalMaterial
  lume: THREE.MeshStandardMaterial
  signal: THREE.MeshStandardMaterial
  sapphire: THREE.MeshPhysicalMaterial
  strap: THREE.MeshPhysicalMaterial
  movement: THREE.MeshStandardMaterial
  engraving: THREE.MeshStandardMaterial
}

export function createDefaultMaterials(): WatchMaterials {
  const metal = new THREE.MeshPhysicalMaterial({ name: MAT.metal, color: '#9da2a7', metalness: 1, roughness: 0.34 })
  const metalPolished = new THREE.MeshPhysicalMaterial({ name: MAT.metalPolished, color: '#c7cbcf', metalness: 1, roughness: 0.12 })
  const ceramic = new THREE.MeshPhysicalMaterial({
    name: MAT.ceramic,
    map: createBezelTexture('calibre'),
    metalness: 0,
    roughness: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  })
  const dial = new THREE.MeshPhysicalMaterial({
    name: MAT.dial,
    map: createDialTexture('calibre'),
    metalness: 0.65,
    roughness: 0.34,
    anisotropy: 0.85,
    anisotropyMap: createSunrayAnisotropy(),
  })
  const lume = new THREE.MeshStandardMaterial({ name: MAT.lume, color: '#e9e6da', roughness: 0.6, emissive: '#c9d6b8', emissiveIntensity: 0.06 })
  const signal = new THREE.MeshStandardMaterial({ name: MAT.signal, color: '#ff5a1f', roughness: 0.38, metalness: 0.15 })
  const sapphire = new THREE.MeshPhysicalMaterial({
    name: MAT.sapphire,
    color: '#ffffff',
    metalness: 0,
    roughness: 0.02,
    transmission: 1,
    thickness: 0.12,
    ior: 1.77,
    specularIntensity: 1,
    envMapIntensity: 1.4,
  })
  const strap = new THREE.MeshPhysicalMaterial({
    name: MAT.strap,
    color: '#151617',
    roughness: 0.72,
    metalness: 0,
    normalMap: createStrapNormal(),
    normalScale: new THREE.Vector2(0.6, 0.6),
    sheen: 0.4,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color('#3a3c40'),
  })
  const movement = new THREE.MeshStandardMaterial({ name: MAT.movement, map: createMovementTexture(), metalness: 1, roughness: 0.3 })
  const engraving = new THREE.MeshStandardMaterial({ name: MAT.engraving, map: createCasebackTexture(), metalness: 1, roughness: 0.4 })
  return { metal, metalPolished, ceramic, dial, lume, signal, sapphire, strap, movement, engraving }
}

/* ------------------------------------------------------------ components */

function buildCase(m: WatchMaterials) {
  const g = latheZ(
    [
      V2(1.7, -0.5),
      V2(1.9, -0.49),
      V2(2.0, -0.42),
      V2(2.045, -0.3),
      V2(2.05, -0.18),
      V2(2.05, 0.14),
      V2(2.03, 0.22),
      V2(1.99, 0.27),
      V2(1.74, 0.28),
    ],
    160,
  )
  return mesh(NODE.case, g, m.metal)
}

function buildLugs(m: WatchMaterials) {
  const parts: THREE.BufferGeometry[] = []
  const basis = new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0))
  for (const sy of [1, -1]) {
    for (const sx of [1, -1]) {
      // Side profile in (y, z): swept, tapering, curving toward the wrist.
      const s = new THREE.Shape()
      s.moveTo(1.55, 0.2)
      s.bezierCurveTo(1.95, 0.2, 2.35, 0.12, 2.62, -0.04)
      s.quadraticCurveTo(2.7, -0.1, 2.66, -0.2)
      s.lineTo(2.5, -0.3)
      s.bezierCurveTo(2.2, -0.34, 1.9, -0.42, 1.55, -0.44)
      s.closePath()
      const g = extrude(s, 0.36, 0.035, 4)
      g.applyMatrix4(basis)
      g.translate(sx > 0 ? 1.03 : -1.03 - 0.36, 0, 0)
      if (sy < 0) g.scale(1, -1, 1)
      // Mirroring flips winding; flip index order back.
      if (sy < 0) {
        const idx = g.index
        if (idx) {
          for (let i = 0; i < idx.count; i += 3) {
            const a = idx.getX(i + 1)
            idx.setX(i + 1, idx.getX(i + 2))
            idx.setX(i + 2, a)
          }
        } else {
          const pos = g.attributes.position as THREE.BufferAttribute
          const uv = g.attributes.uv as THREE.BufferAttribute
          for (let i = 0; i < pos.count; i += 3) {
            for (const attr of [pos, uv]) {
              const size = attr.itemSize
              const tmp = Array.from({ length: size }, (_, k) => attr.getComponent(i + 1, k))
              for (let k = 0; k < size; k++) attr.setComponent(i + 1, k, attr.getComponent(i + 2, k))
              for (let k = 0; k < size; k++) attr.setComponent(i + 2, k, tmp[k])
            }
          }
        }
        g.computeVertexNormals()
      }
      g.clearGroups()
      parts.push(g.index ? g.toNonIndexed() : g)
    }
  }
  const merged = mergeGeometries(parts)!
  merged.computeVertexNormals()
  return mesh(NODE.lugs, merged, m.metal)
}

function buildBezel(m: WatchMaterials) {
  const g = latheZ(
    [
      V2(1.73, 0.28),
      V2(1.74, 0.37),
      V2(1.78, 0.405),
      V2(1.8, 0.405),
      V2(1.98, 0.405),
      V2(2.0, 0.405),
      V2(2.035, 0.385),
      V2(2.045, 0.33),
      V2(2.03, 0.285),
    ],
    480,
  )
  knurl(g, 2.02, 120, 0.004)
  const bezel = mesh(NODE.bezel, g, m.metalPolished)

  const ring = new THREE.RingGeometry(1.8, 1.98, 160, 1)
  ring.translate(0, 0, 0.407)
  const insert = mesh(NODE.bezelInsert, ring, m.ceramic)
  return [bezel, insert]
}

function buildCrystal(m: WatchMaterials) {
  const g = latheZ(
    [V2(0.001, 0.475), V2(0.7, 0.47), V2(1.3, 0.455), V2(1.66, 0.43), V2(1.75, 0.41), V2(1.76, 0.38), V2(1.76, 0.3)],
    128,
  )
  const c = mesh(NODE.crystal, g, m.sapphire)
  c.castShadow = false
  c.renderOrder = 2
  return c
}

function buildDial(m: WatchMaterials) {
  const dial = mesh(NODE.dial, new THREE.CircleGeometry(1.64, 160), m.dial)
  dial.position.z = 0.1

  // Rehaut: inclined flange from the dial edge to the crystal.
  const reh = new THREE.CylinderGeometry(1.745, 1.64, 0.2, 160, 1, true)
  reh.rotateX(Math.PI / 2)
  reh.translate(0, 0, 0.2)
  const rehMat = new THREE.MeshStandardMaterial({ name: 'M_Rehaut', map: createRehautTexture(), roughness: 0.55, metalness: 0.2, side: THREE.DoubleSide })
  const rehaut = mesh(NODE.rehaut, reh, rehMat)

  // Applied indices: faceted batons, doubled at 12, lume inlays.
  const batons: THREE.BufferGeometry[] = []
  const lumes: THREE.BufferGeometry[] = []
  const rect = (w: number, h: number) => {
    const s = new THREE.Shape()
    s.moveTo(-w / 2, -h / 2)
    s.lineTo(w / 2, -h / 2)
    s.lineTo(w / 2, h / 2)
    s.lineTo(-w / 2, h / 2)
    s.closePath()
    return s
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    const cardinal = i % 3 === 0
    const len = cardinal ? 0.36 : 0.28
    const offsets = i === 0 ? [-0.055, 0.055] : [0]
    for (const off of offsets) {
      const b = extrude(rect(0.075, len), 0.035, 0.008, 2)
      const l = extrude(rect(0.034, len - 0.06), 0.012, 0)
      const r = 1.5 - len / 2
      for (const [geo, z] of [
        [b, 0.1],
        [l, 0.1 + 0.035 + 0.008],
      ] as const) {
        geo.translate(off, r, z)
        geo.rotateZ(-a)
        geo.clearGroups()
      }
      batons.push(b.index ? b.toNonIndexed() : b)
      lumes.push(l.index ? l.toNonIndexed() : l)
    }
  }
  const indices = mesh(NODE.indices, mergeGeometries(batons)!, m.metalPolished)
  const lume = mesh(NODE.indexLume, mergeGeometries(lumes)!, m.lume)
  return [dial, rehaut, indices, lume]
}

function buildHands(m: WatchMaterials) {
  // Dauphine-derived hour and minute hands, a needle seconds hand.
  const sword = (len: number, w: number, tail: number) => {
    const s = new THREE.Shape()
    s.moveTo(0, -tail)
    s.lineTo(w * 0.35, -tail * 0.6)
    s.lineTo(w / 2, 0.1)
    s.lineTo(w * 0.32, len * 0.86)
    s.lineTo(0, len)
    s.lineTo(-w * 0.32, len * 0.86)
    s.lineTo(-w / 2, 0.1)
    s.lineTo(-w * 0.35, -tail * 0.6)
    s.closePath()
    return s
  }
  const lumeStrip = (from: number, to: number, w: number) => {
    const s = new THREE.Shape()
    s.moveTo(-w / 2, from)
    s.lineTo(w / 2, from)
    s.lineTo(w * 0.3, to)
    s.lineTo(-w * 0.3, to)
    s.closePath()
    return s
  }

  const hand = (name: string, len: number, w: number, tail: number, z: number) => {
    const g = new THREE.Group()
    g.name = name
    const body = mesh(`${name}Body`, extrude(sword(len, w, tail), 0.014, 0.005, 2), m.metalPolished)
    const inlay = mesh(`${name}Lume`, extrude(lumeStrip(0.3, len * 0.8, w * 0.42), 0.006, 0), m.lume)
    inlay.position.z = 0.02
    g.add(body, inlay)
    g.position.z = z
    return g
  }

  const hour = hand(NODE.hourHand, 0.98, 0.13, 0.16, 0.16)
  const minute = hand(NODE.minuteHand, 1.46, 0.105, 0.2, 0.2)

  const sec = new THREE.Group()
  sec.name = NODE.secondHand
  const needle = new THREE.Shape()
  needle.moveTo(-0.012, -0.42)
  needle.lineTo(0.012, -0.42)
  needle.lineTo(0.007, 1.56)
  needle.lineTo(-0.007, 1.56)
  needle.closePath()
  const needleMesh = mesh('SecondNeedle', extrude(needle, 0.008, 0.002, 1), m.signal)
  // Counterweight: a small open ring — the "measurement mark".
  const cw = mesh('SecondCounterweight', new THREE.TorusGeometry(0.055, 0.014, 12, 40), m.signal)
  cw.position.set(0, -0.3, 0.004)
  const tip = mesh('SecondTip', extrude(new THREE.Shape([V2(-0.022, 1.22), V2(0.022, 1.22), V2(0.022, 1.3), V2(-0.022, 1.3)]), 0.01, 0.002, 1), m.lume)
  sec.add(needleMesh, cw, tip)
  sec.position.z = 0.245

  const capG = new THREE.CylinderGeometry(0.07, 0.075, 0.05, 40)
  capG.rotateX(Math.PI / 2)
  const cap = mesh(NODE.handCap, capG, m.metalPolished)
  cap.position.z = 0.27
  return [hour, minute, sec, cap]
}

function buildCrownAndPushers(m: WatchMaterials) {
  const out: THREE.Object3D[] = []
  const alongX = (g: THREE.BufferGeometry) => {
    g.rotateZ(-Math.PI / 2)
    return g
  }

  const tube = mesh(NODE.crownTube, alongX(new THREE.CylinderGeometry(0.13, 0.15, 0.2, 40)), m.metal)
  tube.position.set(2.12, 0, -0.1)

  const crownProfile = [V2(0.0, 0.0), V2(0.2, 0.0), V2(0.27, 0.02), V2(0.29, 0.06), V2(0.29, 0.2), V2(0.27, 0.24), V2(0.18, 0.27), V2(0.0, 0.275)]
  const cg = new THREE.LatheGeometry(crownProfile, 240)
  // Knurl around the lathe's own Y axis before orienting.
  const pos = cg.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const y = pos.getY(i)
    const r = Math.hypot(x, z)
    if (r < 0.28 || y < 0.05 || y > 0.21) continue
    const a = Math.atan2(z, x)
    const k = 1 - 0.035 * (0.5 + 0.5 * Math.sign(Math.sin(a * 36)))
    pos.setX(i, x * k)
    pos.setZ(i, z * k)
  }
  cg.computeVertexNormals()
  alongX(cg)
  const crown = mesh(NODE.crown, cg, m.metalPolished)
  crown.position.set(2.2, 0, -0.1)

  // Crown end: small signal-free engraved disc (polished).
  out.push(tube, crown)

  for (const [name, angle] of [
    [NODE.pusherTop, Math.PI / 5.2],
    [NODE.pusherBottom, -Math.PI / 5.2],
  ] as const) {
    const grp = new THREE.Group()
    grp.name = name
    const stem = mesh(`${name}Stem`, alongX(new THREE.CylinderGeometry(0.085, 0.1, 0.24, 32)), m.metal)
    stem.position.x = 2.1
    const head = mesh(`${name}Head`, alongX(new THREE.CylinderGeometry(0.13, 0.13, 0.14, 40)), m.metalPolished)
    head.position.x = 2.26
    grp.add(stem, head)
    grp.rotation.z = angle
    grp.position.z = -0.1
    out.push(grp)
  }
  return out
}

function buildBack(m: WatchMaterials) {
  const out: THREE.Object3D[] = []
  // Domed caseback shell.
  const shell = latheZ([V2(1.1, -0.6), V2(1.5, -0.585), V2(1.72, -0.55), V2(1.76, -0.5)], 128)
  out.push(mesh(NODE.caseback, shell, m.metal))

  // Engraved ring facing the wrist.
  const ring = new THREE.RingGeometry(1.1, 1.75, 128, 1)
  ring.rotateY(Math.PI)
  ring.translate(0, 0, -0.598)
  const engraved = mesh('CasebackEngraving', ring, m.engraving)
  out.push(engraved)

  // Exhibition window.
  const glass = new THREE.CircleGeometry(1.1, 96)
  glass.rotateY(Math.PI)
  glass.translate(0, 0, -0.6)
  const g = mesh(NODE.casebackGlass, glass, m.sapphire)
  g.castShadow = false
  out.push(g)

  // Movement: main plate, raised bridges with Côtes de Genève, a gilt gear
  // train, blued screws, a free-sprung balance with its hairspring, and a
  // bevelled rotor — everything a visitor looks for through the caseback.
  const plate = new THREE.CircleGeometry(1.45, 96)
  plate.rotateY(Math.PI)
  plate.translate(0, 0, -0.36)
  out.push(mesh(NODE.movement, plate, m.movement))

  const bridgeShapes: THREE.Shape[] = []
  // Barrel bridge: a broad lobe over the mainspring barrel.
  const barrel = new THREE.Shape()
  barrel.absarc(0.42, 0.38, 0.62, 0, Math.PI * 2, false)
  barrel.holes.push(new THREE.Path().absarc(0.42, 0.38, 0.12, 0, Math.PI * 2, true))
  bridgeShapes.push(barrel)
  // Train bridge: a curved bar sweeping across the lower half.
  const train = new THREE.Shape()
  train.moveTo(-1.25, 0.25)
  train.quadraticCurveTo(-0.5, -0.05, 0.2, -1.2)
  train.lineTo(0.52, -1.1)
  train.quadraticCurveTo(-0.3, 0.2, -1.2, 0.62)
  train.closePath()
  bridgeShapes.push(train)
  // Balance cock: a single arm reaching over the balance.
  const cock = new THREE.Shape()
  cock.moveTo(-1.4, -0.2)
  cock.lineTo(-0.66, -0.47)
  cock.absarc(-0.62, -0.55, 0.1, Math.PI * 0.8, Math.PI * 2.2, true)
  cock.lineTo(-1.32, -0.62)
  cock.closePath()
  bridgeShapes.push(cock)
  const bridges = bridgeShapes.map((sh) => {
    const g = extrude(sh, 0.05, 0.012, 2)
    g.translate(0, 0, -0.44)
    g.clearGroups()
    return g.index ? g.toNonIndexed() : g
  })
  out.push(mesh(NODE.bridges, mergeGeometries(bridges)!, m.movement))

  // Gilt gear train peeking between the bridges.
  const gear = (r: number, teeth: number) => {
    const sh = new THREE.Shape()
    for (let i = 0; i <= teeth * 2; i++) {
      const a = (i / (teeth * 2)) * Math.PI * 2
      const rr = i % 2 ? r : r * 0.9
      if (i === 0) sh.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
      else sh.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
    }
    // Four crossings, the way wheels are skeletonised.
    for (let k = 0; k < 4; k++) {
      const a0 = (k / 4) * Math.PI * 2 + 0.25
      const hole = new THREE.Path()
      hole.absarc(0, 0, r * 0.72, a0, a0 + Math.PI / 2 - 0.5, false)
      hole.absarc(0, 0, r * 0.28, a0 + Math.PI / 2 - 0.5, a0, true)
      sh.holes.push(hole)
    }
    const g = extrude(sh, 0.018, 0, 1)
    g.clearGroups()
    return g
  }
  const gearMat = new THREE.MeshStandardMaterial({ name: 'M_Gear', color: '#c7a468', metalness: 1, roughness: 0.28 })
  const wheels: THREE.BufferGeometry[] = []
  for (const [x, y, r, t] of [
    [-0.25, 0.62, 0.3, 48],
    [0.95, -0.35, 0.22, 36],
    [-0.95, 0.9, 0.18, 30],
  ] as const) {
    const g = gear(r, t)
    g.translate(x, y, -0.395)
    wheels.push(g.index ? g.toNonIndexed() : g)
  }
  out.push(mesh(NODE.wheels, mergeGeometries(wheels)!, gearMat))

  // Blued screws holding each bridge down.
  const screwMat = new THREE.MeshPhysicalMaterial({ name: 'M_Screw', color: '#27408f', metalness: 1, roughness: 0.22, clearcoat: 0.6 })
  const screws: THREE.BufferGeometry[] = []
  for (const [x, y] of [
    [0.9, 0.78],
    [-0.05, 0.72],
    [0.95, 0.0],
    [-1.05, 0.38],
    [0.3, -1.05],
    [-1.25, -0.35],
    [-1.2, -0.52],
  ]) {
    const g = new THREE.CylinderGeometry(0.038, 0.038, 0.025, 20)
    g.rotateX(Math.PI / 2)
    g.translate(x, y, -0.46)
    screws.push(g)
    // Slot across the head.
    const slot = new THREE.BoxGeometry(0.066, 0.01, 0.012)
    slot.translate(x, y, -0.473)
    screws.push(slot)
  }
  out.push(mesh(NODE.screws, mergeGeometries(screws.map((g) => (g.index ? g.toNonIndexed() : g)))!, screwMat))

  // Rotor: a bevelled half-disc with a heavier rim, on a polished hub.
  const rotorGroup = new THREE.Group()
  rotorGroup.name = NODE.rotor
  const rotorMat = new THREE.MeshStandardMaterial({ name: 'M_Rotor', map: createRotorTexture(), metalness: 1, roughness: 0.25 })
  const half = new THREE.Shape()
  half.absarc(0, 0, 1.32, 0, Math.PI, false)
  half.absarc(0, 0, 0.16, Math.PI, 0, true)
  const rotorGeo = extrude(half, 0.03, 0.012, 3)
  rotorGeo.clearGroups()
  rotorGeo.rotateY(Math.PI)
  // Planar UVs for the circular graining texture (extrude UVs are world units).
  const rp = rotorGeo.attributes.position as THREE.BufferAttribute
  const ruv = rotorGeo.attributes.uv as THREE.BufferAttribute
  for (let i = 0; i < rp.count; i++) ruv.setXY(i, -rp.getX(i) / 2.64 + 0.5, rp.getY(i) / 2.64 + 0.5)
  const rotor = mesh('RotorWeight', rotorGeo, rotorMat)
  const rim = new THREE.Shape()
  rim.absarc(0, 0, 1.33, 0, Math.PI, false)
  rim.absarc(0, 0, 1.12, Math.PI, 0, true)
  const rimGeo = extrude(rim, 0.06, 0.01, 2)
  rimGeo.clearGroups()
  rimGeo.rotateY(Math.PI)
  rimGeo.translate(0, 0, -0.01)
  const rotorRim = mesh('RotorRim', rimGeo, m.metalPolished)
  const hubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.06, 32)
  hubGeo.rotateX(Math.PI / 2)
  const hub = mesh('RotorHub', hubGeo, m.metalPolished)
  rotorGroup.add(rotor, rotorRim, hub)
  rotorGroup.position.z = -0.515

  // Balance: rim, crossed arms and a Breguet-style hairspring.
  const balance = new THREE.Group()
  balance.name = NODE.balance
  const wheel = mesh('BalanceWheel', new THREE.TorusGeometry(0.3, 0.022, 10, 64), gearMat)
  const arm = mesh('BalanceArm', new THREE.BoxGeometry(0.6, 0.03, 0.02), gearMat)
  const arm2 = mesh('BalanceArm2', new THREE.BoxGeometry(0.03, 0.6, 0.02), gearMat)
  const spiral = new THREE.CurvePath<THREE.Vector3>()
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= 220; i++) {
    const t = i / 220
    const a = t * Math.PI * 2 * 7
    const r = 0.04 + t * 0.2
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0.02))
  }
  spiral.add(new THREE.CatmullRomCurve3(pts))
  const spring = mesh(NODE.hairspring, new THREE.TubeGeometry(spiral.curves[0], 440, 0.004, 4, false), screwMat)
  balance.add(wheel, arm, arm2, spring)
  balance.position.set(-0.62, -0.55, -0.42)

  // Jewels: a few rubies set into the plate.
  const jewelMat = new THREE.MeshPhysicalMaterial({ name: 'M_Jewel', color: '#7a1020', roughness: 0.1, metalness: 0, clearcoat: 1 })
  const jewels: THREE.BufferGeometry[] = []
  for (const [x, y] of [
    [-0.62, -0.55],
    [0.62, -0.5],
    [0.2, -0.9],
    [-0.9, 0.2],
    [0.85, 0.35],
  ]) {
    const j = new THREE.SphereGeometry(0.035, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2)
    j.rotateX(-Math.PI / 2)
    j.translate(x, y, -0.365)
    jewels.push(j)
  }
  out.push(mesh('Jewels', mergeGeometries(jewels)!, jewelMat), rotorGroup, balance)
  return out
}

function buildStrap(m: WatchMaterials) {
  // Closed wrist loop in the YZ plane; the two halves overlap at the buckle.
  const top = new THREE.CatmullRomCurve3(
    [
      [0, 2.45, -0.12],
      [0, 2.95, -0.55],
      [0, 3.2, -1.5],
      [0, 3.05, -2.7],
      [0, 2.4, -3.75],
      [0, 1.3, -4.45],
      [0, 0.1, -4.72],
      [0, -0.55, -4.7],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    'centripetal',
  )
  const bottom = new THREE.CatmullRomCurve3(
    [
      [0, -2.45, -0.12],
      [0, -2.95, -0.55],
      [0, -3.2, -1.5],
      [0, -3.05, -2.7],
      [0, -2.4, -3.75],
      [0, -1.3, -4.45],
      [0, -0.1, -4.62],
      [0, 0.9, -4.58],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    'centripetal',
  )
  const taper = (t: number) => 2.0 - 0.22 * THREE.MathUtils.smoothstep(t, 0.3, 0.9)
  const strapTop = mesh(NODE.strapTop, createStrapGeometry(top, { width: taper, thickness: 0.3, segments: 180 }), m.strap)
  const strapBottom = mesh(NODE.strapBottom, createStrapGeometry(bottom, { width: taper, thickness: 0.26, segments: 180 }), m.strap)

  // Tang buckle: an open titanium frame on the outside of the loop.
  const frame = new THREE.Shape([V2(-1.0, -0.45), V2(1.0, -0.45), V2(1.0, 0.45), V2(-1.0, 0.45)])
  frame.holes.push(new THREE.Path([V2(-0.84, -0.3), V2(-0.84, 0.3), V2(0.84, 0.3), V2(0.84, -0.3)]))
  const bg = extrude(frame, 0.08, 0.03, 3)
  bg.clearGroups()
  const buckle = mesh(NODE.buckle, bg, m.metalPolished)
  // Parallel to the strap at the back of the loop, on its outer face (−Z).
  buckle.position.set(0, -0.2, -4.98)

  // Tang: the pin that crosses the frame and seats in the strap.
  const tangGeo = new THREE.CylinderGeometry(0.035, 0.03, 0.86, 16)
  const tang = mesh(NODE.tang, tangGeo, m.metalPolished)
  tang.position.set(0, -0.2, -4.96)

  // Two keepers holding the strap's tail: rubber frames around the strap section.
  const keeperShape = new THREE.Shape([V2(-1.08, -0.2), V2(1.08, -0.2), V2(1.08, 0.2), V2(-1.08, 0.2)])
  keeperShape.holes.push(new THREE.Path([V2(-1.0, -0.14), V2(-1.0, 0.14), V2(1.0, 0.14), V2(1.0, -0.14)]))
  const keepers = [0.45, 0.8].map((y) => {
    const g = extrude(keeperShape, 0.16, 0.02, 2)
    g.clearGroups()
    // Shape XY → strap cross-section (X width, Z thickness); extrusion runs along Y.
    g.rotateX(-Math.PI / 2)
    g.translate(0, y, -4.58)
    return g.index ? g.toNonIndexed() : g
  })
  const keeper = mesh(NODE.keepers, mergeGeometries(keepers)!, m.strap)
  return [strapTop, strapBottom, buckle, tang, keeper]
}

/* ----------------------------------------------------------------- build */

export function buildWatch(materials: WatchMaterials = createDefaultMaterials()) {
  const root = new THREE.Group()
  root.name = NODE.root
  const head = new THREE.Group()
  head.name = NODE.head
  head.add(
    buildCase(materials),
    buildLugs(materials),
    ...buildBezel(materials),
    buildCrystal(materials),
    ...buildDial(materials),
    ...buildHands(materials),
    ...buildCrownAndPushers(materials),
    ...buildBack(materials),
  )
  root.add(head, ...buildStrap(materials))
  return { root, materials }
}

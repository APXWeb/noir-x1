import * as THREE from 'three'

/**
 * Sweeps a rounded-rectangle profile along a planar (YZ) curve. Frenet frames
 * twist on near-straight runs, so the frame is derived from the plane itself:
 * X is always the strap's width axis, and the thickness axis is the in-plane
 * normal of the curve.
 */
export function createStrapGeometry(
  curve: THREE.Curve<THREE.Vector3>,
  opts: { width: (t: number) => number; thickness: number; segments: number; radius?: number; profileSteps?: number },
) {
  const { thickness, segments } = opts
  const r = opts.radius ?? thickness * 0.42
  const steps = opts.profileSteps ?? 4

  // Rounded rectangle profile in (w, n) space, unit width, counter-clockwise.
  const profile = (width: number) => {
    const hw = width / 2
    const hn = thickness / 2
    const pts: [number, number][] = []
    const corners: [number, number, number][] = [
      [hw - r, hn - r, 0],
      [-hw + r, hn - r, Math.PI / 2],
      [-hw + r, -hn + r, Math.PI],
      [hw - r, -hn + r, (Math.PI * 3) / 2],
    ]
    for (const [cx, cy, a0] of corners) {
      for (let s = 0; s <= steps; s++) {
        const a = a0 + (s / steps) * (Math.PI / 2)
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
      }
    }
    return pts
  }

  const ring = profile(1).length
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const lengths = curve.getLengths(segments)
  const total = lengths[lengths.length - 1]
  const tangent = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const p = new THREE.Vector3()

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    curve.getPointAt(t, p)
    curve.getTangentAt(t, tangent)
    // In-plane normal (rotate tangent 90° about X), pointing away from the loop centre.
    normal.set(0, -tangent.z, tangent.y).normalize()
    const pts = profile(opts.width(t))
    // Recompute the profile with the true width but keep the same vertex count.
    pts.forEach(([w, n], j) => {
      positions.push(p.x + w, p.y + normal.y * n, p.z + normal.z * n)
      uvs.push((lengths[i] / total) * 6, j / (ring - 1))
    })
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < ring; j++) {
      const a = i * ring + j
      const b = i * ring + ((j + 1) % ring)
      const c = (i + 1) * ring + j
      const d = (i + 1) * ring + ((j + 1) % ring)
      indices.push(a, c, b, b, c, d)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

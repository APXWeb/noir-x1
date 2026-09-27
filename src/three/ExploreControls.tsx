import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitImpl } from 'three-stdlib'
import { exploreBus, type ExploreCommand } from '../animation/exploreBus'
import { track } from '../animation/poseTrack'

const MIN = 5
const MAX = 20
const sph = new THREE.Spherical()
const off = new THREE.Vector3()

/**
 * Free inspection: drag to orbit, wheel / pinch to zoom, plus commands from
 * the DOM overlay (buttons and keyboard) so nothing depends on a pointer.
 */
export default function ExploreControls() {
  const ref = useRef<OrbitImpl>(null)
  const { camera, invalidate } = useThree()

  useEffect(() => {
    const c = ref.current
    if (!c) return
    c.target.set(0, 0, 0)
    c.update()

    const apply = (dTheta: number, dPhi: number, radiusScale: number) => {
      off.copy(camera.position).sub(c.target)
      sph.setFromVector3(off)
      sph.theta += dTheta
      sph.phi = THREE.MathUtils.clamp(sph.phi + dPhi, 0.2, Math.PI - 0.2)
      sph.radius = THREE.MathUtils.clamp(sph.radius * radiusScale, MIN, MAX)
      off.setFromSpherical(sph)
      camera.position.copy(c.target).add(off)
      c.update()
      invalidate()
    }

    return exploreBus.on((cmd: ExploreCommand) => {
      const step = 0.35
      switch (cmd) {
        case 'left':
          return apply(-step, 0, 1)
        case 'right':
          return apply(step, 0, 1)
        case 'up':
          return apply(0, -step, 1)
        case 'down':
          return apply(0, step, 1)
        case 'in':
          return apply(0, 0, 0.8)
        case 'out':
          return apply(0, 0, 1.25)
        case 'reset': {
          const r = track.mobile ? 17 : 13
          camera.position.set(0, 0, r)
          c.target.set(0, 0, 0)
          c.update()
          invalidate()
        }
      }
    })
  }, [camera, invalidate])

  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.7}
      zoomSpeed={0.7}
      minDistance={MIN}
      maxDistance={MAX}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI - 0.2}
    />
  )
}

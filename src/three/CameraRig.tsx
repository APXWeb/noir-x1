import { useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { track, poseOf } from '../animation/poseTrack'
import { intro } from '../animation/intro'
import { INTRO_FROM } from '../data/poses'
import { useStore } from '../state/store'
import { DEG, clamp, damp, lerp } from '../utils/math'

const target = new THREE.Vector3()
const lookAt = new THREE.Vector3()
const fine = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/**
 * Moves the watch and the camera toward the resolved scroll pose with frame-
 * rate independent damping. In explore mode it recentres the watch and leaves
 * the camera to the orbit controls.
 */
export function CameraRig({ children, stageEl, onStageHidden }: { children: ReactNode; stageEl: HTMLElement | null; onStageHidden?: () => void }) {
  const group = useRef<THREE.Group>(null)
  const tilt = useRef<THREE.Group>(null)
  const { camera, pointer, size } = useThree()
  const persp = camera as THREE.PerspectiveCamera
  const mode = useStore((s) => s.mode)

  useFrame((state, rawDt) => {
    const g = group.current
    const t = tilt.current
    if (!g || !t) return
    const dt = Math.min(rawDt, 0.1)
    const r = track.resolved
    const exploring = mode === 'explore'
    const src = exploring ? poseOf('explore-mode') : null
    const reduced = track.reduced
    const lambda = reduced ? 1000 : 3.6

    // Aspect fit: portrait screens pull the camera back and scale the watch's
    // offset with it, so each composition keeps its on-screen proportions.
    const aspect = size.width / size.height
    const fit = track.mobile ? clamp(0.78 / aspect, 1, 2) : clamp(1.5 / aspect, 1, 1.5)

    const i = intro.t
    const from = track.mobile ? INTRO_FROM.mobile : INTRO_FROM.desktop
    const wp = src ? src.watch.pos : r.watchPos
    const wr = src ? src.watch.rot : r.watchRot

    // Sway: a slow presentation turn weighted by the pose (materials, finale).
    const sway = exploring ? 0 : Math.sin(state.clock.elapsedTime * 0.45) * 16 * r.spin

    g.position.set(
      damp(g.position.x, lerp(from.pos[0], wp[0], i) * fit, lambda, dt),
      damp(g.position.y, lerp(from.pos[1], wp[1], i) * fit, lambda, dt),
      damp(g.position.z, lerp(from.pos[2], wp[2], i), lambda, dt),
    )
    g.rotation.set(
      damp(g.rotation.x, lerp(from.rot[0], wr[0], i) * DEG, lambda, dt),
      damp(g.rotation.y, (lerp(from.rot[1], wr[1], i) + sway) * DEG, lambda, dt),
      damp(g.rotation.z, lerp(from.rot[2], wr[2], i) * DEG, lambda, dt),
    )
    g.scale.setScalar(damp(g.scale.x, r.scale, lambda, dt))

    // Pointer parallax: the object leans a few degrees toward the cursor.
    const allowTilt = fine && !reduced && !exploring
    t.rotation.y = damp(t.rotation.y, allowTilt ? pointer.x * 4 * DEG : 0, 3, dt)
    t.rotation.x = damp(t.rotation.x, allowTilt ? -pointer.y * 3 * DEG : 0, 3, dt)

    if (!exploring) {
      target.set(r.camTarget[0] * fit, r.camTarget[1] * fit, r.camTarget[2])
      camera.position.set(
        damp(camera.position.x, target.x + (r.camPos[0] - r.camTarget[0]) * fit, lambda, dt),
        damp(camera.position.y, target.y + (r.camPos[1] - r.camTarget[1]) * fit, lambda, dt),
        damp(camera.position.z, target.z + (r.camPos[2] - r.camTarget[2]) * fit, lambda, dt),
      )
      lookAt.lerp(target, 1 - Math.exp(-lambda * dt))
      camera.lookAt(lookAt)
      if (Math.abs(persp.fov - r.fov) > 0.01) {
        persp.fov = damp(persp.fov, r.fov, lambda, dt)
        persp.updateProjectionMatrix()
      }
    }

    if (stageEl) {
      const o = Number(stageEl.style.opacity || 1)
      const next = damp(o, r.stage, reduced ? 1000 : 6, dt)
      stageEl.style.opacity = next.toFixed(3)
      stageEl.style.visibility = next < 0.01 ? 'hidden' : 'visible'
      // Fully faded out for a DOM-led scene: let the stage stop rendering.
      if (next < 0.01 && r.stage === 0) onStageHidden?.()
    }
  })

  return (
    <group ref={group}>
      <group ref={tilt}>{children}</group>
    </group>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useStore } from '../state/store'
import { VARIANTS } from '../data/collection'
import { applyQuality, bindWatch, setDialAndBezel, setFinish, setStrapPresence, stepLook, stepMovement, type BoundWatch } from './watch/bindWatch'
import { track } from '../animation/poseTrack'
import { damp } from '../utils/math'
import { projectAnchors } from './anchors'

export const MODEL_URL = `${import.meta.env.BASE_URL}models/noir-x1.glb`

/** Exposed for other 3D systems (hotspots, rig). */
export const watchRef: { current: BoundWatch | null } = { current: null }

export function WatchModel() {
  const gltf = useGLTF(MODEL_URL, false, true)
  const bound = useMemo(() => bindWatch(gltf.scene), [gltf.scene])
  const quality = useStore((s) => s.quality)
  const material = useStore((s) => s.material)
  const variantId = useStore((s) => s.variant)
  const { size } = useThree()

  useEffect(() => {
    watchRef.current = bound
    return () => {
      watchRef.current = null
    }
  }, [bound])

  useEffect(() => applyQuality(bound, quality), [bound, quality])

  useEffect(() => {
    const v = VARIANTS.find((x) => x.id === variantId)!
    setFinish(bound, v.finish ?? material)
    setDialAndBezel(bound, v.dial, v.bezel)
  }, [bound, material, variantId])

  const strap = useRef(1)

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.1)
    const target = useStore.getState().mode === 'explore' ? 1 : track.resolved.strap
    strap.current = track.reduced ? target : damp(strap.current, target, 5, d)
    setStrapPresence(bound, strap.current)
    stepMovement(bound, state.clock.elapsedTime, d)
    stepLook(bound, d)
    projectAnchors(bound.nodes, state.camera, size.width, size.height)
  })

  return <primitive object={bound.root} />
}

useGLTF.preload(MODEL_URL, false, true)

if (import.meta.env.DEV) (window as unknown as { __watch: typeof watchRef }).__watch = watchRef

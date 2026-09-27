import { Suspense, lazy, useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import { blendPoses, poseOf, track } from '../animation/poseTrack'
import { intro } from '../animation/intro'
import { useStore } from '../state/store'

const Stage = lazy(() => import('../three/Stage'))

declare global {
  interface Window {
    __stillReady?: boolean
  }
}

/**
 * Dev/capture route (`?still=<pose>`): renders one pose of the real model with
 * no UI, for Story imagery and the no-WebGL fallback (scripts/capture-stills.mjs).
 */
export function StillMode({ pose }: { pose: string }) {
  const { progress, active } = useProgress()

  useEffect(() => {
    track.mobile = window.innerWidth < 768
    track.reduced = true
    const p = poseOf(pose)
    blendPoses(p, p, 0, track.resolved)
    intro.t = 1
    const variant = new URLSearchParams(window.location.search).get('variant')
    useStore.setState({ quality: 'high', ready: true, introDone: true, variant: variant === 'x2' || variant === 'x3' ? variant : 'x1' })
    document.documentElement.dataset.still = pose
  }, [pose])

  useEffect(() => {
    if (progress < 100 || active) return
    const t = window.setTimeout(() => (window.__stillReady = true), 2500)
    return () => window.clearTimeout(t)
  }, [progress, active])

  return (
    <Suspense fallback={null}>
      <Stage />
    </Suspense>
  )
}

import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useStore } from '../state/store'
import { onTrackChange, poseOf, track } from '../animation/poseTrack'
import { CameraRig } from './CameraRig'
import { Lighting } from './Lighting'
import { WatchModel } from './WatchModel'
import styles from './Stage.module.css'

const ExploreControls = lazy(() => import('./ExploreControls'))

const DPR_CAP = { high: 2, mid: 1.5, low: 1 } as const

/**
 * The single persistent WebGL stage, fixed behind the DOM narrative.
 */
export default function Stage() {
  const wrap = useRef<HTMLDivElement>(null)
  const [stageEl, setStageEl] = useState<HTMLDivElement | null>(null)
  const quality = useStore((s) => s.quality)
  const setQuality = useStore((s) => s.setQuality)
  const mode = useStore((s) => s.mode)
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, DPR_CAP[quality]))
  const [tabVisible, setTabVisible] = useState(true)
  const [covered, setCovered] = useState(false)
  const visible = tabVisible && !covered

  useEffect(() => setStageEl(wrap.current), [])
  useEffect(() => setDpr((d) => Math.min(d, DPR_CAP[quality])), [quality])

  // Stop rendering when the tab is hidden or a DOM-led scene fully covers the stage.
  useEffect(() => {
    // Resume as soon as the scroll heads back toward a stage-led scene.
    const off = onTrackChange(() => (poseOf(track.nearestName).stage ?? 1) > 0 && setCovered(false))
    const onVis = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      off()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div ref={wrap} className={styles.stage} data-mode={mode} aria-hidden={mode !== 'explore'}>
      <Canvas
        dpr={dpr}
        shadows={quality !== 'low'}
        frameloop={visible ? 'always' : 'demand'}
        camera={{ fov: 30, position: [0, 0, 13], near: 0.1, far: 100 }}
        gl={{ antialias: quality !== 'low', alpha: true, powerPreference: 'high-performance', toneMapping: THREE.AgXToneMapping, toneMappingExposure: 1.05 }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => {
            setDpr((d) => Math.max(1, d - 0.25))
            if (quality === 'high') setQuality('mid')
            else if (quality === 'mid') setQuality('low')
          }}
          onIncline={() => setDpr((d) => Math.min(DPR_CAP[quality], window.devicePixelRatio, d + 0.25))}
        />
        <Suspense fallback={null}>
          <Lighting />
          <CameraRig stageEl={stageEl} onStageHidden={() => setCovered(true)}>
            <WatchModel />
          </CameraRig>
          {mode === 'explore' && <ExploreControls />}
        </Suspense>
      </Canvas>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { gsap } from 'gsap'
import { useStore } from '../state/store'
import { track } from '../animation/poseTrack'
import { DEG, damp } from '../utils/math'

/**
 * Dark-studio lighting. The environment is built from virtual softboxes
 * (no third-party HDRI) and rendered once; the key light orbits per pose and a
 * narrow sweep light crosses the product on every finish change.
 */
export function Lighting() {
  const key = useRef<THREE.DirectionalLight>(null)
  const sweep = useRef<THREE.SpotLight>(null)
  const az = useRef(20)
  const quality = useStore((s) => s.quality)
  const sweepCount = useStore((s) => s.sweep)

  useEffect(() => {
    const l = sweep.current
    if (!l || sweepCount === 0) return
    const tl = gsap.timeline()
    tl.set(l.position, { x: -9 })
    tl.to(l, { intensity: 260, duration: 0.25, ease: 'power2.out' }, 0)
    tl.to(l.position, { x: 9, duration: 1.2, ease: 'power2.inOut' }, 0)
    tl.to(l, { intensity: 0, duration: 0.4, ease: 'power2.in' }, 0.85)
    return () => {
      tl.kill()
    }
  }, [sweepCount])

  useFrame((_, dt) => {
    az.current = damp(az.current, track.resolved.key, 2.5, Math.min(dt, 0.1))
    const a = (az.current + 35) * DEG
    key.current?.position.set(Math.sin(a) * 9, 6, Math.cos(a) * 9)
  })

  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight
        ref={key}
        intensity={2.2}
        color="#fff6ec"
        castShadow={quality !== 'low'}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      {/* Cool rim from behind: separates the silhouette from the graphite ground. */}
      <directionalLight position={[-6, 4, -8]} intensity={3.2} color="#cfd8e6" />
      <spotLight ref={sweep} position={[-9, 3, 6]} angle={0.18} penumbra={0.9} intensity={0} distance={30} color="#ffffff" />
      <Environment resolution={quality === 'low' ? 128 : 256} frames={1}>
        <color attach="background" args={['#050505']} />
        {/* Long overhead strip: the signature highlight along the case flank. */}
        <Lightformer form="rect" intensity={3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[14, 1.4, 1]} />
        {/* Tall softboxes left and right. */}
        <Lightformer form="rect" intensity={2.2} position={[-7, 1, 2]} rotation-y={Math.PI / 2} scale={[4, 9, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[7, 0, 3]} rotation-y={-Math.PI / 2} scale={[2, 7, 1]} color="#f3ede4" />
        {/* Ring above camera: the reflected halo on the crystal. */}
        <Lightformer form="ring" intensity={1.4} position={[0, 2, 9]} scale={2.4} />
        {/* Low bounce so the underside is never dead black. */}
        <Lightformer form="rect" intensity={0.35} position={[0, -6, 2]} rotation-x={-Math.PI / 2} scale={[10, 4, 1]} color="#9aa0a8" />
      </Environment>
    </>
  )
}

import { useEffect, useState } from 'react'
import { onTrackChange, poseOf, track } from '../animation/poseTrack'
import { useIsMobile } from '../hooks/useMedia'
import styles from './FallbackStage.module.css'

const src = (pose: string, mobile: boolean) => `${import.meta.env.BASE_URL}stills/pose-${pose}${mobile ? '-m' : ''}.webp`

/**
 * Without WebGL the narrative still has its object: pre-rendered frames of the
 * same model at every pose, cross-faded as the scroll moves between scenes.
 */
export function FallbackStage() {
  const mobile = useIsMobile()
  const [pose, setPose] = useState(track.nearestName)
  const [prev, setPrev] = useState<string | null>(null)

  useEffect(
    () =>
      onTrackChange(() => {
        setPose((p) => {
          if (p !== track.nearestName) setPrev(p)
          return track.nearestName
        })
      }),
    [],
  )

  const hidden = (poseOf(pose).stage ?? 1) === 0

  return (
    <div className={styles.stage} data-hidden={hidden} aria-hidden="true">
      {prev && prev !== pose && <img key={`p-${prev}`} className={styles.out} src={src(prev, mobile)} alt="" />}
      <img key={pose} className={styles.in} src={src(pose, mobile)} alt="" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
    </div>
  )
}

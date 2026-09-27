import { useEffect, useState } from 'react'
import { SCENES, sceneIndexOfPose } from '../data/scenes'
import { onTrackChange, poseOf, track } from '../animation/poseTrack'
import { scrollToTarget } from '../animation/smoothScroll'
import { useStore } from '../state/store'
import styles from './PositionRail.module.css'

/**
 * The certification readout: which position the watch is being tested in,
 * and a rail of scenes that doubles as navigation.
 */
export function PositionRail() {
  const [pose, setPose] = useState(track.nearestName)
  const mode = useStore((s) => s.mode)
  const introDone = useStore((s) => s.introDone)

  useEffect(() => onTrackChange(() => setPose(track.nearestName)), [])

  const active = sceneIndexOfPose(pose)
  const label = poseOf(pose).label

  return (
    <aside className={styles.rail} data-hidden={mode === 'explore' || !introDone} aria-label="Scenes">
      <p className={styles.readout} aria-live="off">
        <span className="measure">
          Pos. <span className={styles.num}>{String(active + 1).padStart(2, '0')}</span>
          <span className={styles.of}> / {SCENES.length}</span>
        </span>
        <span key={label} className={`measure ${styles.label}`}>
          {label}
        </span>
      </p>
      <ol className={styles.ticks}>
        {SCENES.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className={styles.tick}
              aria-current={i === active ? 'step' : undefined}
              onClick={() => scrollToTarget(`#${s.id}`)}
            >
              <span className="sr-only">
                Go to scene {i + 1}: {s.title}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  )
}

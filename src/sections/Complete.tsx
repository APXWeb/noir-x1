import { useRef } from 'react'
import { useScene } from '../animation/useScene'
import styles from './Complete.module.css'

/**
 * Scene 8 — the whole watch again, strap and all. Three words on three depth
 * planes: they drift at different speeds so the object sits between them.
 */
export function Complete() {
  const ref = useRef<HTMLElement>(null)

  useScene(ref, (tl, q) => {
    tl.fromTo(q('[data-depth="front"]'), { yPercent: 60, opacity: 0 }, { yPercent: -40, opacity: 1, duration: 1, ease: 'none' }, 0)
      .fromTo(q('[data-depth="mid"]'), { yPercent: 30, opacity: 0 }, { yPercent: -10, opacity: 1, duration: 1 }, 0)
      .fromTo(q('[data-depth="back"]'), { yPercent: 10, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1 }, 0)
      .to(q('[data-depth]'), { opacity: 0, duration: 0.15 }, 0.85)
  })

  return (
    <section ref={ref} id="complete" className={`scene ${styles.scene}`} data-pose="reveal" data-theme="dark" aria-labelledby="complete-title">
      <h2 id="complete-title" className="sr-only">
        Built around precision.
      </h2>
      {/* The words live on two planes: behind the watch, and in front of it. */}
      <div className="scene__frame scene__frame--back" aria-hidden="true">
        <p className={`display ${styles.title}`}>
          <span className={styles.w1} />
          <span className={styles.w2} data-depth="mid">
            around
          </span>
          <span className={styles.w3} data-depth="back">
            precision.
          </span>
        </p>
      </div>
      <div className="scene__frame" aria-hidden="true">
        <p className={`display ${styles.title}`}>
          <span className={styles.w1} data-depth="front">
            Built
          </span>
        </p>
      </div>
    </section>
  )
}

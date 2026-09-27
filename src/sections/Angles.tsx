import { useRef } from 'react'
import { SplitLines } from '../components/SplitLines'
import { useScene } from '../animation/useScene'
import styles from './Angles.module.css'

/** Scene 3 — the watch turns to show its crown side. Lines arrive the way the case turns: sideways. */
export function Angles() {
  const ref = useRef<HTMLElement>(null)

  useScene(ref, (tl, q) => {
    tl.fromTo(q('[data-line]'), { xPercent: 40, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.3, ease: 'power3.out', stagger: 0.05 }, 0.02)
      .fromTo(q('[data-copy]'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.25)
      .to(q('[data-line]'), { xPercent: -30, opacity: 0, duration: 0.25, stagger: 0.04 }, 0.78)
      .to(q('[data-copy]'), { opacity: 0, duration: 0.12 }, 0.8)
  })

  return (
    <section ref={ref} id="angles" className={`scene ${styles.scene}`} data-pose="rotate" data-theme="dark" aria-labelledby="angles-title">
      <div className="scene__frame">
        <div className={styles.text}>
          <SplitLines as="h2" id="angles-title" className={`h2 ${styles.title}`} lines={['Seen from', 'every side.']} />
          <p className="body" data-copy>
            Turn it. The case is cut from a single billet, so there is no seam to find and no angle where it stops being one object.
          </p>
        </div>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { SplitLines } from '../components/SplitLines'
import { Cta } from '../components/Cta'
import { useStore } from '../state/store'
import { useScene } from '../animation/useScene'
import styles from './ExploreIntro.module.css'

/** The invitation to handle the object. The mode itself lives in ExploreOverlay. */
export function ExploreIntro() {
  const ref = useRef<HTMLElement>(null)
  const setMode = useStore((s) => s.setMode)

  useScene(ref, (tl, q) => {
    tl.fromTo(q('[data-line]'), { yPercent: 105 }, { yPercent: 0, duration: 0.25, ease: 'power3.out', stagger: 0.06 }, 0.1)
      .fromTo(q('[data-copy]'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.15, stagger: 0.04 }, 0.25)
      .to(q('[data-fade]'), { opacity: 0, duration: 0.15 }, 0.85)
  })

  return (
    <section ref={ref} id="explore" className={`scene ${styles.scene}`} data-pose="explore" data-theme="dark" aria-labelledby="explore-title">
      <div className="scene__frame">
        <div className={styles.text} data-fade>
          <SplitLines as="h2" id="explore-title" className={`h2 ${styles.title}`} lines={['Explore', 'the X1.']} />
          <p className="body" data-copy>
            Turn it, bring it close, read its parts. The same model you have been watching, now in your hands.
          </p>
          <div data-copy>
            <Cta onClick={() => setMode('explore')}>Enter explore mode</Cta>
          </div>
          <p className="measure" data-copy>
            Drag · Pinch or scroll · Arrow keys
          </p>
        </div>
      </div>
    </section>
  )
}

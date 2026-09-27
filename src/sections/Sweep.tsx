import { useRef } from 'react'
import { SplitLines } from '../components/SplitLines'
import { Callout } from '../components/Callout'
import { useInCenter, useScene } from '../animation/useScene'
import { useIsMobile } from '../hooks/useMedia'
import styles from './Sweep.module.css'

/**
 * Scene 4 — close on the dial. A graticule locks onto the live seconds hand;
 * the reading travels with it around the dial.
 */
export function Sweep() {
  const ref = useRef<HTMLElement>(null)
  const active = useInCenter(ref, 'top 30%', 'bottom 70%')
  const mobile = useIsMobile()

  useScene(ref, (tl, q) => {
    tl.fromTo(q('[data-line]'), { yPercent: 105 }, { yPercent: 0, duration: 0.26, ease: 'power3.out', stagger: 0.06 }, 0.08)
      .fromTo(q('[data-copy]'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.16 }, 0.28)
      .to(q('[data-fade]'), { opacity: 0, y: -30, duration: 0.2 }, 0.8)
  })

  return (
    <section ref={ref} id="sweep" className={`scene ${styles.scene}`} data-pose="detail" data-theme="dark" aria-labelledby="sweep-title">
      <div className="scene__frame">
        <div className={styles.text} data-fade>
          <SplitLines as="h2" id="sweep-title" className={`h2 ${styles.title}`} lines={['Eight beats', 'a second.']} />
          <p className="body" data-copy>
            The seconds hand advances eight times every second. Close enough to continuous that it never appears to stop, and it is reading your time right now.
          </p>
        </div>
      </div>
      <Callout anchor="secondsTip" dx={mobile ? -70 : -150} dy={mobile ? -60 : -90} label="Sweep" value="28 800 vph · 8 Hz" active={active} />
    </section>
  )
}

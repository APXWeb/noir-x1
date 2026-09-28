import { useRef } from 'react'
import { Cta } from '../components/Cta'
import { useStore } from '../state/store'
import { scrollToTarget } from '../animation/smoothScroll'
import { useScene } from '../animation/useScene'
import styles from './Finale.module.css'

/** Scene 9 — the close. Bookends scene 2: the same calibration, now final. */
export function Finale() {
  const ref = useRef<HTMLElement>(null)
  const setMode = useStore((s) => s.setMode)

  useScene(ref, (tl, q) => {
    tl.fromTo(q('[data-word]'), { letterSpacing: '0.5em', opacity: 0, filter: 'blur(12px)' }, { letterSpacing: '-0.04em', opacity: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out', stagger: 0.08 }, 0)
      .fromTo(q('[data-act]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out', stagger: 0.05 }, 0.35)
  }, { start: 'top bottom', end: 'bottom bottom' })

  return (
    <section ref={ref} id="finale" className={`scene ${styles.scene}`} data-pose="finale" data-theme="dark" aria-labelledby="finale-title">
      <div className="scene__frame scene__frame--back">
        <h2 id="finale-title" className={`display ${styles.title}`}>
          <span data-word className={styles.l1}>
            Tempo,
          </span>{' '}
          <span data-word className={styles.l2}>
            refinado.
          </span>
        </h2>
      </div>
      <div className="scene__frame">
        <div className={styles.actions}>
          <div data-act>
            <Cta onClick={() => setMode('explore')}>Explorar o NOIR X1</Cta>
          </div>
          <div data-act>
            <Cta variant="quiet" href="#top" onClick={(e) => (e.preventDefault(), scrollToTarget('#top'))}>
              Voltar ao início
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}

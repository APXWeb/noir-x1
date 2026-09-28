import { useRef } from 'react'
import { useScene } from '../animation/useScene'
import styles from './Approach.module.css'

/**
 * Scene 2 — the camera closes in on the dial. The two words calibrate into
 * place: tracking collapses from loose to exact as the dial fills the frame.
 */
export function Approach() {
  const ref = useRef<HTMLElement>(null)

  useScene(ref, (tl, q) => {
    const words = q('[data-word]')
    tl.fromTo(words, { letterSpacing: '0.42em', opacity: 0, filter: 'blur(10px)' }, { letterSpacing: '-0.04em', opacity: 1, filter: 'blur(0px)', duration: 0.38, ease: 'power2.out', stagger: 0.06 }, 0)
      .fromTo(q('[data-copy]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.26)
      .to(words, { opacity: 0, filter: 'blur(8px)', duration: 0.22, stagger: 0.04 }, 0.8)
      .to(q('[data-copy]'), { opacity: 0, y: -24, duration: 0.18 }, 0.8)
  })

  return (
    <section ref={ref} id="x1" className={`scene ${styles.scene}`} data-pose="approach" data-theme="dark" aria-labelledby="approach-title">
      <div className="scene__frame">
        <h2 id="approach-title" className={`display plane-front ${styles.title}`}>
          <span data-word className={styles.top}>
            Nada
          </span>{' '}
          <span data-word className={styles.bottom}>
            a mais.
          </span>
        </h2>
        <p className={`lead ${styles.copy}`} data-copy>
          O X1 faz uma coisa sem interrupção: marca o tempo. Todo o resto foi retirado até sobrar só isso.
        </p>
      </div>
    </section>
  )
}

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
          <SplitLines as="h2" id="angles-title" className={`h2 ${styles.title}`} lines={['Visto de', 'todos', 'os lados.']} />
          <p className="body" data-copy>
            Gire-o. A caixa sai de um único bloco: não há emenda para achar nem ângulo em que ela deixe de ser um objeto só.
          </p>
        </div>
      </div>
    </section>
  )
}

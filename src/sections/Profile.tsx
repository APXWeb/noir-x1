import { useRef } from 'react'
import { SplitLines } from '../components/SplitLines'
import { Callout } from '../components/Callout'
import { useInCenter, useScene } from '../animation/useScene'
import styles from './Profile.module.css'

/** Scene 5 — the watch lies down and shows its edge. A dimension line measures it. */
export function Profile() {
  const ref = useRef<HTMLElement>(null)
  const active = useInCenter(ref, 'top 25%', 'bottom 75%')

  useScene(ref, (tl, q) => {
    tl.fromTo(q('[data-figure]'), { opacity: 0, filter: 'blur(12px)', scale: 0.96 }, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.3, ease: 'power2.out' }, 0.1)
      .fromTo(q('[data-line]'), { yPercent: 105 }, { yPercent: 0, duration: 0.24, ease: 'power3.out', stagger: 0.05 }, 0.18)
      .fromTo(q('[data-copy]'), { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.32)
      .to(q('[data-fade]'), { opacity: 0, duration: 0.18 }, 0.82)
  })

  return (
    <section ref={ref} id="profile" className={`scene ${styles.scene}`} data-pose="profile" data-theme="dark" aria-labelledby="profile-title">
      <div className="scene__frame">
        <div className={styles.text} data-fade>
          <p className={styles.figure} data-figure aria-hidden="true">
            11,4<span>mm</span>
          </p>
          <SplitLines as="h2" id="profile-title" className={`h2 ${styles.title}`} lines={['Fino a ponto', 'de esquecer.']} />
          <p className="body" data-copy>
            Onze vírgula quatro milímetros do cristal ao fundo. Desliza sob o punho da camisa e fica ali.
          </p>
        </div>
      </div>
      <Callout kind="span" from="edgeTop" to="edgeBottom" side={-1} label="Altura" value="11,4 mm" active={active} />
    </section>
  )
}

import { useRef } from 'react'
import { VARIANTS, type Variant } from '../data/collection'
import { useScene } from '../animation/useScene'
import styles from './Collection.module.css'

function Panel({ v, index }: { v: Variant; index: number }) {
  const ref = useRef<HTMLElement>(null)

  useScene(ref, (tl, q) => {
    tl.fromTo(q('[data-code]'), { yPercent: 18, opacity: 0 }, { yPercent: -12, opacity: 1, duration: 1, ease: 'none' }, 0)
      .fromTo(q('[data-reveal]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.18, stagger: 0.03, ease: 'power2.out' }, 0.2)
      .to(q('[data-code]'), { opacity: 0, duration: 0.12 }, 0.88)
      .to(q('[data-reveal]'), { opacity: 0, duration: 0.12 }, 0.84)
  })

  return (
    <article ref={ref} className={`scene ${styles.panel}`} data-pose={v.id} aria-labelledby={`model-${v.id}`}>
      <div className="scene__frame">
        <p className={`plane-back ${styles.code}`} data-code aria-hidden="true">
          {v.code}
        </p>
        <div className={styles.copy}>
          <p className="measure" data-reveal>
            {String(index + 1).padStart(2, '0')} / {String(VARIANTS.length).padStart(2, '0')}
          </p>
          <h3 id={`model-${v.id}`} className={`h2 ${styles.name}`} data-reveal>
            <span className="sr-only">{v.code} </span>
            {v.name}
          </h3>
          <p className="body" data-reveal>
            {v.line}
          </p>
          <dl className={styles.readings} data-reveal>
            {v.readings.map(([k, val]) => (
              <div key={k} className={styles.reading}>
                <dt className="measure">{k}</dt>
                <dd>{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  )
}

/** The family, editorial: one reference per screen, the same object re-dressed. */
export function Collection() {
  return (
    <section id="collection" className={styles.collection} data-theme="dark" aria-labelledby="collection-title">
      <h2 id="collection-title" className="sr-only">
        Collection
      </h2>
      {VARIANTS.map((v, i) => (
        <Panel key={v.id} v={v} index={i} />
      ))}
    </section>
  )
}

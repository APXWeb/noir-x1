import { useEffect, useRef, useState } from 'react'
import { SplitLines } from '../components/SplitLines'
import { Callout } from '../components/Callout'
import { SPECS } from '../data/specs'
import { onTrackChange, track } from '../animation/poseTrack'
import { useInCenter, useScene } from '../animation/useScene'
import { useIsMobile } from '../hooks/useMedia'
import styles from './Engineering.module.css'

/**
 * Scene 6 — "Engineered to endure", laid out as a certification record. Four
 * readings; the one under test expands while the camera finds its part.
 */
export function Engineering() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInCenter(ref, 'top 40%', 'bottom 60%')
  const mobile = useIsMobile()
  const [active, setActive] = useState<string | null>(null)

  useEffect(
    () =>
      onTrackChange(() => {
        const s = SPECS.find((x) => x.pose === track.nearestName)
        setActive(s ? s.id : null)
      }),
    [],
  )

  useScene(
    ref,
    (tl, q) => {
      tl.fromTo(q('[data-line]'), { yPercent: 105 }, { yPercent: 0, duration: 0.06, ease: 'power3.out', stagger: 0.012 }, 0.01)
        .fromTo(q('[data-row]'), { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.05, stagger: 0.01 }, 0.06)
        .to(q('[data-panel]'), { opacity: 0, duration: 0.02 }, 0.98)
    },
    { start: 'top 60%', end: 'bottom bottom' },
  )

  return (
    <section ref={ref} id="craft" className={`scene ${styles.scene}`} data-theme="dark" aria-labelledby="craft-title">
      <div className="scene__frame">
        <div className={styles.panel} data-panel data-has-active={active !== null}>
          <SplitLines as="h2" id="craft-title" className={`h2 ${styles.title}`} lines={['Feito', 'para durar.']} />
          <ol className={styles.record} data-has-active={active !== null}>
            {SPECS.map((s) => (
              <li key={s.id} className={styles.row} data-row data-active={active === s.id}>
                <div className={styles.rowHead}>
                  <span className={`label ${styles.term}`}>{s.term}</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={`measure ${styles.reading}`}>{s.reading}</span>
                </div>
                <div className={styles.detail}>
                  <div>
                    <p className="label">{s.term}</p>
                    <h3 className={`h3 ${styles.specTitle}`}>{s.title}</h3>
                    <p className={`measure ${styles.detailReading}`}>{s.reading}</p>
                    <p className="body">{s.body}</p>
                    {s.bulletin && (
                      <table className={styles.bulletin}>
                        <caption className="label">Marcha por posição, s/dia</caption>
                        <tbody>
                          <tr>
                            {s.bulletin.map(([pos, , name]) => (
                              <th key={pos} scope="col" className="measure">
                                <abbr title={name}>{pos}</abbr>
                              </th>
                            ))}
                          </tr>
                          <tr>
                            {s.bulletin.map(([pos, rate]) => (
                              <td key={pos} className="measure">
                                {rate}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className={`label ${styles.note}`}>Especificações conceituais</p>
        </div>
      </div>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.intro} />
        {SPECS.map((s) => (
          <div key={s.id} className={styles.step} data-pose={s.pose} />
        ))}
      </div>
      {SPECS.map((s) => (
        <Callout
          key={s.id}
          anchor={s.anchor}
          dx={mobile ? Math.sign(s.dx) * 60 : s.dx}
          dy={mobile ? -Math.abs(s.dy) * 0.6 : s.dy}
          label={s.term}
          value={s.reading}
          active={inView && active === s.id}
        />
      ))}
    </section>
  )
}

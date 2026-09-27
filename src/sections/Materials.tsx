import { useRef, type KeyboardEvent } from 'react'
import { FINISHES, finishById } from '../data/materials'
import { useStore } from '../state/store'
import { useScene } from '../animation/useScene'
import styles from './Materials.module.css'

/**
 * Scene 7 — the finish changes on the object itself. The material's name sits
 * behind the watch at full width and re-sets itself on every change.
 */
export function Materials() {
  const ref = useRef<HTMLElement>(null)
  const material = useStore((s) => s.material)
  const setMaterial = useStore((s) => s.setMaterial)
  const current = finishById(material)
  const radios = useRef<(HTMLButtonElement | null)[]>([])

  useScene(ref, (tl, q) => {
    tl.fromTo(q('[data-name]'), { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 0.05)
      .fromTo(q('[data-controls]'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.2)
      .to(q('[data-name], [data-controls]'), { opacity: 0, duration: 0.18 }, 0.84)
  })

  const onKey = (e: KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (i + dir + FINISHES.length) % FINISHES.length
    setMaterial(FINISHES[next].id)
    radios.current[next]?.focus()
  }

  return (
    <section ref={ref} id="materials" className={`scene ${styles.scene}`} data-pose="materials" data-theme="dark" aria-labelledby="materials-title">
      <div className="scene__frame">
        <p className={`plane-back ${styles.nameWrap}`} data-name aria-hidden="true">
          <span key={current.id} className={styles.name}>
            {current.name}
          </span>
        </p>

        <div className={styles.controls} data-controls>
          <h2 id="materials-title" className={`h3 ${styles.title}`}>
            Four finishes. One object.
          </h2>
          <div role="radiogroup" aria-labelledby="materials-title" className={styles.group}>
            {FINISHES.map((f, i) => {
              const checked = f.id === material
              return (
                <button
                  key={f.id}
                  ref={(el) => {
                    radios.current[i] = el
                  }}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={checked ? 0 : -1}
                  className={styles.option}
                  onClick={() => setMaterial(f.id)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <span className={styles.swatch} style={{ '--swatch': f.swatch } as React.CSSProperties} aria-hidden="true" />
                  <span className={styles.optionName}>{f.name}</span>
                </button>
              )
            })}
          </div>
          <div className={styles.readout} aria-live="polite">
            <p key={current.id} className={`body ${styles.line}`}>
              {current.line}
            </p>
            <p className="measure">
              Density <span className={styles.value}>{current.reading}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

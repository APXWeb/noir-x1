import { useEffect, useRef, useState } from 'react'
import { useStore } from '../state/store'
import { HOTSPOTS } from '../data/hotspots'
import { projected } from '../three/points'
import { exploreBus, type ExploreCommand } from '../animation/exploreBus'
import { lockScroll } from '../animation/smoothScroll'
import styles from './ExploreOverlay.module.css'

const KEYMAP: Record<string, ExploreCommand> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  '+': 'in',
  '=': 'in',
  '-': 'out',
  _: 'out',
  '0': 'reset',
}

/**
 * Explore mode chrome: a modal layer over the live 3D stage. Hotspots are real
 * buttons pinned to projected points; every gesture has a button and key.
 */
export function ExploreOverlay() {
  const mode = useStore((s) => s.mode)
  const setMode = useStore((s) => s.setMode)
  const hotspot = useStore((s) => s.hotspot)
  const setHotspot = useStore((s) => s.setHotspot)
  const exploded = useStore((s) => s.exploded)
  const setExploded = useStore((s) => s.setExploded)
  const root = useRef<HTMLDivElement>(null)
  const pins = useRef<Record<string, HTMLButtonElement | null>>({})
  const returnFocus = useRef<HTMLElement | null>(null)
  const [hint, setHint] = useState(true)
  const open = mode === 'explore'

  // Enter / leave: lock scroll, move focus in, restore it after.
  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement
    lockScroll(true)
    setHint(true)
    const t = window.setTimeout(() => setHint(false), 4200)
    root.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    return () => {
      window.clearTimeout(t)
      lockScroll(false)
      returnFocus.current?.focus?.()
    }
  }, [open])

  // Keyboard: Esc closes (panel first), arrows orbit, +/- zoom. Tab stays inside.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (useStore.getState().hotspot) setHotspot(null)
        else setMode('scroll')
        return
      }
      const target = e.target as HTMLElement
      if (KEYMAP[e.key] && !(target.getAttribute('role') === 'radio')) {
        e.preventDefault()
        exploreBus.emit(KEYMAP[e.key])
        setHint(false)
      }
      if (e.key === 'Tab' && root.current) {
        const f = Array.from(root.current.querySelectorAll<HTMLElement>('button:not([disabled]):not([tabindex="-1"])')).filter((el) => el.offsetParent !== null)
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setMode, setHotspot])

  // Pin hotspots to their projected points every frame.
  useEffect(() => {
    if (!open) return
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      for (const h of HOTSPOTS) {
        const el = pins.current[h.id]
        const p = projected[h.anchor]
        if (!el || !p) continue
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
        const visible = p.facing > 0.35
        el.style.opacity = String(Math.min(1, p.facing * 1.4))
        el.tabIndex = visible ? 0 : -1
        el.dataset.hidden = String(!visible)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [open])

  if (!open) return null
  const active = HOTSPOTS.find((h) => h.id === hotspot)

  return (
    <div ref={root} className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="explore-dialog-title">
      <div className={styles.top}>
        <h2 id="explore-dialog-title" className={`h3 ${styles.title}`}>
          Explore o X1
        </h2>
        <button type="button" className={styles.close} onClick={() => setMode('scroll')} data-autofocus>
          <span className="label">Fechar</span>
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 1l10 10M11 1 1 11" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="sr-only">o modo explorar (Esc)</span>
        </button>
      </div>

      {HOTSPOTS.map((h) => (
        <button
          key={h.id}
          ref={(el) => {
            pins.current[h.id] = el
          }}
          type="button"
          className={styles.pin}
          aria-pressed={hotspot === h.id}
          aria-label={h.name}
          onClick={() => setHotspot(hotspot === h.id ? null : h.id)}
        >
          <span className={styles.pinDot} aria-hidden="true" />
          <span className={styles.pinLabel} aria-hidden="true">
            {h.name}
          </span>
        </button>
      ))}

      <div className={styles.panel} data-open={!!active} aria-live="polite">
        {active && (
          <div key={active.id} className={styles.panelInner}>
            <h3 className={`h3 ${styles.panelTitle}`}>{active.name}</h3>
            <p className="body">{active.line}</p>
          </div>
        )}
      </div>

      <div className={styles.controls} role="group" aria-label="Controles de visualização">
        {(
          [
            ['left', 'Girar para a esquerda', 'M8 2 4 6l4 4'],
            ['right', 'Girar para a direita', 'M4 2l4 4-4 4'],
            ['up', 'Inclinar para cima', 'M2 8l4-4 4 4'],
            ['down', 'Inclinar para baixo', 'M2 4l4 4 4-4'],
            ['in', 'Aproximar', 'M6 2v8M2 6h8'],
            ['out', 'Afastar', 'M2 6h8'],
          ] as const
        ).map(([cmd, label, d]) => (
          <button key={cmd} type="button" className={styles.ctrl} aria-label={label} onClick={() => exploreBus.emit(cmd)}>
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d={d} fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        ))}
        <button type="button" className={`${styles.ctrl} ${styles.reset}`} aria-pressed={exploded}
          onClick={() => {
            if (!exploded) exploreBus.emit('profile')
            setExploded(!exploded)
          }}
        >
          <span className="label">Vista explodida</span>
        </button>
        <button type="button" className={`${styles.ctrl} ${styles.reset}`} onClick={() => exploreBus.emit('reset')}>
          <span className="label">Redefinir</span>
        </button>
      </div>

      <p className={`label ${styles.hint}`} data-show={hint} aria-hidden="true">
        Arraste para girar · Pince ou role para aproximar · Escolha um ponto
      </p>
    </div>
  )
}

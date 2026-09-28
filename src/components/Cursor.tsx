import { useEffect, useRef } from 'react'
import { useStore } from '../state/store'
import styles from './Cursor.module.css'

/**
 * Precise dot + a trailing ring that widens over anything interactive.
 * Fine pointers only; never replaces the native cursor under reduced motion.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const mode = useStore((s) => s.mode)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    document.documentElement.classList.add('has-cursor')

    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let raf = 0
    const d = dot.current!
    const r = ring.current!

    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const target = (e.target as HTMLElement).closest('a, button, [role="radio"], [data-cursor]')
      r.dataset.state = target ? (target as HTMLElement).dataset.cursor ?? 'link' : ''
      r.dataset.visible = 'true'
      d.dataset.visible = 'true'
    }
    const leave = () => {
      r.dataset.visible = 'false'
      d.dataset.visible = 'false'
    }
    const down = () => (r.dataset.pressed = 'true')
    const up = () => (r.dataset.pressed = 'false')
    const loop = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div className={styles.cursor} aria-hidden="true" data-mode={mode}>
      <div ref={ring} className={styles.ring}>
        <span className={styles.drag}>Arraste</span>
      </div>
      <div ref={dot} className={styles.dot} />
    </div>
  )
}

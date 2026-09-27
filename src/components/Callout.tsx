import { useEffect, useRef } from 'react'
import { projected } from '../three/points'
import styles from './Callout.module.css'

type Common = { active: boolean; label: string; value?: string; className?: string }
type PointProps = Common & { kind?: 'point'; anchor: string; dx: number; dy: number }
type SpanProps = Common & { kind: 'span'; from: string; to: string; side?: number }

/**
 * Graticule callout: a hairline leader locked to a projected 3D point on the
 * watch (or a dimension line between two points), carrying a measured value.
 * Positions update every frame without React renders.
 */
export function Callout(props: PointProps | SpanProps) {
  const root = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const labelEl = useRef<HTMLDivElement>(null)
  const lastDx = useRef(0)
  const lastDy = useRef(0)

  useEffect(() => {
    let raf = 0
    const el = root.current!
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (props.kind === 'span') {
        const a = projected[props.from]
        const b = projected[props.to]
        if (!a || !b) return
        const side = props.side ?? -1
        // Dimension line offset perpendicular to the measured edge.
        const vx = b.x - a.x
        const vy = b.y - a.y
        const len = Math.hypot(vx, vy) || 1
        const nx = (-vy / len) * 36 * side
        const ny = (vx / len) * 36 * side
        el.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`
        const d = `M${nx * 0.3} ${ny * 0.3} L${nx} ${ny} L${nx + vx} ${ny + vy} L${vx + nx * 0.3} ${vy + ny * 0.3}`
        path.current?.setAttribute('d', d)
        const lx = nx * 1.9 + vx / 2
        const ly = ny * 1.9 + vy / 2
        labelEl.current!.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(${side < 0 ? '-100%' : '0'}, -50%)`
        el.style.setProperty('--facing', '1')
      } else {
        const p = projected[props.anchor]
        if (!p) return
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
        el.style.setProperty('--facing', p.facing.toFixed(2))
        // Keep the measured label on screen: prefer the authored side, flip if it
        // doesn't fit, then clamp both axes; the leader always ends at the label.
        const lw = labelEl.current!.offsetWidth
        const lh = labelEl.current!.offsetHeight
        const vw = window.innerWidth
        const vh = window.innerHeight
        const margin = 12
        let dx = props.dx
        if (dx > 0 && p.x + dx + 10 + lw > vw - margin) dx = -Math.abs(dx)
        else if (dx < 0 && p.x + dx - 10 - lw < margin) dx = Math.abs(dx)
        let left = dx < 0 ? p.x + dx - 10 - lw : p.x + dx + 10
        left = Math.min(Math.max(left, margin), vw - margin - lw)
        const top = Math.min(Math.max(p.y + props.dy - lh / 2, 84), vh - 72 - lh)
        const ex = (dx < 0 ? left + lw + 10 : left - 10) - p.x
        const ey = top + lh / 2 - p.y
        const kx = Math.round(ex)
        const ky = Math.round(ey)
        if (kx !== lastDx.current || ky !== lastDy.current) {
          lastDx.current = kx
          lastDy.current = ky
          path.current?.setAttribute('d', `M0 0 L${kx * 0.55} ${ky} L${kx} ${ky}`)
          labelEl.current!.style.transform = `translate(${Math.round(left - p.x)}px, ${Math.round(top - p.y)}px)`
        }
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [props])

  const isSpan = props.kind === 'span'
  const dx = isSpan ? 0 : props.dx
  const dy = isSpan ? 0 : props.dy
  const elbow = `M0 0 L${dx * 0.55} ${dy} L${dx} ${dy}`

  return (
    <div ref={root} className={`${styles.callout} ${props.className ?? ''}`} data-active={props.active} aria-hidden="true">
      {!isSpan && <span className={styles.marker} />}
      <svg className={styles.svg} width="1" height="1">
        <path ref={path} d={isSpan ? '' : elbow} pathLength={1} className={styles.path} />
      </svg>
      <div
        ref={labelEl}
        className={styles.label}
        style={isSpan ? undefined : { transform: `translate(${dx}px, ${dy}px) translate(${dx < 0 ? 'calc(-100% - 10px)' : '10px'}, -50%)` }}
      >
        <span className={styles.name}>{props.label}</span>
        {props.value && <span className={styles.value}>{props.value}</span>}
      </div>
    </div>
  )
}

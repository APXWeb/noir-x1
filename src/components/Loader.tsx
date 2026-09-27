import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Wordmark } from './Wordmark'
import { useStore } from '../state/store'
import { intro } from '../animation/intro'
import styles from './Loader.module.css'

const MIN_MS = 1400

/**
 * Entry: a bezel ring whose 60 minute marks fill with real asset progress.
 * On completion the ring opens like an iris onto the stage.
 */
export function Loader({ webgl, reduced }: { webgl: boolean; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const progress = useStore((s) => s.loadProgress)
  const active = useStore((s) => s.loadActive)
  const failed = useStore((s) => s.stageFailed)
  const [shown, setShown] = useState(0)
  const [gone, setGone] = useState(false)
  const setReady = useStore((s) => s.setReady)
  const setIntroDone = useStore((s) => s.setIntroDone)
  const start = useRef(performance.now())
  const done = useRef(false)

  // Ease the displayed number toward real progress so it never jumps.
  useEffect(() => {
    let raf = 0
    const target = webgl && !failed ? progress : 100
    const step = () => {
      setShown((s) => {
        const n = s + (target - s) * 0.12
        return Math.abs(target - n) < 0.4 ? target : n
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [progress, webgl, failed])

  const complete = (webgl && !failed ? progress >= 100 && !active : true) && shown >= 99.5

  useEffect(() => {
    if (!complete || done.current) return
    done.current = true
    const wait = Math.max(0, MIN_MS - (performance.now() - start.current))
    const el = root.current!
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: wait / 1000,
        onStart: () => setReady(true),
        onComplete: () => {
          setGone(true)
          setIntroDone(true)
        },
      })
      if (reduced) {
        tl.to(el, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' })
        tl.set(intro, { t: 1 }, 0)
        return
      }
      tl.to('[data-loader-meta]', { autoAlpha: 0, y: -8, duration: 0.45, ease: 'power2.in', stagger: 0.04 })
        .to('[data-loader-mark]', { autoAlpha: 0, scale: 0.92, filter: 'blur(6px)', duration: 0.5, ease: 'power2.in' }, '<')
        .to('[data-loader-ring]', { scale: 9, duration: 1.5, ease: 'expo.inOut' }, '-=0.15')
        .to(el, { '--iris': '140vmax', duration: 1.5, ease: 'expo.inOut' }, '<')
        .to(intro, { t: 1, duration: 2.6, ease: 'expo.out' }, '<0.55')
    }, el)
    return () => ctx.revert()
  }, [complete, reduced, setReady, setIntroDone])

  if (gone) return null
  const pct = Math.round(shown)
  const lit = Math.round((shown / 100) * 60)

  return (
    <div ref={root} className={styles.loader} role="status" aria-live="polite" aria-label={`Loading experience, ${pct} percent`}>
      <div className={styles.center}>
        <svg className={styles.ring} viewBox="0 0 200 200" aria-hidden="true" data-loader-ring>
          {Array.from({ length: 60 }, (_, i) => (
            <line
              key={i}
              x1="100"
              y1="6"
              x2="100"
              y2={i % 5 === 0 ? 18 : 13}
              transform={`rotate(${i * 6} 100 100)`}
              className={i < lit ? styles.tickOn : styles.tick}
            />
          ))}
        </svg>
        <div className={styles.mark} data-loader-mark>
          <Wordmark className={styles.wordmark} />
          <span className={styles.model}>X1</span>
        </div>
      </div>
      <div className={styles.meta}>
        <span className="label" data-loader-meta>
          Calibrating
        </span>
        <span className={`measure ${styles.pct}`} data-loader-meta aria-hidden="true">
          {String(pct).padStart(3, '0')}
        </span>
      </div>
    </div>
  )
}

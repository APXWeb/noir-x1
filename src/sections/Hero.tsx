import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitLines } from '../components/SplitLines'
import { Cta } from '../components/Cta'
import { useStore } from '../state/store'
import { scrollToTarget } from '../animation/smoothScroll'
import { useScene } from '../animation/useScene'
import styles from './Hero.module.css'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const ready = useStore((s) => s.ready)

  // Entrance, timed against the loader's iris.
  useEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.dataset.entered = 'true'
      return
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.05, onComplete: () => (el.dataset.entered = 'true') })
      tl.fromTo('[data-hero-title] [data-line]', { yPercent: 110 }, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.09 })
        .fromTo('[data-hero-meta]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, 0.45)
        .fromTo('[data-hero-cue]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.1)
    }, el)
    return () => ctx.revert()
  }, [ready])

  // Leaving: the headline drifts back and dims as the camera moves in.
  useScene(
    ref,
    (tl, q) => {
      tl.to(q('[data-hero-title]'), { yPercent: -18, opacity: 0.15, filter: 'blur(6px)', duration: 1 }, 0)
      tl.to(q('[data-hero-leave]'), { y: -40, opacity: 0, duration: 0.6 }, 0)
    },
    { start: 'top top', end: 'bottom top', scrub: 0.4 },
  )

  return (
    <section ref={ref} id="top" className={styles.hero} data-pose="hero" data-theme="dark" aria-labelledby="hero-title">
      <SplitLines
        as="h1"
        id="hero-title"
        data-hero-title
        className={`display ${styles.title}`}
        lines={['Precision', 'without', 'compromise.']}
      />
      <div className={styles.meta} data-hero-leave>
        <p className="lead" data-hero-meta>
          NOIR X1. A 41 mm automatic machined from a single titanium billet. Nothing on it is louder than it needs to be.
        </p>
        <div data-hero-meta>
          <Cta href="#x1" onClick={(e) => (e.preventDefault(), scrollToTarget('#x1'))}>
            Discover X1
          </Cta>
        </div>
      </div>
      <div className={styles.cue} data-hero-cue aria-hidden="true">
        <span className="measure">Scroll</span>
        <span className={styles.cueLine} />
      </div>
    </section>
  )
}

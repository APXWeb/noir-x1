import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { measureAnchors, track, updateTrack } from './poseTrack'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export const getLenis = () => lenis

/** Smooth scroll + pose tracking. Returns a teardown. */
export function startScroll({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  track.reduced = reduced
  track.mobile = mobile

  if (!reduced) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.2 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    const stopRaf = () => gsap.ticker.remove(raf)
    ;(lenis as Lenis & { __stopRaf?: () => void }).__stopRaf = stopRaf
  }

  const onScroll = () => updateTrack(window.scrollY, window.innerHeight)
  const remeasure = () => {
    measureAnchors()
    onScroll()
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  const ro = new ResizeObserver(() => {
    remeasure()
    ScrollTrigger.refresh()
  })
  ro.observe(document.body)
  document.fonts?.ready.then(remeasure)
  remeasure()

  return () => {
    window.removeEventListener('scroll', onScroll)
    ro.disconnect()
    if (lenis) {
      ;(lenis as Lenis & { __stopRaf?: () => void }).__stopRaf?.()
      lenis.destroy()
      lenis = null
    }
  }
}

/** Scroll to an element or y, honouring Lenis when active. */
export function scrollToTarget(target: string | HTMLElement | number, opts: { immediate?: boolean; offset?: number } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: opts.offset ?? 0, immediate: opts.immediate, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : typeof target === 'number' ? null : target
  const y = typeof target === 'number' ? target : el ? el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0) : 0
  window.scrollTo({ top: y, behavior: 'auto' })
}

export function lockScroll(locked: boolean) {
  if (lenis) (locked ? lenis.stop() : lenis.start())
  document.documentElement.classList.toggle('is-locked', locked)
}

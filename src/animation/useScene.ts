import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { track } from './poseTrack'

gsap.registerPlugin(ScrollTrigger)

const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * A scroll-scrubbed timeline bound to a scene. Content is visible by default;
 * the timeline only exists when motion is allowed.
 */
export function useScene(
  ref: RefObject<HTMLElement | null>,
  build: (tl: gsap.core.Timeline, q: (sel: string) => Element[]) => void,
  opts: { start?: string; end?: string; scrub?: number | boolean; deps?: unknown[] } = {},
) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || isReduced()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: opts.start ?? 'top top',
          end: opts.end ?? 'bottom bottom',
          scrub: opts.scrub ?? 0.5,
          invalidateOnRefresh: true,
        },
      })
      build(tl, gsap.utils.selector(el))
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, opts.deps ?? [])
}

/** True while the element occupies the centre band of the viewport. */
export function useInCenter(ref: RefObject<HTMLElement | null>, start = 'top 55%', end = 'bottom 45%') {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({ trigger: el, start, end, onToggle: (self) => setOn(self.isActive) })
    return () => st.kill()
  }, [ref, start, end])
  return on
}

/** Standard masked-line rise used by display headings (varied per scene by the caller). */
export function riseLines(tl: gsap.core.Timeline, lines: Element[], at: number | string = 0, span = 0.25) {
  tl.fromTo(
    lines,
    { yPercent: 105, rotate: 2.5 },
    { yPercent: 0, rotate: 0, ease: 'power3.out', duration: span, stagger: span * 0.18 },
    at,
  )
}

export const motionAllowed = () => !isReduced() && !track.reduced

import { useRef } from 'react'
import { SplitLines } from '../components/SplitLines'
import { useScene } from '../animation/useScene'
import { STORY } from '../data/story'
import styles from './Story.module.css'

const still = (name: string) => `${import.meta.env.BASE_URL}stills/${name}.webp`

/**
 * The brand, told briefly. A light scene — the only one — so it reads as a
 * change of room: the stage goes dark and the page turns to bone.
 */
export function Story() {
  const ref = useRef<HTMLElement>(null)

  useScene(
    ref,
    (tl, q) => {
      tl.fromTo(q('[data-line]'), { yPercent: 105 }, { yPercent: 0, duration: 0.1, ease: 'power3.out', stagger: 0.02 }, 0)
      q('[data-frame]').forEach((el, i) => {
        tl.fromTo(el, { clipPath: 'inset(18% 0% 18% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.22, ease: 'power2.out' }, 0.08 + i * 0.22)
        tl.fromTo(el.querySelector('img'), { scale: 1.18 }, { scale: 1, duration: 0.5 }, 0.08 + i * 0.22)
      })
      tl.fromTo(q('[data-drift]'), { y: 60 }, { y: -60, duration: 1 }, 0)
    },
    { start: 'top 80%', end: 'bottom top' },
  )

  return (
    <section ref={ref} id="about" className={styles.story} data-pose="story" data-theme="light" aria-labelledby="story-title">
      <div className={styles.grid}>
        <SplitLines as="h2" id="story-title" className={`display ${styles.title}`} lines={STORY.title} />

        <p className={`lead ${styles.intro}`}>{STORY.intro}</p>

        <figure className={`${styles.figure} ${styles.figA}`} data-frame>
          <img src={still('crown')} alt={STORY.images.crown} loading="lazy" decoding="async" width="900" height="1200" />
        </figure>

        <div className={styles.body} data-drift>
          {STORY.paragraphs.map((p) => (
            <p key={p} className="body">
              {p}
            </p>
          ))}
        </div>

        <figure className={`${styles.figure} ${styles.figB}`} data-frame>
          <img src={still('caseback')} alt={STORY.images.caseback} loading="lazy" decoding="async" width="1600" height="1000" />
          <figcaption className="measure">{STORY.caption}</figcaption>
        </figure>

        <blockquote className={styles.quote} data-drift>
          <p className="h2">{STORY.quote}</p>
        </blockquote>

        <ol className={styles.timeline}>
          {STORY.timeline.map(([year, text]) => (
            <li key={year}>
              <span className="measure">{year}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>

        <figure className={`${styles.figure} ${styles.figC}`} data-frame>
          <img src={still('dial')} alt={STORY.images.dial} loading="lazy" decoding="async" width="900" height="1200" />
        </figure>
      </div>
    </section>
  )
}

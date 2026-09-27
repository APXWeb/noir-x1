import { Wordmark } from '../components/Wordmark'
import { NAV } from '../data/scenes'
import { scrollToTarget } from '../animation/smoothScroll'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer} data-theme="dark">
      <div className={styles.top}>
        <Wordmark className={styles.mark} />
        <p className={`body ${styles.claim}`}>Precision without compromise.</p>
      </div>
      <div className={styles.bottom}>
        <nav aria-label="Footer">
          <ul className={styles.links}>
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget(n.href)
                  }}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="measure">NOIR is a fictional brand. All specifications are conceptual.</p>
        <p className="measure">Concept, 3D and experience by APX · 2026</p>
      </div>
    </footer>
  )
}

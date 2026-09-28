import { Wordmark } from '../components/Wordmark'
import { NAV } from '../data/scenes'
import { scrollToTarget } from '../animation/smoothScroll'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer} data-theme="dark" data-pose="end">
      <div className={styles.top}>
        <Wordmark className={styles.mark} />
        <p className={`body ${styles.claim}`}>Precisão sem concessões.</p>
      </div>
      <div className={styles.bottom}>
        <nav aria-label="Rodapé">
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
        <p className="label">A NOIR é uma marca fictícia. Todas as especificações são conceituais.</p>
        <p className="label">Conceito, 3D e experiência por APX · 2026</p>
      </div>
    </footer>
  )
}

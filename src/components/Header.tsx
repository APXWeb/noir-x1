import { useEffect, useRef, useState } from 'react'
import { Wordmark } from './Wordmark'
import { NAV } from '../data/scenes'
import { useStore } from '../state/store'
import { lockScroll, scrollToTarget } from '../animation/smoothScroll'
import styles from './Header.module.css'

/**
 * Minimal header. Transparent over the stage, inverts over light scenes, and
 * steps out of the way while scrolling down.
 */
export function Header() {
  const ref = useRef<HTMLElement>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const setMode = useStore((s) => s.setMode)
  const mode = useStore((s) => s.mode)
  const introDone = useStore((s) => s.introDone)

  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const tick = () => {
      raf = 0
      const y = window.scrollY
      const h = ref.current?.offsetHeight ?? 64
      // Which scene is under the header's centre line?
      const probe = document.elementsFromPoint(window.innerWidth / 2, h / 2)
      const themed = probe.find((el) => (el as HTMLElement).closest?.('[data-theme]') && !ref.current?.contains(el))
      const t = (themed as HTMLElement | undefined)?.closest<HTMLElement>('[data-theme]')?.dataset.theme
      setTheme(t === 'light' ? 'light' : 'dark')
      const delta = y - last
      if (Math.abs(delta) > 4) setHidden(delta > 0 && y > window.innerHeight * 0.6)
      setSolid(y > window.innerHeight * 0.9)
      last = y
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    tick()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    lockScroll(menu)
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMenu(false)
    // Wait one frame so the unlocked scroll can move.
    requestAnimationFrame(() => scrollToTarget(href))
    history.replaceState(null, '', href)
  }

  const explore = () => {
    setMenu(false)
    setMode('explore')
  }

  return (
    <header
      ref={ref}
      className={styles.header}
      data-theme={menu ? 'dark' : theme}
      data-hidden={(hidden && !menu) || mode === 'explore' || !introDone}
      data-solid={solid && !menu}
      data-menu={menu}
    >
      <a href="#top" className={styles.logo} onClick={go('#top')} aria-label="NOIR, voltar ao início">
        <Wordmark />
      </a>

      <nav className={styles.nav} aria-label="Principal">
        <ul>
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={go(n.href)} className={styles.link}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button type="button" className={styles.explore} onClick={explore}>
        <span aria-hidden="true">[</span>
        <span className={styles.exploreLabel}>Explorar</span>
        <span aria-hidden="true">]</span>
      </button>

      <button type="button" className={styles.menuButton} aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((m) => !m)}>
        <span className="sr-only">{menu ? 'Fechar menu' : 'Abrir menu'}</span>
        <span className={styles.menuBars} aria-hidden="true" />
      </button>

      <div id="mobile-menu" className={styles.sheet} hidden={!menu}>
        <ul>
          {NAV.map((n, i) => (
            <li key={n.href} style={{ '--i': i } as React.CSSProperties}>
              <a href={n.href} onClick={go(n.href)}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <button type="button" className={styles.sheetExplore} onClick={explore}>
          Explorar o X1 em 3D
        </button>
      </div>
    </header>
  )
}
